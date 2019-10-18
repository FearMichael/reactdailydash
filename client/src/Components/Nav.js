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
import axios from 'axios';


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

  const [file, updateFile] = useState(null);

  const showUpload = () => {
    updateUpload(!upload);
  };

  const picToSend = e => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    updateFile(formData);
  }

  const uploadPicture = () => {
    axios.post("/api/imageupload", file)
      .then(uploadData => {
        firebaseAuth.addProfilePic(uploadData.data).then().catch(err => console.log("Error add profile picture to database", err))
      })
      .catch(err => console.log(err))
  }

  const openModal = () => {
    updateModal(true)
  };

  const closeModal = () => {
    updateModal(false);
  };

  let content = (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="Menu">
          </IconButton>
          <Box >
            <Avatar alt="avatar" src={firebaseAuth.userData && firebaseAuth.userData.profilePic || "./images/avatarDefault.jpg"} onClick={showUpload} />
            <Typography variant="h6" className={classes.title}>
              {firebaseAuth.user && firebaseAuth.user.name}
            </Typography>
            {upload &&
              <Box>
                <input type="file" encType="multipart/form-data" onChange={picToSend} name="file" />
                <Button onClick={uploadPicture} disabled={file ? false : true}>Upload</Button>
              </Box>
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