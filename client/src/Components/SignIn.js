import React, { useState, useContext } from "react";
import { Modal, Input, Box, FormControl, Grid, Button, Paper, makeStyles, ClickAwayListener } from "@material-ui/core";
import Autorenew from "@material-ui/icons/Autorenew"
import FirebaseProvider from "./Context/FirebaseContext";

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        // margin: "0.5rem auto"
    },
    formContent: {
        margin: "1rem auto",
        textAlign: "center",
        fontSize: "2rem"
    }
}));

const SignIn = (props) => {

    const firebaseAuth = useContext(FirebaseProvider);

    const classes = useStyles();

    const [showForm, updateShowForm] = useState(false);

    const [loginType, updateLoginType] = useState(null)


    const [firstName, updateFirstName] = useState("");

    const [lastName, updateLastName] = useState("");

    const [email, updateEmail] = useState("");

    const [password, updatePassword] = useState("");

    const [loggingIn, updateLoggingIn] = useState(false);

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
        console.log("sign in?")
        firebaseAuth.signIn(emailInput, passwordInput).then(data => {
            if (data) {
                modalReset()
            };
        }).catch(err => console.log(err));
    };

    const formCreateAccount = (emailInput, passwordInput) => {
        updateLoggingIn(true)
        console.log("create account?")
        console.log(email, password);
        firebaseAuth.createAccount(emailInput, passwordInput).then(data => {
            console.log(data);
            if (data) {
                firebaseAuth.addUser(data.user.uid, { firstName: firstName, lastName: lastName })
                modalReset()
            }

        }).catch(err => console.log(err))
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

    const handleEmailChange = (event) => {
        console.log(event);
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
    console.log(showForm)
    let content = (
        <Modal
            style={{ top: "10%", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", border: "0" }}
            aria-labelledby="sign-in-form"
            aria-describedby="use-this-form-to-sign-in"
            open={props.formOpen}
            onClose={() => updateShowForm(false)}
        >
            <ClickAwayListener onClickAway={modalReset}>
                <Paper className={classes.paper} >
                    {!showForm &&
                        <>
                            <Button onClick={() => selectLogin("create")}>Create Account</Button>
                            <Button onClick={() => selectLogin("signin")}>Sign In</Button>
                        </>
                    }

                    {showForm &&
                        <Grid
                            container
                            className={classes.formContent}

                        >
                            {loginType === "create" &&
                                <>
                                    < Grid item sm={12}
                                    >
                                        <FormControl>
                                            <Input
                                                inputComponent="input"
                                                label="First Name"
                                                placeholder="First Name"
                                                // value={email}
                                                onChange={firstNameChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={12}>
                                        <FormControl>
                                            <Input
                                                inputComponent="input"
                                                label="Last Name"
                                                placeholder="Last Name"
                                                // value={email}
                                                onChange={lastNameChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                </>
                            }
                            <Grid item sm={12}>
                                <FormControl>
                                    <Input
                                        inputComponent="input"
                                        label="Email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={handleEmailChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item sm={12}>
                                <FormControl>

                                    <Input
                                        inputComponent="input"
                                        label="Password"
                                        placeholder="Password"
                                        type="password"
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </FormControl>
                                {loggingIn &&
                                    <Grid item sm={12}>
                                        <Autorenew className="loadingIcon" />
                                    </Grid>
                                }
                            </Grid>
                            <Grid item sm={12}>
                                {loginType === "signin" && <Button onClick={() => formSignIn(email, password)}>Sign In</Button>}
                                {loginType === "create" && <Button onClick={() => formCreateAccount(email, password)}>Create Account</Button>}
                            </Grid>
                        </Grid>
                    }
                </Paper>
            </ClickAwayListener>
        </Modal >
    )
    return content;
}

export default SignIn;