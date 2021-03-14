import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import RecentCourses from "./RecentCourses";
import TopPicks from "./TopPicks";
import FeaturedArticles from "./FeaturedArticles";
import Categories from "./Categories";
import RecentProjects from "./RecentProjects";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
    maxWidth: "100vw",
  },
}));

const MemberLandingBody = (props) => {
  const classes = styles();
  const { loggedIn } = props;

  return (
    <Fragment>
      <Grid container className={classes.root}>
        {loggedIn && loggedIn ? (
          <div>
            <RecentCourses />
            <Categories />
            <TopPicks />
          </div>
        ) : (
          <div>
            <FeaturedArticles />
            <RecentProjects />
          </div>
        )}
      </Grid>
    </Fragment>
  );
};

export default MemberLandingBody;
