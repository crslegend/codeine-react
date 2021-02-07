import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import {
  BrowserRouter,
  Link,
  NavLink,
  Switch,
  useHistory,
  Route,
  Redirect,
} from "react-router-dom";
import { Avatar, Button, ListItem, Typography } from "@material-ui/core";
import Sidebar from "../components/Sidebar";
import { Dashboard } from "@material-ui/icons";
import Service from "../AxiosService";

import logo from "../assets/content-logo.png";

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
    color: "#6e6e6e",
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
    "& p": {
      fontWeight: 600,
    },
    "&:hover": {
      borderLeft: "5px solid #437FC7",
    },
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    fontSize: "30px",
  },
}));

const ContentProviderHome = () => {
  const classes = useStyles();
  const history = useHistory();

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            history.push("/content-provider");
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const sidebarHead = (
    <Fragment>
      <div style={{ marginTop: "30px", marginBottom: "10px" }}>
        <Avatar className={classes.avatar}>P</Avatar>
      </div>
      <Typography variant="h6">Name here</Typography>
      <Typography variant="body1">Position here</Typography>
    </Fragment>
  );

  const sidebarList = (
    <Fragment>
      <ListItem
        component={NavLink}
        to="/content-provider/dashboard"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="body1">Dashboard</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/content-provider/managecontent"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="body1">Content Management</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/industry"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
        // style={{ position: "fixed", bottom: 5, width: "239px" }}
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="body1">Helpdesk</Typography>
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
        <img src={logo} width="120%" alt="" />
      </Link>
    </Fragment>
  );

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Navbar logo={navLogo} navbarItems={loggedInNavbar} bgColor="#fff" />
        <Sidebar head={sidebarHead} list={sidebarList} />
        <div>
          <Switch>
            <Route
              exact
              path="/content-provider/dashboard"
              render={() => <div></div>}
            />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default ContentProviderHome;
