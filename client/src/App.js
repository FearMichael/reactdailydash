import React from 'react';
import './App.css';
import Nav from './Components/Nav';
import Footer from "./Components/Footer";
import Controller from './Components/Controller';
import NotificationSnackbar from "./Components/NotificationSnackbar";
import NotificationProvider from "./Components/NotificationProvider"
import { Box } from "@material-ui/core";
import FirebaseProvider from "./Components/FirebaseProvider";

// const SnackContext = createContext("snack");

function App() {

  return (
    <NotificationProvider>
      <FirebaseProvider>
        <Nav />
        <Box>
          <Controller />
          <NotificationSnackbar />
        </Box>
      </FirebaseProvider>
      <Footer />
    </NotificationProvider>
  );
}

export default App;
