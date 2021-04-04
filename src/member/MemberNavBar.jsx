import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "../assets/codeineLogos/Member.svg";
import {
  Avatar,
  ListItem,
  Typography,
  Popover,
  Button,
  Divider,
  Badge,
} from "@material-ui/core";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { Dashboard, Timeline } from "@material-ui/icons";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotifTile from "../components/NotificationTile";
import ZeroNotif from "../assets/ZeroNotif.svg";

const useStyles = makeStyles((theme) => ({
  popover: {
    width: "300px",
    padding: theme.spacing(1),
  },
  notifpopover: {
    width: "400px",
    padding: theme.spacing(1),
  },
  popoverPaper: {
    marginTop: "10px",
    boxShadow: "5px 5px 0px #222",
    border: "2px solid #222",
  },
  typography: {
    cursor: "pointer",
  },
  hover: {
    padding: theme.spacing(1),
    display: "flex",
    "&:hover": {
      backgroundColor: "#f5f5f5",
      cursor: "pointer",
    },
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  toprow: {
    display: "flex",
    marginBottom: "5px",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#f5f5f5",
      cursor: "pointer",
    },
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
}));

const MemberNavBar = (props) => {
  const classes = useStyles();
  const { loggedIn, setLoggedIn, viewAllNotif } = props;
  const history = useHistory();

  const [user, setUser] = useState({
    first_name: "Member",
    email: "Member panel",
    profile_photo: "",
  });

  const getUserDetails = () => {
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      // console.log(decoded);
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          if (!res.data.member) {
            //history.push("/404");
          } else {
            setUser(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const [notificationList, setNotificationList] = useState([]);

  const getUserNotifications = () => {
    if (!viewAllNotif) {
      if (Cookies.get("t1")) {
        Service.client
          .get("/notification-objects")
          .then((res) => {
            setNotificationList(res.data);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  useEffect(() => {
    getUserDetails();
    getUserNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [anchorE2, setAnchorE2] = useState(null);

  const handleNotifClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorE2(null);
  };

  const notifOpen = Boolean(anchorE2);
  const notifid = notifOpen ? "simple-popover" : undefined;

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

  const loggedOutNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="outlined"
          component={Link}
          to="/partner"
          style={{ textTransform: "capitalize" }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Teach on Codeine
          </Typography>
        </Button>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          to="/member/login"
          variant="outlined"
          component={Link}
          style={{ textTransform: "capitalize" }}
          color="primary"
        >
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Button>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/member/register"
          style={{
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const notifBell = (
    <div>
      {!viewAllNotif ? (
        <Badge
          badgeContent={
            notificationList.length > 0 ? notificationList[0].num_unread : 0
          }
          color="primary"
        >
          <NotificationsIcon
            className={classes.notification}
            onClick={handleNotifClick}
          />
        </Badge>
      ) : (
        <NotificationsIcon className={classes.notificationOpen} />
      )}

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
              history.push("/member/notifications");
            }}
          >
            View all
          </Typography>
        </div>
      </Popover>
    </div>
  );

  const loggedInNavBar = (
    <Fragment>
      {user && user.member && user.member.membership_tier !== "PRO" && (
        <ListItem style={{ whiteSpace: "nowrap" }}>
          <Button
            variant="outlined"
            color="primary"
            style={{ textTransform: "none" }}
            onClick={() => history.push(`/member/membership`)}
          >
            Upgrade
          </Button>
        </ListItem>
      )}
      <ListItem style={{ whiteSpace: "nowrap" }}>
        {notifBell}
        <Avatar
          onClick={handleClick}
          src={user && user.profile_photo}
          alt=""
          style={{
            width: "34px",
            height: "34px",
            cursor: "pointer",
            marginLeft: "30px",
            border:
              user.member && user.member.membership_tier !== "PRO"
                ? ""
                : "3px solid green",
          }}
        />
        <Popover
          id={id}
          open={open}
          classes={{
            paper: classes.popoverPaper,
          }}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className={classes.popover}>
            <div className={classes.toprow}>
              <Avatar
                src={user && user.profile_photo}
                alt=""
                style={{
                  width: "55px",
                  height: "55px",
                  marginRight: "15px",
                  border:
                    user.member && user.member.membership_tier === "PRO"
                      ? "3px solid green"
                      : "",
                }}
              />
              <div
                style={{
                  flexDirection: "column",
                  width: "100%",
                }}
                onClick={() => {
                  history.push("/member/profile");
                }}
              >
                <Typography
                  style={{
                    fontWeight: "600",
                    paddingTop: "5px",
                    cursor: "pointer",
                  }}
                >
                  {user && user.first_name + " " + user.last_name}
                </Typography>
                <Typography
                  style={{
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                  color="primary"
                >
                  Manage your profile
                </Typography>
              </div>
            </div>

            <Divider style={{ marginBottom: "5px" }} />

            <div
              className={classes.hover}
              onClick={() => {
                history.push("/member/dashboard");
                // alert("Clicked on Dashboard");
              }}
            >
              <Dashboard className={classes.icon} />
              <Typography className={classes.typography}>Dashboard</Typography>
            </div>

            <div
              className={classes.hover}
              onClick={() => {
                history.push("/member/courses");
              }}
            >
              <InsertDriveFileIcon className={classes.icon} />
              <Typography className={classes.typography}>Courses</Typography>
            </div>

            <div
              className={classes.hover}
              onClick={() => {
                history.push("/member/consultations");
              }}
            >
              <Timeline className={classes.icon} />
              <Typography className={classes.typography}>
                Consultations
              </Typography>
            </div>

            <div
              className={classes.hover}
              onClick={() => {
                history.push("/member/articles");
              }}
            >
              <FontAwesomeIcon
                icon={faNewspaper}
                className={classes.icon}
                style={{ height: "24px", width: "24px" }}
              />
              <Typography className={classes.typography}>Articles</Typography>
            </div>

            <div
              className={classes.hover}
              onClick={() => {
                //history.push("/");
                alert("clicked on Industry projects");
              }}
            >
              <Dashboard className={classes.icon} />
              <Typography className={classes.typography}>
                Industry Projects
              </Typography>
            </div>

            <div
              className={classes.hover}
              onClick={() => {
                //history.push("/");
                history.push("/member/helpdesk");
              }}
            >
              <HelpOutlineOutlinedIcon className={classes.icon} />
              <Typography className={classes.typography}>Helpdesk</Typography>
            </div>

            <div
              className={classes.hover}
              onClick={() => {
                history.push("/member/payment");
              }}
            >
              <AccountBalanceWalletIcon className={classes.icon} />
              <Typography className={classes.typography}>
                My Payments
              </Typography>
            </div>

            <Divider style={{ marginTop: "5px", marginBottom: "5px" }} />

            <div
              className={classes.hover}
              onClick={() => {
                Service.removeCredentials();
                setLoggedIn(false);
                history.push("/");
              }}
            >
              <ExitToAppIcon className={classes.icon} />
              <Typography
                className={classes.typography}
                style={{ fontWeight: "700" }}
              >
                Log Out
              </Typography>
            </div>
          </div>
        </Popover>
      </ListItem>
    </Fragment>
  );

  return (
    <Fragment>
      <Navbar
        logo={navLogo}
        navbarItems={loggedIn ? loggedInNavBar : loggedOutNavbar}
        bgColor="#fff"
      />
    </Fragment>
  );
};

export default MemberNavBar;
