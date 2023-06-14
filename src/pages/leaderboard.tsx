

import {useState, useEffect} from "react"
import { Button, Container } from "react-bootstrap"
import Level from"../components/Level"
import {models} from "mongoose"
import Leaderboard from "@/components/Leaderboard"
import { NextApiRequest } from "next"
import Script from "next/script"


export default function Home() {
    let [wrs, setByWrs] = useState<Boolean>(false)
    function calcPoints(wr: any) {
        let {records, completions, extralist_comp, extralist_prog, screenshot, minus} = {
          records: wr.records.filter((e: any) => e != "none").length,
          completions: wr.completions.filter((e: any) => e != "none").length,
          screenshot: wr.screenshot.filter((e: any) => e != "none").length,
          extralist_comp: wr.extralist.filter((e: any) => e != "none").filter((e: any) => e.percent == 100).length,
          extralist_prog: wr.extralist.filter((e: any) => e != "none").filter((e: any) => e.percent != 100).length,
          minus: wr.minus
        }
        let points = records+completions*2+extralist_comp
        if(wrs) {
          points -= completions
          points += extralist_prog
          points += screenshot
          console.log(points)
            return points
        } else {
            return points - (minus || 0)
        }
    }
  let [array, setArray] = useState<Array<Record<any, any>>>([])
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api/levels/75")
          let json = await levels.json()
          let levels2 = await fetch("/api/levels/150")
          let json2 = await levels2.json()
          setArray([...Object.values(json) as any, ...Object.values(json2)])
        } catch(_) {

        }
      })()
  }, [])
  let [lead, setLead] = useState<Array<any>>([])
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api/leaderboard")
          let json = await levels.json()
          setLead(Object.values(json).sort((a: any, b: any) => calcPoints(b) - calcPoints(a)))
        } catch(_) {

        }
      })()
  }, [])

  useEffect(() => {
    setLead([...lead].sort((a,b) => calcPoints(b) - calcPoints(a)))
  }, [wrs])

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
          key={e.id}
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