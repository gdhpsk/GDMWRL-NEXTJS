import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";
import webhook from "webhook";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method != "POST") return res.status(403).json({message: "Incorrect method."})
  try {
    if(req.body.token !== process.env.API_TOKEN) {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
    }
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
  let {level} = req.body
  level._id = new mongoose.Types.ObjectId()
  level.list = [{
    name: "",
    percent: ["", ""],
    screenshot: true,
    link: "",
    hertz: 60
  }]
  let count = await levels.count()
  let newLevel = await levels.create({...level, position: count+1})
  let editPos = await fetch("https://gdmobilewrlist.com/api/levels/edit", {
    method: "PATCH",
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify({
        token: req.body.token,
        changes: {
            position: level.position
        },
        original: newLevel,
        move150below: req.body.move150below
    })
  })
  let json = await editPos.json()
  if(!editPos.ok) {
    await levels.findByIdAndDelete(newLevel._id)
    return res.status(editPos.status).json(json)
  }
  let between = await levels.find({position: {$in: [level.position-1, level.position+1]}}).sort({position:1})
  await webhook(null, [{
    title: "New Level Addition",
    description: `[${newLevel.name}](https://youtube.com/watch?v=${newLevel.ytcode}) by ${newLevel.host} (verifier: ${newLevel.verifier}) has just been placed at #${level.position}, above ${between[1]?.name} and below ${between[0].name}!`
  }])
    res.status(200).json(level)
  }