import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import ErrorPage from "../404"
import styles from "../../styles/settings.module.css"
import { Button, Form, FormControl, InputGroup } from "react-bootstrap"
import withReactContent from "sweetalert2-react-content"
import Swal from "sweetalert2"

export default function Settings({nationalities}: any) {
    let [perms, setPerms] = useState<any>(null)
    let [profile, setProfile] = useState<any>(null)
    let [editedProfile, setEditedProfile] = useState<any>(null)
    let [leaderboard, setLeaderboard] = useState<Array<Record<any, any>>>([])
    let [originalSet, setOriginalSet] = useState<Array<Record<any, any>>>([])
    let [goFetch, setGoFetch] = useState(true)
    let auth = getAuth()
    let mySwal = withReactContent(Swal)
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

    function changeIt() {
      try {
        if(window.innerWidth <= 1200) {
          if(profile) {
            (document.getElementById(styles.show) as any).style.display = "block";
            (document.getElementById(styles.list) as any).style.display = "none"
          } else {
            (document.getElementById(styles.show) as any).style.display = "none";
            (document.getElementById(styles.list) as any).style.display = "initial"
          }
        } else {
          (document.getElementById(styles.show) as any).style.display = "block";
            (document.getElementById(styles.list) as any).style.display = "initial"
        }
      } catch(_) {

      }
    }

    useEffect(changeIt)

    useEffect(() => {
       if((!perms || leaderboard.length) && !goFetch) return;
       (async () => {
        let data = await fetch(`/api/leaderboard`)
        let json = await data.json()
        json = json.map((e:any) => {
            e.points = calcPoints(e, false)
            e.wrs = calcPoints(e, true)
            return e
        }).sort((a:any,b:any) => b.points - a.points)
        setLeaderboard(json)
        setOriginalSet(json)
        setGoFetch(false)
       })()
    }, [goFetch])
    if(perms == false) {
        return <ErrorPage></ErrorPage>
    } else if(perms == null) {
        return
    }

    function calcPoints(wr: any, wrs: boolean) {
        let {records, completions, extralist_comp, extralist_prog, screenshot, minus} = {
          records: wr.records.filter((e: any) => e != "none").length,
          completions: wr.completions.filter((e: any) => e != "none").length,
          screenshot: wr.screenshot.filter((e: any) => e != "none").length,
          extralist_comp: wr.extralist.filter((e: any) => e != "none").filter((e: any) => e.percent == 100).length,
          extralist_prog: wr.extralist.filter((e: any) => e != "none").filter((e: any) => e.percent != 100).length,
          minus: wr.minus
        }
        let points = records+completions*2+extralist_comp
        if(wrs) {
          points -= completions
          points += extralist_prog
          points += screenshot
            return points
        } else {
            return points - (minus || 0)
        }
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
          setLeaderboard(originalSet.filter((x: any) => x.name.toLowerCase().includes(value.toLowerCase())))
          }, 0)
        }}></Form.Control>
       </InputGroup>
       <hr/>
        {leaderboard?.map((e:any) => 
        <div key={e.name} onClick={async () => {
            try {
                if(profile && !objectEquals(profile, editedProfile)) {
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
                if(profile?._id != e._id) {
                    setEditedProfile(null)
                setProfile(null)
                setTimeout(() => {
                    setEditedProfile(e)
                    setProfile(e)
                }, 0)
                    
                } else {
                    setEditedProfile(null)
                setProfile(null)
                }
            }, 0)
        } catch(_) {}
        }}>
            <h1 className="white" style={{fontSize: "50px",}}>{e.name}</h1>
            <h3 className="white">Points: {e.points}</h3>
            <h3 className="white">WRs: {e.wrs}</h3>
        </div>
        )}
      </div>
      <div id={styles.show}>
            {profile ? <div>
                <Button style={{marginLeft: "20px"}} onClick={async () => {
                     try {
                        if(profile && !objectEquals(profile, editedProfile)) {
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
                        setEditedProfile(null)
                        setProfile(null)
                    }, 0)
                } catch(_) {}
                }}>Back</Button>
                <br></br>
                <div style={{display: "grid", placeItems: "center"}}>
                    <Button style={{backgroundColor: "red", fontSize: "50px"}} disabled={!objectEquals(profile, editedProfile)} onClick={async () => {
                        try {
                            await new Promise((resolve, reject) => {
                                mySwal.fire({
                                  background: "#333333",
                                  titleText: `Confirm Profile Deletion?`,
                                  color: "white",
                                  confirmButtonColor: 'black',
                                  html: <>
                                      <h5>You are about to delete the profile &quot;{profile.name}&quot;</h5>
                                      <br></br>
                                        <Button style={{float: "left"}} onClick={resolve}>Confirm</Button>
                                        <Button style={{backgroundColor: "red", float: "right"}} onClick={() => {
                                          mySwal.clickConfirm()
                                          reject()
                                        }}>Deny</Button>
                                  </>
                                })
                              
                            })
                              let authToken = await auth.currentUser?.getIdToken()
                              let data = await fetch("/api/leaderboard/delete", {
                                method: "DELETE",
                                headers: {
                                  'content-type': "application/json",
                                },
                                body: JSON.stringify({
                                  token: authToken,
                                  profile
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
                                setProfile(null)
                                setEditedProfile(null)
                              }, 0)
                            }
                        } catch(_) {

                        }
                    }}>Delete</Button>
                    <br></br>
                    <Button style={{fontSize: "30px"}} disabled={objectEquals(profile, editedProfile)} onClick={async () => {
                       try {
                        let changed = Object.entries(editedProfile).filter((e: any) => {
                            if(e[0] == "socials") {
                              return !objectEquals(e[1] ?? [], profile[e[0]] ?? [])
                            } else {
                              return e[1] != profile[e[0]]
                            }
                          })
                        await new Promise((resolve, reject) => {
                            mySwal.fire({
                              background: "#333333",
                              titleText: `Confirm Profile Edit?`,
                              color: "white",
                              confirmButtonColor: 'black',
                              html: <>
                                  <h5>You are about to edit the profile &quot;{profile.name}&quot;. Recheck your information:</h5>
                                  <br></br>
                                  {changed.map(e => {
                                    if(e[0] == "socials") {
                                        if(Object.values((e[1] as any)[0]).every(e => !e)) {
                                            return <p key={e[0]}>socials {"=>"} undefined</p>
                                        }
                                        return Object.entries((e[1] as any)[0]).filter(x => x[1]).map(x => <p key={x[0]}>socials.{x[0]}: {profile[e[0]]?.[0]?.[x[0]] as any || "undefined"} {"=>"} {x[1] as any}</p>)
                                    } else {
                                        return <p key={e[0]}>{e[0]}: {profile[e[0]] || "undefined"} {"=>"} {e[1] as any}</p>
                                    }
                                  })}
                                    <Button style={{float: "left"}} onClick={resolve}>Confirm</Button>
                                    <Button style={{backgroundColor: "red", float: "right"}} onClick={() => {
                                      mySwal.clickConfirm()
                                      reject()
                                    }}>Deny</Button>
                              </>
                            })
                          
                        })
                          let authToken = await auth.currentUser?.getIdToken()
                          let data = await fetch("/api/leaderboard/edit", {
                            method: "PATCH",
                            headers: {
                              'content-type': "application/json",
                            },
                            body: JSON.stringify({
                              token: authToken,
                              changes: Object.fromEntries(changed),
                              original: profile,
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
                            setProfile(editedProfile)
                          }, 0)
                        }
                    } catch(e) {
                        console.error(e)
                    }
                    }}>Save</Button>
                </div>
                <br></br>
                <h1 style={{textAlign: "center"}} className="white">Name: <textarea style={{width: `${Math.min(editedProfile.name.length || 5, 20)}ch`}} defaultValue={profile.name} onChange={(e:any) => {
                    setTimeout(() => {
                        let {value} = e.target
                    setEditedProfile({
                        ...editedProfile,
                        name: value
                    })
                    }, 0)
                }}/> {editedProfile.name != profile.name ? "*" : ""}</h1>
                <br></br>
                <h1 style={{textAlign: "center"}} className="white">Nationality: <div style={{display: "grid", placeItems: "center", marginTop: "20px"}}><Form.Select style={{width: "fit-content"}} defaultValue={profile.nationality} onChange={(e:any) => {
                  setTimeout(() => {
                    let {value} = e.target
                setEditedProfile({
                    ...editedProfile,
                    nationality: value
                })
                }, 0)
                }}>
                    {Object.keys(nationalities).map(e => <option key={e} value={e}>{e}</option>)}
                  </Form.Select></div> {editedProfile.nationality != profile.nationality ? "*" : ""}</h1>
                <br></br>
                <h1 style={{textAlign: "center"}} className="white">Minus Points: <input type="number" style={{width: `4ch`}} defaultValue={profile.minus} onChange={(e:any) => {
                    setTimeout(() => {
                        let {value} = e.target
                    setEditedProfile({
                        ...editedProfile,
                        minus: parseInt(value)
                    })
                    }, 0)
                }}></input> {editedProfile.minus != profile.minus ? "*" : ""}</h1>
                <br></br>
                <h1 style={{textAlign: "center"}} className="white">Socials:</h1>
                <h1 style={{textAlign: "center"}} className="white">Youtube: <textarea style={{width: `${Math.min(editedProfile.socials?.[0]?.youtube?.length || 10, 20)}ch`}} defaultValue={profile?.socials?.[0]?.youtube} onChange={(e:any) => {
                    setTimeout(() => {
                        let {value} = e.target
                    let socials = [{
                        youtube: value || undefined,
                        twitter: editedProfile.socials?.[0]?.twitter,
                        twitch: editedProfile.socials?.[0]?.twitch,
                        discord: editedProfile.socials?.[0]?.discord ? [editedProfile.socials?.[0]?.discord?.[0], editedProfile.socials?.[0]?.discord?.[1]] : undefined
                    }]
                    setEditedProfile({
                        ...editedProfile,
                        socials
                    })
                    }, 0)
                }}/> {editedProfile.socials?.[0]?.youtube != profile.socials?.[0]?.youtube ? "*" : ""}</h1>
                <h1 style={{textAlign: "center"}} className="white">Twitter: <textarea style={{width: `${Math.min(editedProfile.socials?.[0]?.twitter?.length || 10, 20)}ch`}} defaultValue={profile?.socials?.[0]?.twitter} onChange={(e:any) => {
                    setTimeout(() => {
                        let {value} = e.target
                    let socials = [{
                        twitter: value || undefined,
                        youtube: editedProfile.socials?.[0]?.youtube,
                        twitch: editedProfile.socials?.[0]?.twitch,
                        discord: editedProfile.socials?.[0]?.discord ? [editedProfile.socials?.[0]?.discord?.[0], editedProfile.socials?.[0]?.discord?.[1]] : undefined
                    }]
                    setEditedProfile({
                        ...editedProfile,
                        socials
                    })
                    }, 0)
                }}/> {editedProfile.socials?.[0]?.twitter != profile.socials?.[0]?.twitter ? "*" : ""}</h1>
                <h1 style={{textAlign: "center"}} className="white">Twitch: <textarea style={{width: `${editedProfile.socials?.[0]?.twitch?.length || 10}ch`}} defaultValue={profile?.socials?.[0]?.twitch} onChange={(e:any) => {
                   setTimeout(() => {
                    let {value} = e.target
                    let socials = [{
                        twitch: value || undefined,
                        youtube: editedProfile.socials?.[0]?.youtube,
                        twitter: editedProfile.socials?.[0]?.twitter,
                        discord: editedProfile.socials?.[0]?.discord ? [editedProfile.socials?.[0]?.discord?.[0], editedProfile.socials?.[0]?.discord?.[1]] : undefined
                    }]
                    setEditedProfile({
                        ...editedProfile,
                        socials
                    })
                   }, 0)
                }}/> {editedProfile.socials?.[0]?.twitch != profile.socials?.[0]?.twitch ? "*" : ""}</h1>
                <h1 style={{textAlign: "center"}} className="white">Discord Tag: <textarea style={{width: `${Math.min(editedProfile.socials?.[0]?.discord?.[0]?.length || 10, 20)}ch`}} defaultValue={profile?.socials?.[0]?.discord?.[0]} onChange={(e:any) => {
                    setTimeout(() => {
                        let {value} = e.target
                    let socials = [{
                        twitter: editedProfile.socials?.[0]?.twitter,
                        youtube: editedProfile.socials?.[0]?.youtube,
                        twitch: editedProfile.socials?.[0]?.twitch,
                        discord: [value, editedProfile.socials?.[0]?.discord?.[1] || ""]
                    }]
                    setEditedProfile({
                        ...editedProfile,
                        socials
                    })
                    }, 0)
                }}/> {editedProfile.socials?.[0]?.discord?.[0] != profile.socials?.[0]?.discord?.[0] ? "*" : ""}</h1>
                <h1 style={{textAlign: "center"}} className="white">Discord Server: <textarea style={{width: `${Math.min(editedProfile.socials?.[0]?.discord?.[1]?.length || 10, 20)}ch`}} defaultValue={profile?.socials?.[0]?.discord?.[1]} onChange={(e:any) => {
                    setTimeout(() => {
                        let {value} = e.target
                    let socials = [{
                        twitter: editedProfile.socials?.[0]?.twitter,
                        youtube: editedProfile.socials?.[0]?.youtube,
                        twitch: editedProfile.socials?.[0]?.twitch,
                        discord: [editedProfile.socials?.[0]?.discord?.[0] || "", value]
                    }]
                    setEditedProfile({
                        ...editedProfile,
                        socials
                    })
                    }, 0)
                }}/> {editedProfile.socials?.[0]?.discord?.[1] != profile.socials?.[0]?.discord?.[1] ? "*" : ""}</h1>
            </div> : <h1 className="white" style={{textAlign: "center"}}>No content to display.</h1>}
      </div>
      </div>
    </>
}

export async function getServerSideProps(ctx: any) {
  let res = await fetch("https://insanedemonlist.com/api/nations")
  let data = await res.json()
  return {
    props: {nationalities: data}
  }
}