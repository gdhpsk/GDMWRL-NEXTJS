import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";
import webhook from "webhook";
import { ObjectID } from "bson";

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
  let {level} = req.body
  let count = await levels.count()
  let editPos = await fetch("https://gdmobilewrlist.com/api/levels/edit", {
    method: "PATCH",
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify({
        token: req.body.token,
        changes: {
            position: count
        },
        original: level,
        new150: req.body.new150
    })
  })
  let json = await editPos.json()
  if(!editPos.ok) {
    return res.status(editPos.status).json(json)
  }
  await levels.findByIdAndDelete(level._id)
  await leaderboard.updateMany({name: {$in: level.list.map((e:any) => e.name)}}, [{
    $set: {
      records: {
        $filter: {
          input: "$records",
          as: "record",
          cond: {"$not": [{$in: ["$$record.id", level.list.map((e:any) => new ObjectID(e._id))]}]}
        }
      },
      completions: {
        $filter: {
          input: "$completions",
          as: "record",
          cond: {"$not": [{$in: ["$$record.id", level.list.map((e:any) => new ObjectID(e._id))]}]}
        }
      },
      extralist: {
        $filter: {
          input: "$extralist",
          as: "record",
          cond: {"$not": [{$in: ["$$record.id", level.list.map((e:any) => new ObjectID(e._id))]}]}
        }
      },
      screenshot: {
        $filter: {
          input: "$screenshot",
          as: "record",
          cond: {"$not": [{$in: ["$$record.id", level.list.map((e:any) => new ObjectID(e._id))]}]}
        }
      }
    }
  }])
  level.list.forEach(async (record:any) => {
    if(record.name == "") return;
      let {records, completions, extralist, screenshot} = await leaderboard.findOne({name: record.name}).select("records completions extralist screenshot")
      if([...records, ...completions, ...extralist, ...screenshot].every((e:any) => e == "none")) {
        await leaderboard.deleteOne({name: record.name})
      }
  })
  await webhook(null, [{
    title: "Level Deleted",
    description: `The level [${level.name}](https://youtube.com/watch?v=${level.ytcode}) by ${level.host} (verifier: ${level.verifier}), which was placed at #${level.position}, has just been removed.${level.position <= 150 ? ` As a result, this pushes ${req.body.new150} back to the extended list.` : ""}`
  }])
    res.status(200).json({})
  }