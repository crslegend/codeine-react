import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
  },
}));

const AdminAnalyticsPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography>AdminAnalyticsPage</Typography>
    </div>
  );
};

export default AdminAnalyticsPage;
