import React, { useContext, useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, CardActions, Zoom, Box,
  Button, CardMedia, CardActionArea, FormControl, InputLabel, Input,
  Table, TableBody, TableCell, TableHead, TableRow, makeStyles
} from "@material-ui/core";

import NotificationContext from "./Context/NotificationContext";
import { UPDATE_NOTIFICATION } from "./Reducers/NotificationsReducer";
import moment from "moment";
import FirebaseContext from "./Context/FirebaseContext";
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: "100%",
  },
  icon: {
    margin: "0.5rem 0.5rem 0 0",
    "&:hover": {
      cursor: "pointer"
    }
  }
}));



const Weather = (props) => {

  const firebase = useContext(FirebaseContext);

  const classes = useStyles();

  const [search, updateSearch] = useState("");

  const [weather, updateWeather] = useState();

  const [weatherLocation, updateWeatherLocation] = useState(null);

  const handleChange = (event) => {
    updateSearch(event.currentTarget.value)
  }

  const notificationDispatch = useContext(NotificationContext)[1];

  const fetchData = () => {
    let url = "/api/weather";
    if (search === "") {
      notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a valid zip code" } })
    } else if (search.length > 5 || search.length < 5) {
      notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a 5 digit zip code" } })
    }
    else {
      firebase.user && firebase.updateSearchData("weather", search);
      props.getInfo(url, { zip: search }).then(weather => {
        updateWeatherLocation(weather.data.zipCodeCityName);
        updateWeather(weather.data.daily.data);
      })
    }
  };

  useEffect(() => {
    firebase.userData && firebase.userData.weather && props.getInfo("/api/weather", { zip: firebase.userData.weather })
      .then(weather => {
        updateWeatherLocation(weather.data.zipCodeCityName);
        updateWeather(weather.data.daily.data)
      }).catch(err => console.log(err));
  }, [firebase.userData]);
  console.log(props);
  //component layout
  let content = (
    <Card>
      <Box className={classes.icon} display="flex" flexDirection="row-reverse">
        {props.sizeChange.fullScreen.includes("weather") ?
          <FullscreenExit
            onClick={() => props.sizeChange.decreaseSize("weather")} />
          :
          <Fullscreen
            onClick={() => props.sizeChange.increaseSize("weather")} />
        }
      </Box>
      <CardContent>
        <CardActionArea>
          <CardMedia
            component="img"
            image="./images/weather.jpg"
            title="weather"
          />
        </CardActionArea>
        <Typography variant="h5" component="h2" className="cardHeader">
          Weather {weatherLocation && `for ${weatherLocation}`}
        </Typography>
        <Box container="true" alignItems="center">
          {weather &&
            <Zoom in={weather ? true : false} timeout={600}>
              <Table >
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>Low</TableCell>
                    {props.rawScreenSize > 379 &&
                      <TableCell>Summary</TableCell>
                    }
                  </TableRow>
                </TableHead>
                <TableBody className={props.screenSize === "small" ? "compactTable" : null}>
                  {weather.map((day) => {
                    return (
                      <TableRow key={day.time}>
                        <TableCell>{moment(day.time, "X").format("MMMM Do")}</TableCell>
                        <TableCell>{Math.round(day.apparentTemperatureHigh)}F</TableCell>
                        <TableCell>{Math.round(day.apparentTemperatureLow)}F</TableCell>
                        {props.rawScreenSize > 379 &&
                          <TableCell>{day.summary}</TableCell>
                        }
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Zoom>
          }
        </Box>
      </CardContent>
      <Box display="flex" justifyContent="center" mb={1}>
        <CardActions>
          <FormControl>
            <InputLabel htmlFor="my-input">Weather by zip code</InputLabel>
            <Input id="my-input" aria-describedby="search for weather" value={search} onChange={handleChange} />
          </FormControl>
          <Button size="large" onClick={fetchData}>Get Weather</Button>
        </CardActions>
      </Box>
    </Card>
  )
  return content;

}

export default Weather;