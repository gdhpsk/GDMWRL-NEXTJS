import { NextApiRequest, NextApiResponse } from "next";
import db from "../../firebase"
let {count} = require("../../../count.json")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Cache-Control', 'max-age=2592000000');
    count = count + 1
    res.json(count)
  }