import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";
import { ObjectID, ObjectId } from "bson";
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
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
  let {level, record} = req.body
  if(level.list.length > 1) { 
  await levels.updateOne({_id: new ObjectID(level._id)}, {
    $pull: {
        list: {
            _id: new ObjectId(record._id)
        }
    }
  })
} else {
    await levels.updateOne({_id: new ObjectID(level._id)}, [
        {
            $set: {
                list: [{
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
    ])
}
// console.log(req.body)
  await leaderboard.updateOne({name: record.name}, {
    $pull: {
      [classify(parseInt(record.percent[0]), record.screenshot, level.position)]: {
        id: new ObjectId(record._id)
      }
    }
  })
  let {records, extralist, completions, screenshot} = await leaderboard.findOne({name: record.name}).select("records completions extralist screenshot")
  if([...records, ...completions, ...extralist, ...screenshot].every((e:any) => e == "none")) {
    await leaderboard.deleteOne({name: record.name})
  }
  level.list = level.list.filter((e:any) => e._id != record._id)
  await webhook(null, [{
    title: "Record Deleted",
    description: `[${record.name}](${record.link}) just got their ${record.percent[0]}% record on the level [${level.name}](https://youtube.com/watch?v=${level.ytcode}) by ${level.host} removed! More info:\n\n${Object.entries(record).map(e => `${e[0]}: ${e[1]}`).join("\n")}`
  }])
    res.status(200).json(level)
  }