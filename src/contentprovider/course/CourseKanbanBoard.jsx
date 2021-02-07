import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Edit } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 450,
  },
  insideDrawer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(7),
    minHeight: "100vh",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const CourseKanbanBoard = () => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(false);
  };

  return (
    <Fragment>
      <div>
        <Button startIcon={<Edit />} onClick={() => setDrawerOpen(true)}>
          Edit Course Details
        </Button>
      </div>
      <div>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{ paper: classes.drawer }}
        >
          <div className={classes.insideDrawer}>
            <div
              style={{
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconButton>
                <Avatar className={classes.avatar} />
              </IconButton>
            </div>
            <div style={{ marginBottom: "30px" }}>
              <label htmlFor="title">
                <Typography variant="body2">Course Title</Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                placeholder="Enter course title"
                margin="dense"
                fullWidth
              />
            </div>
            <div style={{ marginBottom: "30px" }}>
              <label htmlFor="title">
                <Typography variant="body2">Course Description</Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                placeholder="Enter course description"
                margin="dense"
                fullWidth
                multiline
                rows={2}
              />
            </div>
            <div style={{ marginBottom: "30px" }}>
              <label htmlFor="title">
                <Typography variant="body2">Course Requirements</Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                placeholder="eg. Node.JS, Java EE"
                margin="dense"
                fullWidth
              />
            </div>
            <div style={{ marginBottom: "30px" }}>
              <label htmlFor="title">
                <Typography variant="body2">
                  Course Learning Objectives
                </Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                placeholder="Enter learning objectives"
                margin="dense"
                fullWidth
                multiline
                rows={2}
              />
            </div>
            <div>
              <Button
                variant="contained"
                color="primary"
                style={{ float: "right" }}
              >
                Next
              </Button>
            </div>
          </div>
        </Drawer>
      </div>
    </Fragment>
  );
};

export default CourseKanbanBoard;
