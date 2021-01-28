import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: theme.palette.primary.main,
    paddingTop: "100px",
  },
}));

const FirstSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography>HELLOW</Typography>
    </div>
  );
};

export default FirstSection;
