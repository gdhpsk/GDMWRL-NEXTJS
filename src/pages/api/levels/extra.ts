import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../firebase" 
import levels from "../../../../unrated.json"
import { collection, getCountFromServer, getDocs, limit, orderBy, query, where } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(isNaN(req.query.page as any) || req.query.page as any < 1) return res.status(400).json({message: "Please send a positive page number!"})
    let page = parseInt(req.query.page as any)
    let count = await getCountFromServer(query(collection(db, "levels"), where("position", ">", 150)))
     let everything = await getDocs(query(collection(db, "levels"), where("position", ">", page*100+50), limit(100), orderBy("position")))
    let data = everything.docs.map(e => {
        return {
            ...e.data() as any,
            id: e.id
        }
    }).filter(e => !levels.levels.includes(e.name))
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(200).json({pages: Math.ceil(count.data().count / 100), data});
  }