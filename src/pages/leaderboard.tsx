

import {useState, useEffect} from "react"
import { Button, Container } from "react-bootstrap"
import Level from"../components/Level"
import {models} from "mongoose"
import Leaderboard from "@/components/Leaderboard"
import { NextApiRequest } from "next"
import Script from "next/script"


export default function Home({leaderboard, levels, bywrs}: any) {
    let [wrs, setByWrs] = useState<Boolean>(bywrs)
    function calcPoints({records, completions, extralist, screenshot, minus}: any) {
        let points = 0
        points += records.filter((e: any) => typeof e === "object").length
        points += completions.filter((e: any) => typeof e === "object").length*2
        points += extralist.filter((e: any) => e?.percent == 100).length
        if(wrs) {
            points -= completions.filter((e: any) => typeof e === "object").length
            points += extralist.filter((e: any) => e?.percent != 100).length
            points += screenshot.filter((e: any) => typeof e === "object").length
            return points
        } else {
            return points - (minus || 0)
        }
    }
  let [array, setArray] = useState<Array<Record<any, any>>>(levels)
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api")
          let json = await levels.json()
          setArray(Object.values(json))
        } catch(_) {

        }
      })()
  })
  let [lead, setLead] = useState<Array<any>>(leaderboard)
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api/leaderboard")
          let json = await levels.json()
          setLead(Object.values(json).sort((a: any, b: any) => calcPoints(b) - calcPoints(a)))
        } catch(_) {

        }
      })()
  })
  lead.sort((a: any, b: any) => calcPoints(b) - calcPoints(a))
  return (
    <div>
    <Script src="sweetalert2/dist/sweetalert2.min.js" defer></Script>
      <div className="bannerone">
        <h1 className="page-title">Leaderboard</h1>
      </div>
    <Container>
    <p style={{"textAlign": "center"}} className="white">Click on a player&#39;s name for some additional information. It may take a second to load. NOTE: If someone has a video and a photo of a record, only the video record will be here with only a few exceptions. THIS IS NOT THE SAME POINTING SYSTEM AS VENFYS!!</p>
    <div style={{display: "grid", placeItems: "center"}}>
    <Button type="button" onClick={() => setByWrs(!wrs)}>View by {wrs ? "points" : "records"}</Button>
    <br></br>
    {lead?.map((e: any)  => {
      return (
        <>
        <Leaderboard
          name={e.name}
          records={e.records}
          completions={e.completions}
          extralist={e.extralist}
          screenshot={e.screenshot}
          nationality={e.nationality}
          socials={e.socials}
          points={calcPoints(e)}
          key={e._id}
          levels={array}
          bywrs={wrs}
        ></Leaderboard>
        <br></br>
        </>
      )
    })}
    </div>
    </Container>
    </div>
  )
}
export async function getServerSideProps(req: NextApiRequest, res: NextApiRequest) {
  // Your code
  let bywrs = req.query.bywrs == "true"
  const leaderboard = await models.leaderboard.find();
    const levels = await models.levels.find();
  // Passing data to the Page using props
  return {
      props : {
        leaderboard: JSON.parse(JSON.stringify(leaderboard)),
        levels: JSON.parse(JSON.stringify(levels)),
        bywrs
      }
  }
}
