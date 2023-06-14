import { NextApiRequest, NextApiResponse } from "next";
import {levels as levelsSchema} from "../../../../mongodb" 
import levels from "../../../../unrated.json"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(isNaN(req.query.page as any) || req.query.page as any < 1) return res.status(400).json({message: "Please send a positive page number!"})
    let page = parseInt(req.query.page as any)
    let count = await levelsSchema.count({position: {"$gt": 150}})
    let everything = await levelsSchema.find({position: {"$lte": page*100+150, "$gt": page*100+50}, name: {"$nin": levels.levels}}).sort({position:1})
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache")
     res.status(200).json({pages: Math.ceil(count / 100), data: everything});
  }