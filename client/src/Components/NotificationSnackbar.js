import React, { useContext } from 'react';
import { Snackbar } from "@material-ui/core";
import NotificationContext from "./Context/NotificationContext";
import { UPDATE_NOTIFICATION } from "./Reducers/NotificationsReducer"

const NotificationSnackbar = (props) => {

const [state, stateDispatch] = useContext(NotificationContext);

    let content = (
        <> {state &&
        <Snackbar
            open={state.notification.open}
            onClose={() => stateDispatch({type: UPDATE_NOTIFICATION, notification: {open: false, message: ""}})}
            autoHideDuration={3000}
            message={state.notification.message}
            >
        </Snackbar>
        }
        </>
    )

    return content;

}

export default NotificationSnackbar;