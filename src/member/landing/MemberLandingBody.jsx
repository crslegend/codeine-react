import React, { Fragment } from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";
import landingmodel from "../../assets/member-landing-model.jpg";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
    maxWidth: "100vw",
  },
  banner: {
    backgroundColor: "#437FC7",
    height: "55vh",
    paddingTop: "8vh",
    paddingLeft: "30px",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "5vh",
      paddingLeft: "0px",
      height: "65vh",
    },
  },
  bannerslogan1: {
    color: "#E5E5E5",
    fontWeight: 700,
  },
  bannerslogan2: {
    color: "#E5E5E5",
    paddingTop: "1vh",
    fontWeight: 700,
    fontSize: "60px",
    [theme.breakpoints.down("md")]: {
      fontSize: "45px",
      lineHeight: "60px",
    },
  },
  bannersentence1: {
    color: "#E5E5E5",
    paddingTop: "2vh",
  },
  bannersentence2: {
    color: "#E5E5E5",
    paddingBottom: "6vh",
    [theme.breakpoints.down("md")]: {
      paddingBottom: "3.5vh",
    },
  },
  bannerbutton: {
    backgroundColor: "#FFFFFF",
    color: "#437FC7",
    marginLeft: "1vw",
    width: "220px",
    height: "60px",
    fontWeight: 700,
    fontSize: "20px",
    "&:hover": {
      backgroundColor: "#164D8F",
      color: "#FFFFFF",
    },
    [theme.breakpoints.down("md")]: {
      fontSize: "16px",
      width: "180px",
      height: "50px",
    },
  },
  bannerphoto: {
    marginLeft: "45px",
    height: "38vh",
    borderRadius: "50%",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0.5vw",
      marginTop: "2vh",
      height: "32vh",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "2vw",
      height: "30vh",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "35vw",
    },
  },
}));

const MemberLandingBody = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid container className={classes.banner}>
          <Grid item xs={1} />
          <Grid item xs={11} sm={5} md={6} lg={7}>
            <Typography variant="subtitle1" className={classes.bannerslogan1}>
              HUSTLE ON
            </Typography>
            <Typography className={classes.bannerslogan2}>
              Coding made addictive!
            </Typography>
            <Typography variant="h3" className={classes.bannersentence1}>
              Kickstart your coding journey with Codeine. Join the
            </Typography>
            <Typography variant="h3" className={classes.bannersentence2}>
              millions who are learning to code!
            </Typography>
            <Button variant="fill" className={classes.bannerbutton}>
              Our Courses
            </Button>
          </Grid>
          <Grid item xs={3}>
            <img
              src={landingmodel}
              className={classes.bannerphoto}
              alt="Landing Page Model"
            />
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default withStyles(styles)(MemberLandingBody);
