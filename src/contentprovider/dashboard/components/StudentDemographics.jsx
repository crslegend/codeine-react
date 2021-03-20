import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    minWidth: "70%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px",
    justifyContent: "center",
    // alignItems: "center",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    width: "200px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "5px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  tooltip: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: theme.spacing(1),
  },
}));

const StudentDemographics = ({ memberDemographics, courseId }) => {
  const classes = useStyles();

  return <div className={classes.root}></div>;
};

export default StudentDemographics;
