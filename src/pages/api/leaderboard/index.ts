import { NextApiRequest, NextApiResponse } from "next";
import {leaderboard} from "../../../../mongodb" 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await leaderboard.find()
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader('Cache-Control', 'no-cache');
     res.status(200).json(everything);
  }