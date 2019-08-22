import React, { useContext, useState } from 'react';
import {
  Card, CardContent, Typography, CardActions, Paper, MenuItem, Popper, Box,
  Button, CardMedia, CardActionArea, FormControl, InputLabel, Input
} from "@material-ui/core";

import NotificationContext from "./Context/NotificationContext"
import { UPDATE_NOTIFICATION } from "./Reducers/NotificationsReducer"

const Stocks = (props) => {

  const [anchorEl, updateAnchorEl] = useState(null);

  //variables
  const [search, updateSearch] = useState("");

  const [stocks, updateStocks] = useState();

  const [autoComplete, updateAutoComplete] = useState("");

  const [autoCompleteList, updateAutoCompleteList] = useState();

  let searchTimer = null;

  const handleChange = (event) => {
    console.log(event.currentTarget);
    updateAnchorEl(event.currentTarget);
    updateSearch(event.currentTarget.value)
    updateAutoComplete(event.currentTarget.value);
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => fetchAutoComplete(event), 200);
    console.log(search)
  }

  const [state, notificationDispatch] = useContext(NotificationContext);

  // console.log(notificationDispatch);
  //functions
  const fetchData = () => {
    console.log(search);
    let url = "/api/stocks";
    if (search === "" || undefined) {
      notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a valid search term" } })
    } else {
      props.getInfo(url, { stock: search }).then(stockData => {
        console.log(stockData.data.defaultKeyStatistics);
        // console.log(stocks.data.defaultKeyStatistics["52WeekChange"])
        // Object.keys(stocks.defaultKeyStatistics).forEach(key => console.log(stocks.defaultKeyStatistics[key]));
        updateStocks(stockData.data);
        updateAutoCompleteList(null);
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
    console.log("auto complete click");
    console.log(item);
    updateSearch(item);
    let url = "/api/stocks"
    // props.getInfo(url, { search: item }).then(stockData => {
    // })
    fetchData();
  };

  const dataCheck = (data) => {
    return data ? data : "Not Available";
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
        {stocks ?
          <Box>
            <Typography variant="body2" component="p">Profits: {dataCheck(stocks.defaultKeyStatistics.profitMargins.fmt)}</Typography>
            <Typography variant="body2" component="p">52 Week Change: {dataCheck(stocks.defaultKeyStatistics["52WeekChange"].fmt)} </Typography>
            <Typography variant="body2" component="p">Sector: {dataCheck(stocks.summaryProfile.sector)} </Typography>
            {/* <Typography variant="body2" component="p">Profits: {dataCheck(stocks.nothingReal)} </Typography> */}
          </Box>
          : null}
      </CardContent>
      <CardActions>
        <FormControl >
          <InputLabel htmlFor="my-input">Check Stocks</InputLabel>
          <Input id="my-input" aria-describedby="search for Stocks!" onChange={handleChange} />
          {autoCompleteList ?
            <Popper anchorEl={anchorEl} open={autoCompleteList ? true : false}>
              <Paper square>{
                autoCompleteList.map(elem => {
                  return <MenuItem key={elem.symbol} onClick={() => autoCompleteClick(elem.symbol)}>{elem.symbol}</MenuItem>
                })}
              </Paper>
            </Popper>
            : null}
        </FormControl>
        <Button size="large" onClick={fetchData}>Get Stocks</Button>
      </CardActions>
    </Card>
  )
  return content;
}

export default Stocks;