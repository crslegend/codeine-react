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
import {
  Avatar,
  ListItem,
  Typography,
  Badge,
  Popover,
  Tooltip,
  IconButton,
} from "@material-ui/core";

import Toast from "../components/Toast.js";
import Button from "@material-ui/core/Button";
import SideBar from "../components/Sidebar";
import logo from "../assets/codeineLogos/Admin.svg";
import SupervisorAccountOutlinedIcon from "@material-ui/icons/SupervisorAccountOutlined";
import WhatshotOutlinedIcon from "@material-ui/icons/WhatshotOutlined";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import PublicOutlinedIcon from "@material-ui/icons/PublicOutlined";
import SchoolOutlinedIcon from "@material-ui/icons/SchoolOutlined";
import WorkOutlinedIcon from "@material-ui/icons/WorkOutline";
import BrokenImageOutlinedIcon from "@material-ui/icons/BrokenImageOutlined";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AdminHumanResourcePage from "./humanResource/HumanResourcePage";
import ContentQualityPage from "./contentQuality/ContentQualityPage";
import ContentQualityArticlePage from "./contentQuality/article/ViewArticle";
import HelpdeskPage from "./helpdesk/HelpdeskPage";
import LearnersAchievementPage from "./learnersAchievement/LearnersAchievementPage";
import AnalyticsPage from "./analytics/AnalyticsPage";
import ProfilePage from "./profile/ProfilePage";
import PasswordPage from "./password/PasswordPage";
import Article from "./article/AdminArticleList";
import ViewCourseDetail from "./contentQuality/course/ViewCourseDetails";
import ViewCourseContent from "./contentQuality/course/EnrollCourse";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import CourseRelatedAnalytics from "./analytics/CourseRelatedAnalytics";
import CourseDetailAnalytics from "./analytics/CourseDetailAnalytics";
import ProjectRelatedAnalysis from "./analytics/ProjectRelatedAnalysis";
import Notifications from "./notification/NotificationManagement";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import ViewTicketPage from "./helpdesk/ViewTicketPage";
import NotifTile from "../components/NotificationTile";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ZeroNotif from "../assets/ZeroNotif.svg";
import IndustryProjectPage from "./industryProject/IndustryProjectPage";
import ViewIndustryProjectDetails from "./industryProject/ViewIndustryProjectDetails";

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
    color: theme.palette.secondary.main,
    backgroundColor: "#F4F4F4",
    borderLeft: "5px solid",
    "& p": {
      fontWeight: 600,
    },
    "&:hover": {
      borderLeft: "5px solid #164D8F",
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
  notification: {
    cursor: "pointer",
    color: "#878787",
    height: "30px",
    width: "30px",
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
    },
  },
  notificationOpen: {
    cursor: "pointer",
    color: theme.palette.primary.main,
    height: "30px",
    width: "30px",
  },
  viewallnotif: {
    textAlign: "center",
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
      color: theme.palette.primary.main,
    },
  },
  notifpopover: {
    width: "400px",
    padding: theme.spacing(1),
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

  const [notificationList, setNotificationList] = useState([]);

  const getUserNotifications = () => {
    if (Cookies.get("t1")) {
      Service.client
        .get("/notification-objects")
        .then((res) => {
          setNotificationList(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getUserNotifications();
    getOwnData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorE2, setAnchorE2] = useState(null);

  const handleNotifClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorE2(null);
  };

  const notifOpen = Boolean(anchorE2);
  const notifid = notifOpen ? "simple-popover" : undefined;

  const markAllAsRead = () => {
    Service.client
      .patch(`/notification-objects/mark/all-read`)
      .then((res) => {
        setNotificationList(res.data);
      })
      .catch();
  };

  const notifBell = (
    <div>
      <Badge
        badgeContent={
          notificationList.length > 0 ? notificationList[0].num_unread : 0
        }
        color="primary"
      >
        <NotificationsIcon
          className={
            notifOpen ? classes.notificationOpen : classes.notification
          }
          onClick={handleNotifClick}
        />
      </Badge>

      <Popover
        id={notifid}
        open={notifOpen}
        anchorEl={anchorE2}
        onClose={handleNotifClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ maxHeight: "70%" }}
      >
        <div className={classes.notifpopover}>
          <div style={{ display: "flex" }}>
            <Typography
              style={{
                fontWeight: "800",
                fontSize: "25px",
                marginLeft: "10px",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              Notifications
            </Typography>

            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Mark all as read">
                <IconButton
                  onClick={() => {
                    markAllAsRead();
                  }}
                >
                  <DoneAllIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {notificationList.slice(0, 20).map((notification, index) => {
            return (
              <NotifTile
                key={index}
                notification={notification}
                getUserNotifications={getUserNotifications}
                userType="member"
              />
            );
          })}
          {notificationList.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <img src={ZeroNotif} alt="" />
              <Typography style={{ fontWeight: "700", marginTop: "20px" }}>
                All caught up!
              </Typography>
            </div>
          )}
        </div>
        <div
          style={{
            backgroundColor: "#dbdbdb",
            position: "sticky",
            bottom: 0,
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          <Typography
            className={classes.viewallnotif}
            onClick={() => {
              //alert("clicked on view all notifications");
              history.push("/admin/notifications");
            }}
          >
            View all
          </Typography>
        </div>
      </Popover>
    </div>
  );

  const adminNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        {notifBell}

        <Button
          onClick={() => {
            Service.removeCredentials();
            history.push("/admin/login");
          }}
          variant="contained"
          color="secondary"
          style={{ textTransform: "capitalize", marginLeft: "30px" }}
        >
          Log Out
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
        <HelpOutlineOutlinedIcon className={classes.listIcon} />
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
        to="/admin/industryproject"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <WorkOutlinedIcon className={classes.listIcon} />
        <Typography variant="body1">Industry Project</Typography>
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
      <ListItem
        component={NavLink}
        to="/admin/notification/manage"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <NotificationsNoneIcon className={classes.listIcon} />
        <Typography variant="body1">Notification</Typography>
      </ListItem>
      {/* <ListItem
        component={NavLink}
        to="/admin/article"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <SubjectIcon className={classes.listIcon} />
        <Typography variant="body1">Articles</Typography>
      </ListItem> */}
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
        navbarItems={adminNavbar}
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
            strict
            sensitive
            path="/admin/contentquality/article/:id"
            render={() => <ContentQualityArticlePage />}
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
            strict
            sensitive
            path="/admin/helpdesk/:id"
            render={() => <ViewTicketPage />}
          />
          <Route
            exact
            path="/admin/learnersachievement"
            render={() => <LearnersAchievementPage />}
          />
          <Route
            exact
            path="/admin/industryproject"
            render={() => <IndustryProjectPage />}
          />
          <Route
            exact
            path="/admin/industryproject/:id"
            render={() => <ViewIndustryProjectDetails />}
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
            exact
            path="/admin/analytics/projects"
            render={() => <ProjectRelatedAnalysis />}
          />
          <Route
            strict
            sensitive
            path="/admin/analytics/courses/:id"
            render={(match) => <CourseDetailAnalytics match={match} />}
          />
          <Route
            strict
            sensitive
            path="/admin/notification/manage"
            render={(match) => <Notifications />}
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
            path="/admin/article"
            render={() => (
              <Article
                history={history}
                snackbar={snackbar}
                setSbOpen={setSbOpen}
                setSnackbar={setSnackbar}
              />
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
