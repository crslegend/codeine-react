import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
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
import ZeroNotif from "../assets/ZeroNotif.svg";
import NotifTile from "../components/NotificationTile";
import NotificationsIcon from "@material-ui/icons/Notifications";
import Cookies from "js-cookie";
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
  notificationOpen: {
    color: theme.palette.primary.main,
    height: "30px",
    width: "30px",
  },
}));

const AllNotifications = (props) => {
  const classes = styles();
  const history = useHistory();
  const location = useLocation();
  const userType = location.pathname.split("/", 4)[1];

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

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
        .get("/notification-objects", {
          timeout: 200000,
        })
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
    <div
      className={classes.root}
      //onClick={() => handleNotifClick(notification.id)}
    >
      {userType === "member" && (
        <MemberNavBar
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          viewAllNotif={true}
        />
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
          {notificationList.length === 0 && (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <img src={ZeroNotif} alt="" />
              <Typography style={{ fontWeight: "700", marginTop: "20px" }}>
                All caught up!
              </Typography>
            </div>
          )}
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
