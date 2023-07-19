import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let data = await fetch("http://www.boomlings.com/database/getGJLevels21.php", {
    method: "post",
    headers: { 
      "User-Agent": "",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
        secret: "Wmfd2893gb7",
        ...req.query
    })
  })
  let text = await data.text()
  res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Cache-Control", "no-cache")
  if(data.status != 200) {
    return res.status(data.status).send(text);
  }
  let seperate = text.split("#")
  let levels = seperate[0].split("|")
  let creators = seperate[1].split("|").map(e => e.split(":"))
  let songs = seperate[2].split("~:~").map(e => e.split("~|~"))
  let pageInfo = seperate[3].split(":")
  let obj = {
    totalLevels: pageInfo[0],
    offset: pageInfo[1],
    amount: pageInfo[2],
    hash: seperate[4],
    levels: levels.map((e, ind) => {
        let array = e.split(":")
        function v(key: number) {
            return array[array.findIndex((e, i) => e == key.toString() && i%2 == 0)+1 || -1]
          }
          let author:any = creators.find(x => x.find(i => i == v(6)))
          let song:any = songs.find((x:any) => x.find((i:any) => i == v(35)))
          function songV(key: number) {
            return song[song.findIndex((e: any, i:any) => e == key.toString() && i%2 == 0)+1 || -1]
          }
          return {
            levelID: parseInt(v(1)),
            levelName: v(2),
            description: {
                raw:v(3),
                text: Buffer.from(v(3), "base64").toString()
            },
            version: parseInt(v(5)),
            player: {
                userID: parseInt(author[0]),
                username: author[1],
                accountID: parseInt(author[2])
            },
            difficultyDenominator: parseInt(v(8)),
            difficultyNumerator: parseInt(v(9)),
            downloads: parseInt(v(10)),
            setCompletes: parseInt(v(11)),
            gameVersion: parseInt(v(13)),
            likes: parseInt(v(14)),
            length: parseInt(v(15)),
            dislikes: parseInt(v(16)),
            demon: !!parseInt(v(17)),
            stars: parseInt(v(18)),
            featureScore: parseInt(v(19)),
            auto: !!parseInt(v(25)),
            recordString: v(26),
            copiedID: parseInt(v(30)),
            twoPlayer: !!parseInt(v(31)),
            extraString: v(36),
            coins: parseInt(v(37)),
            verifiedCoins: !!parseInt(v(38)),
            starsRequested: parseInt(v(39)),
            epic: parseInt(v(42)),
            demonDifficulty: parseInt(v(43)),
            isGauntlet: !!parseInt(v(44)),
            objects: parseInt(v(45)),
            editorTime: parseInt(v(46)),
            editorTimeCopies: parseInt(v(47)),
            settingsString: v(48),
            songInfo: song ? {
                ID: parseInt(songV(1)),
                officialSong: false,
                name: songV(2),
                artistID: parseInt(songV(3)),
                artistName: songV(4),
                size: parseFloat(songV(5)),
                videoID: songV(6),
                youtubeURL: songV(7),
                isVerified: !!parseInt(songV(8)),
                songPriority: parseInt(songV(9)),
                link: decodeURIComponent(songV(10))
            } : {
                ID: parseInt(v(12)),
                officialSong: true
            }
          }
      })
  }
     res.status(200).json(obj);
  }

  export const config = {
    runtime: "nodejs"
  }