import express from "express"
const app = express.Router()
import leaderboard from "../schemas/leaderboard"
import unratedextremes from "../unrated.json"
import levels from "../schemas/levels"
import cache from "node-cache"
let myCache = new cache()

let count = 0

app.get("/test", async (req, res) => {
  if(!myCache.get("count")) {
    count++
    myCache.set("count", count, 5)
  }
  res.json(myCache.get("count") ?? count)
})

// list of all the level names
app.get("/levellist", async (req, res) => {
  const alldata = await levels.find()
    
  alldata.sort((a: any, b: any) => (a?.position ?? 0) - (b?.position ?? 0))
  
    var obj = alldata.reduce(function(acc: any, cur, i) {
        acc[alldata[i].name as any] = cur;
        return acc;
      }, {});
    res.json({levels: Object.keys(obj)})
})

// the entire leaderboard
app.get("/leaderboard", async (req, res) => {
  const alldata = await leaderboard.find()
    var obj = alldata.reduce(function(acc: any, cur: any, i: any) {
        acc[alldata[i].name as any as any] = cur;
        return acc;
      }, {});
    res.json(obj)
})

// the top 75
app.get("/75", async (req, res) => {
  const alldata = await levels.find()
    alldata.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
  alldata.splice(75)
    var obj = alldata.reduce(function(acc: any, cur: any, i: any) {
      acc[alldata[i].name as any] = cur;
        return acc;
      }, {});
    res.json(obj)
})

// the top 76-150
app.get("/150", async (req, res) => {
  const alldata = await levels.find()
    alldata.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
  alldata.splice(0, 75)
  alldata.splice(75)
    var obj = alldata.reduce(function(acc: any, cur: any, i: any) {
      acc[alldata[i].name as any] = cur;
        return acc;
      }, {});
    res.json(obj)
})

// the extralist
app.get("/extra", async (req, res) => {
  const alldata = await levels.find()
    alldata.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
  alldata.splice(0, 150)
  var newalldata = alldata.filter(e => !unratedextremes.levels.includes(e.name))
    var obj = newalldata.reduce(function(acc: any, cur: any, i: any) {
      acc[newalldata[i].name as any] = cur;
        return acc;
      }, {});
    res.json(obj)
})

// All the unrated extremes
app.get("/unratedextremes", async (req, res) => {
  const alldata = await levels.find()
    alldata.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
  var newalldata = alldata.filter(e => unratedextremes.levels.includes(e.name))
    var obj = newalldata.reduce(function(acc: any, cur: any, i: any) {
      acc[newalldata[i].name as any] = cur;
        return acc;
      }, {});
    res.json(obj)
})

// all the levels
app.get("/", async (req, res) => {
  const alldata = await levels.find()
    alldata.sort((a, b) => (a?.position ?? 0) - (b?.position ?? 0))
    var obj = alldata.reduce(function(acc: any, cur: any, i: any) {
      acc[alldata[i].name as any] = cur;
        return acc;
      }, {});
    res.json(alldata)
})

export default app