import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import Calendar from "./Calendar";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    paddingTop: "10px",
    marginLeft: "50px",
  },
}));

const Consultation = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h1" style={{ marginBottom: "50px" }}>
        Upcoming schedule at a glance
      </Typography>
      <Calendar />
    </div>
  );
};

export default Consultation;
