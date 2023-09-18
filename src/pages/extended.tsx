import { models } from "mongoose"
import {useState, useEffect} from "react"
import { Container, SSRProvider } from "react-bootstrap"
import Level from"../components/Level"
import { NextPageContext } from "next"

export default function Home({array}: {array: Array<Record<any, any>>}) {
  function botFunction() {
    document.body.scrollTop = document.body.scrollHeight;
    document.documentElement.scrollTop = document.body.scrollHeight; 
  }
  function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop =0; 
  }
  return (
    <SSRProvider>
      <div className="bannertwo">
        <h1 className="page-title">Extended List</h1>
        <h1 className="page-subtitle">(Top 76 - Top 150)</h1>
      </div>
    <Container>
      <br></br>
    <p style={{"textDecoration": "underline", "textAlign": "center"}} onClick={botFunction} className="white">To the bottom</p>
    <div>
    {array?.map((e: any) => {
      return (
        <div style={{"display": "grid", "placeItems": "center"}} key={e.position}>
        <Level
          n={e.position}
          name={e.name}
          ytcode={e.ytcode}
          creator={e.host}
          records={e.list}
          verifier={e.verifier}
          thumbnail={e.thumbnail}
        ></Level>
        <br></br>
        </div>
      )
    })}
    </div>
    <p style={{"textDecoration": "underline", "textAlign": "center"}} onClick={topFunction} className="white">To the top</p>
    </Container>
    </SSRProvider>
  )
}

export async function getServerSideProps(ctx: NextPageContext) {
  const data = await fetch(`https://gdmobilewrlist.com/api/levels/150`)
  let json = await data.json()
  return {
    props: {array: json}
  }
}