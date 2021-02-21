import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import {
  BrowserRouter,
  Link,
  NavLink,
  Redirect,
  Switch,
  useHistory,
} from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import { Avatar, Button, ListItem, Typography } from "@material-ui/core";
import Sidebar from "../components/Sidebar";
import { Dashboard, NoteAdd, Timeline } from "@material-ui/icons";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import logo from "../assets/CodeineLogos/Partner.svg";
import Consultation from "./consultation/Consultation";
import ViewAllCourses from "./course/ViewAllCourses";
import CourseCreation from "./course/CourseCreation";
import ViewCourseDetailsPage from "./course/ViewCourseDetailsPage";

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
  mainPanel: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing(12),
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    width: "calc(100% - 240px)",
    marginLeft: "240px",
  },
}));

const ContentProviderHome = () => {
  const classes = useStyles();
  const history = useHistory();

  const [user, setUser] = useState();

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
            history.push("/partner");
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
        <Avatar className={classes.avatar}>
          {user && user.first_name.charAt(0)}
        </Avatar>
      </div>
      <Typography variant="h6">
        {user && user.first_name} {user && user.last_name}
      </Typography>
      {user && user.partner.organization && (
        <Typography variant="body1">
          {user.partner.organization.organization_name}
        </Typography>
      )}
    </Fragment>
  );

  const sidebarList = (
    <Fragment>
      <ListItem
        component={NavLink}
        to="/partner/home/dashboard"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="body1">Dashboard</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/content"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <NoteAdd className={classes.listIcon} />
        <Typography variant="body1">Content Management</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/consultation"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
        // style={{ position: "fixed", bottom: 5, width: "239px" }}
      >
        <Timeline className={classes.listIcon} />
        <Typography variant="body1">Consultation</Typography>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/partner/home/dashboard"
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

  const getUserDetails = () => {
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      // console.log(decoded);
      Service.client
        .get(`/auth/partners/${decoded.user_id}`)
        .then((res) => {
          console.log(res);
          setUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  // console.log(user);

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Navbar logo={navLogo} navbarItems={loggedInNavbar} bgColor="#fff" />
        <Sidebar head={sidebarHead} list={sidebarList} />
        <div className={classes.mainPanel}>
          <Switch>
            <PrivateRoute
              exact
              path="/partner/home/dashboard"
              render={() => <div></div>}
            />
            <PrivateRoute
              exact
              path="/partner/home/content"
              render={() => <ViewAllCourses />}
            />
            <PrivateRoute
              exact
              path="/partner/home/content/new"
              render={() => <CourseCreation />}
            />
            <PrivateRoute
              path="/partner/home/content/view/:id"
              strict
              sensitive
              render={(match) => <ViewCourseDetailsPage match={match} />}
            />
            <PrivateRoute
              path="/partner/home/content/:id"
              strict
              sensitive
              render={(match) => <CourseCreation match={match} />}
            />
            <PrivateRoute
              exact
              path="/partner/home/consultation"
              render={() => <Consultation />}
            />
            <Redirect from="/partner/home" to="/partner/home/dashboard" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default ContentProviderHome;
