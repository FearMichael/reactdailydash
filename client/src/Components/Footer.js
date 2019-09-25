import React from 'react';

import { makeStyles, Box, Typography } from "@material-ui/core";
import Copyright from "@material-ui/icons/Copyright";

const useStyles = makeStyles({
    footer: {
        marginTop: "2rem",
        backgroundColor: "#455766",
        color: "rgb(240,240,240)",
        height: "2rem",
        padding: "0.5rem",
    },
    icon: {
        margin: "auto 0.5rem"
    }
})

function Footer(props) {

    const classes = useStyles();

    return (
        <footer className={classes.footer}>
            <Box display="flex" alignItems="center" justifyContent="center" textAlign="center">
                <Typography variant="h5" display="inline">Daily Dash</Typography> <Copyright className={classes.icon} />
            </Box>
        </footer>
    )

}

export default Footer;