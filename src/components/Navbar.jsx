import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, List, Toolbar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    // position: "absolute",
    position: "fixed",
    zIndex: "1000",
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

const Navbar = ({ logo, bgColor, navbarItems, article }) => {
  const classes = useStyles();

  return (
    <AppBar
      className={classes.appBar}
      style={{ backgroundColor: `${bgColor}` }}
      elevation={0}
    >
      <Toolbar className={classes.toolbar}>
        {logo}
        <List className={classes.list}>{navbarItems}</List>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
