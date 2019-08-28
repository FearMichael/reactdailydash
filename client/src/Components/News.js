import React, { useContext, useEffect, useState, useReducer } from 'react';

import moment from "moment";

import {
    Card, CardContent, Typography, CardActions, Box,
    Button, CardMedia, CardActionArea, FormControl, InputLabel, Input, Divider
} from "@material-ui/core";

import NotificationContext from "./Context/NotificationContext";
// import NotificationSnackbar from "./NotificationSnackbar";
// import NotificationProvider from "./NotificationProvider";
import { UPDATE_NOTIFICATION } from './Reducers/NotificationsReducer';
import NotificationsReducer from "./Reducers/NotificationsReducer";
import NewsItem from "./NewsItem";
import axios from 'axios';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles({
    dividerStyle: {
        marginTop: "1.5em",
        marginBottom: "1.5em"
    },
    buttonStyle: {
        justifyContent: "center"
    }
});

const News = props => {

    const classes = useStyles();

    const [search, updateSearch] = useState("");

    // const [showImg, updateShowImg] = useState(true);

    const [news, updateNews] = useState()

    const [newsToShow, updateNewsToShow] = useState(3);

    const [state, notificationDispatch] = useContext(NotificationContext);

    const showMore = () => {
        news.length > newsToShow ? updateNewsToShow(newsToShow + 3) : updateNewsToShow(news.length);
    }

    const handleChange = (event) => {
        updateSearch(event.target.value);
    };

    const fetchData = () => {

        // axios.post("/api/news", search).then(newsData => {
        //     console.log(newsData.data.articles);    
        // updateNews(newsData.data.articles);
        // })

        let url = "/api/news";
        let data = search;
        if (search === "") {
            notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Please enter a valid search term" } })
        } else {
            props.getInfo(url, { news: data }).then(newsData => {
                console.log(newsData.data.articles)
                if (newsData.data.articles.length < 1) {
                    notificationDispatch({ type: UPDATE_NOTIFICATION, notification: { open: true, message: "Hmm, looks like we couldn't find any news for that search" } })
                } else {
                    updateNews(newsData.data.articles);
                }
            })
        }
    }

    let content = (

        <Card>
            <CardContent>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image="./images/news.jpg"
                        title="news"
                    />
                </CardActionArea>
                <Typography variant="h5" component="h2">
                    The News
                </Typography>
                {/* <Typography variant="body2" component="p"> */}
                {news ?
                    news.slice(0, newsToShow).map((newsItem, i) => {
                        return (
                            <div key={i}>
                                <NewsItem
                                    alt={newsItem.title}
                                    image={newsItem.urlToImage}
                                    title={newsItem.title}
                                    url={newsItem.url}
                                    content={newsItem.content}
                                    date={moment(newsItem.publishedAt).fromNow()}
                                />
                                <Divider classes={{ root: classes.dividerStyle }} />
                            </div>
                        )
                    })
                    : null}
                {news ?
                    <Box display="flex" justifyContent="center">
                        <Button size="small" onClick={showMore}>Show More</Button>
                    </Box>
                    : null}

            </CardContent>
            <Box display="flex" justifyContent="center" mb={1}>
                <FormControl>
                    <InputLabel htmlFor="my-input">News Search</InputLabel>
                    <Input id="my-input" aria-describedby="my-helper-text" onChange={handleChange} />
                </FormControl>
                <Button size="large" onClick={fetchData}>Get News</Button>
            </Box>
        </Card>
    )
    return content;
}

export default News;