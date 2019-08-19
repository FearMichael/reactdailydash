import React, { useContext, useEffect, useState } from 'react';
import {
    Card, CardContent, Typography, CardActions, Grid, Grow, Checkbox, List, ListItem, ListItemText,
    Button, CardMedia, CardActionArea, FormControl, InputLabel, Input
} from "@material-ui/core";
import { AddCircle } from "@material-ui/icons"
import { makeStyles } from "@material-ui/styles"
import NotificationContext from "./Context/NotificationContext";

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
    }
});


const Tasks = props => {

    const classes = useStyles();

    const [showImg, updateShowImg] = useState(true);

    const [state, notificationDispatch] = useContext(NotificationContext);

    const [taskItem, updateTaskItem] = useState();

    const [tasks, updateTasks] = useState(["Groceries", "Feed Dog", "Feed Cat"]);

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

    const deleteItem = (identifier) => {
        updateTasks(tasks.filter(elem => elem !== identifier))
        console.log(tasks);
    };

    const editItems = (element) => {
        if (element === taskItem) {
            updateEditItem("");
            updateTaskItem("");
        } else {
            updateEditItem(element);
            updateTaskItem(element);
        }
    }

    const handleCheck = (event, identifier) => {
        let checked = !event.target.checked
        if (checked === false) {
            updateCheckedItems([...checkedItems, identifier]);
        } else if (checked === true) {
            updateCheckedItems(checkedItems.filter(elem => elem !== identifier));
        }
        console.log(checkedItems);
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

    const saveEdit = (elem) => {
        let index = tasks.indexOf(elem)
        let editedArr = [...tasks];
        editedArr[index] = taskItem;
        updateTasks(editedArr);
        updateEditItem("");
    }

    const fetchData = () => {
        console.log("Fake Fetch");
        // let url = "/api/tasks";
        // props.getInfo(url).then(tasks => {
        //     updateTasks(tasks);
        // })
        if (taskItem) {
            updateTasks([...tasks, taskItem]);
        }
        updateShowAdd(false);
    };


    useEffect(() => {
        fetchData();
        console.log(tasks);
        console.log(taskItem)
    }, [])

    let content = (
        <Card>
            <CardContent>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image="./images/task_list.jpg"
                        title="news"
                    />
                </CardActionArea>
                <Typography variant="h5" component="h2">
                    Your Tasks:
                        </Typography>
                <Typography variant="body2" component="div">
                    {tasks.length > 0 ?
                        <List> {
                            tasks.map((elem, i) => {
                                return (
                                    <ListItem key={i} className={classes.listItem} onMouseEnter={() => mouseIn(i)} onMouseLeave={() => mouseOut(i)} >
                                        {editItem !== elem ?
                                            <>
                                                <Checkbox checked={checkedItems.includes(i) ? true : false} onChange={(event) => { handleCheck(event, i) }} />
                                                <ListItemText className={checkedItems.includes(i) ? classes.listText : null}>{elem}</ListItemText>
                                            </>
                                            :
                                            <Grow in={editItem === elem ? true : false} timeout={600}>
                                                <Grid container alignContent="center">
                                                    <Grid item sm={12} md={6} lg={6}>
                                                        <FormControl>
                                                            {/* <InputLabel htmlFor="my-input">Add Task</InputLabel> */}
                                                            <Input aria-describedby="add task" value={taskItem} onChange={(e) => handleChange("taskItem", e)} />
                                                        </FormControl>
                                                    </Grid>
                                                    <Grid item sm={12} md={6} lg={6}>
                                                        <Button disabled={taskItem ? false : true} className={classes.addButton} size="small" onClick={() => saveEdit(elem)} aria-label="submit add task">Save</Button>
                                                    </Grid>
                                                </Grid>
                                            </Grow>
                                        }
                                        <>
                                            <Button className={classes.editButton} style={hoverVis !== i.toString() ? { visibility: "hidden" } : { visibility: "visible" }} onClick={() => { editItems(elem) }}>Edit</Button>
                                            <Button className={classes.deleteButton} style={hoverVis !== i.toString() ? { visibility: "hidden" } : { visibility: "visible" }} onClick={() => deleteItem(elem)}>Delete</Button>
                                        </>
                                    </ListItem>
                                )
                            })}
                        </List>
                        : null}
                </Typography>
            </CardContent>
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
                                <Button disabled={taskItem ? false : true} className={classes.addButton} size="small" onClick={fetchData} aria-label="submit add task">Add</Button>
                            </Grid>
                        </Grid>
                    </Grow>
                    : <AddCircle className={classes.plusIcon} fontSize="large" onClick={() => updateShowAdd(true)} aria-label="open add task form"></AddCircle>
                }
            </CardActions>
        </Card>
    )
    return content;
}

export default Tasks;