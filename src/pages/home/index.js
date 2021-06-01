import React from "react";
import { Container, Row, Button as RbButton, Col } from 'react-bootstrap'
import { Link } from "react-router-dom";


const Home = (props) => {
    return (
        <Container>
            <Row>
                <p style={{ textAlign: 'center', marginTop: 100 }}>
                    Web ini merupakan web untuk mendukung keputusan pemberian vaksin
COVID-19.<br></br> Untuk memulai silahkan tekan tombol di bawah ini.
        </p>
            </Row>
            <Row className="show-grid">
                <Col xs={4} md={4}></Col>
                <Col xs={4} md={4} style={{ justifyContent: 'center', display: 'flex' }}><Link to="/test">
                    <RbButton variant="outline-dark" style={{}}>Mulai Tes</RbButton>
                </Link></Col>
                <Col xs={4} md={4}></Col>
            </Row>
            <Row>
                <p style={{ textAlign: 'center', paddingTop: 50 }}>
                    Petunjuk melakukan testing sistem pendukung keputusan pemberian vaksin COVID-19 :
                </p>
                <Container style={{ paddingLeft: "20%", paddingRight: "20%"}}>
                    <ul>
                        <li>Isi nama, provinsi, dan masing-masing pertanyaan dari halaman testing.</li>
                        <li>Untuk jawaban yang kurang jelas dapat melihat ke icon tanda tanya yang berada di samping jawaban. <br></br>Bantuan tersebut akan memberikan contoh atau penjelasan dari jawaban yang dimaksud.</li>
                        <li>Jika semua pertanyaan, nama dan provinsi sudah diisi silahkan tekan tombol submit untuk memberikan keputusan atas jawaban yang sudah dimasukan.</li>
                        <li>Hasil dari testing ini akan memberikan nilai seberapa tinggi prioritas anda dibandingkan yang lain.</li>
                    </ul>
                </Container>

            </Row>

        </Container>
    )
}

export default Home;