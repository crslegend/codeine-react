import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Avatar, Breadcrumbs, Link } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import InfoIcon from "@material-ui/icons/Info";

const styles = makeStyles((theme) => ({
  root: {},
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
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginBottom: theme.spacing(2),
  },
}));

const NotificationDetail = (props) => {
  const classes = styles();
  const { notification, setShowNotifDetail } = props;
  //const history = useHistory();

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

  return (
    <div className={classes.root}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          onClick={() => {
            setShowNotifDetail(false);
          }}
          className={classes.backLink}
        >
          My Notifications
        </Link>
        <Typography>Notification Detail</Typography>
      </Breadcrumbs>

      <div style={{ marginTop: "25px" }}>
        <div style={{ display: "flex" }}>
          {notification.notification_type === "GENERAL" && (
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
              {notification.title}
            </Typography>

            <Typography
              style={{
                fontSize: "12px",
                color: "#797a7d",
              }}
            >
              {calculateDateInterval(notification.timestamp)}
            </Typography>
          </div>
        </div>

        {notification.photo && (
          <img src={notification.photo} alt="" style={{ width: "100%" }}></img>
        )}

        <Typography>{notification.description}</Typography>
      </div>
    </div>
  );
};

export default NotificationDetail;
