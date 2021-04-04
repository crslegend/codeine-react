import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import More from "@material-ui/icons/MoreVert";
import {
  Typography,
  Popover,
  Grid,
  Avatar,
  ListItem,
  Button,
  Link,
  Card,
  CardContent,
} from "@material-ui/core";
import Service from "../AxiosService";
import { useHistory, useLocation } from "react-router";
import MemberNavBar from "../member/MemberNavBar";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import partnerLogo from "../assets/codeineLogos/Partner.svg";
import adminLogo from "../assets/codeineLogos/Admin.svg";
import NotifTile from "../components/NotificationTile";
import Cookies, { set } from "js-cookie";
import jwt_decode from "jwt-decode";

const styles = makeStyles((theme) => ({
  root: {
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  notiftile: {
    width: "100%",
    cursor: "pointer",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#f5f5f5",
      cursor: "pointer",
    },
  },
  typography: {
    padding: theme.spacing(2),
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
    },
  },
  circle: {
    height: "20px",
    width: "20px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    display: "inline-block",
  },
  markallasread: {
    marginLeft: "auto",
    marginTop: "30px",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
}));

const AllNotifications = (props) => {
  const classes = styles();
  const history = useHistory();
  const location = useLocation();
  const userType = location.pathname.split("/", 4)[1];

  const calculateDateInterval = (timestamp) => {
    const dateBefore = new Date(timestamp);
    const dateNow = new Date();

    let seconds = Math.floor((dateNow - dateBefore) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          return `a few seconds ago`;
        }

        if (minutes === 1) {
          return `${minutes} minute ago`;
        }
        return `${minutes} minutes ago`;
      }

      if (hours === 1) {
        return `${hours} hour ago`;
      }
      return `${hours} hours ago`;
    }

    if (days === 1) {
      return `${days} day ago`;
    }
    return `${days} days ago`;
  };

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

  const handleClick = (event, courseId) => {
    setPopover({
      popoverId: courseId,
      anchorEl: event.currentTarget,
    });
  };

  const handleClose = () => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
  };

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      if (userType === "member") {
        Service.client
          .get(`/auth/members/${userid}`)
          .then((res) => {
            setUser(res.data);
            setLoggedIn(true);
          })
          .catch((err) => {
            setUser(null);
          });
      } else if (userType === "partner") {
        Service.client
          .get(`/auth/partners/${userid}`)
          .then((res) => {
            setUser(res.data);
            setLoggedIn(true);
          })
          .catch((err) => {
            setUser(null);
          });
      } else if (userType === "admin") {
        Service.client
          .get(`/auth/admins/${userid}`)
          .then((res) => {
            setUser(res.data);
            setLoggedIn(true);
          })
          .catch((err) => {
            setUser(null);
          });
      }
    }
  };

  const [notificationList, setNotificationList] = useState([]);

  useEffect(() => {
    checkIfLoggedIn();
    getUserNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const markAllAsRead = () => {
    Service.client
      .patch(`/notification-objects/mark/all-read`)
      .then((res) => {
        setNotificationList(res.data);
      })
      .catch();
  };

  const navLogo = (
    <Fragment>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            marginRight: "35px",
            width: 100,
          }}
        >
          {userType === "partner" && (
            <img src={partnerLogo} width="120%" alt="codeine logo" />
          )}
          {userType === "admin" && (
            <img src={adminLogo} width="120%" alt="codeine logo" />
          )}
        </Link>
      </div>
    </Fragment>
  );

  const loggedInNavbar = (
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
            if (userType === "partner") {
              history.push("/partner");
            } else if (userType === "admin") {
              history.push("/admin");
            }
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  return (
    <div
      className={classes.root}
      //onClick={() => handleNotifClick(notification.id)}
    >
      {userType === "member" && (
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}
      {(userType === "partner" || userType === "admin") && (
        <Navbar logo={navLogo} bgColor="#fff" navbarItems={loggedInNavbar} />
      )}

      <Card style={{ marginTop: "80px" }}>
        <CardContent>
          <div style={{ display: "flex" }}>
            <PageTitle title="Notifications" />
            <Typography
              className={classes.markallasread}
              onClick={() => {
                markAllAsRead();
              }}
            >
              ✔ Mark all as read
            </Typography>
          </div>
          {notificationList.map((notification, index) => {
            return (
              <NotifTile
                key={index}
                notification={notification}
                getUserNotifications={getUserNotifications}
                userType={userType}
              />
            );
          })}
        </CardContent>
      </Card>

      {/* <More onClick={(e) => handleClick(e, notification.id)} /> */}
      {/* <Popover
        open={popover.popoverId === notification.id}
        onClose={handleClose}
        anchorEl={popover.anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Typography
          variant="body2"
          className={classes.typography}
          onClick={() => {
            handleClose();
          }}
        >
          Edit this reponse
        </Typography>
        <Typography
          variant="body2"
          className={classes.typography}
          onClick={() => {
            handleClose();
          }}
        >
          Delete
        </Typography>
      </Popover> */}
    </div>
  );
};

export default AllNotifications;
