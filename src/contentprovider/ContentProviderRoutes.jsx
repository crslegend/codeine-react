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
import PrivateRoute from "../components/Routes/PrivateRoute";
import { Avatar, Button, ListItem, Typography } from "@material-ui/core";
import Sidebar from "../components/Sidebar";
import { AttachMoney, Dashboard, NoteAdd, Timeline } from "@material-ui/icons";
import PaymentIcon from "@material-ui/icons/Payment";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import Toast from "../components/Toast.js";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import logo from "../assets/CodeineLogos/Partner.svg";
import Consultation from "./consultation/Consultation";
import ViewAllCourses from "./course/ViewAllCourses";
import CourseCreation from "./course/CourseCreation";
import ViewCourseDetailsPage from "./course/ViewCourseDetailsPage";
import Password from "./password/PasswordPage";
import Profile from "./profile/ProfilePage";
import Helpdesk from "./helpdesk/HelpdeskPage";
import Wallet from "./wallet/WalletPage";
import Student from "./student/StudentPage";
import DashboardPage from "./dashboard/DashboardPage";
import ContributionsPage from "./contributions/ContributionsPage";
import ReplyToComments from "./course/ReplyToComments";
import ViewAllQuizzes from "./course/ViewAllQuizzes";
import CourseDetailAnalytics from "./dashboard/CourseDetailAnalytics";

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
  subheader: {
    // textAlign: "center",
    paddingLeft: theme.spacing(4),
    paddingTop: "20px",
    paddingBottom: "10px",
    opacity: 0.9,
    fontWeight: 600,
    textTransform: "uppercase",
    // color: theme.palette.primary.main,
  },
}));

const ContentProviderHome = () => {
  const classes = useStyles();
  const history = useHistory();

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [user, setUser] = useState({
    first_name: "Member",
    email: "Member panel",
    profile_photo: "",
  });

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <a href={`/codereview`} style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Code Review
          </Typography>
        </a>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
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
        {user.profile_photo ? (
          <Avatar alt="" src={user.profile_photo} className={classes.avatar} />
        ) : (
          <Avatar className={classes.avatar}>
            {user.first_name.charAt(0)}
          </Avatar>
        )}
      </div>
      <Typography variant="h6">
        {user.first_name} {user.last_name}
      </Typography>
      {user && user.partner && !user.partner.organization && (
        <Typography variant="body1">{user.partner.job_title}</Typography>
      )}
      {user && user.partner && user.partner.organization && (
        <Typography variant="body1">
          {user.partner.organization.organization_name}
        </Typography>
      )}
    </Fragment>
  );

  const sidebarList = (
    <Fragment>
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            Navigation
          </Typography>
        </label>
      </div>
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
        <Typography variant="body1">My Courses</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/student"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <SchoolOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">My Students</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/consultation"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Timeline className={classes.listIcon} />
        <Typography variant="body1">Consultation</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/helpdesk"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <HelpOutlineOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Helpdesk</Typography>
      </ListItem>
      {/* <Divider /> */}
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            User Settings
          </Typography>
        </label>
      </div>
      <ListItem
        component={NavLink}
        to="/partner/home/profile"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PersonOutlineOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Profile</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/partner/home/password"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <LockOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Password</Typography>
      </ListItem>
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            Transactions
          </Typography>
        </label>
      </div>
      {user && user.partner && user.partner.organization && (
        <ListItem
          component={NavLink}
          to="/partner/home/contributions"
          activeClassName={classes.activeLink}
          className={classes.listItem}
          button
        >
          <AttachMoney className={classes.listIcon} />
          <Typography variant="body1">Funding</Typography>
        </ListItem>
      )}
      <ListItem
        component={NavLink}
        to="/partner/home/earnings"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PaymentIcon className={classes.listIcon} />
        <Typography variant="body1">Earnings</Typography>
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
          // console.log(res);

          if (!res.data.partner) {
            history.push("/404");
          } else {
            setUser(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(user);

  return (
    <BrowserRouter>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.root}>
        <Navbar logo={navLogo} navbarItems={loggedInNavbar} bgColor="#fff" />
        <Sidebar head={sidebarHead} list={sidebarList} />
        <div className={classes.mainPanel}>
          <Switch>
            <PrivateRoute
              exact
              path="/partner/home/dashboard"
              render={() => <DashboardPage />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/dashboard/:id"
              strict
              sensitive
              render={(match) => <CourseDetailAnalytics match={match} />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/content"
              render={() => <ViewAllCourses />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/content/new"
              render={() => <CourseCreation />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/view/comments/:id"
              strict
              sensitive
              render={(match) => <ReplyToComments match={match} />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/view/quizzes/:id"
              strict
              sensitive
              render={(match) => <ViewAllQuizzes match={match} />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/view/:id"
              strict
              sensitive
              render={(match) => <ViewCourseDetailsPage match={match} />}
              user="partner"
            />
            <PrivateRoute
              path="/partner/home/content/:id"
              strict
              sensitive
              render={(match) => <CourseCreation match={match} />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/student"
              render={() => <Student />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/consultation"
              render={() => <Consultation />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/helpdesk"
              render={() => <Helpdesk />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/password"
              render={() => (
                <Password
                  snackbar={snackbar}
                  setSbOpen={setSbOpen}
                  setSnackbar={setSnackbar}
                />
              )}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/profile"
              render={() => <Profile profile={user} setProfile={setUser} />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/earnings"
              render={() => <Wallet />}
              user="partner"
            />
            <PrivateRoute
              exact
              path="/partner/home/contributions"
              render={() => <ContributionsPage />}
              user="partner"
            />
            <Redirect from="/partner/home" to="/partner/home/dashboard" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default ContentProviderHome;
