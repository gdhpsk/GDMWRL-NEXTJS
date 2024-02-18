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
    if(req.method != "PATCH") return res.status(403).json({message: "Incorrect method."})
  try {
    if(req.body.token !== process.env.API_TOKEN) {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
    }
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
  let {changes, original} = req.body
  if(changes.name) {
  await levels.updateMany({"list.name": original.name}, [{
    $set: {
        list: {
            $map: {
                input: "$list",
                as: "record",
                in: {
                    $mergeObjects: ["$$record", {
                    name: {
                        $switch: {
                            branches: [
                                {case: {$eq: ["$$record.name", original.name]}, then: changes.name}
                            ],
                            default: "$$record.name"
                        }
                    }
                }]
            }
            }
        }
    }
  }])
}

  await leaderboard.updateOne({name: original.name}, [
    {
        $set: changes
    }
  ])
  let message = `${original.name}'s profile has been updated with the following information:\n\n${Object.entries(changes).map(e => e[0] != "socials" ? `${e[0]}: ${original[e[0]]} => ${e[1]}`: "socials: Check the site ngl")}`
  if(changes?.socials?.[0]) {
    if(Object.values(changes.socials[0]).every(e => !e)) {
        await leaderboard.updateOne({name: original.name}, [
            {
                $unset: ["socials"]
            }
          ])
    }
  }

  await webhook(null, [{
    title: "Profile Update",
    description: message
  }])
    res.status(200).json({})
  }