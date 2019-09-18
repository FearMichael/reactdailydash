import React, { useState, useContext } from "react";
import { Modal, Input, Box, FormControl, Grid, Button, Paper, makeStyles, ClickAwayListener } from "@material-ui/core";
import FirebaseProvider from "./Context/FirebaseContext";

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

const SignIn = (props) => {

    const firebaseAuth = useContext(FirebaseProvider);

    // console.log(props);

    const classes = useStyles();

    const [showForm, updateShowForm] = useState(false);

    const [loginType, updateLoginType] = useState(null)

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

    const [firstName, updateFirstName] = useState();

    const [lastName, updateLastName] = useState();

    const [email, updateEmail] = useState();

    const [password, updatePassword] = useState();


    const formSignIn = (emailInput, passwordInput) => {
        console.log("sign in?")
        firebaseAuth.signIn(emailInput, passwordInput).then(data => {
            data ? props.closeModal() : console.log("Error signing in");
        }).catch(err => console.log(err));
    };

    const formCreateAccount = (emailInput, passwordInput) => {
        console.log("create account?")
        console.log(email, password);
        firebaseAuth.createAccount(emailInput, passwordInput).then(data => {
            console.log(data);
            if (data) {
                firebaseAuth.addUser(data.user.uid, { firstName: firstName, lastName: lastName })
                props.closeModal()
            }

        }).catch(err => console.log(err))
    };

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

    let content = (
        <Modal
            style={{ top: "10%", margin: "auto", display: "flex", alignItems: "center", justifyContent: "center", border: "0" }}
            aria-labelledby="sign-in-form"
            aria-describedby="use-this-form-to-sign-in"
            open={props.formOpen}
            onClose={props.formHandleClose}
        >
            <ClickAwayListener onClickAway={props.closeModal}>
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
                            alignItems="center"
                        >
                            {loginType === "create" &&
                                <>
                                    < Grid item sm={12}>
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
                                        value={password}
                                        onChange={handlePasswordChange}
                                    />
                                </FormControl>
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