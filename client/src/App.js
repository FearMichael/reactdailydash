import React from 'react';
import './App.css';
import Nav from './Components/Nav';
// import News from './Components/News'
import Controller from './Components/Controller';
import NotificationSnackbar from "./Components/NotificationSnackbar";
import NotificationProvider from "./Components/NotificationProvider"
import { Container } from "@material-ui/core"

// const SnackContext = createContext("snack");

function App() {

  return (
    <NotificationProvider>
      <Nav />
      <Container>
      <Controller />
      <NotificationSnackbar />
      </Container>
    </NotificationProvider>
  );
}

export default App;
