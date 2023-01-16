import {useState, useEffect} from "react"
import { Container } from "react-bootstrap"
import Level from"../components/Level"

export default function Home() {
  let [array, setArray] = useState<Array<Record<any, any>>>()
  useEffect(() => {
      (async () => {
        let levels = await fetch("/api/150")
        let json = await levels.json()
        setArray(Object.values(json))
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
      <div className="bannertwo">
        <h1 className="page-title">Extended List</h1>
        <h1 className="page-subtitle">(Top 76 - Top 150)</h1>
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
    </div>
    <p style={{"textDecoration": "underline", "textAlign": "center"}} onClick={topFunction} className="white">To the top</p>
    </Container>
    </div>
  )
}