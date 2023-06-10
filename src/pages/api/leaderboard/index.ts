import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../firebase" 
import { collection, getCountFromServer, getDocs, orderBy, query, where } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await getDocs(collection(db, "leaderboard"))
    let getCount = async (id: string, subcollection: string, queryOp?: string) => {
        let count = await getCountFromServer(queryOp ? query(collection(db, `leaderboard/${id}/${subcollection}`), where("percent", queryOp as any, 100)) : collection(db, `leaderboard/${id}/${subcollection}`))
        return count.data().count
    }
    let data = everything.docs.map(async e => {
        let records = await getCount(e.id, "records")
        let completions = await getCount(e.id, "completions")
        let extralist_prog = await getCount(e.id, "extralist", "<")
        let extralist_comp = await getCount(e.id, "extralist", "==")
        let screenshot = await getCount(e.id, "screenshot")
        return {
            ...e.data(),
            id: e.id,
            records,
            completions,
            extralist_prog,
            extralist_comp,
            screenshot
        }
    })
    let resolved = await Promise.all(data)
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(200).json(resolved);
  }