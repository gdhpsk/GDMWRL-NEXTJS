import { models } from "mongoose"
import {useState, useEffect} from "react"
import { Container, Dropdown, DropdownButton } from "react-bootstrap"
import Level from"../components/Level"

export default function Home() {
  let [pages, setPages] = useState(1)
  let [page, setPage] = useState(1)
    let [array, setArray] = useState<any>([])
  useEffect(() => {
      (async () => {
        try {
          if(page == pages+1) {
            let levels = await fetch("/api/levels/unratedextremes")
            let json = await levels.json()
            setArray([...array, {page, levels: Object.values(json)}])
            return
          }
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
          Page {page}/{pages+1}&nbsp;
        </Dropdown.Toggle>
        <Dropdown.Menu>
        {Array.from(new Array(pages).keys()).map(e => <Dropdown.Item key={e} onClick={() => {
          setPage(e+1)
        }}>
            {e+1}
          </Dropdown.Item>)}
          <Dropdown.Item onClick={() => {
          setPage(pages+1)
        }}>
            Past Rated Extremes
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {page == pages+1 ? <><br></br><h1 style={{"textAlign": "center"}} className="white">Past Rated Extreme Demons</h1>
    <p style={{"textAlign": "center"}} className="white">This is the section of the Extra List where we showcase extreme demons that got unrated with time. Any level that is unrated that one point was rated gets mentioned in this section.</p></> : ""}
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