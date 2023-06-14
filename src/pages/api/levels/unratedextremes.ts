import { NextApiRequest, NextApiResponse } from "next";
import {levels as levelsSchema} from "../../../../mongodb" 
import levels from "../../../../unrated.json"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await levelsSchema.find({name: {"$in": levels.levels}}).sort({position:1})
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache")
     res.status(200).json(everything);
  }