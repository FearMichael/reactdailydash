import React from 'react';

import { Link, Grid, CardMedia, Typography, Box } from "@material-ui/core";

const NewsItem = (props) => {

    return (
        <Grid container spacing={2} alignContent="center" alignItems="center">
            <Grid item sm={12} md={4}>
                <CardMedia component="img" src={props.image}></CardMedia>
            </Grid>
            <Grid item sm={12} md={8}>
                <Link
                    component="a"
                    target="_blank"
                    rel="noreferrer"
                    underline="hover"
                    href={props.url}> {props.title} </Link>
                <Box my={2}><Typography variant="body1" component="p">Published: {props.date} </Typography></Box>
                <Box mb={2}><Typography variant="body1" component="p">{props.content} </Typography></Box>
            </Grid>
        </Grid>
    )

}

export default NewsItem;