import { NextApiRequest, NextApiResponse } from "next";
import {authentication} from "../../../firebase-admin" 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let currentUser = await authentication.verifyIdToken(req.query.token as any)
    if(currentUser.role != "owner" && currentUser.role != "editor") throw new Error()
  } catch(_) {
    return res.status(401).json({message: "You cannot perform this action."})
  }
    let users = await authentication.listUsers(1000)
    let mod_users = users.users.filter(e => ["editor", "owner"].includes(e?.customClaims?.role))
    let list = mod_users.map(e => {
      return {
        uid: e.uid,
        email: e.email,
        name: e.displayName,
        role: e.customClaims?.role
      }
    })
    res.status(200).json(list)
  }