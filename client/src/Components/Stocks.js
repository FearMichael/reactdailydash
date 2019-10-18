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
// import { useDebouncedCallback } from "use-debounce";

import { debounce } from "lodash";

const useStyles = makeStyles(theme => ({
  icon: {
    margin: "0.5rem 0.5rem 0 0",
    "&:hover": {
      cursor: "pointer"
    }
  },
  stockData: {
    fontSize: "1.25rem",
    marginLeft: "10rem"
  },
  red: {
    color: "#E15554"
  },
  green: {
    color: "#3BB273"
  }
}));

const Stocks = (props) => {

  const firebase = useContext(FirebaseContext);

  const classes = useStyles();

  const [anchorEl, updateAnchorEl] = useState(null);

  // const [debouncedValue] = useDebouncedCallback(() =>)

  //variables
  const [search, updateSearch] = useState("");

  const [stocks, updateStocks] = useState();

  const [autoComplete, updateAutoComplete] = useState("");

  const [autoCompleteList, updateAutoCompleteList] = useState();

  const percentRemover = (item) => {
    return item.toString().slice(0, item.length - 1);

  }

  const handleChange = (event) => {
    let searchTimer = null;
    updateAnchorEl(event.currentTarget);
    updateSearch(event.currentTarget.value)
    updateAutoComplete(event.currentTarget.value);
    // debounce(fetchAutoComplete, 250);
    // clearTimeout(searchTimer);
    debounce(fetchAutoComplete, 300)
    // searchTimer = setTimeout(fetchAutoComplete, 1000 * 5)
  };


  const notificationDispatch = useContext(NotificationContext)[1];

  //functions
  const fetchData = () => {
    let url = "/api/stocks";
    if (search === "" || undefined) {
      notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a valid search term" } })
    } else {
      firebase.userData && firebase.updateSearchData("stocks", search);
      props.getInfo(url, { stock: search }).then(stockData => {
        updateStocks(stockData.data);
        updateAutoCompleteList(null);
      })
    }
  };

  const fetchAutoComplete = () => {
    let url = "/api/stockautocomplete"
    props.getInfo(url, { search: search }).then(listData => {
      updateAutoCompleteList(listData.data);
    })
  }

  const autoCompleteClick = (item) => {
    firebase.userData && firebase.updateSearchData("stocks", search);
    props.getInfo("/api/stocks", { stock: item }).then(stockData => {
      updateStocks(stockData.data);
      updateAutoCompleteList(null);
    })
  };

  useEffect(() => {
    if (firebase.userData && firebase.userData.stocks) {
      let url = "/api/stocks"
      props.getInfo(url, { stock: firebase.userData.stocks }).then(listData => {
        updateStocks(listData.data);
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
        {stocks &&
          <Box>
            {stocks.defaultKeyStatistics.profitMargins ?
              <Typography
                className={percentRemover(stocks.defaultKeyStatistics.profitMargins.fmt) > 0 ? `${classes.stockData} ${classes.green}` : `${classes.stockData} ${classes.red}`}
                variant="body2"
                component="p">
                Profits: {stocks.defaultKeyStatistics.profitMargins.fmt}
              </Typography>
              : <Typography className={classes.stockData} variant="body2" component="p"> Not Available </Typography>}

            {stocks.defaultKeyStatistics["52WeekChange"] ?
              <Typography
                className={percentRemover(stocks.defaultKeyStatistics["52WeekChange"].fmt) > 0 ? `${classes.stockData} ${classes.green}` : `${classes.stockData} ${classes.red}`}
                variant="body2"
                component="p">
                52 Week Change: {stocks.defaultKeyStatistics["52WeekChange"].fmt}
              </Typography>
              : <Typography className={classes.stockData} variant="body2" component="p"> Not Available </Typography>}
            {stocks.summaryDetail ?
              <Typography
                className={classes.stockData}
                variant="body2"
                component="p">
                Previous Closed Value: $ {stocks.summaryDetail.previousClose.fmt}
              </Typography>
              : <Typography className={classes.stockData} variant="body2" component="p"> Not Available </Typography>}
            {stocks.summaryDetail ?
              <Typography
                className={stocks.summaryDetail.previousClose.fmt < stocks.summaryDetail.regularMarketOpen.fmt ? `${classes.stockData} ${classes.green}` : `${classes.stockData} ${classes.red}`}
                variant="body2"
                component="p">
                Market Open Value: $ {stocks.summaryDetail.regularMarketOpen.fmt}
              </Typography>
              : <Typography className={classes.stockData} variant="body2" component="p"> Not Available </Typography>}
            {stocks.summaryDetail ?
              <Typography
                className={stocks.summaryDetail.previousClose.fmt < stocks.summaryDetail.regularMarketOpen.fmt ? `${classes.stockData} ${classes.green}` : `${classes.stockData} ${classes.red}`}
                variant="body2"
                component="p">
                Close to Open Differential: $ {parseFloat(stocks.summaryDetail.regularMarketOpen.fmt - stocks.summaryDetail.previousClose.fmt).toFixed(2)}
              </Typography>
              : <Typography className={classes.stockData} variant="body2" component="p"> Not Available </Typography>}
            {stocks.summaryProfile ?

              <Typography
                className={classes.stockData}
                variant="body2" component="p">
                Sector: {stocks.summaryProfile.sector}
              </Typography>

              : <Typography className={classes.stockData} variant="body2" component="p"> Not Available </Typography>}
            {stocks.symbol ?
              <Typography
                className={classes.stockData}
                variant="body2" component="p">
                Symbol: {stocks.symbol.toUpperCase()}
              </Typography>
              : <Typography className={classes.stockData} variant="body2" component="p"> Not Available </Typography>}


          </Box>
        }
      </CardContent>
      <Box display="flex" justifyContent="center" mb={1}>
        <CardActions>
          <FormControl >
            <InputLabel htmlFor="my-input">Check Stocks</InputLabel>
            <Input fullWidth={true} aria-describedby="search for Stocks!" value={search} onChange={handleChange} />
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