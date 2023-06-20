import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";

function classify(percent: number, screenshot: boolean, position: number) {
    if(screenshot) return "screenshot"
    if(position > 150) return "extralist"
    if(percent < 100) return "records"
    return "completions"
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
  let {name, record} = req.body
  let exists = await levels.findOne({name})
  if(!exists) return res.status(400).json({message: "This level is not on the list!"})
  record._id = new mongoose.Types.ObjectId()
  exists.list = [...exists.list, record]
  await exists.save()
  await leaderboard.updateOne({name: record.name}, {
    $push: {
      [classify(parseInt(record.percent[0]), record.screenshot, exists.position)]: {
        name: record.name,
        percent: record.percent[0],
        hertz: record.hertz,
        verification: record.verification,
        id: record._id
      }
    }
  }, {upsert: true})
    res.status(200).json(exists)
  }