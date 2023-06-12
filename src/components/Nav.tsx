import React, { useEffect, useState } from 'react'
import { Collapse, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'
import { NextPageContext } from 'next'
import Auth from './Auth'
import { getAuth, onAuthStateChanged, sendEmailVerification, signOut } from 'firebase/auth'
import Settings from './Settings'

interface HeaderProps {
  name: string
  mainRoutes: {
    [display: string]: string
  },
  active: string
}

function App({name, mainRoutes, active}: HeaderProps) {
  if(active == "/index") {
    active = "/"
  }
  let auth = getAuth()
  let [loggedIn, setLoggedIn] = useState(auth?.currentUser)
  onAuthStateChanged(auth, setLoggedIn) 
  useEffect(() => {
    (async () => {
      if(loggedIn) {
        if(!loggedIn.emailVerified) {
          await sendEmailVerification(loggedIn)
          await signOut(auth)
          return
        }
      }
    })()
  })
  function changeView() {
    let type = document.getElementById("responsive-navbar-nav")
    if(type) {
      (document.getElementById("responsive-navbar-nav") as any).style.display = type.style.display != "block" ?"block" : "none"
    }
  }
  return (
    <Navbar style={{"backgroundColor": "#000000"}} expand="lg">
      <Container fluid>
        <Navbar.Brand href="/" style={{ cursor: 'pointer' }}>
          <strong className="white">{name}</strong>
        </Navbar.Brand>
        <button aria-controls="basic-navbar-nav" style={{backgroundColor:"white"}} type="button" aria-label="Toggle navigation" className="navbar-toggler" onClick={changeView}><span className="navbar-toggler-icon"></span></button>
          <Navbar.Collapse id='responsive-navbar-nav' className='justify-content-end'>
          {Object.keys(mainRoutes).map((e, i) => (
              <Nav.Link
                key={`link-${i}`}
                href={mainRoutes[e]}
                target={mainRoutes[e].startsWith("https") ? "_blank" : "_self"}
                id={mainRoutes[e]}
                style={{backgroundColor: `${mainRoutes[e] == active ? "#454545" : "none"}`, color: "white"}}
              >
                {e}
              </Nav.Link>
            ))}  
            {loggedIn ? <Settings></Settings> : <Auth></Auth>}
          </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default App