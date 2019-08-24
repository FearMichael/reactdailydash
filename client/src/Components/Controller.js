import React, { useContext, useEffect, useState } from 'react';
import { Grid } from "@material-ui/core"
import axios from 'axios'
import News from './News';
import Stocks from './Stocks';
import Tasks from './Tasks';
import Weather from './Weather';

const Controller = props => {

    const apiPost = (route, data) => {
        // function escapeRegExp(string) {
        //     return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
        // };
        return axios.post(route, data);
    };

    // const db = (collection, data) => {
    //     return database.collection(collection)
    // }

    const db = {
        // collections: (collection, data) => {
        //     return database.collection(collection)
        // },
        // addData: (collection, data) => {
        //     return database.collection(collection).add(data);
        // }
    }

    let content = (
        <div>
            <Grid container spacing={2}>
                <Grid item sm={12} md={6} lg={6}>
                    <News getInfo={apiPost} db={db} />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                    <Stocks getInfo={apiPost} db={db} />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                    <Weather getInfo={apiPost} db={db} />
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                    <Tasks getInfo={apiPost} db={db} />
                </Grid>
            </Grid>
        </div>
    )
    return content;
}

export default Controller;