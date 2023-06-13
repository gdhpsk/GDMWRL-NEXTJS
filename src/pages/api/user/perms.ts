import { NextApiRequest, NextApiResponse } from "next";
import db, {authentication} from "../../../../firebase-admin" 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method == "POST") {
      try {
        let currentUser = await authentication.verifyIdToken(req.body.token)
        if(currentUser.role != "owner") return res.status(401).json({message: "You cannot perform this action, since you are not an owner."})
        let info = await authentication.getUser(req.body.uid)
        if(info.uid == "UmgdQBJPp6Wxdr1lShhCMGUwOZo1") return res.status(400).send({message: "How dare you try and change hpsk!"})
        if(!info.emailVerified) return res.status(400).send({message: "This user has not yet verified their email, so please tell them to!"})
        if(!["editor", "owner"].includes(req.body.role)) return res.status(400).json({message: "Please input a role that is either 'editor' or 'owner'!"})
        await authentication.setCustomUserClaims(req.body.uid, {role: req.body.role})
        res.status(201).json({message: "success"})
      } catch(_) {
        res.status(400).json({message: "Please check your body to see if you sent the correct information!"})
      }
    } else if(req.method == "DELETE") {
      try {
        let currentUser = await authentication.verifyIdToken(req.body.token)
        if(currentUser.role != "owner") return res.status(401).json({message: "You cannot perform this action, since you are not an owner."})
        let info = await authentication.getUser(req.body.uid)
        if(info.uid == "UmgdQBJPp6Wxdr1lShhCMGUwOZo1") return res.status(400).send({message: "How dare you try and delete hpsk!"})
        await authentication.setCustomUserClaims(req.body.uid, {})
        res.status(201).json({message: "success"})
      } catch(_) {
        res.status(400).json({message: "Please check your body to see if you sent the correct information!"})
      }
    } else {
      res.status(404).send("404 Not Found")
    }
  }