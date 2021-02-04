import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
}));

const AdminPasswordPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography>AdminPasswordPage</Typography>
    </div>
  );
};

export default AdminPasswordPage;
