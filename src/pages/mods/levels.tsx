import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import ErrorPage from "../404"
import styles from "../../styles/levels.module.css"
import { Button, Form, FormSelect, InputGroup } from "react-bootstrap"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"

export default function Settings() {
    let [perms, setPerms] = useState<any>(null)
    let [level, changeLevel] = useState<any>(null);
    let [originalSet, setOriginalSet] = useState<any>([])
    let [levels, setLevels] = useState<any>([])
    let [editedLevel, setEditedLevel] = useState<any>(null)
    let [goFetch, setGoFetch] = useState(true)
    let [newRecord, setNewRecord] = useState({
      name: "",
      percent: ["", ""],
      listpercent: false,
      screenshot: false,
      verification: false,
      deleted: false,
      link: "",
      hertz: 0
    })
    let auth = getAuth()
    let info = {
      move150below: {
        name: "",
        id: ""
      },
      new150: {
        name: "",
        id: ""
      }
    }
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
        if(window.innerWidth <= 1200) {
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

    useEffect(changeIt)

    useEffect(() => {
      if((!perms || levels.length) && !goFetch) return;
        (async () => {
            let data = await fetch("/api/levels")
            let json = await data.json() 
            setLevels(json)
            setOriginalSet(json)
            setGoFetch(false)
        })()
    }, [goFetch])

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
       <div style={{display: "grid", placeItems: "center"}}>
       <Button onClick={async () => {
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
        setTimeout(() => {

          changeLevel(null)
        setEditedLevel(null)
        setTimeout(() => {
          if(level?._id != "yourmom") {
            changeLevel({
              _id: "yourmom",
              name: "",
              host: "",
              verifier: "",
              ytcode: "",
              position: null
          })
            setEditedLevel({
              _id: "yourmom",
               name: "",
              host: "",
              verifier: "",
              ytcode: "",
              position: null
          })
          }
        }, 0)
        }, 0)
       }}>+ Add Level</Button>
       </div>
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
          {level._id == "yourmom" ? <div style={{display: "grid", placeItems: "center"}}>
            <Button style={{fontSize: "30px"}} onClick={async () => {
              try {
              if(editedLevel.position <= 150) {
                await new Promise((resolve, reject) => {
                  mySwal.fire({
                    background: "#333333",
                    titleText: `Move 150 Level Below?`,
                    color: "white",
                    confirmButtonColor: 'black',
                    html: <>
                      <InputGroup>
                        <InputGroup.Text id="150name">Level Name</InputGroup.Text>
                        <Form.Select aria-describedby="150name" id="name150" onChange={(e) => {
                              let {value} = e.target
                            info.move150below = {
                              name: value.split(" @ ")[1],
                              id: value.split(" @ ")[0]
                            }
                          }}>
                            <option>Select a Level</option>
                            {originalSet.filter((e:any) => e.position > 150).map((e:any) => <option key={e._id.toString()} value={`${e._id} @ ${e.name} by ${e.host}`}>{e.name} by {e.host}</option>)}
                          </Form.Select>
                        <Button style={{float: "left"}} onClick={() => {
                            resolve(0)
                        }}>Go</Button>
                      </InputGroup>
                    </>
                  })
              }) 
            }

            await new Promise((resolve, reject) => {
              mySwal.fire({
                background: "#333333",
                titleText: `Confirm Level Addition?`,
                color: "white",
                confirmButtonColor: 'black',
                html: <>
                    <h5>Please recheck all of your information:</h5>
                    <br></br>
                    {info.move150below.name ? <p>Current #150 level below: {info.move150below.name}</p> : ""}
                    {Object.entries(editedLevel).map(e => e[0] == "_id" ? "" : <p key={e[0]}>{e[0]}: {e[1] as any}</p>)}
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
            let authToken = await auth.currentUser?.getIdToken()
            let data = await fetch("/api/levels/add", {
              method: "POST",
              headers: {
                'content-type': "application/json",
              },
              body: JSON.stringify({
                token: authToken,
                level: editedLevel,
                move150below: info.move150below.id
              })
            })
            let json = await data.json()
            mySwal.fire({
              background: "#333333",
              titleText: `${data.ok ? "Success!" :json.message}`,
              color: "white",
              confirmButtonColor: 'black',
            })
            if(data.ok) {
              info.move150below = {
                name: "",
                id: ""
              }
            setTimeout(() => {
              setGoFetch(true)
              changeLevel(json)
              setEditedLevel(json)
            }, 0)
          }
              } catch(_) {

              }

            }} disabled={!Object.values(editedLevel).every(e => e)}>Add</Button>
            </div> : ""}
          {level._id != "yourmom" ? <div style={{display: "grid", placeItems: "center"}}>
          <Button style={{fontSize: "50px", backgroundColor: "red"}} onClick={async () => {
            if(level.position <= 150) {
              await new Promise((resolve, reject) => {
                mySwal.fire({
                  background: "#333333",
                  titleText: `New 150 Level?`,
                  color: "white",
                  confirmButtonColor: 'black',
                  html: <>
                    <InputGroup>
                      <InputGroup.Text id="150name">Level Name</InputGroup.Text>
                      <Form.Select aria-describedby="150name" id="name150" onChange={(e) => {
                              let {value} = e.target
                            info.new150 = {
                              name: value.split(" @ ")[1],
                              id: value.split(" @ ")[0]
                            }
                          }}>
                            <option>Select a Level</option>
                            {originalSet.filter((e:any) => e.position > 150).map((e:any) => <option key={e._id.toString()} value={`${e._id} @ ${e.name} by ${e.host}`}>{e.name} by {e.host}</option>)}
                          </Form.Select>
                      <Button style={{float: "left"}} onClick={resolve}>Go</Button>
                    </InputGroup>
                  </>
                })
            }) 
            }
            await new Promise((resolve, reject) => {
              mySwal.fire({
                background: "#333333",
                titleText: `Confirm Level Deletion?`,
                color: "white",
                confirmButtonColor: 'black',
                html: <>
                    <h5>You are deleting the level {level.name} by &quot;{level.host}&quot;</h5>
                    <br></br>
                    {info.new150.name ? <p>New #150 Level: {info.new150.name}</p> : ""}
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

          let authToken = await auth.currentUser?.getIdToken()
            let data = await fetch("/api/levels/delete", {
              method: "DELETE",
              headers: {
                'content-type': "application/json",
              },
              body: JSON.stringify({
                token: authToken,
                level,
                new150: info.new150.id
              })
            })
            let json = await data.json()
            mySwal.fire({
              background: "#333333",
              titleText: `${data.ok ? "Success!" :json.message}`,
              color: "white",
              confirmButtonColor: 'black',
            })
            if(data.ok) {
              info.new150 = {
                name: "",
                id: ""
              }
            setTimeout(() => {
              setGoFetch(true)
              changeLevel(null)
              setEditedLevel(null)
            }, 0)
          }
          }} disabled={!objectEquals(level, editedLevel)}>Delete</Button>
          <br></br>
            <Button style={{fontSize: "30px"}} onClick={async () => {
              try {
                if(level.position > 150 && editedLevel.position <= 150) {
                  await new Promise((resolve, reject) => {
                    mySwal.fire({
                      background: "#333333",
                      titleText: `Move 150 Level Below?`,
                      color: "white",
                      confirmButtonColor: 'black',
                      html: <>
                        <InputGroup>
                          <InputGroup.Text id="150name">Level Name</InputGroup.Text>
                          <Form.Select aria-describedby="150name" id="name150" onChange={(e) => {
                              let {value} = e.target
                            info.move150below = {
                              name: value.split(" @ ")[1],
                              id: value.split(" @ ")[0]
                            }
                          }}>
                            <option>Select a Level</option>
                            {originalSet.filter((e:any) => e.position > 150).map((e:any) => <option key={e._id.toString()} value={`${e._id} @ ${e.name} by ${e.host}`}>{e.name} by {e.host}</option>)}
                          </Form.Select>
                          <Button style={{float: "left"}} onClick={() => {
                              resolve(0)
                          }}>Go</Button>
                        </InputGroup>
                      </>
                    })
                }) 
              }
              if(level.position <= 150 && editedLevel.position > 150) {
                await new Promise((resolve, reject) => {
                  mySwal.fire({
                    background: "#333333",
                    titleText: `New 150 Level?`,
                    color: "white",
                    confirmButtonColor: 'black',
                    html: <>
                      <InputGroup>
                        <InputGroup.Text id="150name">Level Name</InputGroup.Text>
                        <Form.Select aria-describedby="150name" id="name150" onChange={(e) => {
                              let {value} = e.target
                            info.new150 = {
                              name: value.split(" @ ")[1],
                              id: value.split(" @ ")[0]
                            }
                          }}>
                            <option>Select a Level</option>
                            {originalSet.filter((e:any) => e.position > 150).map((e:any) => <option key={e._id.toString()} value={`${e._id} @ ${e.name} by ${e.host}`}>{e.name} by {e.host}</option>)}
                          </Form.Select>
                        <Button style={{float: "left"}} onClick={resolve}>Go</Button>
                      </InputGroup>
                    </>
                  })
              }) 
            }
                let changed = Object.entries(level).filter((e: any) => {
                  if(e[0] == "list") {
                    return !objectEquals(e[1], editedLevel[e[0]])
                  } else {
                    return e[1] != editedLevel[e[0]]
                  }
                })
                await new Promise((resolve, reject) => {
                  mySwal.fire({
                    background: "#333333",
                    titleText: `Confirm Level Update?`,
                    color: "white",
                    confirmButtonColor: 'black',
                    html: <>
                        <h5>To recap, here are all the changes you made on the level &quot;{level.name}&quot; by {level.host}:</h5>
                        <br></br>
                        {info.new150.name ? <p>New #150 level: {info.new150.name}</p> : ""}
                        {info.move150below.name ? <p>Current #150 level below: {info.move150below.name}</p> : ""}
                        {changed.map((e: any) => {
                          if(e[0] != "list") {
                            return <p key={e[0]}>{e[0]}: {e[1]} {"=>"} {editedLevel[e[0]]}</p>
                          }
                          let changes: any = []
                          editedLevel[e[0]].forEach((x:any) => {
                            let ind = editedLevel[e[0]].indexOf(x)
                            Object.entries(x).forEach((i:any) => {
                              if(i[0] == "percent") {
                                  Object.entries(i[1]).forEach((h:any) => {
                                  if(h[1] != e[1][ind][i[0]][h[0]]) {
                                    changes.push(<p key={`list.${ind}.${i[0]}.${h[0]}`}>list.{ind}.{i[0]}.{h[0]}: {e[1][ind][i[0]][h[0]]} {"=>"} {h[1]}</p>)
                                  }
                                })
                                return
                              }
                              if(i[1] != e[1][ind][i[0]]) {
                                changes.push(<p key={`list.${ind}.${i[0]}`}>list.{ind}.{i[0]}: {typeof i[1] == "boolean" ? JSON.stringify(e[1][ind][i[0]]) : e[1][ind][i[0]]} {"=>"} {typeof i[1] == "boolean" ? JSON.stringify(i[1]) : i[1]}</p>)
                              }
                            })
                          })
                          return changes
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
                let authToken = await auth.currentUser?.getIdToken()
                let data = await fetch("/api/levels/edit", {
                  method: "PATCH",
                  headers: {
                    'content-type': "application/json",
                  },
                  body: JSON.stringify({
                    token: authToken,
                    changes: Object.fromEntries(changed.map((e: any) => [e[0], editedLevel[e[0]]])),
                    original: level,
                    new150: info.new150.id,
                    move150below: info.move150below.id
                  })
                })
                let json = await data.json()
                mySwal.fire({
                  background: "#333333",
                  titleText: `${data.ok ? "Success!" :json.message}`,
                  color: "white",
                  confirmButtonColor: 'black',
                })
                if(data.ok) {
                  info.move150below = {
                    name: "",
                    id: ""
                  }
                  info.new150 = {
                    name: "",
                    id: ""
                  }
                setTimeout(() => {
                  setGoFetch(true)
                  changeLevel(editedLevel)
                }, 0)
              }
              } catch(_) { 

              }
            }} disabled={objectEquals(level, editedLevel) }>Save</Button>
          </div> : ""}
          <br></br>
        <h1 style={{textAlign: "center"}} className="white">#<input placeholder="pos..."  type="number" style={{width: "4ch"}} defaultValue={level.position} onChange={(e:any) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.position = parseInt(e.target.value)
          setEditedLevel(newLevel)
          }, 0)
        }}/>{editedLevel.position != level.position ? " *" : ""}: <textarea placeholder="Name..."  style={{width: `${Math.min(editedLevel.name.length || 4, 25)}ch`}} defaultValue={level.name} onChange={(e:any) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.name = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.name != level.name ? "*" : ""}</h1> 
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Host: <textarea style={{maxWidth: `${Math.min(editedLevel.host.length || 4, 25)}ch`}} defaultValue={level.host} onChange={(e:any) => {
            setTimeout(() => {
              let newLevel = structuredClone(editedLevel)
            newLevel.host = e.target.value
            setEditedLevel(newLevel)
            }, 0)
        }}/> {editedLevel.host != level.host ? "*" : ""}</h1> 
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Verifier: <textarea style={{width: `${Math.min(editedLevel.verifier.length || 4, 25)}ch`}} defaultValue={level.verifier} onChange={(e:any) => {
          setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.verifier = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.verifier != level.verifier ? "*" : ""}</h1> 
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">YT code: <textarea style={{width: `${Math.min(editedLevel.ytcode.length || 4, 25)}ch`}} defaultValue={level.ytcode} onChange={(e:any) => {
           setTimeout(() => {
            let newLevel = structuredClone(editedLevel)
          newLevel.ytcode = e.target.value
          setEditedLevel(newLevel)
          }, 0)
        }}/> {editedLevel.ytcode != level.ytcode ? "*" : ""}</h1> 
        <br></br>
        <div style={{display: "grid", placeItems: "center"}}>
        <iframe style={{width: "min(90vw, 560px)", height: "calc(min(90vw, 560px) * (315 / 560))"}} src={`https://www.youtube-nocookie.com/embed/${editedLevel.ytcode}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        </div>
        {level?._id != "yourmom" ? <><br></br>
        <h1 style={{textAlign: "center"}} className="white">Add a record:</h1>
        <br></br>
        <div>
          <div style={{display: "grid", placeItems: "center"}}><Button id="record-add" onClick={async () => {
           try {
            await new Promise((resolve, reject) => {
              mySwal.fire({
                background: "#333333",
                titleText: `Confirm Record Addition?`,
                color: "white",
                confirmButtonColor: 'black',
                html: <>
                    <h5>Please recheck all of your information:</h5>
                    <br></br>
                    {Object.entries(newRecord).map(e => e[0] == "_id" ? "" : <p key={e[0]}>{e[0]}: {JSON.stringify(e[1] as any)}</p>)}
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
          
          let authToken = await auth.currentUser?.getIdToken()
                let data = await fetch("/api/records/add", {
                  method: "POST",
                  headers: {
                    'content-type': "application/json",
                  },
                  body: JSON.stringify({
                    token: authToken,
                    record: newRecord,
                    level
                  })
                })
                let json = await data.json()
                mySwal.fire({
                  background: "#333333",
                  titleText: `${data.ok ? "Success!" :json.message}`,
                  color: "white",
                  confirmButtonColor: 'black',
                })
                if(data.ok) {
                setTimeout(() => {
                  setGoFetch(true)
                  setEditedLevel(json)
                  changeLevel(json)
                  setNewRecord({
                    name: "",
                    percent: ["", ""],
                    listpercent: false,
                    screenshot: false,
                    verification: false,
                    deleted: false,
                    link: "",
                    hertz: 0
                  })
                  let elements = document.getElementsByClassName("record-adding")
                  for(let i in elements) {
                    if(isNaN(i as any)) return;
                    let element = elements.item(parseInt(i))
                    if(element?.tagName == "SELECT") {
                      (element as any).value = "false"
                    } else {
                      (element as any).value = ""
                    }
                  }
                }, 0)
              }
           }  catch(_) {

           }
          }} disabled={!(objectEquals(level, editedLevel) && newRecord.name && newRecord.link && newRecord.percent[0] && newRecord.hertz)} style={{fontSize: "20px"}}>Add</Button></div>
          <br></br>
            <h1 style={{textAlign: "center"}} className="white">Name: <textarea className="record-adding" style={{width: `${Math.min(newRecord.name.length || 5, 25)}ch`}} placeholder="Name..." onChange={((e:any) => {
             setTimeout(() => {
              let {value} = e.target
                        setNewRecord({
                          ...newRecord,
                          name: value
                        })
            }, 0)
            })}/></h1>
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Main Record %: <input className="record-adding" style={{width: `4ch`}} placeholder="Main Record %..." type="number" onChange={((e:any) => {
              setTimeout(() => {
                let {value} = e.target
                          setNewRecord({
                            ...newRecord,
                            percent: [value, newRecord.percent[1]]
                          })
              }, 0)
            })}/></h1>
          <br></br>
        <h1 style={{textAlign: "center"}} className="white">Screenshot/Clip %: <input className="record-adding" style={{width: `4ch`}} type="number" placeholder="Screenshot/Clip %..." onChange={((e:any) => {
              setTimeout(() => {
                let {value} = e.target
                          setNewRecord({
                            ...newRecord,
                            percent: [newRecord.percent[0], value]
                          })
              }, 0)
            })}/></h1>
        {level.position < 76 ? <><br></br><h1 style={{textAlign: "center"}} className="white">Listpercent: <select className="record-adding" defaultValue={"false"} onChange={(e) => {
          setTimeout(() => {
            let {value} = e.target
                      setNewRecord({
                        ...newRecord,
                        listpercent: JSON.parse(value)
                      })
          }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select></h1></> : ""}
<br></br>
<h1 style={{textAlign: "center"}} className="white">Screenshot: <select className="record-adding" defaultValue={"false"} onChange={(e) => {
           setTimeout(() => {
            let {value} = e.target
                      setNewRecord({
                        ...newRecord,
                        screenshot: JSON.parse(value)
                      })
          }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select></h1>
<br></br>
<h1 style={{textAlign: "center"}} className="white">Deleted: <select className="record-adding" defaultValue={"false"} onChange={(e) => {
         setTimeout(() => {
          let {value} = e.target
                    setNewRecord({
                      ...newRecord,
                      deleted: JSON.parse(value)
                    })
        }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select></h1>
<br></br>
<h1 style={{textAlign: "center"}} className="white">Verification: <select className="record-adding" defaultValue={"false"} onChange={(e) => {
          setTimeout(() => {
            let {value} = e.target
                      setNewRecord({
                        ...newRecord,
                        verification: JSON.parse(value)
                      })
          }, 0)
        }}>
        <option value="true">true</option>          
        <option value="false">false</option>          
</select></h1>
<br></br>
<h1 style={{textAlign: "center"}} className="white">Link: <textarea className="record-adding" style={{width: `${Math.min(newRecord.link.length || 25, 25)}ch`}} onChange={(e:any) => {
  setTimeout(() => {
    let {value} = e.target
              setNewRecord({
                ...newRecord,
                link: value
              })
  }, 0)
        }}/></h1>
        <br></br>
        <h1 style={{textAlign: "center"}} className="white">Hertz: <input className="record-adding" style={{width: `4ch`}} type='number' onChange={(e:any) => {
         setTimeout(() => {
          let {value} = e.target
                    setNewRecord({
                      ...newRecord,
                      hertz: parseInt(value)
                    })
        }, 0)
        }}/></h1>
        <br></br><br></br><br></br>
          </div>
          <h1 style={{textAlign: "center"}} className="white">List:</h1>
          <br></br>
        {!level?.list.length || level.list[0].name == "" ? <h1 style={{textAlign: "center"}} className="white">No list records</h1> : level?.list?.map((e: any) => {
          let i = level.list.findIndex((x: any) => x._id == e._id)
         return <div key={e.link}>
          <div style={{display: "grid", placeItems: "center"}}><Button style={{backgroundColor: "red", fontSize: "20px"}} onClick={async () => {
               try {
                await new Promise((resolve, reject) => {
                  mySwal.fire({
                    background: "#333333",
                    titleText: `Confirm Record Deletion?`,
                    color: "white",
                    confirmButtonColor: 'black',
                    html: <>
                        <h5>You are deleting a record on the level &quot;{level.name}&quot; by {level.host}. Info:</h5>
                        <br></br>
                        {Object.entries(e).map(e => e[0] == "_id" ? "" : <p key={e[0]}>{e[0]}: {JSON.stringify(e[1] as any)}</p>)}
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

              let authToken = await auth.currentUser?.getIdToken()
              let data = await fetch("/api/records/delete", {
                method: "DELETE",
                headers: {
                  'content-type': "application/json",
                },
                body: JSON.stringify({
                  token: authToken,
                  record: e,
                  level
                })
              })
              let json = await data.json()
              mySwal.fire({
                background: "#333333",
                titleText: `${data.ok ? "Success!" :json.message}`,
                color: "white",
                confirmButtonColor: 'black',
              })
              if(data.ok) {
              setTimeout(() => {
                setGoFetch(true)
                setEditedLevel(json)
                changeLevel(json)
              }, 0)
            }
            } catch(_) {

            }
          }} disabled={!objectEquals(level, editedLevel)}>Delete</Button>
          </div>
          <br></br>
            <h1 style={{textAlign: "center"}} className="white">Name: <textarea style={{width: `${Math.min(editedLevel.list[i].name.length || 5, 25)}ch`}} defaultValue={level.list[i].name} onChange={(e:any) => {
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
<h1 style={{textAlign: "center"}} className="white">Link: <textarea style={{width: `${Math.min(editedLevel.list[i].link.length || 25, 25)}ch`}} defaultValue={level.list[i].link} onChange={(e:any) => {
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
        }}/> {editedLevel.list[i].hertz != level.list[i].hertz ? "*" : ""}</h1>
        <br></br><br></br><br></br>
          </div>
        })}
        </> : ""}
          </div> : <h1 style={{textAlign: "center"}} className="white">No content to display</h1>}
          
      </div>
      </div>
    </>
}