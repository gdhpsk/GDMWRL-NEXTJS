import { Request } from "express"
import { models } from "mongoose"
import {useState, useEffect} from "react"
import { Container } from "react-bootstrap"
import Level from"../components/Level"
import levels from "../../server/unrated.json"

export default function Home({data, data2}: any) {

    let [array, setArray] = useState<Array<Record<any, any>>>(data)
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api/extra")
          let json = await levels.json()
          setArray(Object.values(json))
        } catch(_) {

        }
      })()
  })
  let [pastRated, setPastRated] = useState<Array<Record<any, any>>>(data2)
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api/unratedextremes")
          let json = await levels.json()
          setPastRated(Object.values(json))
        } catch(_) {

        }
      })()
  })


  function botFunction() {
    document.body.scrollTop = document.body.scrollHeight;
    document.documentElement.scrollTop = document.body.scrollHeight; 
  }
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop =0; 
  }
  return (
    <div>
      <div className="bannerthree">
        <h1 className="page-title">Extra List</h1>
        <h1 className="page-subtitle">(All Extreme Demons)</h1>
      </div>
    <Container>
    <p style={{"textDecoration": "underline", "textAlign": "center"}} onClick={botFunction} className="white">To the bottom</p>
    <div>
    {array?.map((e: any)  => {
      return (
        <div style={{"display": "grid", "placeItems": "center"}} key={e.position}>
        <Level
          n={e.position}
          name={e.name}
          ytcode={e.ytcode}
          creator={e.host}
          records={e.list}
          verifier={e.verifier}
        ></Level>
        <br></br>
        </div>
      )
    })}
    <h1 style={{"textAlign": "center"}} className="white">Past Rated Extreme Demons</h1>
    <p style={{"textAlign": "center"}} className="white">This is the section of the Extra List where we showcase extreme demons that got unrated with time. Any level that is unrated that one point was rated gets mentioned in this section.</p>
    <br></br>
    {pastRated?.map((e: any)  => {
      return (
        <div style={{"display": "grid", "placeItems": "center"}} key={e.position}>
        <Level
          n={e.position}
          name={e.name}
          ytcode={e.ytcode}
          creator={e.host}
          records={e.list}
          verifier={e.verifier}
        ></Level>
        <br></br>
        </div>
      )
    })}
    </div>
    <p style={{"textDecoration": "underline", "textAlign": "center"}} onClick={topFunction} className="white">To the top</p>
    </Container>
    </div>
  )
}

export async function getServerSideProps(req: Request, res: Response) {
    // Your code
    let data = await models.levels.find({position: {$gt: 150}}).sort({position: 1})
    data = JSON.parse(JSON.stringify(data))
    // Passing data to the Page using props
    return {
        props : {
          data: data.filter(e => !levels.levels.includes(e.name)),
          data2: data.filter(e => levels.levels.includes(e.name))
        }
    }
  }