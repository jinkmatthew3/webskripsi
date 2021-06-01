import React, { useState } from "react";
import { Container, Form, Button, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Redirect } from "react-router";
import firebase from '../../firebase'
import Divider from '@material-ui/core/Divider'
import { FaQuestion } from "react-icons/fa";

const SelectProvinsi = (props) => {
    if (props.listProvinsi) {
        console.log("List: ", props.listProvinsi.features);
        return (
            props.listProvinsi.features
            .filter(data => {
                return data.attributes.Provinsi.toLowerCase().indexOf("indonesia") < 0
            })
            .map((data, key) => {
                return (
                    <option key={key} value={[data.attributes.Kasus_Meni, data.attributes.Provinsi]}>
                        {data.attributes.Provinsi}
                    </option>
                )
            })
        );
    }
    else {
        return true;
    }
    // console.log("Select: ", props.listProvinsi);
}

const fetchProvinsiName = async () => {

    const url = 'https://services5.arcgis.com/VS6HdKS0VfIhv8Ct/arcgis/rest/services/COVID19_Indonesia_per_Provinsi/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';
    const response = await fetch(url)
        .then(result => {
            return result;
        })
    const data = await response.json();
    console.log("ini fetch", data);

    return data;
}


const Test = (props) => {
    const [valueNama, setValueNama] = useState("");
    const [valueHealthcare, setvalueHealthcare] = useState();
    const [valueDiseases, setvalueDiseases] = useState();
    const [valueEssential, setvalueEssential] = useState();
    const [valueAge, setvalueAge] = useState();
    const [provinsi, setProvinsi] = useState("432,Aceh");
    const [listProvinsi, setListProvinsi] = useState(null);

    //buat pindah halaman
    const [hasil, setHasil] = useState(null);
    const [idDokumen, setIdDokumen] = useState(null);
    const [submitForm, setSubmitForm] = useState(false);


    var maxMeninggal = 0;

    const fetchProvinsi = async () => {
        const temp = await fetchProvinsiName();
        setListProvinsi(temp);
    }

    if (!listProvinsi) {
        fetchProvinsi();
    }

    const uploadFirebase = async (namaProvinsi, sum, bobotHealthcare, bobotDiseases, bobotEssential, bobotAge, bobotProvinsi) => {
        const db = firebase.firestore();
        const userRef = await db.collection("dataCalonVaksin").add({
            nama: valueNama,
            provinsi: namaProvinsi,
            nilaiH: bobotHealthcare,
            nilaiD: bobotDiseases,
            nilaiE: bobotEssential,
            nilaiA: bobotAge,
            nilaiP: bobotProvinsi,
            nilai: sum,
        }).catch((err) => {
            console.log(err);
        }).then((querySnapshot) => {
            setIdDokumen(querySnapshot.id);
            return querySnapshot.id;
        })
        return userRef;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        sumMeninggal();

        var kasusMeninggal;
        var namaProvinsi;

        var temp = provinsi.split(",");
        //console.log("hai sayang",temp);
        kasusMeninggal = temp[0];
        namaProvinsi = temp[1];


        var bobotHealthcare = valueHealthcare / 3;
        var bobotDiseases = valueDiseases / 3;
        var bobotEssential = valueEssential / 3;
        var bobotAge = valueAge / 4;
        var bobotProvinsi;

        if (maxMeninggal !== 0) {
            bobotProvinsi = kasusMeninggal / maxMeninggal;
        }

        console.log("H", bobotHealthcare);
        console.log("D", bobotDiseases);
        console.log("E", bobotEssential);
        console.log("A", bobotAge);
        console.log("P", bobotProvinsi);

        bobotHealthcare = bobotHealthcare * 0.3684379;
        bobotDiseases = bobotDiseases * 0.13777309;
        bobotEssential = bobotEssential * 0.07878485;
        bobotAge = bobotAge * 0.2772308;
        bobotProvinsi = bobotProvinsi * 0.13777309;

        var sum = bobotHealthcare + bobotDiseases + bobotEssential + bobotAge + bobotProvinsi;

        // console.log("Nama kamu ", valueNama);
        // console.log("Provinsi kamu ", namaProvinsi);
        console.log("Nilai kamu", sum);

        const firebase = uploadFirebase(namaProvinsi, sum, bobotHealthcare, bobotDiseases, bobotEssential, bobotAge, bobotProvinsi);

        if (firebase) {
            console.log("hai bebeb", idDokumen);
            setHasil({
                nama: valueNama,
                provinsi: namaProvinsi,
                nilaiH: bobotHealthcare,
                nilaiD: bobotDiseases,
                nilaiE: bobotEssential,
                nilaiA: bobotAge,
                nilaiP: bobotProvinsi,
                nilai: sum,
            });
        }
    }

    console.log(provinsi);

    const sumMeninggal = () => {
        console.log("yes", listProvinsi.features);
        listProvinsi.features.map((element, key) => {
            if (maxMeninggal < element.attributes.Kasus_Meni) {
                maxMeninggal = element.attributes.Kasus_Meni;
            }
            return true;
        });
    }

    // console.log(" hai senpai ", valueNama);
    // console.log(" ini value healthcare ", valueHealthcare);
    // console.log(" ini value disease ", valueDiseases);
    // console.log(" ini value essential ", valueEssential);
    // console.log(" ini value age ", valueAge);

    if (submitForm) {
        return (
            <Redirect to={{
                pathname: "/data",
                state: { hasil: hasil }
            }}></Redirect>
        )
    }

    if (idDokumen) {
        console.log("hasil: ", hasil);
        setSubmitForm(true);
    }

    return (
        <Container>
            <Form onSubmit={onSubmit}>
                <Form.Group controlId="formName" style={{ padding: 10 }}>
                    <Form.Label>Nama</Form.Label>
                    <Form.Control type="text" placeholder="Enter your name" onChange={(e) => setValueNama(e.target.value)} />
                </Form.Group>
                <Row>
                    <Col>
                        <Form.Group style={{ padding: 10 }}>
                            <Form.Label>1. Apakah anda seorang petugas kesehatan ?</Form.Label>
                            <fieldset>
                                <Form.Group>
                                    <Col sm={12}>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="Ya, saya seorang tenaga kesehatan, sangat rentan terpapar virus dan rentan memaparkan virus."
                                                    name="formHorizontalRadios1"
                                                    id="formHorizontalH1"
                                                    onChange={() => setvalueHealthcare(3)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Anda merupakan orang yang berinteraksi langsung dengan pasien COVID-19. Contoh dari pekerjaan ini adalah Dokter dan Perawat.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="Ya, saya seorang tenaga kesehatan, sangat rentan terpapar virus tapi tidak rentan memaparkan virus."
                                                    name="formHorizontalRadios1"
                                                    id="formHorizontalH2"
                                                    onChange={() => setvalueHealthcare(2)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Anda bekerja di bidang kesehatan tetapi anda tidak berinteraksi langsung dengan pasien COVID-19. Contoh dari pekerjaan ini adalah Apoteker dan Bidan.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="Tidak, saya bukan tenaga kesehatan."
                                                    name="formHorizontalRadios1"
                                                    id="formHorizontalH3"
                                                    onChange={() => setvalueHealthcare(1)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Anda tidak bekerja di bidang kesehatan</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>
                            </fieldset>
                        </Form.Group>
                        <Divider />
                        <Form.Group style={{ padding: 10 }}>
                            <Form.Label>2. Apakah anda pernah mempunyai atau terjangkit penyakit serius ?</Form.Label>
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Col sm={12}>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="Ya, saya mempunyai atau terjangkit penyakit yang sangat serius."
                                                    name="formHorizontalRadios2"
                                                    id="formHorizontalP1"
                                                    onChange={() => setvalueDiseases(3)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Beberapa contoh seperti pernah transplantasi organ, sedang melakukan kemoterapi atau mempunyai down syndrome.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="Ya, saya mempunyai atau terjangkit penyakit yang cukup serius."
                                                    name="formHorizontalRadios2"
                                                    id="formHorizontalP2"
                                                    onChange={() => setvalueDiseases(2)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Beberapa contoh seperti diabetes, hipertensi, atau sedang dalam proses pengobatan yang tidak terlalu serius.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">

                                                <Form.Check
                                                    type="radio"
                                                    label="Tidak, tidak ada."
                                                    name="formHorizontalRadios2"
                                                    id="formHorizontalP3"
                                                    onChange={() => setvalueDiseases(1)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Sedang tidak mempunyai atau pernah terjangkit penyakit yang serius.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>
                            </fieldset>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group style={{ padding: 10 }}>
                            <Form.Label>3. Apakah anda pekerja yang dibutuhkan dalam keberlangsungan masyarakat ?</Form.Label>
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Col sm={12}>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="Ya, jika tidak ada saya maka kehidupan masyarakat terhambat atau terancam."
                                                    name="formHorizontalRadios3"
                                                    id="formHorizontalE1"
                                                    onChange={() => setvalueEssential(3)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Beberapa contoh pekerjaan ini seperti Dokter, Perawat, Guru, atau Staff Sekolah.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="Ya, tapi tidak berhubungan langsung dengan masyarakat."
                                                    name="formHorizontalRadios3"
                                                    id="formHorizontalE2"
                                                    onChange={() => setvalueEssential(2)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Beberapa contoh dari pekerjaan ini seperti Supir Taksi, Pelayan atau Kasir.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">

                                                <Form.Check
                                                    type="radio"
                                                    label="Tidak, pekerjaan saya tidak dibutuhkan secara langsung oleh masyarakat."
                                                    name="formHorizontalRadios3"
                                                    id="formHorizontalE3"
                                                    onChange={() => setvalueEssential(1)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Beberapa contoh dari pekerjaan ini seperti pekerja kantoran, atau ibu rumah tangga.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>
                            </fieldset>
                        </Form.Group>
                        <Divider />
                        <Form.Group style={{ padding: 10 }}>
                            <Form.Label>4. Berapakah umur anda ?</Form.Label>
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Col sm={12}>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="70 tahun ke atas."
                                                    name="formHorizontalRadios4"
                                                    id="formHorizontalA4"
                                                    onChange={() => setvalueAge(4)}
                                                />

                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Berumur 70 tahun ke atas.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="50 - 69 tahun."
                                                    name="formHorizontalRadios4"
                                                    id="formHorizontalA3"
                                                    onChange={() => setvalueAge(3)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Berumur di antara 50-69 tahun.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">

                                                <Form.Check
                                                    type="radio"
                                                    label="30 - 49 tahun."
                                                    name="formHorizontalRadios4"
                                                    id="formHorizontalA2"
                                                    onChange={() => setvalueAge(2)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Berumur di antara 30-49 tahun.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl="10">
                                                <Form.Check
                                                    type="radio"
                                                    label="0 - 29 tahun."
                                                    name="formHorizontalRadios4"
                                                    id="formHorizontalA1"
                                                    onChange={() => setvalueAge(1)}
                                                />
                                            </Col>
                                            <Col>
                                                <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Berumur di antara 0-29 tahun.</Tooltip>}>
                                                    <span className="d-inline-block">
                                                        <Button variant="light" disabled style={{ pointerEvents: 'none', borderRadius: 25 }}>
                                                            <FaQuestion></FaQuestion>
                                                        </Button>
                                                    </span>
                                                </OverlayTrigger>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Form.Group>
                            </fieldset>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="exampleForm.ControlSelect1" style={{ padding: 10 }}>
                    <Form.Label>Provinsi Asal</Form.Label>
                    <Form.Control as="select" onChange={(e) => setProvinsi(e.target.value)}>
                        <SelectProvinsi listProvinsi={listProvinsi}></SelectProvinsi>
                    </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" style={{ margin: 10 }}>
                    Submit
                </Button>
            </Form>
        </Container>
    )
}

export default Test;