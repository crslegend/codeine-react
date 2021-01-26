import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    height: "calc(100vh - 68px)",
    bottom: 0,
    position: "absolute",
  },
  drawerPaper: {
    width: drawerWidth,
    height: "calc(100vh - 68px)",
    bottom: 0,
    position: "absolute",
    backgroundColor: theme.palette.primary.main,
  },
  drawerContent: {
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    padding: "30px 50px",
    maxWidth: "100%",
  },
  listItem: {
    borderRadius: "10px",
    margin: "5px 10px",
    width: "calc(100% - 20px)",
    color: "#333030",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  listIcon: {
    marginRight: "20px",
  },
  activeLink: {
    borderRadius: "10px",
    margin: "5px 10px",
    width: "calc(100% - 20px)",
    color: "#FFFFFF",
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  logout: {
    borderRadius: "10px",
    margin: "30px 15px",
    width: "calc(100% - 30px)",
    color: "#FFF",
    backgroundColor: theme.palette.error.main,
    "&:hover": {
      backgroundColor: theme.palette.error.light,
    },
  },
}));

const Sidebar = () => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    ></Drawer>
  );
};

export default Sidebar;
