import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Button,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff",
    // position: "absolute",
    position: "relative",
    zIndex: "unset",
  },
  toolbar: {
    minHeight: "65px",
    flex: "1",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    flexWrap: "nowrap",
    paddingLeft: "60px",
    paddingRight: "60px",
  },
  codeineLogo: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  list: {
    display: "flex",
    flexDirection: "row",
  },
  listItem: {
    whiteSpace: "nowrap",
  },
  listItemLink: {
    textDecoration: "none",
  },
}));

const Navbar = ({ location }) => {
  const classes = useStyles();

  console.log(location);

  const memberNavbar = (
    <Fragment>
      <ListItem className={classes.listItem}>
        <Link to="/" className={classes.listItemLink}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Content Providers
          </Typography>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link to="/" className={classes.listItemLink}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Industry Partners
          </Typography>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link to="/" className={classes.listItemLink}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          component={Link}
          to="/"
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

  return (
    <AppBar className={classes.appBar} elevation={0}>
      <Toolbar className={classes.toolbar}>
        <Link to="/" className={classes.codeineLogo}>
          <Typography variant="h4">codeine</Typography>
        </Link>
        <List className={classes.list}>
          {(() => {
            if (location.pathname === "/") {
              return memberNavbar;
            }
          })()}
        </List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
