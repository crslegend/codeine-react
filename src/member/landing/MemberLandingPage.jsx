import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Button, ListItem, Typography } from "@material-ui/core";

import MemberLandingBody from "./MemberLandingBody";
import Footer from "./Footer";

import logo from "../../assets/logo2.png";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
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
}));

const MemberLandingPage = () => {
  const classes = useStyles();

  const [loggedIn, setLoggedIn] = useState(false);

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/content-provider" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Content Providers
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/industry" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Industry Partners
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          component={Link}
          to="/member/register"
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const memberLoggedInNavbar = (
    <Fragment>
      <Button
        style={{
          backgroundColor: "#437FC7",
          textTransform: "capitalize",
        }}
      >
        <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
          Log Out
        </Typography>
      </Button>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" />
      </Link>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Navbar
        loggedIn={loggedIn}
        logo={navLogo}
        navbarItems={loggedIn ? memberLoggedInNavbar : memberNavbar}
      />
      <MemberLandingBody />
      <Footer />
    </div>
  );
};

export default MemberLandingPage;
