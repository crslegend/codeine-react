import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  BrowserRouter,
  Switch,
  Link,
  NavLink,
  useHistory,
  Redirect,
} from "react-router-dom";
import { Avatar, Button, ListItem, Typography } from "@material-ui/core";
import PrivateRoute from "../../components/PrivateRoute.jsx";
import Sidebar from "../../components/Sidebar";
import { Dashboard, Timeline } from "@material-ui/icons";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Consultation from "./Consultation";
import logo from "../../assets/CodeineLogos/Member.svg";

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

const MemberLanding = () => {
  const classes = useStyles();
  const history = useHistory();

  const [user, setUser] = useState();

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          onClick={() => {
            history.push("/");
          }}
          style={{
            textTransform: "capitalize",
          }}
        >
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Home
          </Typography>
        </Button>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          style={{
            backgroundColor: "#437FC7",
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
        <Avatar className={classes.avatar}>
          {user && user.first_name.charAt(0)}
        </Avatar>
      </div>
      <Typography variant="h6">
        {user && user.first_name} {user && user.last_name}
      </Typography>
      <Typography variant="body1">Student</Typography>
    </Fragment>
  );

  const sidebarList = (
    <Fragment>
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
        <Dashboard className={classes.listIcon} />
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
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/member/home"
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
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);
          setUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Navbar logo={navLogo} navbarItems={memberNavbar} bgColor="#fff" />
        <Sidebar head={sidebarHead} list={sidebarList} />
        <div className={classes.mainPanel}>
          <Switch>
            <PrivateRoute
              exact
              path="/member/home/dashboard"
              render={() => <div></div>}
            />
            <PrivateRoute
              exact
              path="/member/home/consultation"
              render={() => <Consultation />}
            />
            <Redirect from="/member/home" to="/member/home/dashboard" />
          </Switch>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default MemberLanding;
