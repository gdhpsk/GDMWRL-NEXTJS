import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../firebase" 
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await getDocs(query(collection(db, "levels"), where("position", ">", 75), where("position", "<=", 150), orderBy("position")))
    let data = everything.docs.map(e => {
        return {
            ...e.data(),
            id: e.id
        }
    })
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(200).json(data);
  }