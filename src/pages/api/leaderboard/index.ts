import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../firebase" 
import { collection, getCountFromServer, getDocs, orderBy, query, where } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(!["true", "false"].includes(req.query.wrs as string)) return res.status(400).send({message: "Please put either true or false for the 'wrs' query"})
    let wrs =  req.query.wrs == "true" ? true : false
    let everything = await getDocs(collection(db, "leaderboard"))
    let getCount = async (id: string, subcollection: string, getOnlyCompletions?: boolean) => {
        let count = await getCountFromServer(getOnlyCompletions ? query(collection(db, `leaderboard/${id}/${subcollection}`), where("percent", "==", 100)) : collection(db, `leaderboard/${id}/${subcollection}`))
        return count.data().count
    }
    async function getWRs(id: string) {
        let records = await getCount(id, "records")
        let completions = await getCount(id, "completions")
        let extralist = await getCount(id, "extralist")
        let screenshot = await getCount(id, "screenshot")
        return records+completions+extralist+screenshot
    }
    async function getPoints(id: string, minus: number) {
        let records = await getCount(id, "records")
        let completions = await getCount(id, "completions")
        let extralist = await getCount(id, "extralist", true)
        return records+completions*2+extralist-minus
    }
    let data = everything.docs.map(async e => {
        let data = e.data()
        let total = wrs ? await getWRs(e.id) : await getPoints(e.id, data.minus || 0)
        return {
            ...e.data(),
            id: e.id,
            total
        }
    })
    let resolved = await Promise.all(data)
    res.setHeader('Cache-Control', 'public, s-maxage=86400');
     res.status(200).json(resolved);
  }