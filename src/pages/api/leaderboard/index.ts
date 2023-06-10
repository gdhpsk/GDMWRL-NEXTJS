import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../firebase-admin" 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await db.collection("leaderboard").get()
    let getCount = async (id: string, subcollection: string, queryOp?: string) => {
        let count = queryOp ? await db.collection(`leaderboard/${id}/${subcollection}`).where("percent", queryOp as any, 100).count().get() : await db.collection(`leaderboard/${id}/${subcollection}`).count().get()
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
           count: {
            records,
            completions,
            extralist_prog,
            extralist_comp,
            screenshot
           }
        }
    })
    let resolved = await Promise.all(data)
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(200).json(resolved);
  }