import express, { Request, Response } from "express";
import next from "next";
import fs from "fs/promises"
import apiRoute from"./api/public"
import levels from "./schemas/levels"
import * as application from "firebase-admin/app"
import * as database from "firebase-admin/firestore"
if(!process.env.password) {
  let dotenv = require("dotenv")
  dotenv.config()
}
import mongoose from "mongoose"
import Level from "./firebase/levels";
import leaderboard from "./schemas/leaderboard";
mongoose.connect(`mongodb+srv://gdhpsk:${process.env.password}@gdhpsk-data.ldfbk.mongodb.net/test`)
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  await fs.writeFile("cred.json", JSON.stringify(Object.fromEntries(Object.entries(process.env).filter(e => e[0].toLowerCase() === e[0]))))

const firebase = application.initializeApp({
  credential: application.applicationDefault(),
  databaseURL: 'https://mwrl-7b27f-default-rtdb.firebaseio.com',
  databaseAuthVariableOverride: {
    uid: process.env.APIKEY
  }
});

function classify(percent: number, screenshot: boolean, position: number) {
  if(screenshot) return "screenshot"
  if(position > 150) return "extralist"
  if(percent < 100) return "records"
  return "completions"
}

let db =database.getFirestore(firebase)
db.settings({
  ignoreUndefinedProperties: true
})

  try {
    
    // let everything = await db.collection("levels").get()
    // let data = everything.docs.map(async e => {
    //   let listData = await db.collection(`levels/${e.id}/list`).get()
    //   let list = listData.docs.map(x => x.data())
    //   return {
    //     ...e.data(),
    //     list
    //   }
    // })
    // console.log(await Promise.all(data))
    // let everything = await levels.find()
    // for(let item of everything) {
    // let removeList = Object.fromEntries(Object.entries(item.toJSON()).filter(e => !["list", "_id", "__v"].includes(e[0])))
    // let onlyList = item.toJSON().list.map(e => Object.fromEntries(Object.entries(e).filter(x => !["_id"].includes(x[0]))))
    // let level = await db.collection("levels").add(removeList)
    // for(let record of onlyList) {
    //   await level.collection("list").add(record)
    // }
    // }

    // let everything2 = await leaderboard.find()
    // let levels = await db.collection("levels").get()
    // for(let level of levels.docs) {
    //   let records = await db.collection(`levels/${level.id}/list`).get()
    //   for(let record of records.docs) {
    //     let data = record.data()
    //     if(data.name == "") continue
    //     let exists = db.collection("leaderboard").where("name", "==", data.name).limit(1)
    //     let count = await exists.count().get()
    //     if(!count.data().count) {
    //       let person = everything2.find(e => e.name == data.name)
    //       await db.collection("leaderboard").add({
    //         name: data.name,
    //         nationality: person?.nationality,
    //         socials: person?.socials,
    //         minus: person?.minus
    //       })
    //       exists = db.collection("leaderboard").where("name", "==", data.name).limit(1)
    //     }
    //     let real = await exists.get()
    //     let profile = db.collection(`leaderboard/${real.docs[0].id}/${classify(parseInt(data.percent[0]), data.screenshot, level.data().position)}`)
    //     await profile.add({
    //       name: level.data().name,
    //       percent: parseInt(data.percent[0]),
    //       hertz: data.hertz,
    //       id: record.id,
    //       verification: data.verification
    //     })
    //   }
    // }
    await app.prepare();
    const server = express();

    server.use("/api", apiRoute)

    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });
    server.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();