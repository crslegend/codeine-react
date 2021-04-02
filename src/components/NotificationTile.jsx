import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import More from "@material-ui/icons/MoreVert";
import { Typography, Popover } from "@material-ui/core";
import Service from "../AxiosService";
import { useHistory } from "react-router";

const styles = makeStyles((theme) => ({
  root: {
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
}));

const NotificationTile = (props) => {
  const classes = styles();
  const history = useHistory();
  const { notification } = props;

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

  const handleNotifClick = (notifId) => {
    //history.push();
    Service.client
      .patch(`/notification-objects/${notifId}/read`)
      .then((res) => {})
      .catch();
    alert("clicked on notif: " + notifId);
  };

  return (
    <div
      className={classes.root}
      onClick={() => handleNotifClick(notification.id)}
    >
      {/* <img src={notification.photo} alt=""></img> */}
      <div>
        <Typography
          style={{
            fontWeight: 700,
          }}
          variant="body1"
        >
          {notification.notification && notification.notification.title}
        </Typography>
        <Typography variant="body1">
          {notification.notification && notification.notification.description}
        </Typography>
      </div>
      <Typography
        color={notification.notification.is_read ? "" : "primary"}
        style={{ fontSize: "14px", fontWeight: "700" }}
      >
        {calculateDateInterval(notification.notification.timestamp)}
      </Typography>
      {!notification.is_read && <span className={classes.circle} />}

      <More onClick={(e) => handleClick(e, notification.id)} />
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
      </Popover>
    </div>
  );
};

export default NotificationTile;
