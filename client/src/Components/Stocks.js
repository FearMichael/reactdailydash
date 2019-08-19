import React, { useContext, useState } from 'react';
import {
  Card, CardContent, Typography, CardActions, MenuList, MenuItem,
  Button, CardMedia, CardActionArea, FormControl, InputLabel, Input
} from "@material-ui/core";

import NotificationContext from "./Context/NotificationContext"
import { UPDATE_NOTIFICATION } from "./Reducers/NotificationsReducer"

const Stocks = (props) => {
  //variables
  const [search, updateSearch] = useState("");

  const [stocks, updateStocks] = useState();

  const [autoComplete, updateAutoComplete] = useState("");

  const [autoCompleteList, updateAutoCompleteList] = useState();

  let searchTimer = null;

  const handleChange = (event) => {
    updateSearch(event.currentTarget.value)
    updateAutoComplete(event.currentTarget.value);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(fetchAutoComplete, 300);
    console.log(search)
  }

  const [state, notificationDispatch] = useContext(NotificationContext);

  // console.log(notificationDispatch);
  //functions
  const fetchData = () => {
    let url = "/api/stocks";
    if (search === "") {
      notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a valid search term" } })
    } else {
      props.getInfo(url, search).then(stocks => {
        console.log(stocks)
        updateStocks(stocks);
      })
    }
  }

  const fetchAutoComplete = () => {
    let url = "/api/stockautocomplete"
    props.getInfo(url, { search: search }).then(listData => {
      updateAutoCompleteList(listData.data);
      console.log(listData.data);
    })
  }

  const autoCompleteClick = (item) => {
    updateSearch(item);
    let url = "/api/stocks"
    props.getInfo(url, { search: item }).then(stockData => {
      updateStocks(stockData.data);
      console.log(stockData.data);
    })
  };

  //component layout
  let content = (
    <Card>
      <CardContent>
        <CardActionArea>
          <CardMedia
            component="img"
            image="./images/stocks.jpg"
            title="stocks"
          />
        </CardActionArea>
        <Typography variant="h5" component="h2">
          The Stocks
        </Typography>
        <Typography variant="body2" component="p">
          Heellloooo Data!!!
        </Typography>
      </CardContent>
      <CardActions>
        <FormControl>
          <InputLabel htmlFor="my-input">Check Stocks</InputLabel>
          <Input id="my-input" aria-describedby="search for weather" onChange={handleChange} />
          {autoCompleteList ?
            <MenuList>{
              autoCompleteList.map(elem => {
                return <MenuItem key={elem.symbol} onClick={() => autoCompleteClick(elem.symbol)}>{elem.symbol}</MenuItem>
              })}
            </MenuList>
            : null}
        </FormControl>
        <Button size="large" onClick={fetchData}>Get Stocks</Button>
      </CardActions>
    </Card>
  )
  return content;
}

export default Stocks;