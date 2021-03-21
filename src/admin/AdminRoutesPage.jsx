import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  Link,
  NavLink,
  BrowserRouter,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Avatar, ListItem, Typography } from "@material-ui/core";
import Toast from "../components/Toast.js";
import Button from "@material-ui/core/Button";
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
import ViewCourseDetail from "./ContentQuality/course/ViewCourseDetails";
import ViewCourseContent from "./ContentQuality/course/EnrollCourse";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import CourseRelatedAnalytics from "./Analytics/CourseRelatedAnalytics";

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
    backgroundColor: "#fff",
    padding: theme.spacing(3),
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

const AdminRoutesPage = () => {
  const classes = useStyles();
  const [loggedIn] = useState(false);
  const history = useHistory();

  const [profile, setProfile] = useState({
    first_name: "Admin",
    email: "Admin panel",
    profile_photo: "",
  });

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

  const getOwnData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      // console.log(`profile useeffect userid = ${userid}`);
      Service.client
        .get(`/auth/admins/${userid}`)
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => {
          //setProfile([]);
        });
    }
  };

  useEffect(() => {
    getOwnData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          onClick={() => {
            Service.removeCredentials();
            history.push("/admin/login");
          }}
        >
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log Out
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/admin/humanresource"
        style={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <img src={logo} alt="" width="100px" />
      </Link>
    </Fragment>
  );

  const sidebarHead = (
    <Fragment>
      <div style={{ marginTop: "30px", marginBottom: "10px" }}>
        {profile.profile_photo ? (
          <Avatar
            alt=""
            src={profile.profile_photo}
            className={classes.avatar}
          />
        ) : (
          <Avatar className={classes.avatar}>{profile.email.charAt(0)}</Avatar>
        )}
      </div>
      <Typography variant="h6">
        {profile.first_name} {profile.last_name}
      </Typography>
      <Typography variant="body1">{profile.email}</Typography>
    </Fragment>
  );

  const sidebarList = (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            Navigation
          </Typography>
        </label>
      </div>
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
          <Route
            exact
            path="/admin/contentquality/courses/:id"
            strict
            sensitive
            render={() => <ViewCourseDetail />}
          />
          <Route
            exact
            path="/admin/contentquality/courses/view/:id"
            strict
            sensitive
            render={() => <ViewCourseContent />}
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
          <Route
            exact
            path="/admin/analytics/courses"
            render={() => <CourseRelatedAnalytics />}
          />
          <Route
            strict
            sensitive
            path="/admin/analytics/courses/:id"
            render={(match) => <div match={match} />}
          />
          <Route
            exact
            path="/admin/profile"
            render={() => (
              <ProfilePage profile={profile} setProfile={setProfile} />
            )}
          />
          <Route
            exact
            path="/admin/password"
            render={() => (
              <PasswordPage
                snackbar={snackbar}
                setSbOpen={setSbOpen}
                setSnackbar={setSnackbar}
              />
            )}
          />
          <Redirect from="/admin" to="/admin/humanresource" />
        </Switch>
      </main>
    </BrowserRouter>
  );
};

export default AdminRoutesPage;
