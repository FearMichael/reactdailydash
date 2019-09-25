import React, { useContext, useState, useEffect } from 'react';
import {
  Card, CardContent, Typography, CardActions, Paper, MenuItem, Popper, Box,
  Button, CardMedia, CardActionArea, FormControl, InputLabel, Input, makeStyles
} from "@material-ui/core";

import NotificationContext from "./Context/NotificationContext";
import { UPDATE_NOTIFICATION } from "./Reducers/NotificationsReducer";
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";
import FirebaseContext from "./Context/FirebaseContext";

const useStyles = makeStyles(theme => ({
  icon: {
    margin: "0.5rem 0.5rem 0 0",
    "&:hover": {
      cursor: "pointer"
    }
  }
}));

const Stocks = (props) => {

  const firebase = useContext(FirebaseContext);

  const classes = useStyles();

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
    console.log(anchorEl)
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
      firebase.updateSearchData("stocks", search);
      props.getInfo(url, { stock: search }).then(stockData => {
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
    updateSearch(item);
    fetchData();
  };

  const dataCheck = (data) => {
    return data ? data : "Not Available";
  };

  useEffect(() => {
    if (firebase.userData) {
      let url = "/api/stockautocomplete"
      props.getInfo(url, { search: firebase.userData.stocks }).then(listData => {
        updateAutoCompleteList(listData.data);
        console.log(listData.data);
      })
    }
  }, [firebase.userData]);

  //component layout
  let content = (
    <Card>
      <Box className={classes.icon} display="flex" flexDirection="row-reverse">
        {props.sizeChange.fullScreen.includes("stocks") ?
          <FullscreenExit
            onClick={() => props.sizeChange.decreaseSize("stocks")} />
          :
          <Fullscreen
            onClick={() => props.sizeChange.increaseSize("stocks")} />
        }
      </Box>
      <CardContent>
        <CardActionArea>
          <CardMedia
            component="img"
            image="./images/stocks.jpg"
            title="stocks"
          />
        </CardActionArea>
        <Typography variant="h5" component="h2" className="cardHeader">
          The Stocks
        </Typography>
        {stocks ?
          <Box>
            <Typography variant="body2" component="p">Profits: {dataCheck(stocks.defaultKeyStatistics.profitMargins.fmt)}</Typography>
            <Typography variant="body2" component="p">52 Week Change: {dataCheck(stocks.defaultKeyStatistics["52WeekChange"].fmt)} </Typography>
            <Typography variant="body2" component="p">Sector: {dataCheck(stocks.summaryProfile.sector)} </Typography>
          </Box>
          : null}
      </CardContent>
      <Box display="flex" justifyContent="center" mb={1}>
        <CardActions>
          <FormControl >
            <InputLabel htmlFor="my-input">Check Stocks</InputLabel>
            <Input id="my-input" aria-describedby="search for Stocks!" value={search} onChange={handleChange} />
            {autoCompleteList &&
              <Popper anchorEl={anchorEl} open={autoCompleteList ? true : false}>
                <Paper square>{
                  autoCompleteList.map(elem => {
                    return <MenuItem key={elem.symbol} onClick={() => autoCompleteClick(elem.symbol)}>{elem.symbol}</MenuItem>
                  })}
                </Paper>
              </Popper>
            }
          </FormControl>
          <Button size="large" onClick={fetchData}>Get Stocks</Button>
        </CardActions>
      </Box>
    </Card>
  )
  return content;
}

export default Stocks;