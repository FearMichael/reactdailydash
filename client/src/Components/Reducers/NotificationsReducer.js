export const UPDATE_NOTIFICATION = "UPDATE_NOTIFICATION"

const NotificationsReducer = (state, action) => {
    switch(action.type) {
        case UPDATE_NOTIFICATION:
            return {...state, notification: action.notification}
            
        default:
            return state;
    }
};
export default NotificationsReducer;