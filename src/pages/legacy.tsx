import { models } from "mongoose"
import {useState, useEffect} from "react"
import { Container, Dropdown, DropdownButton } from "react-bootstrap"
import Level from"../components/Level"

export default function Home() {
  let [pages, setPages] = useState(0)
  let [page, setPage] = useState(1)
    let [array, setArray] = useState<any>([])
  useEffect(() => {
      (async () => {
        try {
          if(!array.find((e: any) => e.page == page)) {
          let levels = await fetch(`/api/levels/extra?page=${page}`)
          let json = await levels.json()
          setArray([...array, {page, levels: Object.values(json.data)}])
          setPages(json.pages)
          }
        } catch(_) {

        }
      })()
  }, [page])
  let [pastRated, setPastRated] = useState<Array<Record<any, any>>>([])
  useEffect(() => {
      (async () => {
        try {
          let levels = await fetch("/api/levels/unratedextremes")
          let json = await levels.json()
          setPastRated(json)
        } catch(_) {

        }
      })()
  }, [])

  let updateFunc = async (x: any, n: any)=> {
    let e = structuredClone(array.find((i:any) => i.page == page).levels.find((i: any) => i.id == n))
    if(e && !e.list) {
        let data = await fetch(`/api/levels/${e.id}/list`)
        if(data.ok) {
          let json = await data.json()
          e.list = json
          let changedArr = structuredClone(array.find((i: any) => i.page == page))
          changedArr.levels = [...changedArr.levels.filter((i: any) => i.id != n), e].sort((a,b) => a.position - b.position)
          setArray([...array.filter((i:any) => i.page != page), changedArr])
        }
    }
  }

  let updateFunc2 = async (x: any, n: any)=> {
    let e = structuredClone(pastRated.find(i => i.id == n))
    if(e && !e.list) {
        let data = await fetch(`/api/levels/${e.id}/list`)
        if(data.ok) {
          let json = await data.json()
          e.list = json
          setPastRated([...pastRated.filter(i => i.id != e?.id), e].sort((a,b) => a.position - b.position))
        }
    }
  }

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
    <Dropdown style={{"display": "grid", "placeItems": "center"}}>
        <Dropdown.Toggle variant="primary">
          Page {page}/{pages}&nbsp;
        </Dropdown.Toggle>
        <Dropdown.Menu>
        {Array.from(new Array(pages).keys()).map(e => <Dropdown.Item onClick={() => {
          setPage(e+1)
        }}>
            {e+1}
          </Dropdown.Item>)}
        </Dropdown.Menu>
      </Dropdown>
      <br></br>
    <p style={{"textDecoration": "underline", "textAlign": "center"}} onClick={botFunction} className="white">To the bottom</p>
    <div>
    {array?.find((e: any) => e.page == page)?.levels?.map((e: any)  => {
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
          records={e.list ?? [{
            name: "",
            percent: ["", ""],
            screenshot: false,
            link: "",
            hertz: 60
          }]}
          verifier={e.verifier}
          id={e.id}
          onClick={updateFunc2}
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