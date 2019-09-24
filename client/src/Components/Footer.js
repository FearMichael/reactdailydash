import React from 'react';

import { makeStyles, Box, Typography } from "@material-ui/core";
import Copyright from "@material-ui/icons/Copyright";

const useStyles = makeStyles({
    footer: {
        backgroundColor: "rgb(169,169,169)",
        color: "rgb(240,240,240)",
        height: "2rem",
        width: "100%"
    }
})

function Footer(props) {

    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Box textAlign="center" >
                <Typography>Daily Dash</Typography> <Copyright />
            </Box>

        </footer>
    )

}

export default Footer;