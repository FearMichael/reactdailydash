import React, { useContext, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import SignIn from "./SignIn";
import FirebaseProvider from "./Context/FirebaseContext";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid"
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
    backgroundColor: "#455766",
    padding: "0.5rem 0"
  },
  uploadButton: {
    backgroundColor: "white",
    padding: "0.25rem"
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
        firebaseAuth.addProfilePic(uploadData.data)
          .then(data => { updateUpload(false) })
          .catch(err => console.log("Error add profile picture to database", err))
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
          <Grid container style={{ width: "70%" }}>
            <Grid item sm={1}>
              <Avatar alt="avatar" src={(firebaseAuth.userData && firebaseAuth.userData.profilePic) || "./images/avatarDefault.jpg"} onClick={showUpload} />
            </Grid>
            <Grid item sm={4}>

              <Typography variant="h6">
                {firebaseAuth.user && firebaseAuth.user.name}
              </Typography>

              {upload &&
                <Box>
                  <input type="file" encType="multipart/form-data" onChange={picToSend} name="file" />
                  <Button className={classes.uploadButton} onClick={uploadPicture} disabled={file ? false : true}>Upload</Button>
                </Box>
              }

            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">

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