import { NextApiRequest, NextApiResponse } from "next";
import {levels} from "../../../../mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await levels.find({position: {"$lte": 75}}).sort({position:1})
     res.status(200).json(everything);
  }