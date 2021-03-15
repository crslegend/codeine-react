import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import RecentCourses from "./RecentCourses";
import TopPicks from "./TopPicks";
import FeaturedCourses from "./FeaturedCourses";
import IconPage from "./IconPage";
import Categories from "./Categories";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
    maxWidth: "100%",
  },
}));

const MemberLandingBody = (props) => {
  const classes = styles();
  const { loggedIn } = props;

  return (
    <Fragment>
      <Grid container className={classes.root}>
        {loggedIn && loggedIn ? (
          <div style={{ width: "100%" }}>
            <RecentCourses />
            <Categories />
            <TopPicks />
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <IconPage />
            <Categories />
            <FeaturedCourses />
          </div>
        )}
      </Grid>
    </Fragment>
  );
};

export default MemberLandingBody;
