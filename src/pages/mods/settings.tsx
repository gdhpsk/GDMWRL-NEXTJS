import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import ErrorPage from "../404"
import styles from "../../styles/settings.module.css"
import { Button, Form, InputGroup } from "react-bootstrap"

export default function Settings() {
    let [perms, setPerms] = useState<any>(null)
    let [displayMod, setDisplayMod] = useState<any>(null)
    let [user, setUser] = useState<any>(null)
    let [listType, changeListType] = useState("profiles")
    let [width, setWidth] = useState({width:0})
    let [allUsers, changeAllUsers] = useState([])
    let [editRole, showEditRole] = useState<any>(false)
    let [mods, setMods] = useState<any>([])
    let auth = getAuth()
    onAuthStateChanged(auth, (u) => {
      if(u) {
        u?.getIdTokenResult(true).then((e: any) => {
          if(e.claims.role == "owner" || e.claims.role == "editor") {
            setUser(u)
            setPerms(e.claims.role)
          } else {
            setPerms(false)
            setUser(null)
          }
        })
    } else {
      setPerms(false)
      setUser(null)
    }
    })
    function changeIt() {
      try {
        if(window.innerWidth <= 1000) {
          if(displayMod) {
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
      if(listType != "users" || !perms) return;
      (async () => {
        let token = await user.getIdToken()
        let data = await fetch("/api/users?token="+token)
        let json = await data.json()
        changeAllUsers(json)
      })()
    }, [listType])
    useEffect(() => {
      changeIt()
     if(!perms || mods.length) return;
     (async () => {
      let token = await user.getIdToken();
      let data = await fetch(`/api/mods?token=${token}`)
      let json = await data.json()
      json = json.sort((a: any,b: any) => b.role.localeCompare(a.role))
      setMods(json)
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
        <div style={{display: "grid", placeItems: "center"}}>
        <Button onClick={() => {
          changeListType(listType == "profiles" ? "users" : "profiles")
        }}>{listType == "users" ? "View Mods" : "Add User"}</Button>
        </div>
        <hr/>
        <section style={{display: `${listType == "users" ? "block" : "none"}`}}>
        {allUsers.map((e: any) => <div style={{paddingTop: "20px", paddingBottom: "20px"}} onClick={async () => {
          let token = await user.getIdToken()
          let role = "editor"
          let data = await fetch("/api/user/perms", {
            method: "POST",
            headers: {
              'content-type': "application/json"
            },
            body: JSON.stringify({
              token,
              uid: e.uid,
              role: role.toLowerCase()
            })
          })
          let json = await data.json();
          (document.getElementById(e.uid) as any).innerText = json.message;
          setTimeout(() => {
            (document.getElementById(e.uid) as any).innerText = ""
          }, 3000)
        }} key={e.name}>
          <h1 style={{textAlign: "center"}} className="white">{e.name}</h1>
          <h5 style={{textAlign: "center"}} className="white">Email: {e.email}</h5>
          <p id={e.uid} className="white" style={{textAlign: "center"}}></p>
        </div>)}
          </section>
        <section style={{display: `${listType == "profiles" ? "initial" : "none"}`}}>
        {mods.map((e: any) => <div style={{paddingTop: "20px", paddingBottom: "20px"}} onClick={() => e == displayMod ? setDisplayMod(null) : setDisplayMod(e)} key={e.name}>
          <h1 style={{textAlign: "center"}} className="white">{e.name}</h1>
          <h4 style={{textAlign: "center"}} className="white">Role: {e.role}</h4>
          <h5 style={{textAlign: "center"}} className="white">Email: {e.email}</h5>
        </div>)}
      </section>
      </div>
      <div id={styles.show}>
        {!displayMod ? <h1 style={{textAlign: "center"}} className="white">No content to be displayed</h1> : <>
        <Button onClick={() => setDisplayMod(null)}>Back</Button>
        <h1 style={{textAlign: "center", fontSize: "60px"}} className="white">Moderator: {displayMod.name}</h1>
        <h1 style={{textAlign: "center"}} className="white">Role: {displayMod.role}</h1>
        <h2 style={{textAlign: "center"}} className="white">Email: {displayMod.email}</h2>
        <h3 style={{textAlign: "center"}} className="white">UID: {displayMod.uid}</h3>
        {perms == "owner" ? <div>
        <Button onClick={() => showEditRole(!editRole)} style={{marginBottom: "50px"}}>Edit Role</Button>
          {editRole ? <Form>
          <InputGroup>
            <InputGroup.Text id="newrole">New Role</InputGroup.Text>
            <Form.Control required placeholder="'owner' or 'editor" aria-describedby="newrole" id="new_role"></Form.Control>
          </InputGroup>
          <p id="err1" className="white"></p>
          <br></br>
          <Button type="button" onClick={async () => {
            let token = await user.getIdToken()
            let role = (document.getElementById("new_role") as any).value
            let data = await fetch("/api/user/perms", {
              method: "POST",
              headers: {
                'content-type': "application/json"
              },
              body: JSON.stringify({
                token,
                uid: displayMod.uid,
                role: role.toLowerCase()
              })
            })
            let json = await data.json();
            (document.getElementById("err1") as any).innerText = json.message;
            setTimeout(() => {
              (document.getElementById("err1") as any).innerText = ""
            }, 3000)
          }}>Submit</Button></Form> : ""}
          <br></br>
          <Button type="button" onClick={async () => {
            let token = await user.getIdToken()
            let data = await fetch("/api/user/perms", {
              method: "DELETE",
              headers: {
                'content-type': "application/json"
              },
              body: JSON.stringify({
                token,
                uid: displayMod.uid
              })
            })
            let json = await data.json();
            (document.getElementById("err2") as any).innerText = json.message;
            setTimeout(() => {
              (document.getElementById("err2") as any).innerText = ""
            }, 3000)
          }}>Delete User</Button>
          <p id="err2" className="white"></p>
          <br></br>
        </div> : ""}
        </>}
      </div>
      </div>
    </>
}