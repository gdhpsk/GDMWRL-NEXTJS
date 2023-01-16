import React, { useEffect } from 'react'
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap'


interface HeaderProps {
  name: string
  mainRoutes: {
    [display: string]: string
  }
}

const Header: React.FC<HeaderProps> = ({ name, mainRoutes }: HeaderProps) => {
  return (
    <Navbar style={{"backgroundColor": "#000000"}}>
      <Container fluid>
        <Navbar.Brand href="/" style={{ cursor: 'pointer' }}>
          <strong className="white">{name}</strong>
        </Navbar.Brand>
          <Nav id="nav">
            {Object.keys(mainRoutes).map((e, i) => (
              <Nav.Link
                key={`link-${i}`}
                href={mainRoutes[e]}
                id={mainRoutes[e]}
                style={{"color": "white"}}
              >
                {e}
              </Nav.Link>
            ))}  
          </Nav>
      </Container>
    </Navbar>
  )
}

export default Header