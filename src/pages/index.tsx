

import {useState, useEffect} from "react"
import { Container } from "react-bootstrap"
import Level from"../components/Level"
import {models} from "mongoose"


export default function Home({data}: any) {
  let [array, setArray] = useState<Array<Record<any, any>>>(data)
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api/75")
          let json = await levels.json()
          setArray(Object.values(json))
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
export async function getServerSideProps() {
  // Your code
  const data = await models.levels.find({position: {$lt: 76}}).sort({position: 1})
  
  // Passing data to the Page using props
  return {
      props : {
        data: JSON.parse(JSON.stringify(data))
      }
  }
}
