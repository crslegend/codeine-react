import React, { Fragment } from "react";
import { Button, ListItem, Typography } from "@material-ui/core";
import logo from "../../../assets/CodeineLogos/Member.svg";
import { Link } from "react-router-dom";

const memberNavbar = (
  <Fragment>
    <ListItem style={{ whiteSpace: "nowrap" }}>
      <Link to="/partner" style={{ textDecoration: "none" }}>
        <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
          Partners
        </Typography>
      </Link>
    </ListItem>
    {/* <ListItem style={{ whiteSpace: "nowrap" }}>
      <Link to="/industry" style={{ textDecoration: "none" }}>
        <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
          Partners for Enterprise
        </Typography>
      </Link>
    </ListItem> */}
    <ListItem style={{ whiteSpace: "nowrap" }}>
      <Link to="/member/login" style={{ textDecoration: "none" }}>
        <Typography variant="h6" style={{ fontSize: "15px", color: "#437FC7" }}>
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

const loggedInNavbar = (onClickFn) => {
  return (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/home" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Dashboard
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
          onClick={onClickFn}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );
};

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
  memberNavbar,
  loggedInNavbar,
  navLogo,
};
