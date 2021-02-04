import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, List, Toolbar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#fff",
    // position: "absolute",
    position: "fixed",
    zIndex: "100",
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

const Navbar = ({ logo, navbarItems }) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} elevation={1}>
      <Toolbar className={classes.toolbar}>
        {logo}
        <List className={classes.list}>{navbarItems}</List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
