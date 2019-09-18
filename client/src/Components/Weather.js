import React, { useContext, useState } from 'react';
import {
  Card, CardContent, Typography, CardActions, Grid, Zoom, Box,
  Button, CardMedia, CardActionArea, FormControl, InputLabel, Input,
  Table, TableBody, TableCell, TableHead, TableRow, makeStyles
} from "@material-ui/core";

import NotificationContext from "./Context/NotificationContext";
import { UPDATE_NOTIFICATION } from "./Reducers/NotificationsReducer";
import moment from "moment";

import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  table: {
    minWidth: "100%",
  },
}));



const Weather = (props) => {

  const classes = useStyles();
  //variables
  const [search, updateSearch] = useState("");

  const [weather, updateWeather] = useState()

  const handleChange = (event) => {
    updateSearch(event.currentTarget.value)
    console.log(search)
  }

  const [state, notificationDispatch] = useContext(NotificationContext);

  // console.log(notificationDispatch);
  //functions
  const fetchData = () => {
    // axios.get("http://dataservice.accuweather.com/forecasts/v1/daily/5day/339474?apikey=yD2AOALJjsPFwnMjt2FozOWwzEp0jG72")
    //   .then(weatherData => {
    //     updateWeather(weatherData.data);
    //     console.log(weatherData.data)
    //   });
    let url = "/api/weather";
    if (search === "") {
      notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a valid zip code" } })
    } else if (search.length > 5 || search.length < 5) {
      notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a 5 digit zip code" } })
    }
    else {
      props.getInfo(url, { zip: search }).then(weather => {
        console.log(weather);
        updateWeather(weather.data);
      })
    }
  }

  //component layout
  let content = (
    <Card>
      <CardContent>
        <CardActionArea>
          <CardMedia
            component="img"
            image="./images/weather.jpg"
            title="weather"
          />
        </CardActionArea>
        <Typography variant="h5" component="h2">
          The Weather
        </Typography>
        <Grid container alignItems="center">
          {weather ?
            <Zoom in={weather ? true : false} timeout={600}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>Low</TableCell>
                    <TableCell>Day</TableCell>
                    <TableCell>Night</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weather.DailyForecasts.map((day, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell>{moment(day.EpochDate, "X").format("MMMM Do")}</TableCell>
                        <TableCell>{day.Temperature.Maximum.Value}{day.Temperature.Minimum.Unit}</TableCell>
                        <TableCell>{day.Temperature.Minimum.Value}{day.Temperature.Minimum.Unit}</TableCell>
                        <TableCell>{day.Day.IconPhrase}</TableCell>
                        <TableCell>{day.Night.IconPhrase}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Zoom>
            : null}
        </Grid>
      </CardContent>
      <Box display="flex" justifyContent="center" mb={1}>
        <CardActions>
          <FormControl>
            <InputLabel htmlFor="my-input">Weather by zip code</InputLabel>
            <Input id="my-input" aria-describedby="search for weather" onChange={handleChange} />
          </FormControl>
          <Button size="large" onClick={fetchData}>Get Weather</Button>
        </CardActions>
      </Box>
    </Card>
  )
  return content;

}

export default Weather;