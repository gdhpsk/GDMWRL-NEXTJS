import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
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
  let editPos = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/edit", {
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
  let json = await editPos.text()
  console.log(json)
//   if(!editPos.ok) {
//     return res.status(editPos.status).json(json)
//   }
    res.status(200).json(level)
  }