import React, { useContext, useReducer } from "react";
import NotificationsContext from "./Context/NotificationContext";
import NotificationsReducer from "./Reducers/NotificationsReducer";
import NotificationContext from "./Context/NotificationContext"

const NotificationProvider = (props) => {

    const defaultState = useContext(NotificationContext);

    const [state, notificationDispatch] = useReducer(NotificationsReducer, defaultState);

    return (
        <NotificationsContext.Provider value={[state, notificationDispatch]}>
            {props.children}
        </NotificationsContext.Provider>
    );

};

export default NotificationProvider;