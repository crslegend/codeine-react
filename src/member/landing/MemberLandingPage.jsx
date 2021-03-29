import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../MemberNavBar";
import { useHistory } from "react-router-dom";
import { Button, ListItem, Typography } from "@material-ui/core";

import MemberLandingBody from "./MemberLandingBody";
import Footer from "./Footer";

import logo from "../../assets/codeineLogos/Member.svg";

import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
    //backgroundColor: "#EDEFEA",
  },
  listItem: {
    width: "100%",
    padding: 10,
    borderLeft: "5px solid #fff",
    "&:hover": {
      backgroundColor: "#F4F4F4",
      borderLeft: "5px solid #F4F4F4",
    },
  },
  listIcon: {
    marginLeft: "15px",
    marginRight: "20px",
  },
  activeLink: {
    width: "100%",
    padding: 10,
    color: theme.palette.primary.main,
    backgroundColor: "#F4F4F4",
    borderLeft: "5px solid",
    "&:hover": {
      borderLeft: "5px solid #437FC7",
    },
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    fontSize: "60px",
  },
  navHome: {
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  },
}));

const MemberLandingPage = () => {
  const classes = useStyles();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  return (
    <div className={classes.root}>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <MemberLandingBody loggedIn={loggedIn} />
      <Footer />
    </div>
  );
};

export default MemberLandingPage;
