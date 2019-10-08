import React, { useState } from 'react';
import { Grid } from "@material-ui/core";
import axios from 'axios'
import News from './News';
import Stocks from './Stocks';
import Tasks from './Tasks';
import Weather from './Weather';


const Controller = props => {

    const apiPost = (route, data) => {
        return axios.post(route, data);
    };

    const [fullScreen, updateFullScreen] = useState([null]);

    const increaseSize = (item) => {
        updateFullScreen([...fullScreen, item]);
    };

    const decreaseSize = (item) => {
        let filtered = fullScreen.filter(elem => elem !== item);
        updateFullScreen(filtered);
    };

    let content = (
        <Grid
            container
            spacing={1}
        >
            <Grid
                item
                sm={12}
                md={fullScreen.includes("news") ? 12 : 6}
                lg={fullScreen.includes("news") ? 12 : 6}
            >
                <News getInfo={apiPost} sizeChange={{ increaseSize, decreaseSize, fullScreen }} />
            </Grid>
            <Grid
                item
                sm={12}
                md={fullScreen.includes("weather") ? 12 : 6}
                lg={fullScreen.includes("weather") ? 12 : 6}
            >
                <Weather getInfo={apiPost} sizeChange={{ increaseSize, decreaseSize, fullScreen }} />
            </Grid>
            <Grid
                item
                sm={12}
                md={fullScreen.includes("stocks") ? 12 : 6}
                lg={fullScreen.includes("stocks") ? 12 : 6}
            >
                <Stocks getInfo={apiPost} sizeChange={{ increaseSize, decreaseSize, fullScreen }} />
            </Grid>
            <Grid
                item
                sm={12}
                md={fullScreen.includes("tasks") ? 12 : 6}
                lg={fullScreen.includes("tasks") ? 12 : 6}
            >
                <Tasks getInfo={apiPost} sizeChange={{ increaseSize, decreaseSize, fullScreen }} />
            </Grid>
        </Grid>
    )
    return content;
}

export default Controller;