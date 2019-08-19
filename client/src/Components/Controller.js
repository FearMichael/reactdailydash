import React, { useContext, useEffect, useState } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
import { Grid } from "@material-ui/core"
import axios from 'axios'
import News from './News';
import Stocks from './Stocks';
import Tasks from './Tasks';
import Weather from './Weather';
// import NotificationProvider from "./NotificationProvider";
import firebase from "firebase";
// import firestore from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCNj-zPSwifJfaluXLT7ZlPepFqD9dJn14",
    authDomain: "daily-dash-1553976444540.firebaseapp.com",
    databaseURL: "https://daily-dash-1553976444540.firebaseio.com",
    projectId: "daily-dash-1553976444540",
    storageBucket: "daily-dash-1553976444540.appspot.com",
    messagingSenderId: "328742274675",
    appId: "1:328742274675:web:ade0772859ba511e"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();

database.collection("users").get().then(users => users.docs.map(user => console.log(user.data())));

const Controller = props => {

    const apiPost = (route, data) => {
        // function escapeRegExp(string) {
        //     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        // };
        return axios.post(route, data);
    };

    // const db = (collection, data) => {
    //     return database.collection(collection)
    // }

    const db = {
        collections: (collection, data) => {
            return database.collection(collection)
        },
        addData: (collection, data) => {
            return database.collection(collection).add(data);
        }
    }

    let content = (
        <div>
            <Grid container spacing={2}>
                <Grid item sm={12} md={6} lg={6}>
                    <News getInfo={apiPost} db={db} />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                    <Stocks getInfo={apiPost} db={db} />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                    <Weather getInfo={apiPost} db={db} />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                    <Tasks getInfo={apiPost} db={db} />
                </Grid>
            </Grid>
        </div>
    )
    return content;
}

export default Controller;