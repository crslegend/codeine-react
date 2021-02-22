import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  paper: {
    height: "calc(100vh - 115px)",
  },
}));

const DashboardPage = () => {
  const classes = useStyles();

  return <div>Dashboard Page</div>;
};

export default DashboardPage;
