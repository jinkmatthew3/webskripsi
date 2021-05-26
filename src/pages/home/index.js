import React from "react";
import { Container, Row, Button as RbButton, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";


const Home = (props) => {
    return (
        <Container>
            <Row>
                <p style={{ textAlign: 'center', marginTop: 100 }}>
                    Web ini merupakan web untuk mendukung keputusan pemberian vaksin
Covid-19.<br></br> Untuk memulai silahkan tekan tombol di bawah ini.
        </p>
            </Row>
            <Row className="show-grid">
                <Col xs={1} md={4}></Col>
                <Col xs={4} md={4} style={{ justifyContent: 'center', display: 'flex'}}><Link to="/test">
                    <RbButton variant="outline-dark" style={{}}>Mulai Tes</RbButton>
                </Link></Col>
                <Col xs={1} md={4}></Col>
            </Row>

        </Container>
    )
}

export default Home;