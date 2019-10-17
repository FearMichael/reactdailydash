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
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    marginLeft: "1rem"
  },
  appBar: {
    backgroundColor: "#455766"
  }
}));

const Nav = (props) => {

  const firebaseAuth = useContext(FirebaseProvider);

  const classes = useStyles();

  // const [user, updateUser] = useState(null)

  const [modal, updateModal] = useState(false);

  const [upload, updateUpload] = useState(false);

  const showUpload = () => {
    console.log(upload);
    updateUpload(!upload);
  };

  const sendPic = e => {
    console.log(e)
    let files = Array.from(e.target.files);
    let formData = new FormData();
    formData.append("avatar", files[0]);
    console.log(formData)
    fetch("/api/imageupload", { method: "POST", body: formData })
      .then(uploadUrl => console.log(uploadUrl))
      .catch(err => console.log(err))
  }

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
  console.log(firebaseAuth.user);

  let content = (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="Menu">
          </IconButton>
          <Box >
            <Avatar alt={firebaseAuth.user || "Default avatar"} src={firebaseAuth.profilePic || "./images/avatarDefault.jpg"} onClick={showUpload} />
            <Typography variant="h6" className={classes.title}>
              {firebaseAuth.user && firebaseAuth.user.name}
            </Typography>
            {upload &&
              <input type="file" onChange={sendPic} multiple />

            }
          </Box>
          <Box display="flex" flexDirection="row-reverse">

            {firebaseAuth.user ?
              <Button color="inherit" onClick={firebaseAuth.signOut}>Sign Out</Button>
              :
              <Button color="inherit" onClick={openModal}>Sign In</Button>
            }
          </Box>
        </Toolbar>
      </AppBar>
      <SignIn formOpen={modal} closeModal={closeModal} />
    </div>
  )
  return content;
}

export default Nav;