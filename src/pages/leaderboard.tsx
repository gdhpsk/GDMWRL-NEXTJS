

import {useState, useEffect} from "react"
import { Button, Container } from "react-bootstrap"
import Level from"../components/Level"
import {models} from "mongoose"
import Leaderboard from "@/components/Leaderboard"
import { NextApiRequest } from "next"
import Script from "next/script"


export default function Home() {
    let [wrs, setByWrs] = useState<Boolean>(false)
    function calcPoints({count}: any) {
        let {records, completions, extralist_comp, extralist_prog, screenshot, minus} = count
        let points = records+completions*2+extralist_comp
        if(wrs) {
          points -= completions
          points += extralist_prog
          points += screenshot
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

 async function updateFunc(id: string) {
    let profile = structuredClone(lead.find(e => e.id == id))
    if(profile && !profile.records) {
        let getData = async (col: string) => {
            let data = await fetch(`/api/leaderboard/${id}/${col}`)
            let json = await data.json()
            return json
        }
        let records = await getData("records")
        let completions = await getData("completions")
        let extralist = await getData("extralist")
        let screenshot = await getData("screenshot")
        profile.records = records
        profile.completions = completions
        profile.extralist = extralist
        profile.screenshot = screenshot
        setLead([...lead.filter(e => e.id != id), profile].sort((a,b) => calcPoints(b) - calcPoints(a)))
        return profile
    } else {
      return profile
    }
  }
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
          records={e.records ?? []}
          completions={e.completions ?? []}
          extralist={e.extralist ?? []}
          screenshot={e.screenshot ?? []}
          nationality={e.nationality}
          socials={e.socials}
          points={calcPoints(e)}
          key={e.id}
          id={e.id}
          levels={array}
          bywrs={wrs}
          onClick={updateFunc}
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