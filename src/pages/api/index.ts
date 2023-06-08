import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../firebase"

let count = 0

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 's-maxage=86400');
    count++;
     res.status(200).json(count);
  }