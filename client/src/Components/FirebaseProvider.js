import React, { useState } from "react";
import NotificationsContext from "./Context/NotificationContext";
// import NotificationsReducer, { UPDATE_NOTIFICATION } from "./Reducers/NotificationsReducer";
import FirebaseContext from "./Context/FirebaseContext";
import firebase from "firebase/app";
import "firebase/firebase-firestore";
import "firebase/auth";


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

const db = firebase.firestore();

let userId;
// firebase.auth().
// db.collection("users").where("email", "==", "mtfear@hotmail.com").get().then(users => { return users.length > 1 ? "Error too many results" : console.log(users.docs[0].id) });

// const user = db.collection("users");

const FirebaseProvider = (props) => {

    const [taskData, updateTaskData] = useState();

    const [stockData, updateStockData] = useState();

    const [locationData, updateLocationData] = useState();

    const [newsData, updateNewsData] = useState();

    const addTask = (task) => {
        console.log(userId);
        try {
            db.collection("users").doc("NqvlgaF9Cr6R4yVcUpdM").update({ tasks: firebase.firestore.FieldValue.arrayUnion(task) }).then(newData => {

            })
        }
        catch (error) {
            console.error(`Error at Add Task to Firestore Function: ${error}`);
        }
    }

    // addTask("Potato")

    let state = {
        tasks: taskData,
        stocks: stockData,
        location: locationData,
        news: newsData,
    }

    return (
        <FirebaseContext.Provider value={state}>
            {props.children}
        </FirebaseContext.Provider>
    );

};

export default FirebaseProvider;