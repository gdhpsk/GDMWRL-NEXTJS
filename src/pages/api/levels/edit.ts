import { NextApiRequest, NextApiResponse } from "next";
import { authentication } from "../../../../firebase-admin"
import levels from "schemas/levels";
import { json } from "stream/consumers";
import leaderboard from "schemas/leaderboard";
import mongoose from "mongoose";
import { ObjectID, ObjectId } from "bson";
import webhook from "webhook";
import { thumbnails } from "types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method != "PATCH") return res.status(403).json({ message: "Incorrect method." })
  try {
    if(req.body.token !== process.env.API_TOKEN) {
    let currentUser = await authentication.verifyIdToken(req.body.token as any)
    if (currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
    }
  } catch (_) {
    return res.status(401).json({ message: "You cannot perform this action." })
  }
  let level = req.body.original
  if (req.body.changes.position) {
    if (req.body.changes.position < 1) return res.status(400).send({ message: "Input a valid placement number!" })
    let additional_info: Record<any, any> = {
      new150: null,
      move150below: null
    }

    if (req.body.changes.position <= 150 && level.position > 150) {
      try {
        let lev = await levels.findById(req.body.move150below ?? "")
        if (!lev) throw new Error()
        if (lev._id.toString() == level._id.toString()) return res.status(400).send({ message: "The move 150 below field cannot be the level you are moving!" })
        if (lev.position <= 150) return res.status(400).send({ message: "The move 150 below field cannot be a top 150 level!" })
        additional_info.move150below = lev
      } catch (_) {
        return res.status(400).json({ message: "Please input a valid level for the move 150 below field!" })
      }
    }

    if (req.body.changes.position > 150 && level.position <= 150) {
      try {
        let lev = await levels.findById(req.body.new150 ?? "")
        if (!lev) throw new Error()
        if (lev._id.toString() == level._id.toString()) return res.status(400).send({ message: "The new 150 field cannot be the level you are moving!" })
        if (lev.position <= 150) return res.status(400).send({ message: "The new 150 field cannot be a top 150 level!" })
        additional_info.new150 = lev
      } catch (_) {
        return res.status(400).json({ message: "Please input a valid level for the new 150 field!" })
      }
    }

    if (additional_info.new150 || additional_info.move150below) {
      let levelFilter = await levels.aggregate([
        { "$match": { position: { "$in": [150, (additional_info.new150 ?? level).position] } } },
        { "$addFields": { "levelNames": [] } },
        {
          "$group": {
            _id: null,
            list: {
              "$addToSet": {
                "$map": {
                  input: "$list",
                  as: "record",
                  in: {
                    $mergeObjects: [{ levPos: "$position" }, "$$record"]
                  }
                }
              }
            }
          }
        },
        {
          "$project": {
            list: {
              "$filter": {
                input: "$list",
                as: "records",
                cond: { "$ne": ["$$records.screenshot", true] }
              }
            }
          }
        },
        {
          "$project": {
            ids: [{
              "$map": {
                input: {
                  "$filter": {
                    input: "$list",
                    as: "records",
                    cond: { "$eq": ["$$records.levPos", 150] }
                  }
                },
                as: "record",
                in: "$$record._id"
              }
            }, {
              "$map": {
                input: {
                  "$filter": {
                    input: "$list",
                    as: "records",
                    cond: { "$ne": ["$$records.levPos", 150] }
                  }
                },
                as: "record",
                in: "$$record._id"
              }
            }],
            names: {
              "$map": {
                input: "$list",
                as: "record",
                in: "$$record.name"
              }
            }
          }
        },
        {
          "$project": {
            ids: {
              "$map": {
                input: "$ids",
                as: "id",
                in: {
                  "$reduce": {
                    input: "$$id",
                    initialValue: [],
                    in: { "$concatArrays": ["$$value", "$$this"] }
                  }
                }
              }
            },
            names: {
              "$reduce": {
                input: "$names",
                initialValue: [],
                in: { "$concatArrays": ["$$value", "$$this"] }
              }
            }
          }
        },
      ])
      let { ids, names } = levelFilter[0]
      await leaderboard.updateMany({ name: { "$in": names } }, [
        {
          "$set": {
            records: {
              "$concatArrays": [{
                "$filter": {
                  input: "$records",
                  as: "record",
                  cond: {
                    "$and": [
                      { "$ne": ["$$record", "none"] },
                      { "$not": [{ $in: ["$$record.id", ids[0]] }] }
                    ]
                  }
                }
              }, {
                "$filter": {
                  input: "$extralist",
                  as: "record",
                  cond: {
                    "$and": [
                      { "$lt": [{ $toInt: "$$record.percent" }, 100] },
                      { "$in": ["$$record.id", ids[1]] }
                    ]
                  }
                }
              }]
            },
            completions: {
              "$concatArrays": [{
                "$filter": {
                  input: "$completions",
                  as: "record",
                  cond: {
                    "$and": [
                      { "$ne": ["$$record", "none"] },
                      { "$not": [{ $in: ["$$record.id", ids[0]] }] }
                    ]
                  }
                }
              }, {
                "$filter": {
                  input: "$extralist",
                  as: "record",
                  cond: {
                    "$and": [
                      { "$eq": [{ $toInt: "$$record.percent" }, 100] },
                      { "$in": ["$$record.id", ids[1]] }
                    ]
                  }
                }
              }]
            },
            extralist: {
              "$concatArrays": [{
                "$filter": {
                  input: "$extralist",
                  as: "record",
                  cond: {
                    "$and": [
                      { "$ne": ["$$record", "none"] },
                      { "$not": [{ $in: ["$$record.id", ids[1]] }] }
                    ]
                  }
                }
              }, {
                "$filter": {
                  input: "$records",
                  as: "record",
                  cond: { $in: ["$$record.id", ids[0]] }
                }
              },
              {
                "$filter": {
                  input: "$completions",
                  as: "record",
                  cond: { $in: ["$$record.id", ids[0]] }
                }
              }]
            }
          }
        }
      ])
    }
    await levels.updateMany({ position: { "$lte": Math.max(level.position, req.body.changes.position, (additional_info.move150below?.position ?? 0), (additional_info.new150?.position ?? 0)), "$gte": Math.min(level.position, req.body.changes.position), "$ne": level.position } }, [
      {
        "$set": {
          position: {
            "$switch": {
              branches: [
                { case: { "$eq": ["$position", additional_info.new150?.position ?? 0] }, then: 150 },
                {
                  case: {
                    "$and": [
                      { "$gt": ["$position", additional_info.new150?.position ?? Infinity] },
                      { "$lte": ["$position", req.body.changes.position] }
                    ]
                  }, then: { "$subtract": ["$position", 1] }
                },
                {
                  case: {
                    "$and": [
                      { "$lt": ["$position", additional_info.new150?.position ?? 0] },
                      { "$gte": ["$position", req.body.changes.position] }
                    ]
                  }, then: { "$add": ["$position", 1] }
                },
                {
                  case: {
                    "$and": [
                      { "$lt": ["$position", req.body.changes.position] },
                      { "$gt": ["$position", additional_info.new150 ? 150 : Infinity] }
                    ]
                  }, then: "$position"
                },
                {
                  case: {
                    $and: [
                      { "$lte": ["$position", additional_info.move150below?.position ?? 0] },
                      { "$gt": ["$position", level.position] }
                    ]
                  }, then: { "$subtract": ["$position", 1] }
                },
                {
                  case: {
                    "$and": [
                      { "$gt": ["$position", 150] },
                      { "$lt": ["$position", additional_info.move150below?.position ?? 0] }
                    ]
                  }, then: "$position"
                },
                {
                  case: {
                    "$and": [
                      { "$eq": ["$position", additional_info.move150below?.position ?? 0] },
                      { "$lt": ["$position", level.position] }
                    ]
                  }, then: "$position"
                },
                { case: { "$eq": ["$position", additional_info.move150below?.position ?? 0] }, then: { "$subtract": ["$position", 1] } },
                {
                  case: {
                    "$and": [
                      { "$eq": ["$position", 150] },
                      { "$lt": [additional_info.move150below?.position ?? Infinity, level.position] }
                    ]
                  }, then: additional_info.move150below?.position + 1
                },
                {
                  case: {
                    "$and": [
                      { "$eq": ["$position", 150] },
                      { "$lt": ["$position", additional_info.move150below?.position ?? 0] }
                    ]
                  }, then: additional_info.move150below?.position
                },
                { case: { "$lt": [req.body.changes.position, level.position] }, then: { "$add": ["$position", 1] } },
                { case: { "$gt": [req.body.changes.position, level.position] }, then: { "$subtract": ["$position", 1] } }
              ],
              default: "$position"
            }
          }
        }
      }])
  }
  if (req.body.changes.name || req.body.changes.host) {
    let names = level.list.map((e: any) => e.name)
    await leaderboard.updateMany({ name: { $in: names } }, [
      {
        "$set": {
          extralist: {
            "$map": {
              input: "$extralist",
              as: "record",
              in: {
                "$switch": {
                  branches: [
                    {
                      case: { "$in": ["$$record.id", level.list.map((e: any) => new ObjectID(e._id))] }, then: {
                        name: req.body.changes.name ?? level.name,
                        host: req.body.changes.host ?? level.host,
                        percent: "$$record.percent",
                        hertz: "$$record.hertz",
                        verification: "$$record.verification",
                        id: "$$record.id"
                      }
                    }
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
                    {
                      case: { "$in": ["$$record.id", level.list.map((e: any) => new ObjectID(e._id))] }, then: {
                        name: req.body.changes.name ?? level.name,
                        host: req.body.changes.host ?? level.host,
                        percent: "$$record.percent",
                        hertz: "$$record.hertz",
                        verification: "$$record.verification",
                        id: "$$record.id"
                      }
                    }
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
                    {
                      case: { "$in": ["$$record.id", level.list.map((e: any) => new ObjectID(e._id))] }, then: {
                        name: req.body.changes.name ?? level.name,
                        host: req.body.changes.host ?? level.host,
                        percent: "$$record.percent",
                        hertz: "$$record.hertz",
                        verification: "$$record.verification",
                        id: "$$record.id"
                      }
                    }
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
                    {
                      case: { "$in": ["$$record.id", level.list.map((e: any) => new ObjectID(e._id))] }, then: {
                        name: req.body.changes.name ?? level.name,
                        host: req.body.changes.host ?? level.host,
                        percent: "$$record.percent",
                        hertz: "$$record.hertz",
                        verification: "$$record.verification",
                        id: "$$record.id"
                      }
                    }
                  ],
                  default: "$$record"
                }
              }
            }
          }
        }
      }
    ])
  }
  if (req.body.changes.list) {
    let replacements = {
      names: level.list.map((e: any) => {
        let eq = req.body.changes.list.find((x: any) => x._id == e._id)
        if (!eq) return undefined;
        if (eq.name == e.name) return undefined;
        return [e.name, eq.name, {
          name: req.body.changes.name ?? level.name,
          host: req.body.changes.host ?? level.host,
          percent: eq.percent[0],
          hertz: eq.hertz,
          verification: eq.verification,
          id: new ObjectID(eq._id)
        }]
      }).filter((e: any) => e),
      other: level.list.map((e: any) => {
        let eq = req.body.changes.list.find((x: any) => x._id == e._id)
        if (!eq) return undefined;
        if (eq.percent[0] == e.percent[0] && eq.screenshot == e.screenshot && eq.hertz == e.hertz && eq.verification == e.verification) return undefined;
        return [eq.name, {
          name: req.body.changes.name ?? level.name,
          host: req.body.changes.host ?? level.host,
          percent: eq.percent[0],
          hertz: eq.hertz,
          verification: eq.verification,
          id: new ObjectID(eq._id)
        }, eq.screenshot]
      }).filter((e: any) => e)
    }
    function classify(percent: number, screenshot: boolean, position: number) {
      if (screenshot) return "screenshot"
      if (position > 150) return "extralist"
      if (percent < 100) return "records"
      return "completions"
    }
    replacements.names.forEach(async (names: [string, string, any]) => {
      await leaderboard.updateOne({ name: names[0] }, {
        $pull: {
          [classify(parseInt(names[2].percent[0]), names[2].screenshot, req.body.changes.position ?? level.position)]: {
            id: new ObjectId(names[2].id)
          }
        }
      })
      await leaderboard.updateOne({ name: names[1] }, {
        $push: {
          [classify(names[2].percent, names[2].screenshot, req.body.changes.position ?? level.position)]: names[2]
        }
      }, { upsert: true })
      let { records, completions, extralist, screenshot } = await leaderboard.findOne({ name: names[0] }).select("records completions extralist screenshot")
      if ([...records, ...completions, ...extralist, ...screenshot].every((e: any) => e == "none")) {
        await leaderboard.deleteOne({ name: names[0] })
      }

    })
    replacements.other.forEach(async (stuff: [string, any, boolean]) => {
      if(replacements.names?.find((e:any) => e?.[2]?.id.toString() == stuff[1].id.toString())) return;
      await leaderboard.updateOne({ name: stuff[0] }, [{
        $set: {
          records: {
            $concatArrays: [
              {
                $filter: {
                  input: "$records",
                  as: "record",
                  cond: {
                    $and: [
                      { $ne: ["$$record.id", stuff[1].id] },
                      { $ne: ["$$record", "none"] }
                    ]
                  }
                }
              },
              {
                $switch: {
                  branches: [
                    {
                      case: {
                        $and: [
                          { $lte: [level.position, 150] },
                          { $lt: [{ $toInt: stuff[1].percent }, 100] },
                          { $ne: [stuff[2], true] }
                        ]
                      }, then: [stuff[1]]
                    }
                  ],
                  default: []
                }
              }
            ]
          },
          completions: {
            $concatArrays: [
              {
                $filter: {
                  input: "$completions",
                  as: "record",
                  cond: {
                    $and: [
                      { $ne: ["$$record.id", stuff[1].id] },
                      { $ne: ["$$record", "none"] }
                    ]
                  }
                }
              },
              {
                $switch: {
                  branches: [
                    {
                      case: {
                        $and: [
                          { $lte: [level.position, 150] },
                          { $eq: [{ $toInt: stuff[1].percent }, 100] },
                          { $ne: [stuff[2], true] }
                        ]
                      }, then: [stuff[1]]
                    }
                  ],
                  default: []
                }
              }
            ]
          },
          extralist: {
            $concatArrays: [
              {
                $filter: {
                  input: "$extralist",
                  as: "record",
                  cond: {
                    $and: [
                      { $ne: ["$$record.id", stuff[1].id] },
                      { $ne: ["$$record", "none"] }
                    ]
                  }
                }
              },
              {
                $switch: {
                  branches: [
                    {
                      case: {
                        $and: [
                          { $gte: [level.position, 150] },
                          { $ne: [stuff[2], true] }
                        ]
                      }, then: [stuff[1]]
                    }
                  ],
                  default: []
                }
              }
            ]
          },
          screenshot: {
            $concatArrays: [
              {
                $filter: {
                  input: "$screenshot",
                  as: "record",
                  cond: {
                    $and: [
                      { $ne: ["$$record.id", stuff[1].id] },
                      { $ne: ["$$record", "none"] }
                    ]
                  }
                }
              },
              {
                $switch: {
                  branches: [
                    { case: { $eq: [stuff[2], true] }, then: [stuff[1]] }
                  ],
                  default: []
                }
              }
            ]
          }
        }
      }])
    })
  }
  await levels.findByIdAndUpdate(level._id, {
    "$set": req.body.changes
  })

  let changes: any = []

  if (req.body.changes.list) {
    req.body.changes.list.forEach((x: any, ind: number) => {
      Object.entries(x).forEach((i: any) => {
        if (i[0] == "percent") {
          Object.entries(i[1]).forEach((h: any) => {
            if (h[1] != level.list[ind][i[0]][h[0]]) {
              changes.push(`list.${ind}.${i[0]}.${h[0]}: ${level.list[ind][i[0]][h[0]]} => ${h[1]}`)
            }
          })
          return
        }
        if (i[1] != level.list[ind][i[0]]) {
          changes.push(`list.${ind}.${i[0]}: ${level.list[ind][i[0]]} => ${i[1]}`)
        }
      })
    })
  }

  await webhook(null, [{
    title: "Level Edited",
    description: `[${level.name}](https://youtube.com/watch?v=${level.ytcode}) by ${level.host} (verifier: ${level.verifier}) has just been edited! Here is the info that was edited:\n\n${Object.entries(req.body.changes).map(e => e[0] == "thumbnail" ? `${e[0]}: ${thumbnails.get(level[e[0]])} => ${thumbnails.get(e[1])}` : e[0] != "list" ? `${e[0]}: ${level[e[0]]} => ${e[1]}` : changes.join("\n")).join("\n")}`
  }])
  res.status(200).json({})
}