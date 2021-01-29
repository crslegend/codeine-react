import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, List, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff",
    // position: "absolute",
    position: "fixed",
    zIndex: "unset",
  },
  toolbar: {
    height: "65px",
    flex: "1",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    flexWrap: "nowrap",
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
  },
  codeineLogo: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
  list: {
    display: "flex",
    flexDirection: "row",
  },
}));

const Navbar = ({ navbarItems }) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} elevation={1}>
      <Toolbar className={classes.toolbar}>
        <Link to="/" className={classes.codeineLogo}>
          <Typography variant="h4">
            <strong>codeine</strong>
          </Typography>
        </Link>
        <List className={classes.list}>{navbarItems}</List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
