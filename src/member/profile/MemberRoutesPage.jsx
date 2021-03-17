import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  BrowserRouter,
  Switch,
  NavLink,
  useHistory,
  Redirect,
} from "react-router-dom";
import { Avatar, Button, ListItem, Typography } from "@material-ui/core";
import PrivateRoute from "../../components/Routes/PrivateRoute.jsx";
import Sidebar from "../../components/Sidebar";
import Toast from "../../components/Toast.js";
import {
  Dashboard,
  Timeline,
  PublicOutlined,
  HelpOutline,
  LockOutlined,
  PersonOutlineOutlined,
  Assignment,
  Payment,
} from "@material-ui/icons";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Consultation from "./Consultation/ConsultationPage";
import Helpdesk from "./Helpdesk/HelpdeskPage";
import Profile from "./Profile/ProfilePage";
import Password from "./Password/PasswordPage";
import Transaction from "./Payment/PaymentPage";
import logo from "../../assets/CodeineLogos/Member.svg";
import CoursesPage from "./Courses/CoursesPage";

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

const MemberLanding = () => {
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

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            history.push("/");
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
      <Typography variant="body1">{user.email}</Typography>
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
        to="/member/home/dashboard"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Dashboard className={classes.listIcon} />
        <Typography variant="body1">Dashboard</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/member/home/course"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Assignment className={classes.listIcon} />
        <Typography variant="body1">Courses</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/member/home/consultation"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Timeline className={classes.listIcon} />
        <Typography variant="body1">Consultations</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/member/home/project"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PublicOutlined className={classes.listIcon} />
        <Typography variant="body1">Industry Projects</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/member/home/helpdesk"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <HelpOutline className={classes.listIcon} />
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
        to="/member/home/profile"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <PersonOutlineOutlined className={classes.listIcon} />
        <Typography variant="body1">Profile</Typography>
      </ListItem>
      <ListItem
        component={NavLink}
        to="/member/home/password"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <LockOutlined className={classes.listIcon} />
        <Typography variant="body1">Password</Typography>
      </ListItem>
      <div>
        <label>
          <Typography className={classes.subheader} variant="body2">
            Transactions
          </Typography>
        </label>
      </div>
      <ListItem
        component={NavLink}
        to="/member/home/transaction"
        activeClassName={classes.activeLink}
        className={classes.listItem}
        button
      >
        <Payment className={classes.listIcon} />
        <Typography variant="body1">My Payments</Typography>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <a
        href="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" alt="" />
      </a>
    </Fragment>
  );

  const getUserDetails = () => {
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      // console.log(decoded);
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);

          if (!res.data.member) {
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

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
        <Navbar logo={navLogo} navbarItems={memberNavbar} bgColor="#fff" />
        <Sidebar head={sidebarHead} list={sidebarList} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <PrivateRoute
              exact
              path="/member/home/dashboard"
              render={() => <div></div>}
            />
            <PrivateRoute
              exact
              path="/member/home/course"
              render={() => <CoursesPage />}
            />
            <PrivateRoute
              exact
              path="/member/home/consultation"
              render={() => <Consultation />}
            />
            <PrivateRoute
              exact
              path="/member/home/project"
              render={() => <div></div>}
            />
            <PrivateRoute
              exact
              path="/member/home/helpdesk"
              render={() => <Helpdesk />}
            />
            <PrivateRoute
              exact
              path="/member/home/profile"
              render={() => <Profile profile={user} setProfile={setUser} />}
            />
            <PrivateRoute
              exact
              path="/member/home/password"
              render={() => (
                <Password
                  snackbar={snackbar}
                  setSbOpen={setSbOpen}
                  setSnackbar={setSnackbar}
                />
              )}
            />
            <PrivateRoute
              exact
              path="/member/home/transaction"
              render={() => <Transaction />}
            />
            <Redirect from="/member/home" to="/member/home/dashboard" />
          </Switch>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default MemberLanding;
