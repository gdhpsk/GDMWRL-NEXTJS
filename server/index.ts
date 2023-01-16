import express, { Request, Response } from "express";
import next from "next";
import apiRoute from"./api/public"
if(!process.env.password) {
  let dotenv = require("dotenv")
  dotenv.config()
}
import mongoose from "mongoose"
mongoose.connect(`mongodb+srv://gdhpsk:${process.env.password}@gdhpsk-data.ldfbk.mongodb.net/test`)
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
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
    console.error(e);
    process.exit(1);
  }
})();