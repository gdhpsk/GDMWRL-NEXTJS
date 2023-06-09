import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../firebase" 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await db.collection("levels").where("position", "<=", 75).orderBy("position").get()
    let data = everything.docs.map(e => {
        return {
            ...e.data(),
            id: e.id
        }
    })
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(200).json(data);
  }