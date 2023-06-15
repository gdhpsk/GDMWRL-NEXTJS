import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import ErrorPage from "../404"
import styles from "../../styles/levels.module.css"
import { Button, Form, InputGroup } from "react-bootstrap"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"

export default function Settings() {
    let [perms, setPerms] = useState<any>(null)
    let [level, changeLevel] = useState<any>(null);
    let [originalSet, setOriginalSet] = useState<any>([])
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
            let data = await fetch("/api/levels")
            let json = await data.json() 
            if(!levels.length) {
            setLevels(json)
            }
            setOriginalSet(json)
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
    return <>
    <hr className="white"/>
    <div id={styles.content}>
      <div id={styles.list}>
       <InputGroup>
       <InputGroup.Text id="search">Search</InputGroup.Text>
        <Form.Control placeholder="Search..." aria-describedby="search" onChange={(e: any) => {
          setTimeout(() => {
            
          let {value} = e.target
          setLevels(originalSet.filter((x: any) => x.name.toLowerCase().includes(value.toLowerCase())))
          }, 0)
        }}></Form.Control>
       </InputGroup>
        <hr/>
        {levels.map((e: any) => <div key={e.position} onClick={() => {setTimeout(async () => {
          try {
          if(level && !objectEquals(level, editedLevel)) {
            await new Promise((resolve, reject) => {
              mySwal.fire({
                background: "#333333",
                titleText: `Are you sure you want to disgard your changes?`,
                color: "white",
                confirmButtonColor: 'black',
                html: <>
                    <div>
                    <Button style={{float: "right"}} onClick={() => {
                        setTimeout(() => {
                          mySwal.clickConfirm()
                          reject()
                        }, 0)
                      }}>No</Button>
                      <Button style={{backgroundColor: "red", float: "left"}} onClick={() => {
                        setTimeout(() => {
                          mySwal.clickConfirm()
                          resolve(0)
                        }, 0)
                      }}>Yes</Button>
                    </div>
                </>
              })
          })
        }
          changeLevel(null)
          setEditedLevel(null)
          setTimeout(() => {
            if(level?._id != e._id) {
              changeLevel(e)
              setEditedLevel(e)
            }
          }, 0)
        } catch(_) {

        }
        }, 0)}}>
            <h1 className="white">#{e.position}: {e.name}</h1>
            <h3 className="white">By: {e.host}</h3>
            <h4 className="white">Verifier: {e.verifier}</h4>
        </div>)}
      </div>
      <div id={styles.show}>
        {level ? <div>
          <Button style={{marginLeft: "20px"}} onClick={() => {
            setTimeout(async () => {
              try {
                if( !objectEquals(level, editedLevel)) {
                  await new Promise((resolve, reject) => {
                    mySwal.fire({
                      background: "#333333",
                      titleText: `Are you sure you want to disgard your changes?`,
                      color: "white",
                      confirmButtonColor: 'black',
                      html: <>
                          <div>
                          <Button style={{float: "right"}} onClick={() => {
                              setTimeout(() => {
                                mySwal.clickConfirm()
                                reject()
                              }, 0)
                            }}>No</Button>
                            <Button style={{backgroundColor: "red", float: "left"}} onClick={() => {
                              setTimeout(() => {
                                mySwal.clickConfirm()
                                resolve(0)
                              }, 0)
                            }}>Yes</Button>
                          </div>
                      </>
                    })
                })
              }
                changeLevel(null)
                setEditedLevel(null)
              } catch(_) {

              }
            }, 0)
          }}>Back</Button>
          {!objectEquals(level, editedLevel) ? <div style={{display: "grid", placeItems: "center"}}>
            <Button style={{fontSize: "30px"}} onClick={async () => {
              try {
                let changed = Object.entries(level).filter((e: any) => {
                  if(e[0] == "list") {
                    return !objectEquals(e[1], editedLevel[e[0]])
                  } else {
                    return e[1] != editedLevel[e[0]]
                  }
                })
                console.log(changed)
                await new Promise((resolve, reject) => {
                  mySwal.fire({
                    background: "#333333",
                    titleText: `Confirm Level Update?`,
                    color: "white",
                    confirmButtonColor: 'black',
                    html: <>
                        <h5>To recap, here are all the changes you made on the level &quot;{level.name}&quot; by {level.host}:</h5>
                        <br></br>
                        {changed.map((e: any) => {
                          if(e[0] != "list") {
                            return <p key={e[0]}>{e[0]}: {e[1]} {"=>"} {editedLevel[e[0]]}</p>
                          }
                          return <p key={e[0]}>{e[0]}: {e[1].map((x: any) => <>
                            {Object.entries(x).map((i: any) => {
                              if(i[0] == "_id") return;
                              return <p key={i[0]}>{i[0]}: {i[1]}</p>
                            })}
                        </>)} {"=>"} <br></br>  {editedLevel[e[0]].map((x: any) => <>
                              {Object.entries(x).map((i: any) => {
                                if(i[0] == "_id") return;
                                return <p key={i[0]}>{i[0]}: {i[1]}</p>
                              })}
                          </>)}</p>
                        })}
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
                mySwal.fire({
                  background: "#333333",
                  titleText: `Success! (backend not implemented yet)`,
                  color: "white",
                  confirmButtonColor: 'black',
                })
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
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">List:</h1>
        <br></br>
        {!level?.list.length || level.list[0].name == "" ? <h1 style={{textAlign: "center"}} className="white">No list records</h1> : level?.list?.map((e: any) => {
          let i = level.list.findIndex((x: any) => x._id == e._id)
         return <div key={e.link}>
            <h1 style={{textAlign: "center"}} className="white">Name: <input style={{width: `${editedLevel.list[i].name.length}ch`}} defaultValue={level.list[i].name} onChange={(e:any) => {
           setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].name = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.list[i].name != level.list[i].name ? "*" : ""}</h1>
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Main Record %: <input style={{width: `4ch`}} defaultValue={level.list[i].percent[0]} type="number" onChange={(e:any) => {
           setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].percent[0] = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.list[i].percent[0] != level.list[i].percent[0] ? "*" : ""}</h1>
          <br></br>
        <h1 style={{textAlign: "center"}} className="white">Screenshot/Clip %: <input style={{width: `4ch`}} defaultValue={level.list[i].percent[1]} type="number" onChange={(e:any) => {
           setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].percent[1] = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.list[i].percent[1] != level.list[i].percent[1] ? "*" : ""}</h1>
        {level.position < 76 ? <><br></br><h1 style={{textAlign: "center"}} className="white">Listpercent: <select defaultValue={JSON.stringify(!!level.list[i].listpercent)} onChange={(e) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].listpercent = JSON.parse(e.target.value)
          setEditedLevel(newLevel)
          }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select> {editedLevel.list[i].listpercent != level.list[i].listpercent ? "*" : ""}</h1></> : ""}
<br></br>
<h1 style={{textAlign: "center"}} className="white">Screenshot: <select defaultValue={JSON.stringify(!!level.list[i].screenshot)} onChange={(e) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].screenshot = JSON.parse(e.target.value)
          setEditedLevel(newLevel)
          }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select> {editedLevel.list[i].screenshot != level.list[i].screenshot ? "*" : ""}</h1>
<br></br>
<h1 style={{textAlign: "center"}} className="white">Deleted: <select defaultValue={JSON.stringify(!!level.list[i].deleted)} onChange={(e) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].deleted = JSON.parse(e.target.value)
          setEditedLevel(newLevel)
          }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select> {editedLevel.list[i].deleted != level.list[i].deleted ? "*" : ""}</h1>
<br></br>
<h1 style={{textAlign: "center"}} className="white">Verification: <select defaultValue={JSON.stringify(!!level.list[i].verification)} onChange={(e) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].verification = JSON.parse(e.target.value)
          setEditedLevel(newLevel)
          }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select> {editedLevel.list[i].verification != level.list[i].verification ? "*" : ""}</h1>
<br></br>
<h1 style={{textAlign: "center"}} className="white">Link: <input style={{width: `${editedLevel.list[i].link.length}ch`}} defaultValue={level.list[i].link} onChange={(e:any) => {
           setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].link = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.list[i].link != level.list[i].link ? "*" : ""}</h1>
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Hertz: <input style={{width: `4ch`}} type='number' defaultValue={level.list[i].hertz} onChange={(e:any) => {
           setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.list[i].hertz = parseInt(e.target.value)
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.list[i].link != level.list[i].link ? "*" : ""}</h1>
        <br></br><br></br><br></br>
          </div>
        })}
          </div> : <h1 style={{textAlign: "center"}} className="white">No content to display</h1>}
      </div>
      </div>
    </>
}