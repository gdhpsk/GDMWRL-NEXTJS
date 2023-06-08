import { NextApiRequest, NextApiResponse } from "next";
import cache from "../../../cache"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.json(cache.get("count") ?? 0)
  }