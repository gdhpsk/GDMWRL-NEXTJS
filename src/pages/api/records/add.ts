import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";
import webhook from "webhook";
import { ObjectID } from "bson";

function classify(percent: number, screenshot: boolean, position: number) {
    if(screenshot) return "screenshot"
    if(position > 150) return "extralist"
    if(percent < 100) return "records"
    return "completions"
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method != "POST") return res.status(403).json({message: "Incorrect method."})
  try {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
  let {level, record} = req.body
  record._id = new mongoose.Types.ObjectId()
  if(level.list[0]?.name) { 
    await levels.updateOne({_id: new ObjectID(level._id)}, {
      $push: {
          list: record
      }
    })
  } else {
      await levels.updateOne({_id: new ObjectID(level._id)}, [
          {
              $set: {
                  list: [record]
              }
          }
      ])
  }
  await leaderboard.updateOne({name: record.name}, {
    $push: {
      [classify(parseInt(record.percent[0]), record.screenshot, level.position)]: {
        name: level.name,
        host: level.host,
        percent: record.percent[0],
        hertz: record.hertz,
        verification: record.verification,
        id: record._id
      }
    }
  }, {upsert: true})
  await webhook(null, [{
    title: "Record Added",
    description: `[${record.name}](${record.link}) just got ${record.percent[0]}% on the level [${level.name}](https://youtube.com/watch?v=${level.ytcode}) by ${level.host}. More info:\n\n${Object.entries(record).map(e => `${e[0]}: ${e[1]}`).join("\n")}`
  }])
  level.list = [...(level.list[0].name ? level.list : []), record]
    res.status(200).json(level)
  }