import React, { Fragment } from "react";
import { Button, ListItem, Typography } from "@material-ui/core";
import logo from "../../assets/codeineLogos/Member.svg";
import { Link } from "react-router-dom";

const loggedOutNavbar = (
  <Fragment>
    <ListItem style={{ whiteSpace: "nowrap" }}>
      <Button
        variant="outlined"
        component={Link}
        to="/partner"
        style={{ textTransform: "capitalize" }}
      >
        <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
          Teach on Codeine
        </Typography>
      </Button>
    </ListItem>
    <ListItem style={{ whiteSpace: "nowrap" }}>
      <Button
        to="/member/login"
        variant="outlined"
        component={Link}
        style={{ textTransform: "capitalize" }}
        color="primary"
      >
        <Typography variant="h6" style={{ fontSize: "15px", color: "#437FC7" }}>
          Log In
        </Typography>
      </Button>
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
      <img src={logo} width="120%" alt="codeine's logo" />
    </Link>
  </Fragment>
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  loggedOutNavbar,
  navLogo,
};
