import React, { useState } from "react";
import { Container, Table } from 'react-bootstrap'
import firebase from '../../firebase'


const DataTableBody = (props) => {
    if (props.dataTabel) {
        return (
            props.dataTabel.map((data, key) => {
                var id = data.id + '';
                var nilai = (data.nilai*100).toFixed(2) + '%';
                return (
                    <tr>
                        <td>{id}</td>
                        <td>{data.nama}</td>
                        <td>{data.provinsi}</td>
                        <td>{nilai}</td>
                    </tr>
                )
            })
        )
    }
    else {
        return true;
    }
};

const Data = (props) => {
    const [hasil, setHasil] = useState(null);
    const [dataTabel, setDataTabel] = useState([]);
    const [done, setDone] = useState(false);
    const [id, setId] = useState(null);

    const TarikData = async () => {
        var temp2 = [];
        const db = firebase.firestore();
        const userRef = await db.collection("dataCalonVaksin").orderBy("nilai", "desc").get()
            .catch((err) => {
                console.log(err);
            }).then((querySnapshot) => {
                querySnapshot.forEach(element => {
                    var temp = {
                        id: temp2.length+1,
                        nama: element.data().nama,
                        provinsi: element.data().provinsi,
                        nilai: element.data().nilai,
                    }
                    if(hasil && hasil.nama == element.data().nama){
                        setId(temp.id);
                    }
                    temp2.push(temp);
                    console.log("ini Data kamu", temp2);
                });
                //setDataTabel(dataTabel);
                return temp2;
            })
        return userRef;
    }

    const fetchDataTabel = async () =>{
        const something = await TarikData();
        setDataTabel(something);
        if(hasil && dataTabel){
        }
    }

    console.log("location", props.location);
    if (props.location.state && !hasil) {
        setHasil(props.location.state.hasil);
    }

    if (hasil) {
        console.log(hasil);
    }

    if (!dataTabel.length) {
        fetchDataTabel();
    }
    return (
        <Container>
            {hasil &&
                <p>Halo {hasil.nama} kamu berada di urutan {id} dengan nilai {((hasil.nilai)*100).toFixed(2)}%</p>
            }
            <Table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Provinsi</th>
                        <th>Nilai</th>
                    </tr>
                </thead>
                <tbody>
                    <DataTableBody dataTabel={dataTabel}></DataTableBody>
                </tbody>
            </Table>
        </Container>
    )
}

export default Data;