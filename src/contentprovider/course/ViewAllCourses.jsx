import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import { Add } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    height: 50,
    "&:hover": {
      color: "#000",
    },
  },
}));

const ViewAllCourses = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <PageTitle title="Your Courses" />
        <Button
          variant="contained"
          startIcon={<Add />}
          className={classes.addButton}
          onClick={() => history.push("/content-provider/home/content/new")}
        >
          Create New Course
        </Button>
      </div>
    </Fragment>
  );
};

export default ViewAllCourses;
