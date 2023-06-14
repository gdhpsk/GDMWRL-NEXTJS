import { NextApiRequest, NextApiResponse } from "next";
import {levels} from "../../../../mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await levels.find().sort({position:1})
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache")
     res.status(200).json(everything);
  }