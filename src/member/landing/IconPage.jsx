import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#000000",
    height: "100vh",
  },
  heading1: {
    marginTop: "20vh",
    color: "#D4D4D4",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  heading2: {
    marginTop: "10px",
    color: "#D4D4D4",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
}));

const IconPage = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h1" className={classes.heading1} style={{}}>
            Not sure where to start?
          </Typography>
          <Typography variant="h1" className={classes.heading2}>
            Find out their Pros & Cons!
          </Typography>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default IconPage;
