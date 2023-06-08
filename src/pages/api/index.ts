import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../firebase" 

let count = 0

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await db.collection("levels").get()
    let data = everything.docs.map(async e => {
      let listData = await db.collection(`levels/${e.id}/list`).get()
      let list = listData.docs.map(x => x.data())
      return {
        ...e.data(),
        list
      }
    })
    let resolved = await Promise.all(data)
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(200).json(resolved);
  }