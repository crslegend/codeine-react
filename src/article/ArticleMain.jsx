import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  ListItem,
  Badge,
  Popover,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import { useHistory, useParams, useLocation, Link } from "react-router-dom";
import Service from "../AxiosService";
import CommentDrawer from "./ArticleComments";
import ViewArticle from "./ViewArticle";
import ArticleIDE from "./ArticleIDE";
import Footer from "./Footer";
import MemberNavBar from "../member/MemberNavBar";
import Navbar from "../components/Navbar";
import partnerLogo from "../assets/codeineLogos/Partner.svg";
import adminLogo from "../assets/codeineLogos/Admin.svg";
import Toast from "../components/Toast.js";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import NotificationsIcon from "@material-ui/icons/Notifications";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import ZeroNotif from "../assets/ZeroNotif.svg";
import NotifTile from "../components/NotificationTile";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  codeineLogo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10px",
    width: "25%",
    minWidth: "120px",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    padding: "20px 30px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    width: 120,
  },
  tile: {
    height: "100%",
  },
  split: {
    height: "calc(100vh - 65px)",
  },
  notifpopover: {
    width: "400px",
    padding: theme.spacing(1),
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
    cursor: "pointer",
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

const ArticleMain = () => {
  const classes = useStyles();
  const history = useHistory();
  //const location = useLocation();
  //const userType = location.pathname.split("/", 3)[2];
  const { id } = useParams();

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

  const [userType, setUserType] = useState("guest");
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);

      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res.data);
          setUser(res.data);
          if (res.data.member) {
            setUserType("member");
          } else if (res.data.partner) {
            setUserType("partner");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [articleDetails, setArticleDetails] = useState({
    id: "",
    title: "",
    content: "",
    category: [],
    coding_languages: [],
    languages: [],
    engagements: [],
    top_level_comments: [],
  });

  useEffect(() => {
    checkIfLoggedIn();
    getArticleDetails();
    getUserNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArticleDetails = () => {
    Service.client
      .get(`/articles/${id}`)
      .then((res) => {
        setArticleDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIDE, setOpenIDE] = useState(false);

  const [notificationList, setNotificationList] = useState([]);

  const getUserNotifications = () => {
    if (Cookies.get("t1")) {
      Service.client
        .get("/notification-objects", {
          timeout: 20000,
        })
        .then((res) => {
          console.log(res);
          setNotificationList(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const [anchorE2, setAnchorE2] = useState(null);

  const handleNotifClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorE2(null);
  };

  const notifOpen = Boolean(anchorE2);
  const notifid = notifOpen ? "simple-popover" : undefined;

  const markAllAsRead = () => {
    Service.client
      .patch(`/notification-objects/mark/all-read`)
      .then((res) => {
        setNotificationList(res.data);
      })
      .catch();
  };

  const notifBell = (
    <div>
      <Badge
        badgeContent={
          notificationList.length > 0 ? notificationList[0].num_unread : 0
        }
        color="primary"
      >
        <NotificationsIcon
          className={
            notifOpen ? classes.notificationOpen : classes.notification
          }
          onClick={handleNotifClick}
        />
      </Badge>

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
          <div style={{ display: "flex" }}>
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
            <div style={{ marginLeft: "auto" }}>
              <Tooltip title="Mark all as read">
                <IconButton
                  onClick={() => {
                    markAllAsRead();
                  }}
                >
                  <DoneAllIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          {notificationList.slice(0, 20).map((notification, index) => {
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
              history.push("/partner/notifications");
            }}
          >
            View all
          </Typography>
        </div>
      </Popover>
    </div>
  );

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
      <ListItem style={{ whiteSpace: "nowrap" }}>{notifBell}</ListItem>
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
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />

      {drawerOpen && (
        <CommentDrawer
          user={user}
          openIDE={openIDE}
          setOpenIDE={setOpenIDE}
          articleDetails={articleDetails}
          setArticleDetails={setArticleDetails}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          setSnackbar={setSnackbar}
          setSbOpen={setSbOpen}
        />
      )}

      {openIDE ? (
        <ArticleIDE
          user={user}
          openIDE={openIDE}
          setOpenIDE={setOpenIDE}
          articleDetails={articleDetails}
          setArticleDetails={setArticleDetails}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          setSnackbar={setSnackbar}
          setSbOpen={setSbOpen}
        />
      ) : (
        <>
          {(userType === "member" || userType === "guest") && (
            <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
          )}
          {(userType === "partner" || userType === "admin") && (
            <Navbar
              logo={navLogo}
              bgColor="#fff"
              navbarItems={loggedInNavbar}
            />
          )}
          <ViewArticle
            user={user}
            openIDE={openIDE}
            setOpenIDE={setOpenIDE}
            articleDetails={articleDetails}
            setArticleDetails={setArticleDetails}
            drawerOpen={drawerOpen}
            setDrawerOpen={setDrawerOpen}
            setSnackbar={setSnackbar}
            setSbOpen={setSbOpen}
            userType={userType}
          />
          <Footer />
        </>
      )}
    </div>
  );
};

export default ArticleMain;
