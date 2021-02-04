import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { Link, NavLink, BrowserRouter, Route, Switch } from "react-router-dom";
import {
  Avatar,
  Button,
  ListItem,
  Typography,
  Divider,
} from "@material-ui/core";
import SideBar from "../components/Sidebar";
import logo from "../assets/logo2.png";
import { Dashboard } from "@material-ui/icons";
import AdminHumanResourcePage from "./HumanResourcePage";
import ContentQualityPage from "./ContentQualityPage";
import HelpdeskPage from "./HelpdeskPage";
import LearnersAchievementPage from "./LearnersAchievementPage";
import AnalyticsPage from "./AnalyticsPage";
import ProfilePage from "./ProfilePage";
import PasswordPage from "./PasswordPage";

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
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
    width: "calc(100% - 240px)",
    marginLeft: "240px",
  },
}));

const AdminRoutesPage = () => {
  const classes = useStyles();
  const [loggedIn] = useState(false);

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/admin/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log Out
          </Typography>
        </Link>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link to="/" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
        <Button className={classes.logoButton}>
          <img src={logo} alt="" width="100px" />
        </Button>
      </Link>
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
        to="/admin/humanresource"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="h5">Human Resource</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/contentquality"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="h5">Content Quality</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/helpdesk"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="h5">Helpdesk</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/learnersachievement"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="h5">Learners Achievement</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/analytics"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="h5">Analytics</Typography>
      </ListItem>
      <Divider />
      <ListItem
        component={NavLink}
        to="/admin/profile"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="h5">Profile</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/password"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="h5">Password</Typography>
      </ListItem>
    </Fragment>
  );

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Navbar loggedIn={loggedIn} logo={navLogo} navbarItems={memberNavbar} />
        <SideBar head={sidebarHead} list={sidebarList} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route
              exact
              path="/admin/humanresource"
              render={() => <AdminHumanResourcePage />}
            />
            <Route
              exact
              path="/admin/contentquality"
              render={() => <ContentQualityPage />}
            />
            <Route
              exact
              path="/admin/helpdesk"
              render={() => <HelpdeskPage />}
            />
            <Route
              exact
              path="/admin/learnersachievement"
              render={() => <LearnersAchievementPage />}
            />
            <Route
              exact
              path="/admin/analytics"
              render={() => <AnalyticsPage />}
            />
            <Route exact path="/admin/profile" render={() => <ProfilePage />} />
            <Route
              exact
              path="/admin/password"
              render={() => <PasswordPage />}
            />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default AdminRoutesPage;
