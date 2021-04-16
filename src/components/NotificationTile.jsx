import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import More from "@material-ui/icons/MoreHoriz";
import {
  Typography,
  Popover,
  Grid,
  Avatar,
  IconButton,
} from "@material-ui/core";
import { Work } from "@material-ui/icons/Info";
import InfoIcon from "@material-ui/icons/Info";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faFileCode } from "@fortawesome/free-solid-svg-icons";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import Service from "../AxiosService";
import { useHistory } from "react-router";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";

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
    width: "65px",
    height: "65px",
  },
  avatarIcon: {
    width: "45px",
    height: "45px",
  },
}));

const NotificationTile = (props) => {
  const classes = styles();
  const history = useHistory();
  const { notification, getUserNotifications, userType } = props;

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
    setShowEditIcon(false);
  };

  const [hoveredNotif, setHoveredNotif] = useState({
    is_read: true,
  });

  const handleNotifClick = (notifId) => {
    //history.push();
    Service.client
      .patch(`/notification-objects/${notifId}/read`)
      .then((res) => {
        if (res.data.notification.notification_type === "HELPDESK") {
          if (userType === "member") {
            history.push(
              `/member/helpdesk/tickets/${res.data.notification.ticket.id}`
            );
            history.go();
          } else if (userType === "partner") {
            history.push(
              `/partner/home/helpdesk/tickets/${res.data.notification.ticket.id}`
            );
            history.go();
          } else if (userType === "admin") {
            history.push(`/admin/helpdesk/${res.data.notification.ticket.id}`);
            history.go();
          }
        } else if (res.data.notification.notification_type === "GENERAL") {
          if (userType === "member") {
            history.push(`/member/notification/view/${res.data.id}`);
            history.go();
          } else if (userType === "partner") {
            history.push(`/partner/notification/view/${res.data.id}`);
            history.go();
          } else if (userType === "admin") {
            history.push(`/admin/notification/view/${res.data.id}`);
            history.go();
          }
        } else if (res.data.notification.notification_type === "ARTICLE") {
          if (userType === "member") {
            history.push(`/article/member/${res.data.notification.article.id}`);
            history.go();
          } else if (userType === "partner") {
            history.push(
              `/article/partner/${res.data.notification.article.id}`
            );
            history.go();
          } else if (userType === "admin") {
            history.push(`/article/admin/${res.data.notification.article.id}`);
            history.go();
          }
        } else if (res.data.notification.notification_type === "COURSE") {
          if (userType === "member") {
            history.push(`/courses/enroll/${res.data.notification.course.id}`);
            history.go();
          } else if (userType === "partner") {
            history.push(
              `/partner/home/content/view/comments/${res.data.notification.course.id}`
            );
            history.go();
          } else if (userType === "admin") {
            history.push(
              `/article/contentquality/courses/${res.data.notification.course.id}`
            );
            history.go();
          }
        } else if (res.data.notification.notification_type === "CODE_REVIEW") {
          if (userType === "member") {
            history.push(`/codereview/${res.data.notification.code_review.id}`);
            history.go();
          } else if (userType === "partner") {
            history.push(`/codereview/${res.data.notification.code_review.id}`);
            history.go();
          } else if (userType === "admin") {
            history.push(`/codereview/${res.data.notification.code_review.id}`);
            history.go();
          }
        } else {
          // TO BE DELETE LATER
          if (userType === "member") {
            history.push(`/member/notification/view/${res.data.id}`);
            history.go();
          } else if (userType === "partner") {
            history.push(`/partner/notification/view/${res.data.id}`);
            history.go();
          } else if (userType === "admin") {
            history.push(`/admin/notification/view/${res.data.id}`);
            history.go();
          }
        }
      })
      .catch();
  };

  const [showEditIcon, setShowEditIcon] = useState();

  const markUnread = (notifId) => {
    Service.client
      .patch(`/notification-objects/${notifId}/unread`)
      .then(() => {
        getUserNotifications();
      })
      .catch();
  };

  const markRead = (notifId) => {
    Service.client
      .patch(`/notification-objects/${notifId}/read`)
      .then(() => {
        getUserNotifications();
      })
      .catch();
  };

  const deleteNotif = (notifId) => {
    Service.client
      .delete(`/notification-objects/${notifId}`)
      .then(() => {
        getUserNotifications();
      })
      .catch();
  };

  return (
    <div
      className={classes.root}
      onMouseEnter={() => {
        setShowEditIcon(true);
        setHoveredNotif(notification);
      }}
      onMouseLeave={() => {
        setShowEditIcon(false);
      }}
    >
      <div style={{ display: "flex", position: "relative" }}>
        <div
          style={{ display: "flex", width: `calc(100% - 30px)` }}
          onClick={() => handleNotifClick(notification.id)}
        >
          {notification.notification.notification_type === "HELPDESK" && (
            <Avatar className={classes.avatar}>
              <HelpOutlineOutlinedIcon className={classes.avatarIcon} />
            </Avatar>
          )}
          {notification.notification.notification_type === "GENERAL" && (
            <Avatar className={classes.avatar}>
              <InfoIcon className={classes.avatarIcon} />
            </Avatar>
          )}
          {notification.notification.notification_type === "COURSE" && (
            <Avatar className={classes.avatar}>
              <InsertDriveFileIcon className={classes.avatarIcon} />
            </Avatar>
          )}
          {notification.notification.notification_type === "PAYMENT" && (
            <Avatar className={classes.avatar}>
              <AccountBalanceWalletIcon className={classes.avatarIcon} />
            </Avatar>
          )}
          {notification.notification.notification_type === "CODE_REVIEW" && (
            <Avatar className={classes.avatar}>
              <FontAwesomeIcon
                icon={faFileCode}
                className={classes.icon}
                style={{ height: "24px", width: "24px" }}
              />
            </Avatar>
          )}
          {notification.notification.notification_type === "ARTICLE" && (
            <Avatar className={classes.avatar}>
              <FontAwesomeIcon
                icon={faNewspaper}
                className={classes.avatarIcon}
                style={{ height: "24px", width: "24px" }}
              />
            </Avatar>
          )}
          {notification.notification.notification_type ===
            "INDUSTRY_PROJECT" && (
            <Avatar className={classes.avatar}>
              <Work className={classes.avatarIcon} />
            </Avatar>
          )}

          <div style={{ marginLeft: "10px" }}>
            {notification.is_read ? (
              <>
                <Typography
                  style={{
                    fontWeight: 700,
                    color: "#797a7d",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {notification.notification && notification.notification.title}
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    color: "#797a7d",
                    cursor: "pointer",
                    fontSize: "13px",
                  }}
                >
                  {notification.notification &&
                    notification.notification.description}
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
              </>
            ) : (
              <>
                <Typography
                  style={{
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {notification.notification && notification.notification.title}
                </Typography>
                <Typography
                  variant="body1"
                  style={{ cursor: "pointer", fontSize: "13px" }}
                >
                  {notification.notification &&
                    notification.notification.description}
                </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {calculateDateInterval(notification.notification.timestamp)}
                </Typography>
              </>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            position: "absolute",
            right: "0",
            marginLeft: "auto",
          }}
        >
          <div>
            {(showEditIcon || popover.popoverId === notification.id) && (
              <IconButton onClick={(e) => handleClick(e, notification.id)}>
                <More />
              </IconButton>
            )}
          </div>

          {!notification.is_read ? (
            <span className={classes.bluecircle} />
          ) : (
            <span className={classes.whitecircle} />
          )}
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
          {hoveredNotif.is_read ? (
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
          ) : (
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
          )}

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
      </Popover>
    </div>
  );
};

export default NotificationTile;
