import React, { useContext, useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, CardActions, Grid, Grow, Checkbox, Box, List, ListItem, ListItemText,
    Button, CardMedia, CardActionArea, FormControl, InputLabel, Input
} from "@material-ui/core";
import { AddCircle } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import NotificationContext from "./Context/NotificationContext";
import FirebaseContext from './Context/FirebaseContext';
import Fullscreen from "@material-ui/icons/Fullscreen";
import FullscreenExit from "@material-ui/icons/FullscreenExit";

const coolGreen = "linear-gradient(45deg, #8CD790 30%, #AAFCB8 90%)"
const useStyles = makeStyles({
    addButton: {
        background: coolGreen,
        margin: "1rem, 1rem, 0, 0",
        "&:hover": {
            boxShadow: "0 0 0.5rem 0.25rem #6D676E"
        }
    },
    plusIcon: {
        margin: "0 auto",
        color: "#8CD790",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "#6D676E",
            borderRadius: "25%"
        }
    },
    deleteButton: {
        color: "#C41E3D"
    },
    listItem: {
        "&:hover": {
            backgroundColor: "#E1E1E1"
        }
    },
    listText: {
        textDecoration: "line-through"
    },
    invisible: {
        visibility: "hidden"
    },
    icon: {
        margin: "0.5rem 0.5rem 0 0",
        "&:hover": {
            cursor: "pointer"
        }
    }
});


const Tasks = props => {

    const classes = useStyles();

    const firebase = useContext(FirebaseContext);

    const [taskItem, updateTaskItem] = useState();

    const [hoverVis, updateHoverVis] = useState("");

    const [showAdd, updateShowAdd] = useState(true);

    const [checkedItems, updateCheckedItems] = useState([]);

    const [editItem, updateEditItem] = useState("");

    const mouseIn = (identifier) => {
        updateHoverVis(identifier.toString())
    };

    const mouseOut = (identifier) => {
        updateHoverVis("")
    };

    const deleteItem = (taskId) => {
        firebase.deleteTask(taskId).then(() => console.log("Deleted"));
    };

    const editItems = (elementId, elementName) => {
        updateEditItem(elementId);
        updateTaskItem(elementName);
    };

    const handleCheck = (taskName, currentCompleted, taskId) => {
        firebase.updateTask(taskName, !currentCompleted, taskId).then(data => console.log(data))
    };

    const handleChange = (stateItem, event) => {
        switch (stateItem) {
            case "taskItem":
                return updateTaskItem(event.target.value);
            case "showAdd":
                return updateShowAdd(event.target.value);
            default:
                return console.log("Error... no item provided to update")
        }
    };

    const saveEdit = (taskName, currentCompleted, taskId) => {
        firebase.updateTask(taskName, currentCompleted, taskId).then(data => {
            updateEditItem("");
        });

    }

    const addTaskItem = () => {
        firebase.addTask(taskItem).then(newTasks => console.log(newTasks));
    }

    const fetchData = () => {
        updateShowAdd(false);
    };


    useEffect(() => {
        fetchData();
    }, [firebase.userData])

    let content = (
        <Card>
            <Box className={classes.icon} display="flex" flexDirection="row-reverse">
                {props.sizeChange.fullScreen.includes("tasks") ?
                    <FullscreenExit
                        onClick={() => props.sizeChange.decreaseSize("tasks")} />
                    :
                    <Fullscreen
                        onClick={() => props.sizeChange.increaseSize("tasks")} />
                }
            </Box>
            <CardContent>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image="./images/task_list.jpg"
                        title="news"
                    />
                </CardActionArea>
                <Typography variant="h5" component="h2" className="cardHeader">
                    Your Tasks:
                        </Typography>
                <Typography variant="body2" component="div">
                    {firebase.userData && firebase.userData.tasks &&
                        <List> {
                            firebase.userData.tasks.map(elem => {
                                return (
                                    <ListItem key={elem.id} className={classes.listItem} onMouseEnter={() => mouseIn(elem.id)} onMouseLeave={() => mouseOut(elem.id)} >
                                        {editItem !== elem.id ?
                                            <>
                                                <Checkbox checked={elem.completed} onChange={() => { handleCheck(elem.name, elem.completed, elem.id) }} />
                                                <ListItemText className={checkedItems.includes(elem.id) ? classes.listText : null}>{elem.name}</ListItemText>
                                            </>
                                            :
                                            <Grow in={editItem === elem.id ? true : false} timeout={600}>
                                                <Grid container alignContent="center">
                                                    <Grid item sm={12} md={6} lg={6}>
                                                        <FormControl>
                                                            <Input aria-describedby="add task" value={taskItem} onChange={(e) => handleChange("taskItem", e)} />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sm={12} md={6} lg={6}>
                                                        <Button
                                                            disabled={taskItem ? false : true}
                                                            className={classes.addButton}
                                                            size="small" onClick={() => saveEdit(taskItem, elem.completed, elem.id)}
                                                            aria-label="submit add task">
                                                            Save</Button>
                                                    </Grid>
                                                </Grid>
                                            </Grow>
                                        }
                                        <>
                                            <Button
                                                className={classes.editButton}
                                                style={hoverVis !== elem.id ? { visibility: "hidden" } : { visibility: "visible" }}
                                                onClick={() => editItems(elem.id, elem.name)}>
                                                Edit</Button>

                                            <Button
                                                className={classes.deleteButton}
                                                style={hoverVis !== elem.id ? { visibility: "hidden" } : { visibility: "visible" }}
                                                onClick={() => deleteItem(elem.id)}>
                                                Delete</Button>
                                        </>
                                    </ListItem>
                                )
                            })}
                        </List>
                    }
                </Typography>
            </CardContent>
            <Box display="flex" justifyContent="center" mb={1}>
                {firebase.userData ?
                    <CardActions>
                        {showAdd ?
                            <Grow in={showAdd} timeout={600}>
                                <Grid container alignContent="center">
                                    <Grid item sm={12} md={6} lg={6}>
                                        <FormControl>
                                            <InputLabel htmlFor="my-input">Add Task</InputLabel>
                                            <Input aria-describedby="add task" onChange={(e) => handleChange("taskItem", e)} />
                                        </FormControl>
                                    </Grid>
                                    <Grid item sm={12} md={6} lg={6}>
                                        <Button
                                            disabled={taskItem ? false : true}
                                            className={classes.addButton}
                                            size="small" onClick={addTaskItem}
                                            aria-label="submit add task">
                                            Add</Button>
                                    </Grid>
                                </Grid>
                            </Grow>
                            : <AddCircle
                                className={classes.plusIcon}
                                fontSize="large"
                                onClick={() => updateShowAdd(true)}
                                aria-label="open add task form">
                            </AddCircle>
                        }
                    </CardActions>
                    :
                    <Typography variant="body2">Create Account or Login to save tasks</Typography>
                }
            </Box>
        </Card>
    )
    return content;
}

export default Tasks;