import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import ErrorPage from "../404"
import styles from "../../styles/levels.module.css"
import { Button, Form, InputGroup } from "react-bootstrap"

export default function Settings() {
    let [perms, setPerms] = useState<any>(null)
    let [level, changeLevel] = useState<any>(null);
    let [levels, setLevels] = useState<any>([])
    let auth = getAuth()
    onAuthStateChanged(auth, (u) => {
      if(u) {
        u?.getIdTokenResult().then((e: any) => {
          if(e.claims.role == "owner" || e.claims.role == "editor") {
            setPerms(e.claims.role)
          } else {
            setPerms(false)
          }
        })
    } else {
      setPerms(false)
    }
    })
    function changeIt() {
      try {
        if(window.innerWidth <= 1000) {
          if(level) {
            (document.getElementById(styles.show) as any).style.display = "grid";
            (document.getElementById(styles.list) as any).style.display = "none"
          } else {
            (document.getElementById(styles.show) as any).style.display = "none";
            (document.getElementById(styles.list) as any).style.display = "initial"
          }
        } else {
          (document.getElementById(styles.show) as any).style.display = "grid";
            (document.getElementById(styles.list) as any).style.display = "initial"
        }
      } catch(_) {

      }
    }

    useEffect(() => {
      changeLevel("")
        changeIt();
        (async () => {
            let levs = []
            let data = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/75")
            let json = await data.json() 
            let data2 = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/150")
            let json2 = await data2.json()
            let data3 = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/extra?page=1")
            let json3 = await data3.json()
            levs.push(...json, ...json2, ...json3.data)
            for(let i = 2; i <= json3.pages; i++) {
                let ex_data = await fetch(`https://gdmwrl-nextjs.vercel.app/api/levels/extra?page=${i}`)
                let ex_json = await ex_data.json()
                levs.push(...ex_json.data)
            }
            let unrated_data = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/unratedextremes")
            let unrated_json = await unrated_data.json()
            levs.push(...unrated_json)
            setLevels(levs.sort((a,b) => a.position - b.position))
        })()
    }, [])

    if(perms == false) {
        return <ErrorPage></ErrorPage>
    } else if(perms == null) {
        return
    }

    return <>
    <hr className="white"/>
    <div id={styles.content}>
      <div id={styles.list}>
        {levels.map((e: any) => <div key={e.position} onClickCapture={(x) => {
           changeLevel(e)
        }}>
            <h1 className="white">#{e.position}: {e.name}</h1>
            <h3 className="white">By: {e.host}</h3>
            <h4 className="white">Verifier: {e.verifier}</h4>
        </div>)}
      </div>
      <div id={styles.show}>
        {!level ? <h1>No content to display</h1> : <div>
          <h1 style={{textAlign: "center"}} className="white">{level.name}</h1>
          </div>}
      </div>
      </div>
    </>
}