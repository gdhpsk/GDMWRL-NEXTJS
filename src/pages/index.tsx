

import {useState, useEffect} from "react"
import { Container } from "react-bootstrap"
import Level from"../components/Level"

export default function Home() {
  let [array, setArray] = useState<Array<Record<any, any>>>([])
  useEffect(() => {
    (async () => {
      const data = await fetch(`/api/levels/75`)
      let json = await data.json()
      setArray(json)
    })()

  }, [])
  function botFunction() {
    document.body.scrollTop = document.body.scrollHeight;
    document.documentElement.scrollTop = document.body.scrollHeight; 
  }
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop =0; 
  }

let updateFunc = async (x: any, n: any)=> {
  let e = structuredClone(array.find(i => i.id == n))
  if(e && !e.list) {
      let data = await fetch(`/api/levels/${e.id}/list`)
      if(data.ok) {
        let json = await data.json()
        e.list = json
        setArray([...array.filter(i => i.id != e?.id), e].sort((a,b) => a.position - b.position))
      }
  }
}

  return (
    <div>
      <div className="bannerone">
        <h1 className="page-title">Main List</h1>
        <h1 className="page-subtitle">(Top 1 - Top 75)</h1>
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
          records={e.list ?? [{
            name: "",
            percent: ["", ""],
            screenshot: false,
            link: "",
            hertz: 60
          }]}
          verifier={e.verifier}
          id={e.id}
          onClick={updateFunc}
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
