import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "30px",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "0px",
    },
  },
  heading: {
    color: "#437FC7",
    fontSize: "42px",
    lineHeight: "50px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "32px",
    },
  },
}));

const FeaturedArticles = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography className={classes.heading}>FEATURED</Typography>
          <Typography className={classes.heading}>ARTICLES</Typography>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default FeaturedArticles;
