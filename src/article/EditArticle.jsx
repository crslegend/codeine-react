import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Breadcrumbs,
  Button,
  TextField,
  Typography,
  Grid,
  Badge,
  ListItem,
  Avatar,
  Divider,
  Popover,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import memberLogo from "../assets/codeineLogos/Member.svg";
import partnerLogo from "../assets/codeineLogos/Partner.svg";
import adminLogo from "../assets/codeineLogos/Admin.svg";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Service from "../AxiosService";
import { useDebounce } from "use-debounce";
import ReactQuill from "react-quill";
import { ToggleButton } from "@material-ui/lab";
import Toast from "../components/Toast.js";
import NotificationsIcon from "@material-ui/icons/Notifications";
import NotifTile from "../components/NotificationTile";
import ZeroNotif from "../assets/ZeroNotif.svg";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import DoneAllIcon from "@material-ui/icons/DoneAll";
import "./quill.css";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { Delete } from "@material-ui/icons";
import { Dashboard, Timeline, Work } from "@material-ui/icons";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faFileCode } from "@fortawesome/free-solid-svg-icons";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
    paddingTop: "65px",
    backgroundColor: "#fff",
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    width: 120,
  },
  tile: {
    height: "100%",
  },
  languageButtons: {
    minWidth: 80,
    marginRight: "15px",
    marginBottom: "10px",
    height: 30,
  },
  categoryButtons: {
    minWidth: 80,
    marginRight: "15px",
    marginBottom: "10px",
    height: 30,
  },
  gridlayout: {
    padding: theme.spacing(3),
  },
  popover: {
    width: "300px",
    padding: theme.spacing(1),
  },
  notifpopover: {
    width: "400px",
    padding: theme.spacing(1),
  },
  typography: {
    cursor: "pointer",
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
  redButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  redButtonPadded: {
    backgroundColor: theme.palette.red.main,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  greenButton: {
    backgroundColor: theme.palette.green.main,
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkgreen.main,
    },
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
  popoverPaper: {
    marginTop: "10px",
    boxShadow: "3px 4px 0px #222",
    border: "1px solid #222",
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
  dropzone: {
    width: "100%",
    minHeight: "150px",
    "@global": {
      ".MuiDropzoneArea-text.MuiTypography-h5": {
        textTransform: "none",
        fontSize: "14px",
      },
    },
  },
  gridList: {
    width: "100%",
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  proBorderWrapper: {
    borderRadius: 50,
    background:
      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
    padding: 3,
  },
  freeBorderWrapper: {
    borderRadius: 50,
    background: "rgba(84,84,84,1)",
    padding: 3,
  },
  innerBorderWrapper: {
    borderRadius: 50,
    background: "#FFF",
    padding: 2,
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
}));

const EditArticle = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const userType = location.pathname.split("/", 4)[3];

  let quillRef = React.createRef();

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

  // const [loggedIn, setLoggedIn] = useState(false);

  // const checkIfLoggedIn = () => {
  //   if (Cookies.get("t1")) {
  //     setLoggedIn(true);
  //   }
  // };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverid = open ? "simple-popover" : undefined;

  const [dialogopen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const [dialog2open, setDialog2Open] = useState(false);

  // const handleDialog2Open = () => {
  //   setDialog2Open(true);
  // };

  const handleDialog2Close = () => {
    setDialog2Open(false);
  };

  const editor = {
    toolbar: [
      [{ size: ["normal", "large"] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const format = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const [user, setUser] = useState(null);
  const [articleDetails, setArticleDetails] = useState({
    title: "",
    content: "",
  });
  const [thumbnail, setThumbnail] = useState();
  const [content, setContent] = useState("");
  const [editThumbnailState, setEditThumbnailState] = useState(false);

  useEffect(() => {
    // if (quillRef && quillRef.current) {
    //   quillRef.current.focus();
    // }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const memberid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${memberid}`)
        .then((res) => {
          setUser(res.data);
          // setLoggedIn(true);
        })
        .catch((err) => {
          setUser();
        });
      Service.client
        .get(`/articles/${id}`)
        .then((res1) => {
          console.log(res1);
          getFields(res1.data);
          if (res1.data.thumbnail) {
            setThumbnail(res1.data.thumbnail);
          }
        })
        .catch(() => {});
    }
    getUserNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [debouncedText] = useDebounce(articleDetails, 1000);
  const [debouncedThumbnail] = useDebounce(thumbnail, 1000);
  const [saveState, setSaveState] = useState(true);

  useEffect(() => {
    if (debouncedText || debouncedThumbnail) {
      if (!articleDetails.is_published && articleDetails.title !== "") {
        const formData = new FormData();
        console.log(JSON.stringify(articleDetails.categories));
        formData.append("title", articleDetails.title);
        formData.append("content", articleDetails.content);
        formData.append("categories", articleDetails.categories);
        formData.append("coding_languages", articleDetails.coding_languages);
        formData.append("languages", articleDetails.languages);

        if (editThumbnailState && thumbnail) {
          // console.log(thumbnail[0].file);
          formData.append("thumbnail", thumbnail[0].file);
        }

        Service.client
          .put(`/articles/${id}`, formData)
          .then((res) => {
            setEditThumbnailState(false);
            setSaveState(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText, debouncedThumbnail]);

  const [languages, setLanguages] = useState({
    ENG: false,
    MAN: false,
    FRE: false,
  });

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const [codeLanguage, setCodeLanguage] = useState({
    PY: false,
    JAVA: false,
    JS: false,
    CPP: false,
    CS: false,
    HTML: false,
    CSS: false,
    RUBY: false,
  });

  useEffect(() => {
    if (!articleDetails.is_published && articleDetails.title !== "") {
      //console.log("useeffect 2");
      let data = {
        ...articleDetails,
        content: content,
        coding_languages: [],
        languages: [],
        categories: [],
      };

      for (const property in languages) {
        if (languages[property]) {
          data.languages.push(property);
        }
      }

      for (const property in categories) {
        if (categories[property]) {
          data.categories.push(property);
        }
      }

      for (const property in codeLanguage) {
        if (codeLanguage[property]) {
          data.coding_languages.push(property);
        }
      }
      setArticleDetails(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, languages, categories, codeLanguage]);

  function getFields(currentarticle) {
    setArticleDetails(currentarticle);
    setContent(currentarticle.content);
    let newLanguages = { ...languages };
    for (let i = 0; i < currentarticle.languages.length; i++) {
      newLanguages = {
        ...newLanguages,
        [currentarticle.languages[i]]: true,
      };
    }
    setLanguages(newLanguages);

    let newCategories = { ...categories };
    for (let i = 0; i < currentarticle.categories.length; i++) {
      newCategories = {
        ...newCategories,
        [currentarticle.categories[i]]: true,
      };
    }
    setCategories(newCategories);

    let newCodeLanguages = { ...codeLanguage };
    for (let i = 0; i < currentarticle.coding_languages.length; i++) {
      newCodeLanguages = {
        ...newCodeLanguages,
        [currentarticle.coding_languages[i]]: true,
      };
    }
    setCodeLanguage(newCodeLanguages);
  }

  const validateArticle = () => {
    if (articleDetails.title === "") {
      setSbOpen(true);
      setSnackbar({
        message: "A title is required!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return true;
    }
    let neverChooseOne = true;
    for (const property in languages) {
      if (languages[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 course language",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return true;
    }

    neverChooseOne = true;
    for (const property in categories) {
      if (categories[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 category",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return true;
    }

    neverChooseOne = true;
    for (const property in codeLanguage) {
      if (codeLanguage[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message:
          "Please select at least 1 coding language/framework for your course",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return true;
    }
  };

  const publishArticle = () => {
    if (!validateArticle()) {
      var millisecondsToWait = 1500;
      setTimeout(function () {
        Service.client
          .patch(`/articles/${id}/publish`)
          .then((res) => {
            history.push(`/article/${res.data.id}`);
          })
          .catch((err) => {
            console.log(err);
          });
      }, millisecondsToWait);
    }
  };

  const unpublishArticle = () => {
    Service.client
      .patch(`/articles/${id}/unpublish`)
      .then((res) => {
        if (userType === "member") {
          history.push(`/member/articles`);
        } else if (userType === "partner") {
          history.push(`/partner/home/article`);
        } else if (userType === "admin") {
          history.push(`/admin/article`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteArticle = () => {
    Service.client
      .delete(`/articles/${id}`)
      .then((res) => {
        if (userType === "member") {
          history.push(`/member/articles`);
        } else if (userType === "partner") {
          history.push(`/partner/home/article`);
        } else if (userType === "admin") {
          history.push(`/admin/article`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveAndPublishArticle = () => {
    if (!thumbnail) {
      setSbOpen(true);
      setSnackbar({
        message: "Please give a thumbnail for your article!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
    if (!validateArticle()) {
      let data = {
        ...articleDetails,
        content: content,
        coding_languages: [],
        languages: [],
        categories: [],
      };

      for (const property in languages) {
        if (languages[property]) {
          data.languages.push(property);
        }
      }

      for (const property in categories) {
        if (categories[property]) {
          data.categories.push(property);
        }
      }

      for (const property in codeLanguage) {
        if (codeLanguage[property]) {
          data.coding_languages.push(property);
        }
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("content", data.content);
      formData.append("categories", data.categories);
      formData.append("coding_languages", data.coding_languages);
      formData.append("languages", data.languages);

      if (editThumbnailState) {
        formData.append("thumbnail", thumbnail[0].file);
      }

      Service.client
        .put(`/articles/${id}`, formData)
        .then((res) => {
          console.log(data);
          setEditThumbnailState(false);
          setSaveState(true);
          history.push(`/article/${id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const backToArticle = () => {
    history.push(`/article/${id}`);
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
          {userType === "member" && (
            <img src={memberLogo} width="120%" alt="codeine logo" />
          )}
          {userType === "partner" && (
            <img src={partnerLogo} width="120%" alt="codeine logo" />
          )}
          {userType === "admin" && (
            <img src={adminLogo} width="120%" alt="codeine logo" />
          )}
        </Link>
        {user && articleDetails && !articleDetails.is_published && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="h6"
              style={{ fontSize: "15px", color: "#000000" }}
            >
              Draft in {user.first_name + " " + user.last_name}&nbsp;
            </Typography>
            <Typography
              variant="h6"
              style={{ fontSize: "15px", color: "#0000008a" }}
            >
              {saveState ? "Saved" : "Saving"}
            </Typography>
          </div>
        )}
      </div>
    </Fragment>
  );

  const [notificationList, setNotificationList] = useState([]);

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

  const [anchorE2, setAnchorE2] = useState(null);

  const handleNotifClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorE2(null);
  };

  const notifOpen = Boolean(anchorE2);
  const notifid = notifOpen ? "simple-popover" : undefined;

  const notifBell = (
    <div>
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
              history.push("/member/notifications");
            }}
          >
            View all
          </Typography>
        </div>
      </Popover>
    </div>
  );

  const loggedInNavbar = (
    <Fragment>
      {userType === "member" && (
        <ListItem style={{ whiteSpace: "nowrap" }}>
          {notifBell}
          <div
            className={
              user && user.member && user.member.membership_tier === "PRO"
                ? classes.proBorderWrapper
                : classes.freeBorderWrapper
            }
            style={{
              marginLeft: "30px",
            }}
          >
            <div className={classes.innerBorderWrapper}>
              <Avatar
                onClick={handleClick}
                src={user && user.profile_photo}
                alt=""
                style={{
                  width: "34px",
                  height: "34px",
                  cursor: "pointer",
                }}
              />
            </div>
          </div>
          <Popover
            id={popoverid}
            open={open}
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
            classes={{
              paper: classes.popoverPaper,
            }}
          >
            <div className={classes.popover}>
              <div className={classes.toprow}>
                <div
                  className={
                    user && user.member && user.member.membership_tier === "PRO"
                      ? classes.proBorderWrapper
                      : classes.freeBorderWrapper
                  }
                  style={{
                    marginRight: "15px",
                  }}
                >
                  <div className={classes.innerBorderWrapper}>
                    <Avatar
                      src={user && user.profile_photo}
                      alt=""
                      style={{
                        width: "55px",
                        height: "55px",
                      }}
                    />
                  </div>
                </div>

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
                      color: "#757575",
                      cursor: "pointer",
                    }}
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
                <Typography className={classes.typography}>
                  Dashboard
                </Typography>
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
                  history.push("/codereview");
                }}
              >
                <FontAwesomeIcon
                  icon={faFileCode}
                  className={classes.icon}
                  style={{ height: "24px", width: "24px" }}
                />
                <Typography className={classes.typography}>
                  Code Review
                </Typography>
              </div>

              {user && user.member && user.member.membership_tier === "PRO" && (
                <div
                  className={classes.hover}
                  onClick={() => {
                    history.push("/member/industryprojects");
                    // alert("clicked on Industry projects");
                  }}
                >
                  <Work className={classes.icon} />
                  <Typography className={classes.typography}>
                    Industry Projects
                  </Typography>
                </div>
              )}

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
      )}
      {(userType === "partner" || userType === "admin") && (
        <ListItem style={{ whiteSpace: "nowrap" }}>
          {notifBell}
          <Button
            variant="contained"
            color="primary"
            style={{
              textTransform: "capitalize",
              marginLeft: "30px",
            }}
            onClick={() => {
              Service.removeCredentials();
              history.push("/partner");
            }}
          >
            <Typography
              variant="h6"
              style={{ fontSize: "15px", color: "#fff" }}
            >
              Logout
            </Typography>
          </Button>
        </ListItem>
      )}
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Navbar logo={navLogo} bgColor="#fff" navbarItems={loggedInNavbar} />
      <Grid container>
        <Grid item xs={8} className={classes.gridlayout}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              onClick={() => {
                if (userType === "member") {
                  history.push("/member/articles");
                } else if (userType === "partner") {
                  history.push("/partner/home/article");
                } else if (userType === "admin") {
                  history.push("/admin/article");
                }
              }}
              className={classes.backLink}
            >
              My Articles
            </Link>
            <Typography>Edit Article</Typography>
          </Breadcrumbs>

          <TextField
            margin="normal"
            id="title"
            label="Title"
            name="title"
            required
            fullWidth
            value={articleDetails && articleDetails.title}
            // error={firstNameError}
            onChange={(event) => {
              setArticleDetails({
                ...articleDetails,
                title: event.target.value,
              });
              setSaveState(false);
            }}
          />

          <ReactQuill
            ref={(el) => {
              quillRef = el;
            }}
            theme={"snow"}
            value={content}
            modules={editor}
            format={format}
            id="content"
            name="content"
            style={{ height: "75vh" }}
            onChange={(event) => {
              // set content first to prevent lose focus
              setContent(event);
              setSaveState(false);
            }}
            placeholder="Compose an epic..."
          />
        </Grid>
        <Grid item xs={4} className={classes.gridlayout}>
          <div style={{ marginBottom: "30px" }}>
            {thumbnail ? (
              <GridList className={classes.gridList} cols={1}>
                <GridListTile>
                  <img
                    alt="thumbnail"
                    src={thumbnail[0].data ? thumbnail[0].data : thumbnail}
                  />
                  <GridListTileBar
                    classes={{
                      root: classes.titleBar,
                    }}
                    actionIcon={
                      <IconButton
                        onClick={() => {
                          setEditThumbnailState(true);
                          setThumbnail();
                        }}
                      >
                        <Delete style={{ color: "#C74343" }} />
                      </IconButton>
                    }
                  />
                </GridListTile>
              </GridList>
            ) : (
              <Fragment>
                <Typography variant="body2" style={{ paddingBottom: "7px" }}>
                  Article Thumbnail
                </Typography>
                <DropzoneAreaBase
                  dropzoneClass={classes.dropzone}
                  dropzoneText="Drag and drop an image or click here&nbsp;"
                  acceptedFiles={["image/*"]}
                  filesLimit={1}
                  maxFileSize={5000000}
                  fileObjects={thumbnail}
                  onAdd={(newPhoto) => {
                    console.log("onAdd", newPhoto);
                    setEditThumbnailState(true);
                    setThumbnail(newPhoto);
                    // setValidatePhoto(false);
                  }}
                  onDelete={(deletePhotoObj) => {
                    setThumbnail();
                    setEditThumbnailState(true);
                  }}
                  previewGridProps={{
                    item: {
                      xs: "auto",
                    },
                  }}
                  style={{ minHeight: "100px" }}
                />
              </Fragment>
            )}
          </div>
          <div style={{ marginBottom: "30px" }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Language (Choose at least 1)
            </Typography>
            <div>
              <ToggleButton
                value=""
                size="small"
                selected={languages && languages.ENG}
                onChange={() => {
                  setLanguages({ ...languages, ENG: !languages.ENG });
                  setSaveState(false);
                }}
                className={classes.languageButtons}
              >
                English
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={languages && languages.MAN}
                onChange={() => {
                  setLanguages({ ...languages, MAN: !languages.MAN });
                  setSaveState(false);
                }}
                className={classes.languageButtons}
              >
                中文
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={languages && languages.FRE}
                onChange={() => {
                  setLanguages({ ...languages, FRE: !languages.FRE });
                  setSaveState(false);
                }}
                className={classes.languageButtons}
              >
                français
              </ToggleButton>
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Category (Choose at least 1)
            </Typography>
            <div>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.SEC}
                onChange={() => {
                  setCategories({ ...categories, SEC: !categories.SEC });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Security
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.DB}
                onChange={() => {
                  setCategories({ ...categories, DB: !categories.DB });
                  setSaveState(false);
                }}
                className={`${classes.categoryButtons}`}
              >
                Database Administration
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.FE}
                onChange={() => {
                  setCategories({ ...categories, FE: !categories.FE });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Frontend
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.BE}
                onChange={() => {
                  setCategories({ ...categories, BE: !categories.BE });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Backend
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.UI}
                onChange={() => {
                  setCategories({ ...categories, UI: !categories.UI });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                UI/UX
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.ML}
                onChange={() => {
                  setCategories({ ...categories, ML: !categories.ML });
                  setSaveState(false);
                }}
                className={`${classes.categoryButtons}`}
              >
                Machine Learning
              </ToggleButton>
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Coding Language/Framework (Choose at least 1)
            </Typography>
            <div>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.PY}
                onChange={() => {
                  setCodeLanguage({ ...codeLanguage, PY: !codeLanguage.PY });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Python
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.JAVA}
                onChange={() => {
                  setCodeLanguage({
                    ...codeLanguage,
                    JAVA: !codeLanguage.JAVA,
                  });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Java
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.JS}
                onChange={() => {
                  setCodeLanguage({ ...codeLanguage, JS: !codeLanguage.JS });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Javascript
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.CPP}
                onChange={() => {
                  setCodeLanguage({ ...codeLanguage, CPP: !codeLanguage.CPP });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                C++
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.CS}
                onChange={() => {
                  setCodeLanguage({ ...codeLanguage, CS: !codeLanguage.CS });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                C#
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.HTML}
                onChange={() => {
                  setCodeLanguage({
                    ...codeLanguage,
                    HTML: !codeLanguage.HTML,
                  });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                HTML
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.CSS}
                onChange={() => {
                  setCodeLanguage({ ...codeLanguage, CSS: !codeLanguage.CSS });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                CSS
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.RUBY}
                onChange={() => {
                  setCodeLanguage({
                    ...codeLanguage,
                    RUBY: !codeLanguage.RUBY,
                  });
                  setSaveState(false);
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Ruby
              </ToggleButton>
            </div>
          </div>
          <Button
            variant="contained"
            className={classes.redButton}
            onClick={handleClickOpen}
            style={{
              marginBottom: "10px",
              marginRight: "15px",
            }}
          >
            Delete Article
          </Button>
          {articleDetails && articleDetails.is_published && (
            <>
              <Button
                variant="contained"
                color="primary"
                style={{
                  textTransform: "capitalize",
                  marginRight: "15px",
                  marginBottom: "10px",
                }}
                onClick={(e) => unpublishArticle()}
              >
                Unpublish
              </Button>
              <Button
                variant="contained"
                className={classes.greenButton}
                style={{ marginBottom: "10px", marginRight: "15px" }}
                onClick={(e) => saveAndPublishArticle(e)}
              >
                Save and publish
              </Button>
            </>
          )}
          {articleDetails && !articleDetails.is_published && (
            <Button
              variant="contained"
              className={classes.greenButton}
              style={{
                marginRight: "15px",
                marginBottom: "10px",
                marginLeft: "15px",
                float: "right",
              }}
              onClick={(e) => publishArticle(e)}
            >
              Publish
            </Button>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={dialogopen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Article?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => deleteArticle()}
            className={classes.redButtonPadded}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={dialog2open}
        onClose={handleDialog2Close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Back to Article</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please take note that any changes will not be saved. Please click
            "Save And Publish" to save your changes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialog2Close} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => backToArticle()}
            className={classes.redButtonPadded}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditArticle;
