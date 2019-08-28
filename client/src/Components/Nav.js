import React, { useContext, useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { ClickAwayListener } from "@material-ui/core";
import SignIn from "./SignIn";
import FirebaseProvider from "./Context/FirebaseContext";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Nav = (props) => {

  const firebaseAuth = useContext(FirebaseProvider);

  const classes = useStyles();

  // const [user, updateUser] = useState(null)

  const [modal, updateModal] = useState(false);

  const openModal = () => {
    console.log("opened")
    updateModal(true)
  };

  const closeModal = () => {
    console.log("closed")
    updateModal(false);
  };

  // useEffect(() => {
  //   updateUser(firebaseAuth.getUser())
  //   console.log(user)
  // }, []);
  console.log(firebaseAuth.user)

  let content = (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="Menu">
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {/* Welcome, {user ? user.email : ":( "} */}
            {`Welcome ${firebaseAuth.user ? firebaseAuth.user.name : " :( "}`}
          </Typography>
          {firebaseAuth.user ?
            <Button color="inherit" onClick={firebaseAuth.signOut}>Sign Out</Button>
            :
            <Button color="inherit" onClick={openModal}>Sign In</Button>
          }
        </Toolbar>
      </AppBar>
      <SignIn formOpen={modal} closeModal={closeModal} />
    </div>
  )
  return content;
}

export default Nav;