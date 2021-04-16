import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Popover,
  Avatar,
  ListItem,
  Button,
  Link,
} from "@material-ui/core";
import MemberNavBar from "../member/MemberNavBar";
import Navbar from "../components/Navbar";
import partnerLogo from "../assets/codeineLogos/Partner.svg";
import adminLogo from "../assets/codeineLogos/Admin.svg";
import NotificationsIcon from "@material-ui/icons/Notifications";
import InfoIcon from "@material-ui/icons/Info";
import Service from "../AxiosService";
import { useHistory, useParams, useLocation } from "react-router";
import jwt_decode from "jwt-decode";

const styles = makeStyles((theme) => ({
  root: {
    width: "60%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  typography: {
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
      backgroundColor: "#f5f5f5",
    },
  },
  bluecircle: {
    height: "15px",
    width: "15px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    display: "inline-block",
  },
  whitecircle: {
    height: "15px",
    width: "15px",
    borderRadius: "50%",
    display: "inline-block",
  },
  pop: {
    padding: theme.spacing(1),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginBottom: theme.spacing(2),
  },
}));

const NotificationDetail = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();
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

  const [notification, setNotification] = useState({
    notification: {
      title: "",
      description: "",
      photo: "",
      article: "",
      course: "",
      code_review: "",
      transaction: "",
      consultation_slot: "",
      tiket: "",
      industry_project: "",
      timestamp: "",
      notification_type: "",
    },
  });

  const getNotification = () => {
    Service.client
      .get(`/notification-objects/${id}`, {
        timeout: 200000,
      })
      .then((res) => {
        // console.log(res);
        setNotification(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

  const handleClick = (event, notifId) => {
    setPopover({
      popoverId: notifId,
      anchorEl: event.currentTarget,
    });
  };

  const handleClose = () => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
  };

  const markUnread = (notifId) => {
    Service.client
      .patch(`/notification-objects/${notification.id}/unread`)
      .then(() => {})
      .catch();
  };

  const markRead = (notifId) => {
    Service.client
      .patch(`/notification-objects/${notification.id}/read`)
      .then(() => {})
      .catch();
  };

  const deleteNotif = (notifId) => {
    Service.client
      .delete(`/notification-objects/${notifId}`)
      .then(() => {})
      .catch();
  };

  const navLogo = (
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
          <img
            src={partnerLogo}
            width="120%"
            alt="codeine logo"
            onClick={() => history.push("/partner")}
          />
        )}
        {userType === "admin" && (
          <img
            src={adminLogo}
            width="120%"
            alt="codeine logo"
            onClick={() => history.push("/admin")}
          />
        )}
      </Link>
    </div>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <NotificationsIcon className={classes.notificationOpen} />
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "capitalize",
            marginLeft: "30px",
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
    <div className={classes.root}>
      <div style={{ display: "flex" }}>
        {userType === "member" && (
          <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )}
        {(userType === "partner" || userType === "admin") && (
          <Navbar logo={navLogo} bgColor="#fff" navbarItems={loggedInNavbar} />
        )}
        <div style={{ marginTop: "85px" }}>
          <div style={{ display: "flex" }}>
            {notification &&
              notification.notification &&
              notification.notification.notification_type === "GENERAL" && (
                <Avatar className={classes.avatar}>
                  <InfoIcon />
                </Avatar>
              )}

            <div style={{ marginLeft: "15px" }}>
              <Typography
                style={{
                  fontWeight: 800,
                }}
              >
                {notification.notification && notification.notification.title}
              </Typography>

              <Typography
                style={{
                  fontSize: "12px",
                  color: "#797a7d",
                }}
              >
                Posted by{" "}
                {notification.notification &&
                notification.notification.sender &&
                notification.notification.sender.is_admin
                  ? "Codeine Admin ~ "
                  : notification.notification.sender.first_name +
                    " " +
                    notification.notification.sender.last_name +
                    " ~ "}
                {calculateDateInterval(notification.notification.timestamp)}
              </Typography>
            </div>
          </div>

          {notification.notification && notification.notification.photo && (
            <img
              src={notification.notification && notification.notification.photo}
              alt=""
              style={{ width: "100%" }}
            ></img>
          )}

          <Typography>
            {notification.notification && notification.notification.description}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetail;
