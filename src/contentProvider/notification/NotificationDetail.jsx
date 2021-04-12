import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import More from "@material-ui/icons/MoreHoriz";
import {
  Typography,
  Popover,
  Grid,
  Avatar,
  Breadcrumbs,
  IconButton,
  ListItem,
  Button,
  Link,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import AccountIcon from "../assets/notifIcon/AccountIcon.png";
import AnnouncementIcon from "../assets/notifIcon/AnnouncementIcon.png";
import ConsulatationIcon from "../assets/notifIcon/ConsultationIcon.png";
import PaymentIcon from "../assets/notifIcon/PaymentIcon.svg";
import partnerLogo from "../assets/codeineLogos/Partner.svg";
import adminLogo from "../assets/codeineLogos/Admin.svg";
import NotificationsIcon from "@material-ui/icons/Notifications";
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
}));

const NotificationDetail = () => {
  const classes = styles();
  const history = useHistory();

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

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

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

  return (
    <div className={classes.root}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          onClick={() => {
            history.push("/partner/home/notification");
          }}
          className={classes.backLink}
        >
          My Notifications
        </Link>
        <Typography>Notification Detail</Typography>
      </Breadcrumbs>

      {/* <div style={{ display: "flex", position: "relative", marginTop: "65px" }}>
        <div style={{ display: "flex", width: `calc(100% - 30px)` }}>
          {notification.notification.notification_type === "HELPDESK" && (
            <Avatar
              src={AccountIcon}
              alt=""
              style={{ height: "65px", width: "65px" }}
            ></Avatar>
          )}
          {notification.notification.notification_type === "GENERAL" && (
            <Avatar
              src={AnnouncementIcon}
              alt=""
              style={{ height: "65px", width: "65px" }}
            ></Avatar>
          )}
          {notification.notification.notification_type === "COURSE" && (
            <Avatar
              src={AnnouncementIcon}
              alt=""
              style={{ height: "65px", width: "65px" }}
            ></Avatar>
          )}
          {notification.notification.notification_type === "PAYMENT" && (
            <Avatar
              src={PaymentIcon}
              alt=""
              style={{ height: "65px", width: "65px" }}
            ></Avatar>
          )}

          <img
            src={notification.notification && notification.notification.photo}
            alt=""
            style={{ height: "100px" }}
          ></img>

          <Typography
            style={{
              fontWeight: 700,
              color: "#797a7d",
              cursor: "pointer",
            }}
          >
            {notification.notification && notification.notification.title}
          </Typography>

          <Typography
            style={{
              fontSize: "12px",
              color: "#797a7d",
              cursor: "pointer",
            }}
          >
            {calculateDateInterval(notification.notification.timestamp)}
          </Typography>
          <Typography
            variant="body1"
            style={{
              color: "#797a7d",
              cursor: "pointer",
            }}
          >
            {notification.notification && notification.notification.description}
          </Typography>
        </div>
      </div>

      <Popover
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
        <div className={classes.pop}>
          <Typography
            variant="body2"
            className={classes.typography}
            onClick={() => {
              handleClose();
              markUnread(notification.id);
            }}
          >
            ✔ Mark as unread
          </Typography>
          <Typography
            variant="body2"
            className={classes.typography}
            onClick={() => {
              handleClose();
              markRead(notification.id);
            }}
          >
            ✔ Mark as read
          </Typography>

          <Typography
            variant="body2"
            className={classes.typography}
            onClick={() => {
              deleteNotif(notification.id);
            }}
          >
            X Delete Notification
          </Typography>
        </div>
      </Popover> */}
    </div>
  );
};

export default NotificationDetail;
