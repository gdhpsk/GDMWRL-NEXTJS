import express, { Request, Response } from "express";
import next from "next";
import fs from "fs/promises"
import apiRoute from"./api/public"
import levels from "./schemas/levels"
import * as application from "firebase-admin/app"
import * as database from "firebase-admin/database"
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

let db =database.getDatabase(firebase)
  try {
    // let everything = await leaderboard.find()
    // await db.ref("leaderboard").push(everything[0].toJSON())
    // let level = await db.collection("levels").where("name", "==", "Erebus").limit(1).get()
    // console.log(level.docs[0].data())
  //  await fs.appendFile("./.env", `\n${Object.entries(fb_cred).map((e) => `${e[0]}="${e[1]}"`).join("\n")}`)
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