import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import RecentCourses from "./RecentCourses";
import FeaturedArticles from "./FeaturedArticles";
import CodeReview from "./CodeReview";
import Categories from "./Categories";
import RecentProjects from "./RecentProjects";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
    maxWidth: "100vw",
  },
  banner: {
    backgroundColor: "#437FC7",
    height: "40vh",
    paddingTop: "5vh",
    paddingLeft: "30px",
    [theme.breakpoints.down("sm")]: {
      paddingTop: "5vh",
      paddingLeft: "0px",
      height: "65vh",
    },
  },
  bannerslogan1: {
    color: "#E5E5E5",
    fontWeight: 600,
  },
  bannerslogan2: {
    color: "#E5E5E5",
    paddingTop: "1vh",
    fontWeight: 700,
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
    width: 150,
    fontWeight: 600,
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
    height: "30vh",
    borderRadius: "50%",
    [theme.breakpoints.down("md")]: {
      marginLeft: "0.5vw",
      marginTop: "2vh",
      height: "28vh",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "2vw",
      height: "25vh",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "30vw",
    },
  },
}));

const MemberLandingBody = (loggedIn) => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        {loggedIn && loggedIn.loggedIn ? (
          <div>
            <RecentCourses />
            <FeaturedArticles />
            <CodeReview />
          </div>
        ) : (
          <div>
            <Categories />
            <RecentProjects />
          </div>
        )}
      </Grid>
    </Fragment>
  );
};

export default MemberLandingBody;
