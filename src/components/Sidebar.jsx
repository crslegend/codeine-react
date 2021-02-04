import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Drawer, List } from "@material-ui/core";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    height: "calc(100vh - 70px)",
    bottom: 0,
    position: "absolute",
  },
  drawerPaper: {
    width: drawerWidth,
    height: "calc(100vh - 70px)",
    bottom: 0,
    position: "absolute",
    // backgroundColor: theme.palette.primary.main,
  },
  drawerContent: {
    display: "flex",
    flexDirection: "column",
  },
}));

const Sidebar = ({ head, list }) => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.drawerContent}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {head}
        </div>
        <List style={{ marginTop: "20px" }}>{list}</List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
