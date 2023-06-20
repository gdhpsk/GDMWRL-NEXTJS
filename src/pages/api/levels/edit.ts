import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../../firebase-admin" 
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";
import { ObjectID } from "bson";
import webhook from "webhook";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method != "PATCH") return res.status(403).json({message: "Incorrect method."})
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
        if(!lev) return res.status(400).json({message: "Please input a valid level for the new 150 field!"})
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
        await levels.updateMany({position: {"$lte": Math.max(level.position, req.body.changes.position, (additional_info.move150below?.position ?? 0), (additional_info.new150?.position ?? 0)), "$gte": Math.min(level.position, req.body.changes.position), "$ne": level.position}},[
            {
            "$set": {
                position: {
                    "$switch": {
                        branches: [
                          {case: {"$eq": ["$position", additional_info.new150?.position ?? 0]}, then: 150},
                          {case: {"$and": [
                            {"$gt": ["$position", additional_info.new150?.position ?? Infinity]},
                            {"$lte": ["$position", req.body.changes.position]}
                          ]}, then: {"$subtract": ["$position", 1]}},
                          {case: {"$and": [
                            {"$lt": ["$position", additional_info.new150?.position ?? 0]},
                            {"$gte": ["$position", req.body.changes.position]}
                          ]}, then: {"$add": ["$position", 1]}},
                            {case: {"$and": [
                              {"$lt": ["$position", req.body.changes.position]},
                              {"$gt": ["$position", additional_info.new150 ? 150 : Infinity]}
                            ]}, then: "$position"},
                            {case: {$and: [
                              {"$lte": ["$position", additional_info.move150below?.position ?? 0]},
                              {"$gt": ["$position", level.position]}
                            ]}, then: {"$subtract": ["$position", 1]}},
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
  }])
  }
  if(req.body.changes.name) {
    let names = level.list.map((e:any) => e.name)
    await leaderboard.updateMany({name: {$in: names}}, [
      {"$set": {
        extralist: {
          "$map": {
            input: "$extralist",
            as: "record",
            in: {
              "$switch": {
                branches: [
                  {case: {"$eq": ["$$record.name", level.name]}, then: {
                    name: req.body.changes.name,
                    percent: "$$record.percent",
                    hertz: "$$record.hertz",
                    verification: "$$record.verification",
                    id: "$$record.id"
                  }}
                ],
                default: "$$record"
              }
            }
          }
        },
        records: {
          "$map": {
            input: "$records",
            as: "record",
            in: {
              "$switch": {
                branches: [
                  {case: {"$eq": ["$$record.name", level.name]}, then: {
                    name: req.body.changes.name,
                    percent: "$$record.percent",
                    hertz: "$$record.hertz",
                    verification: "$$record.verification",
                    id: "$$record.id"
                  }}
                ],
                default: "$$record"
              }
            }
          }
        },
        completions: {
          "$map": {
            input: "$completions",
            as: "record",
            in: {
              "$switch": {
                branches: [
                  {case: {"$eq": ["$$record.name", level.name]}, then: {
                    name: req.body.changes.name,
                    percent: "$$record.percent",
                    hertz: "$$record.hertz",
                    verification: "$$record.verification",
                    id: "$$record.id"
                  }}
                ],
                default: "$$record"
              }
            }
          }
        },
        screenshot: {
          "$map": {
            input: "$screenshot",
            as: "record",
            in: {
              "$switch": {
                branches: [
                  {case: {"$eq": ["$$record.name", level.name]}, then: {
                    name: req.body.changes.name,
                    percent: "$$record.percent",
                    hertz: "$$record.hertz",
                    verification: "$$record.verification",
                    id: "$$record.id"
                  }}
                ],
                default: "$$record"
              }
            }
          }
        }
      }}
    ])
  }
if(req.body.changes.list) {
  let replacements = {
    names: level.list.map((e:any) => {
      let eq = req.body.changes.list.find((x:any)=>x._id == e._id)
      if(!eq) return undefined;
      if(eq.name == e.name) return undefined;
      return [e.name, eq.name, {
        name: req.body.changes.name ?? level.name,
        percent: eq.percent[0],
        hertz: eq.hertz,
        verification: eq.verification,
        id: new ObjectID(eq._id)
      }]
    }).filter((e:any) => e),
    other: level.list.map((e:any) => {
      let eq = req.body.changes.list.find((x:any)=>x._id == e._id)
      if(!eq) return undefined;
      if(eq.percent[0] == e.percent[0] && eq.screenshot == e.screenshot && eq.hertz == e.hertz && eq.verification == e.verification) return undefined;
      return [eq.name, {
        name: req.body.changes.name ?? level.name,
        percent: eq.percent[0],
        hertz: eq.hertz,
        verification: eq.verification,
        id: new ObjectID(eq._id)
      }]
    }).filter((e:any) => e)
  }
  function classify(percent: number, screenshot: boolean, position: number) {
    if(screenshot) return "screenshot"
    if(position > 150) return "extralist"
    if(percent < 100) return "records"
    return "completions"
  }
  replacements.names.forEach(async (names:[string, string, any]) => {
    await leaderboard.updateOne({name: names[0]}, [{
      $set: {
        records: {
          $filter: {
            input: "$records",
            as: "record",
            cond: {$ne: ["$$record.name", req.body.changes.name ?? level.name]}
          }
        },
        completions: {
          $filter: {
            input: "$completions",
            as: "record",
            cond: {$ne: ["$$record.name", req.body.changes.name ?? level.name]}
          }
        },
        extralist: {
          $filter: {
            input: "$extralist",
            as: "record",
            cond: {$ne: ["$$record.name", req.body.changes.name ?? level.name]}
          }
        },
        screenshot: {
          $filter: {
            input: "$screenshot",
            as: "record",
            cond: {$ne: ["$$record.name", req.body.changes.name ?? level.name]}
          }
        }
      }
    }])
    await leaderboard.updateOne({name: names[1]}, {
      $push: {
        [classify(names[2].percent, names[2].screenshot, req.body.changes.position ?? level.position)]: names[2]
      }
    }, {upsert: true})
    let {records, completions, extralist, screenshot} = await leaderboard.findOne({name: names[0]}).select("records completions extralist screenshot")
    if([...records, ...completions, ...extralist, ...screenshot].every((e:any) => e == "none")) {
      await leaderboard.deleteOne({name: names[0]})
    }

  })
  replacements.other.map(async (stuff: [string, any]) => {
    await leaderboard.updateOne({name: stuff[0]}, [{
      $set: {
        records: {
          $map: {
            input: "$records",
            as: "record",
            in: {
              $switch: {
                branches: [
                  {case: {$eq: ["$$record.id", stuff[1].id]}, then: stuff[1]}
                ],
                default: "$$record"
              }
            }
          }
        },
        completions: {
          $map: {
            input: "$completions",
            as: "record",
            in: {
              $switch: {
                branches: [
                  {case: {$eq: ["$$record.id", stuff[1].id]}, then: stuff[1]}
                ],
                default: "$$record"
              }
            }
          }
        },
        extralist: {
          $map: {
            input: "$extralist",
            as: "record",
            in: {
              $switch: {
                branches: [
                  {case: {$eq: ["$$record.id", stuff[1].id]}, then: stuff[1]}
                ],
                default: "$$record"
              }
            }
          }
        },
        screenshot: {
          $map: {
            input: "$screenshot",
            as: "record",
            in: {
              $switch: {
                branches: [
                  {case: {$eq: ["$$record.id", stuff[1].id]}, then: stuff[1]}
                ],
                default: "$$record"
              }
            }
          }
        }
      }
    }])
  })
}
  await levels.findByIdAndUpdate(level._id, {
    "$set": req.body.changes
  }) 
  await webhook(null, [{
    title: "Level Edited",
    description: `[${level.name}](https://youtube.com/watch?v=${level.ytcode}) by ${level.host} (verifier: ${level.verifier}) has just been edited! Here is the info that was edited:\n\n${Object.entries(req.body.changes).map(e => e[0] != "list" ? `${e[0]}: ${level[e[0]]} => ${e[1]}` : "list: Check the site ngl.").join("\n")}`
  }])
    res.status(200).json({})
  }