import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../firebase" 
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let listData = await getDocs(collection(db, `leaderboard/${req.query.id}/records`))
      let list = listData.docs.map(x => x.data())
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(listData.empty ? 404 : 200).json(list);
  }