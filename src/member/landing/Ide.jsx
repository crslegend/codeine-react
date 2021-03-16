import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";
import ide from "../../assets/ide_asset.png";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "30px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "30px",
    marginBottom: "50px",
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
  },
  heading: {
    marginTop: "10%",
    lineHeight: "50px",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  subheading: {
    margin: "30px 0px",
    fontFamily: "Roboto Mono",
  },
  button: {
    fontFamily: "Roboto Mono",
    textTransform: "none",
    color: "#FFFFFF",
    fontSize: "18px",
    borderColor: "#FFFFFF",
  },
}));

const Ide = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={5}>
          <Typography variant="h2" className={classes.heading}>
            INBUILT IDE
          </Typography>
          <Typography variant="h4" className={classes.subheading}>
            want to access our <br />
            step-by-step coding environment?
          </Typography>
          <Button variant="outlined" className={classes.button}>
            subscribe now
          </Button>
        </Grid>
        <Grid item xs={5}>
          <img width="90%" alt="ide" src={ide}></img>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default Ide;
