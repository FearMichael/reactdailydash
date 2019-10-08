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

    const [userData, updateUserData] = useState();

    const [user, updateUser] = useState(null);

    const addTask = (task) => {
        console.log(task);
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

    const updateSearchData = (key, value) => {
        switch (key) {
            case "weather":
                db.collection("users").doc(user.uid).update({ "weather": value }).then((data) => console.log(data));
                break;
            case "news":
                db.collection("users").doc(user.uid).update({ "news": value }).then((data) => console.log(data));
                break;
            case "stocks":
                db.collection("users").doc(user.uid).update({ "stocks": value }).then((data) => console.log(data));
                break;
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
        tasks: taskData,
        stocks: stockData,
        location: locationData,
        news: newsData,
        addTask: addTask,
        deleteTask: deleteTask,
        updateTask: updateTask,
        signIn: signIn,
        createAccount: createAccount,
        user: user,
        signOut: signOut,
        addUser: addUser,
    }

    return (
        <FirebaseContext.Provider value={state}>
            {props.children}
        </FirebaseContext.Provider>
    );

};

export default FirebaseProvider;