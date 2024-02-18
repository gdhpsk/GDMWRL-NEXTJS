import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";
import webhook from "webhook";

function classify(percent: number, screenshot: boolean, position: number) {
    if(screenshot) return "screenshot"
    if(position > 150) return "extralist"
    if(percent < 100) return "records"
    return "completions"
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method != "DELETE") return res.status(403).json({message: "Incorrect method."})
  try {
if(req.body.token !== process.env.API_TOKEN) {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
}
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
  let {profile} = req.body
  await levels.updateMany({"list.name": profile.name}, [{
    $set: {
        list: {
            $switch: {
                branches: [
                    {case: {$gt: [{$size: "$list"}, 1]}, then: {
                        $filter: {
                            input: "$list",
                            as: "record",
                            cond: {$ne: ["$$record.name", profile.name]}
                        }
                    }}
                ],
                default:  [{
                    name: "",
                    percent: ["", ""],
                    listpercent: false,
                    screenshot: false,
                    verification: false,
                    deleted: false,
                    link: "",
                    hertz: 60,
                    _id: new mongoose.Types.ObjectId()
                  }]
            }
        }
    }
  }])
  await leaderboard.deleteOne({name: profile.name})
  await webhook(null, [{
    title: "Profile Delete",
    description: `The leaderboard profile ${profile.name} has been deleted, and so has all their records.`
  }])
    res.status(200).json({})
  }