import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../firebase" 
import { NextResponse } from "next/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let everything = await db.collection("levels").where("position", "<=", 75).orderBy("position").get()
    let data = everything.docs.map(e => {
        return {
            ...e.data(),
            id: e.id
        }
    })
    let response = NextResponse.json(data, {status: 200});
    response.headers.set("Cache-Control", 'public, s-maxage=86400')
    return response
  }

  export const config = {
    runtime: 'edge',
  }
  