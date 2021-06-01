import React from "react";
import { Navbar, Nav } from 'react-bootstrap'
import Logo from './Logo.png'

const NavbarComp = (props) => {
    return (
        <Navbar bg="light">
            <Navbar.Brand href="/" style={{ paddingLeft: 20 }}><img src={Logo} alt="yes" width="80"></img></Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/" className={props.linkState === "home" ? "navActive" : ""}>Home</Nav.Link>
                <Nav.Link href="/test" className={props.linkState === "test" ? "navActive" : ""}>Testing</Nav.Link>
                <Nav.Link href="/data" className={props.linkState === "data" ? "navActive" : ""}>Data</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavbarComp;