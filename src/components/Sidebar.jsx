import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Drawer, List, ListItem, Typography } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Dashboard } from "@material-ui/icons";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
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
  logo: {
    padding: "30px 50px",
    maxWidth: "100%",
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
    >
      <div className={classes.drawerContent}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ marginTop: "30px", marginBottom: "10px" }}>
            <Avatar className={classes.avatar}>P</Avatar>
          </div>
          <Typography variant="h6">Name here</Typography>
          <Typography variant="body1">Position here</Typography>
        </div>

        <List style={{ marginTop: "20px" }}>
          <ListItem
            component={NavLink}
            to="/member"
            activeClassName={classes.activeLink}
            className={classes.listItem}
            button
          >
            <Dashboard className={classes.listIcon} />
            <Typography variant="h5">Dashboard</Typography>
          </ListItem>
          <ListItem
            component={NavLink}
            to="/industry"
            activeClassName={classes.activeLink}
            className={classes.listItem}
            button
          >
            <Dashboard className={classes.listIcon} />
            <Typography variant="h5">Dashboard</Typography>
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
