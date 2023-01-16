import {useState, useEffect} from "react"
import { Container } from "react-bootstrap"
import Level from"../components/Level"

export default function Home() {
  let [array, setArray] = useState<Array<Record<any, any>>>()
  let [pastRated, setPastRated] = useState<Array<Record<any, any>>>()
  useEffect(() => {
      (async () => {
        let levels = await fetch("/api/extra")
        let json = await levels.json()
        setArray(Object.values(json))
      })()
  })
  useEffect(() => {
    (async () => {
      let levels = await fetch("/api/unratedextremes")
      let json = await levels.json()
      setPastRated(Object.values(json))
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
    {array?.map(e  => {
      return (
        <div style={{"display": "grid", "placeItems": "center"}} key={e.position}>
        <Level
          n={e.position}
          name={e.name}
          ytcode={e.ytcode}
          creator={e.host}
          records={e.list}
        ></Level>
        <br></br>
        </div>
      )
    })}
    <h1 style={{"textAlign": "center"}} className="white">Past Rated Extreme Demons</h1>
    <p style={{"textAlign": "center"}} className="white">This is the section of the Extra List where we showcase extreme demons that got unrated with time. Any level that is unrated that one point was rated gets mentioned in this section.</p>
    <br></br>
    {pastRated?.map(e  => {
      return (
        <div style={{"display": "grid", "placeItems": "center"}} key={e.position}>
        <Level
          n={e.position}
          name={e.name}
          ytcode={e.ytcode}
          creator={e.host}
          records={e.list}
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