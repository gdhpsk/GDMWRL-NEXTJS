import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import ErrorPage from "../404"
import styles from "../../styles/settings.module.css"
import { Button, Form, InputGroup } from "react-bootstrap"

export default function Settings() {
    let [perms, setPerms] = useState<any>(null)
    let [level, setLevel] = useState<any>(null)
    let [levels, setLevels] = useState<any>([])
    let auth = getAuth()
    onAuthStateChanged(auth, (u) => {
      if(u) {
        u?.getIdTokenResult(true).then((e: any) => {
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
        changeIt();
        (async () => {
            let data = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/75")
            let json = await data.json() 
            let data2 = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/150")
            let json2 = await data2.json()
            let data3 = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/extra")
            let json3 = await data3.json()
            setLevels([...json, ...json2, ...json3.data])
            for(let i = 2; i <= json3.pages; i++) {
                let ex_data = await fetch(`https://gdmwrl-nextjs.vercel.app/api/levels/extra?page=${i}`)
                let ex_json = await ex_data.json()
                setLevels([...levels, ...ex_json.data])
            }
            let unrated_data = await fetch("https://gdmwrl-nextjs.vercel.app/api/levels/unratedextremes")
            let unrated_json = await unrated_data.json()
            setLevels([...levels, ...unrated_json].sort((a,b) => a.position - b.position))
        })()
    })

    if(perms == false) {
        return <ErrorPage></ErrorPage>
    } else if(perms == null) {
        return
    }

    return <>
    <hr className="white"/>
    <div id={styles.content}>
      <div id={styles.list}>
        {levels.map((e: any) => <div key={e.position}>
            <h1>#{e.position}: {e.name}</h1>
            <h3>By: {e.host}</h3>
            <h4>Verifier: {e.verifier}</h4>
        </div>)}
      </div>
      <div id={styles.show}>
        
      </div>
      </div>
    </>
}