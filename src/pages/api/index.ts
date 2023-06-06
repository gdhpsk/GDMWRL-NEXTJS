import { NextApiRequest, NextApiResponse } from "next";
import db from "../../firebase"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let levels = await db.collection("levels").orderBy("position").get()
    let everything = levels.docs.map(e => e.data())
    delete everything[0]._id
    delete everything[0].__v
    //  everything[0].list[0].deleted = "lol"
    // console.log(everything[0])
    // await db.collection("levels").add(everything[0])
    res.status(200).send(everything)
  }

  export const config = {
    runtime: "edge"
  }