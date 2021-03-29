import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import pricing from "../../assets/PricingAsset.png";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "50px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "10px",
    marginBottom: "50px",
  },
  heading: {
    marginTop: "20%",
    marginBottom: "20px",
    lineHeight: "40px",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  subheading: {
    marginBottom: "30px",
    fontFamily: "Roboto Mono",
  },
  button: {
    fontFamily: "Roboto Mono",
    textTransform: "none",
    fontWeight: 600,
    fontSize: "18px",
  },
}));

const Pricing = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={5}>
          <img width="80%" alt="ide" src={pricing}></img>
        </Grid>
        <Grid item xs={5}>
          <Typography variant="h3" className={classes.heading}>
            Become our PRO member to
            <br />
            have access to ALL of
            <br />
            our features
          </Typography>

          <Typography variant="h6" className={classes.subheading}>
            ** Register today to enjoy a free premium <br /> membership for 7
            days
          </Typography>

          <Button
            component={Link}
            to="/member/register"
            variant="outlined"
            color="primary"
            className={classes.button}
          >
            Start Free Trial
          </Button>
        </Grid>

        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default Pricing;
