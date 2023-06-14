import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import ErrorPage from "../404"
import styles from "../../styles/levels.module.css"
import { Button, Form, InputGroup } from "react-bootstrap"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"
import { doc, getDoc, getFirestore, query, updateDoc } from "firebase/firestore"

export default function Settings() {
    let [perms, setPerms] = useState<any>(null)
    let [level, changeLevel] = useState<any>(null);
    let [levels, setLevels] = useState<any>([])
    let [editedLevel, setEditedLevel] = useState<any>(null)
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
      if(!perms) return;
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
    })

    function objectEquals(x: any, y: any) {
      'use strict';
  
      if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
      // after this just checking type of one would be enough
      if (x.constructor !== y.constructor) { return false; }
      // if they are functions, they should exactly refer to same one (because of closures)
      if (x instanceof Function) { return x === y; }
      // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
      if (x instanceof RegExp) { return x === y; }
      if (x === y || x.valueOf() === y.valueOf()) { return true; }
      if (Array.isArray(x) && x.length !== y.length) { return false; }
  
      // if they are dates, they must had equal valueOf
      if (x instanceof Date) { return false; }
  
      // if they are strictly equal, they both need to be object at least
      if (!(x instanceof Object)) { return false; }
      if (!(y instanceof Object)) { return false; }
  
      // recursive object equality check
      var p = Object.keys(x);
      return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
          p.every(function (i: any) { return objectEquals(x[i], y[i]); } as any);
  }

  let mySwal = withReactContent(Swal)
  

    if(perms == false) {
        return <ErrorPage></ErrorPage>
    } else if(perms == null) {
        return
    }
    let db = getFirestore()
    return <>
    <hr className="white"/>
    <div id={styles.content}>
      <div id={styles.list}>
        {levels.map((e: any) => <div key={e.position} onClick={() => setTimeout(() => {
          if(level?.id == e.id) {
            changeLevel(null)
            setEditedLevel(null)
          } else {
            changeLevel(e)
            setEditedLevel(e)
          }
        }, 0)}>
            <h1 className="white">#{e.position}: {e.name}</h1>
            <h3 className="white">By: {e.host}</h3>
            <h4 className="white">Verifier: {e.verifier}</h4>
        </div>)}
      </div>
      <div id={styles.show}>
        {level ? <div>
          {!objectEquals(level, editedLevel) ? <div style={{display: "grid", placeItems: "center"}}>
            <Button style={{fontSize: "30px"}} onClick={async () => {
              try {
                let changed = Object.entries(level).filter((e: any) => e[1] != editedLevel[e[0]])
                await new Promise((resolve, reject) => {
                  mySwal.fire({
                    background: "#333333",
                    titleText: `Confirm Level Update?`,
                    color: "white",
                    confirmButtonColor: 'black',
                    html: <>
                        <h5>To recap, here are all the changes you made on the level "{level.name}" by {level.host}:</h5>
                        <br></br>
                        {changed.map((e: any) => <p key={e[0]}>{e[0]}: {e[1]} {"=>"} {editedLevel[e[0]]}</p>)}
                        <br></br>
                        <div>
                          <Button style={{float: "left"}} onClick={resolve}>Confirm</Button>
                          <Button style={{backgroundColor: "red", float: "right"}} onClick={() => {
                            mySwal.clickConfirm()
                            reject()
                          }}>Deny</Button>
                        </div>
                    </>
                  })
                })
                let obj = Object.fromEntries(changed.map(e => [e[0], editedLevel[e[0]]]))
                updateDoc(doc(db, "levels", level.id), obj).then(() => {
                  mySwal.fire({
                    background: "#333333",
                    titleText: `Success!`,
                    color: "white",
                    confirmButtonColor: 'black',
                  })
                }).catch(console.log)
              } catch(_) {

              }
            }}>Save</Button>
          </div> : ""}
          <br></br>
        <h1 style={{textAlign: "center"}} className="white">#<input type="number" style={{width: "4ch"}} defaultValue={level.position} onChange={(e:any) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.position = parseInt(e.target.value)
          setEditedLevel(newLevel)
          }, 0)
        }}/>{editedLevel.position != level.position ? " *" : ""}: <input style={{width: `${editedLevel.name.length}ch`}} defaultValue={level.name} onChange={(e:any) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.name = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.name != level.name ? "*" : ""}</h1> 
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Host: <input style={{width: `${editedLevel.host.length}ch`}} defaultValue={level.host} onChange={(e:any) => {
            setTimeout(() => {
              let newLevel = structuredClone(editedLevel)
            newLevel.host = e.target.value
            setEditedLevel(newLevel)
            }, 0)
        }}/> {editedLevel.host != level.host ? "*" : ""}</h1> 
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Verifier: <input style={{width: `${editedLevel.verifier.length}ch`}} defaultValue={level.verifier} onChange={(e:any) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.verifier = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.verifier != level.verifier ? "*" : ""}</h1> 
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">YT code: <input style={{width: `${editedLevel.ytcode.length}ch`}} defaultValue={level.ytcode} onChange={(e:any) => {
           setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.ytcode = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.ytcode != level.ytcode ? "*" : ""}</h1> 
        <br></br>
        <div style={{display: "grid", placeItems: "center"}}>
        <iframe width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${editedLevel.ytcode}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
          </div> : <h1 style={{textAlign: "center"}} className="white">No content to display</h1>}
      </div>
      </div>
    </>
}