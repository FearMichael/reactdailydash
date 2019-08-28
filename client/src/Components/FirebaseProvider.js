import React, { useState, useEffect } from "react";
// import NotificationsContext from "./Context/NotificationContext";
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

    const [user, updateUser] = useState(null)

    const addTask = (task) => {
        try {
            db.collection("users").doc(user.id).update({ tasks: firebase.firestore.FieldValue.arrayUnion(task) }).then(newData => {
                console.log(newData);
            })
        }
        catch (error) {
            console.error(`Error at Add Task to Firestore Function: ${error}`);
        }
    };

    const signIn = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
        // .catch(error => {
        //     console.log(error.code);
        //     console.log(error.message);
        // })
    };

    const createAccount = (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password)
        // .catch(error => {
        //     console.log(error.code);
        //     console.log(error.message);
        // })
    };
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // updateUser(user);
                db.collection("users").doc(user.uid).get().then(userData => {
                    let name = `${userData.data().firstName} ${userData.data().lastName}`;
                    let userWithName = { ...user, name }
                    updateUser(userWithName);
                })
            } else {
                updateUser(null);
            }
        });
    }, []);

    const addUser = (uid, data) => {
        db.collection("users").doc(uid).set(data).then(newUser => {
        });
    };

    const signOut = () => {
        console.log("Signed Out")
        firebase.auth().signOut();
    };

    let state = {
        tasks: taskData,
        stocks: stockData,
        location: locationData,
        news: newsData,
        addTask: addTask,
        signIn: signIn,
        createAccount: createAccount,
        user: user,
        signOut: signOut,
        addUser: addUser
    }

    return (
        <FirebaseContext.Provider value={state}>
            {props.children}
        </FirebaseContext.Provider>
    );

};

export default FirebaseProvider;