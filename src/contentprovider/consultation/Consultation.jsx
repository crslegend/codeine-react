import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    paddingTop: "100px",
    marginLeft: "300px",
  },
}));

const Consultation = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h1"> Upcoming schedule at a glance</Typography>
    </div>
  );
};

export default Consultation;
