import React from "react";
import { Navbar, Nav } from 'react-bootstrap'

const NavbarComp = (props) => {
    return (
        <Navbar bg="light">
            <Navbar.Brand href="#home" style={{ paddingLeft: 20 }}>Logo</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link href="/home" className={props.linkState === "home" ? "navActive" : ""}>Home</Nav.Link>
                <Nav.Link href="/test" className={props.linkState === "test" ? "navActive" : ""}>Testing</Nav.Link>
                <Nav.Link href="/data" className={props.linkState === "data" ? "navActive" : ""}>Data</Nav.Link>
            </Nav>
        </Navbar>
    );
}

export default NavbarComp;