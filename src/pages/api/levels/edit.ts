import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
  let level = req.body.original
  if(req.body.changes.position) {
    if(req.body.changes.position < 1) return res.status(400).send({message: "Input a valid placement number!"})
    let additional_info: Record<any, any> = {
        new150: null,
        move150below: null
    }

    if(req.body.changes.position <=  150 && level.position > 150) {
        let lev = await levels.findOne({name: req.body.move150below ?? ""})
        if(!lev) return res.status(400).json({message: "Please input a valid level for the move 150 below field!"})
        if(lev.position <= 150) return res.status(400).send({message: "The move 150 below field cannot be a top 150 level!"})
        additional_info.move150below = lev
    }

    if(req.body.changes.position >  150 && level.position <= 150) {
        let lev = await levels.findOne({name: req.body.new150 ?? ""})
        if(!lev) return res.status(400).json({message: "Please input a valid level for the move 150 below field!"})
        if(lev.position <= 150) return res.status(400).send({message: "The new 150 field cannot be a top 150 level!"})
        additional_info.new150 = lev
    }

    if(additional_info.new150 || additional_info.move150below) {
      let levelFilter = await levels.aggregate([
        {"$match": {position: {"$in": [150, (additional_info.new150 ?? level).position]}}},
        {"$addFields": {"levelNames": []}},
        {"$group": {
          _id: null,
          levelNames: {"$push": "$name"},
          list: {
            "$addToSet": "$list"
          }
        }},
        {"$project": {
          levelNames: 1,
          list: {
            "$filter": {
              input: "$list",
              as: "records",
              cond: {"$ne": ["$$records.screenshot", true]}
            }
          }
        }},
        {"$project": {
          levelNames: 1,
          names: {
            "$map": {
              input: "$list",
              as: "record",
              in: "$$record.name"
            }
          }
        }},
        {"$project": {
          levelNames: 1,
          names: {
            "$reduce": {
              input: "$names",
              initialValue: [],
              in: {"$concatArrays": ["$$value", "$$this"]}
            }
          }
        }},
      ])
      let {levelNames, names} = levelFilter[0]
      await leaderboard.updateMany({name: {"$in": names}}, [
        {
          "$set": {
            records: {
              "$concatArrays": [{
                "$filter": {
                  input: "$records",
                  as: "record",
                  cond: {"$and": [
                    {"$ne": ["$$record", "none"]},
                    {"$ne": ["$$record.name", levelNames[0]]}
                  ]}
                }
              }, {
                "$filter": {
                  input: "$extralist",
                  as: "record",
                  cond: {"$and": [
                    {"$lt": ["$$record.percent", 100]},
                    {"$eq": ["$$record.name", levelNames[1]]}
                  ]}
                }
              }]
            },
            completions: {
              "$concatArrays": [{
                "$filter": {
                  input: "$completions",
                  as: "record",
                  cond: {"$and": [
                    {"$ne": ["$$record", "none"]},
                    {"$ne": ["$$record.name", levelNames[0]]}
                  ]}
                }
              }, {
                "$filter": {
                  input: "$extralist",
                  as: "record",
                  cond: {"$and": [
                    {"$eq": ["$$record.percent", 100]},
                    {"$eq": ["$$record.name", levelNames[1]]}
                  ]}
                }
              }]
            },
            extralist: {
              "$concatArrays": [{
                "$filter": {
                  input: "$extralist",
                  as: "record",
                  cond: {"$and": [
                    {"$ne": ["$$record", "none"]},
                    {"$ne": ["$$record.name",levelNames[1]]}
                  ]}
                }
              }, {
                "$filter": {
                  input: "$records",
                  as: "record",
                  cond: {"$eq": ["$$record.name", levelNames[0]]}
                }
              }, 
              {
                "$filter": {
                  input: "$completions",
                  as: "record",
                  cond: {"$eq": ["$$record.name", levelNames[0]]}
                }
              }]
            }
          }
        }
      ])
  }

        await levels.updateMany({position: {"$lte": Math.max(level.position, req.body.changes.position, (additional_info.move150below?.position ?? 0), (additional_info.new150?.positon ?? 0)), "$gte": Math.min(level.position, req.body.changes.position), "$ne": level.position}},[
            {
            "$set": {
                position: {
                    "$switch": {
                        branches: [
                            {case: {"$and": [
                              {"$lt": ["$position", req.body.changes.position]},
                              {"$gt": ["$position", additional_info.new150 ? level.position : Infinity]}
                            ]}, then: "$position"},
                            {case: {"$and": [
                              {"$gt": ["$position", additional_info.new150?.position ?? Infinity]},
                              {"$lte": ["$position", req.body.changes.position]}
                            ]}, then: {"$subtract": ["$position", 1]}},
                            {case: {"$and": [
                              {"$lt": ["$position", additional_info.new150?.position ?? 0]},
                              {"$gte": ["$position", req.body.changes.position]}
                            ]}, then: {"$add": ["$position", 1]}},
                            {case: {"$and": [
                                {"$eq": ["$position", (additional_info.move150below?.position ?? -1)+1]},
                                {"$gt": ["$position", 150]},
                                {"$lt": ["$position", additional_info.move150below?.position ?? 0]}
                            ]}, then: {"$add": ["$position", 1]}},
                            {case: {"$and": [
                                {"$gt": ["$position", 150]},
                                {"$lt": ["$position", additional_info.move150below?.position ?? 0]}
                            ]}, then: "$position"},
                            {case: {"$and": [
                              {"$eq": ["$position", additional_info.move150below?.position ?? 0]},
                              {"$lt": ["$position", level.position]}
                            ]}, then: "$position"},
                            {case: {"$eq": ["$position", additional_info.move150below?.position ?? 0]}, then: {"$subtract": ["$position", 1]}},
                            {case: {"$and": [
                              {"$eq": ["$position", 150]},
                              {"$lt": [additional_info.move150below?.position ?? Infinity, level.position]}
                            ]}, then: additional_info.move150below?.position+1},
                            {case: {"$and": [
                              {"$eq": ["$position", 150]},
                              {"$lt": ["$position", additional_info.move150below?.position ?? 0]}
                            ]}, then: additional_info.move150below?.position},
                            {case: {"$lt": [req.body.changes.position, level.position]}, then: {"$add": ["$position", 1]}},
                            {case: {"$gt": [req.body.changes.position, level.position]}, then: {"$subtract": ["$position", 1]}}
                        ],
                        default: "$position"
                    }
                }
            }
  }], {upsert: true})
  if(additional_info.new150) {
    additional_info.new150.position = 150
    await additional_info.new150.save()
  }
  }
  await levels.findByIdAndUpdate(level._id, {
    "$set": req.body.changes
  }) 
    res.status(200).json({})
  }