import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import {
  Link,
  NavLink,
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Avatar, ListItem, Typography, Divider } from "@material-ui/core";
import SideBar from "../components/Sidebar";
import logo from "../assets/CodeineLogos/Admin.svg";
import SupervisorAccountOutlinedIcon from "@material-ui/icons/SupervisorAccountOutlined";
import WhatshotOutlinedIcon from "@material-ui/icons/WhatshotOutlined";
import PublicOutlinedIcon from "@material-ui/icons/PublicOutlined";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import BrokenImageOutlinedIcon from "@material-ui/icons/BrokenImageOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AdminHumanResourcePage from "./HumanResource/HumanResourcePage";
import ContentQualityPage from "./ContentQuality/ContentQualityPage";
import HelpdeskPage from "./Helpdesk/HelpdeskPage";
import LearnersAchievementPage from "./LearnersAchievement/LearnersAchievementPage";
import AnalyticsPage from "./Analytics/AnalyticsPage";
import ProfilePage from "./Profile/ProfilePage";
import PasswordPage from "./Password/PasswordPage";

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
        <img src={logo} alt="" width="100px" />
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
        <SupervisorAccountOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Human Resource</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/contentquality"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <WhatshotOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Content Quality</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/helpdesk"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PublicOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Helpdesk</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/learnersachievement"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <SchoolOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Learners Achievement</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/analytics"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <BrokenImageOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Analytics</Typography>
      </ListItem>
      <Divider />
      <ListItem
        component={NavLink}
        to="/admin/profile"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PersonOutlineOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Profile</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/admin/password"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <LockOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Password</Typography>
      </ListItem>
    </Fragment>
  );

  return (
    <BrowserRouter>
      <Navbar
        loggedIn={loggedIn}
        bgColor="#fff"
        logo={navLogo}
        navbarItems={memberNavbar}
      />
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
          <Route exact path="/admin/helpdesk" render={() => <HelpdeskPage />} />
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
          <Route exact path="/admin/password" render={() => <PasswordPage />} />
          <Redirect from="/admin" to="/admin/humanresource" />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default AdminRoutesPage;
