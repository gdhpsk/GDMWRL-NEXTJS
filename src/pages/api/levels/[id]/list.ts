import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../firebase" 
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let listData = await getDocs(collection(db, `levels/${req.query.id}/list`))
      let list = listData.docs.map(x => x.data())
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(listData.empty ? 404 : 200).json(list);
  }