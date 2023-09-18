import { models } from "mongoose"
import {useState, useEffect} from "react"
import { Container, Dropdown, DropdownButton, SSRProvider } from "react-bootstrap"
import Level from"../components/Level"
import levels from "../../unrated.json"
import { NextPageContext } from "next"

export default function Home({page_one}: {page_one: Record<any, any>}) {
  let [pages, setPages] = useState(page_one.pages)
  let [page, setPage] = useState(1)
    let [array, setArray] = useState<any>([{page:1, levels: page_one.data}])
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
    <SSRProvider>
      <div className="bannerthree">
        <h1 className="page-title">Extra List</h1>
        <h1 className="page-subtitle">(All Extreme Demons)</h1>
      </div>
    <Container>
      <br></br>
    <Dropdown style={{"display": "grid", "placeItems": "center"}}>
        <Dropdown.Toggle variant="primary">
          {page < pages+1 ? <>Letters {levels.range[page-1].normal}&nbsp;</> : <>Past Rated Extremes</>}
        </Dropdown.Toggle>
        <Dropdown.Menu>
        {Array.from(new Array(pages).keys()).map(e => <Dropdown.Item key={e} onClick={() => {
          setPage(e+1)
        }}>
            {levels.range[e].normal}
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
          levelID={e.levelID}
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
  const data = await fetch(`https://gdmobilewrlist.com/api/levels/extra?page=1`)
  let json = await data.json()
  return {
    props: {page_one: json}
  }
}