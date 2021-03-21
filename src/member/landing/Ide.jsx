import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import ide from "../../assets/ide_asset.png";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "40px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "40px",
    marginBottom: "50px",
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
  },
  heading: {
    marginTop: "10%",
    marginBottom: "30px",
    lineHeight: "50px",
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
          <Typography variant="h3" className={classes.heading}>
            Learning made easy
          </Typography>

          <Typography variant="h5" className={classes.subheading}>
            Deploy your own integrated coding
            <br />
            environment (IDE) in the cloud <br />
            and access it from anywhere
          </Typography>
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
