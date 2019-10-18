import React, { useState, useContext } from "react";
import { Dialog, DialogContent, Input, Box, FormControl, Grid, Button, Paper, makeStyles, ClickAwayListener, Typography } from "@material-ui/core";
import Autorenew from "@material-ui/icons/Autorenew"
import FirebaseProvider from "./Context/FirebaseContext";
import FormUtil from "./FormUtil";

const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: "white",
        padding: "2rem",
        textAlign: "center",
        display: "flex",
        justifyContent: "center"
    },
    formContent: {
        margin: "2rem auto",
        textAlign: "center",
        fontSize: "2rem",
        width: "100%"
    },
    buttons: {
        margin: "0 auto"
    }
}));

// const RefComp = React.forwardRef((props, ref) => <div ref={ref}> {props.children} </div>);

const SignIn = (props) => {

    // const ref = React.createRef();

    const firebaseAuth = useContext(FirebaseProvider);

    const classes = useStyles();

    const [showForm, updateShowForm] = useState(false);

    const [loginType, updateLoginType] = useState(null)

    const [firstName, updateFirstName] = useState("");

    const [lastName, updateLastName] = useState("");

    const [email, updateEmail] = useState("");

    const [password, updatePassword] = useState("");

    const [loggingIn, updateLoggingIn] = useState(false);

    const [error, updateError] = useState(null);

    const selectLogin = (loginSelect) => {
        updateShowForm(true)
        if (loginSelect === "create") {
            updateLoginType("create")
        } else if (loginSelect === "signin") {
            updateLoginType("signin")
        } else {
            console.log("Login type not available")
        }
    }

    const formSignIn = (emailInput, passwordInput) => {
        updateLoggingIn(true)
        firebaseAuth.signIn(emailInput, passwordInput).then(data => {
            if (data) {
                updateError(null);
                modalReset()
            };
        }).catch(err => { updateError(err.message); updateLoggingIn(false); });
    };

    const formCreateAccount = (emailInput, passwordInput) => {
        updateLoggingIn(true)
        firebaseAuth.createAccount(emailInput, passwordInput).then(data => {
            if (data) {
                updateError(null);
                firebaseAuth.addUser(data.user.uid, {
                    firstName: firstName,
                    lastName: lastName,
                    profilePic: null,
                    weather: null,
                    news: null,
                    stocks: null
                })
                modalReset()
            }

        }).catch(err => { updateError(err.message); updateLoggingIn(false); });
    };

    const modalReset = () => {
        props.closeModal();
        updateLoggingIn(false);
        updateLoginType(null);
        updateShowForm(false);
        updatePassword("");
        updateEmail("");
        updateFirstName("");
        updateLastName("");
    }
    const determineLogin = () => {
        if (loginType === "signin") {
            return formSignIn(email, password);
        } else if (loginType === "create") {
            return formCreateAccount(email, password);
        }
    }

    const handleEmailChange = (event) => {
        updateEmail(event.target.value)
    };
    const handlePasswordChange = (event) => {
        updatePassword(event.target.value)
    };

    const firstNameChange = (event) => {
        updateFirstName(event.target.value);
    }

    const lastNameChange = (event) => {
        updateLastName(event.target.value);
    }
    let content = (
        <Dialog
            // style={{ top: "10%", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", border: "0" }}
            aria-labelledby="sign-in-form"
            aria-describedby="use-this-form-to-sign-in"
            open={props.formOpen}
            onClose={() => updateShowForm(false)}
        >
            <ClickAwayListener onClickAway={modalReset} >
                <DialogContent className={classes.paper} >
                    {!showForm &&
                        <Box display="flex" justifyContent="center">
                            <Button onClick={() => selectLogin("create")}>Create Account</Button>
                            <Button onClick={() => selectLogin("signin")}>Sign In</Button>
                        </Box>
                    }
                    {showForm &&
                        <FormUtil submit={determineLogin} >
                            {loginType === "create" &&
                                <>
                                    <FormControl fullWidth={true}>
                                        <Input
                                            inputComponent="input"
                                            label="First Name"
                                            placeholder="First Name"
                                            // value={email}
                                            fullWidth={true}
                                            onChange={firstNameChange}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth={true}>
                                        <Input
                                            inputComponent="input"
                                            label="Last Name"
                                            placeholder="Last Name"
                                            fullWidth={true}
                                            // value={email}
                                            onChange={lastNameChange}
                                        />
                                    </FormControl>
                                </>
                            }
                            <FormControl fullWidth={true}>
                                <Input
                                    inputComponent="input"
                                    label="Email"
                                    placeholder="Email"
                                    fullWidth={true}
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                            </FormControl>
                            <FormControl fullWidth={true}>

                                <Input
                                    inputComponent="input"
                                    label="Password"
                                    placeholder="Password"
                                    type="password"
                                    fullWidth={true}
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                            </FormControl >
                            {loggingIn &&
                                <Box display="flex" justifyContent="center">
                                    <Autorenew className="loadingIcon" />
                                </Box>
                            }
                            <Box display="flex" justifyContent="center">
                                {loginType === "signin" && <Button onClick={() => formSignIn(email, password)}>Sign In</Button>}
                                {loginType === "create" && <Button onClick={() => formCreateAccount(email, password)}>Create Account</Button>}
                            </Box>
                            <Box display="flex" justifyContent="center">
                                {error && <Typography style={{ color: "red", textAlign: "center" }}>{error}</Typography>}
                            </Box>
                        </FormUtil>
                    }
                </DialogContent>
            </ClickAwayListener>
        </Dialog >
    )
    return content;
}

export default SignIn;