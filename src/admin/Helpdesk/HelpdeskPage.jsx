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

const AdminHelpdeskPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography>HELPDESK</Typography>
    </div>
  );
};

export default AdminHelpdeskPage;
