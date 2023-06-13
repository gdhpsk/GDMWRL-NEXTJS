import { NextApiRequest, NextApiResponse } from "next";
import db, {authentication} from "../../../firebase-admin" 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let currentUser = await authentication.verifyIdToken(req.query.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
    let mods = await db.collection("mods").select("uid").get()
    let users = mods.docs.map(e => e.data())
    let mod_users = await authentication.getUsers(users as any)
    let list = mod_users.users.map(e => {
      return {
        uid: e.uid,
        email: e.email,
        name: e.displayName,
        role: e.customClaims?.role
      }
    })
    res.status(200).json(list)
  }