import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  oot: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
}));

const ContentProviderLanding = () => {
  const classes = useStyles();
  const location = useLocation();

  return (
    <div className={classes.root}>
      <Navbar location={location} />
    </div>
  );
};

export default ContentProviderLanding;
