import React, { useState, useEffect } from "react";
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

const FirebaseProvider = (props) => {

    const [userData, updateUserData] = useState();

    const [user, updateUser] = useState(null);

    const addTask = (task) => {
        return db.collection("users").doc(user.uid).collection("todos").add({ name: task, completed: false });
    };

    const updateTask = (task, completed, taskId) => {
        return db.collection("users").doc(user.uid).collection("todos").doc(taskId).update({ name: task, completed: completed });
    };

    const deleteTask = (taskId) => {
        return db.collection("users").doc(user.uid).collection("todos").doc(taskId).delete();
    };

    const signIn = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    };

    const createAccount = (email, password) => {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    };

    const addProfilePic = (url) => {
        return db.collection("users").doc(user.uid).update({ "profilePic": url });
    }

    const updateSearchData = (key, value) => {
        switch (key) {
            case "weather":
                db.collection("users").doc(user.uid).update({ "weather": value })
                    .then().catch(err => console.log(err));
                break;
            case "news":
                db.collection("users").doc(user.uid).update({ "news": value })
                    .then().catch(err => console.log(err));
                break;
            case "stocks":
                db.collection("users").doc(user.uid).update({ "stocks": value })
                    .then().catch(err => console.log(err));
                break;
            default:
                console.log("Error no items to update in database");
        }
    }


    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // updateUser(user);
                db.collection("users").doc(user.uid).get().then(userData => {
                    let name = `${userData.data().firstName} ${userData.data().lastName}`;
                    let userInfo = userData.data();
                    let userWithName = { ...user, name, userInfo }
                    updateUser(userWithName);
                });
                db.collection("users").doc(user.uid).onSnapshot(doc => {
                    updateUserData(doc.data());
                });
                db.collection("users").doc(user.uid).collection("todos").onSnapshot(todos => {
                    let todoList = [];
                    todos.forEach(todoItem => {
                        let todo = { id: todoItem.id, ...todoItem.data() };
                        todoList.push(todo);
                    });
                    updateUserData(prev => { return { ...prev, tasks: todoList } });

                });
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
        updateUser(null);
        updateUserData(null);
        firebase.auth().signOut().then(() => {
            window.location.reload();
        });
    };

    let state = {
        updateSearchData: updateSearchData,
        userData: userData,
        addTask: addTask,
        deleteTask: deleteTask,
        updateTask: updateTask,
        signIn: signIn,
        createAccount: createAccount,
        user: user,
        signOut: signOut,
        addUser: addUser,
        addProfilePic: addProfilePic
    }

    return (
        <FirebaseContext.Provider value={state}>
            {props.children}
        </FirebaseContext.Provider>
    );

};

export default FirebaseProvider;