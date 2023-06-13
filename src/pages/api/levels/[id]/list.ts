import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../firebase-admin" 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let listData = await db.collection(`levels/${req.query.id}/list`).get()
      let list = listData.docs.map(x => x.data())
      res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(listData.empty ? 404 : 200).json(list);
  }