import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Typography,
  Grid,
  ListItem,
  Avatar,
  Divider,
  Popover,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import memberLogo from "../assets/CodeineLogos/Member.svg";
import partnerLogo from "../assets/CodeineLogos/Partner.svg";
import adminLogo from "../assets/CodeineLogos/Admin.svg";
import Service from "../AxiosService";
import { useDebounce } from "use-debounce";
import ReactQuill from "react-quill";
import { ToggleButton } from "@material-ui/lab";
import Toast from "../components/Toast.js";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

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
  typography: {
    cursor: "pointer",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#e0e0e0",
      cursor: "pointer",
    },
  },
  toprow: {
    display: "flex",
    marginBottom: "5px",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#e0e0e0",
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
}));

const EditArticle = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const userType = location.pathname.split("/", 4)[3];

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

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

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

  const handleDialog2Open = () => {
    setDialog2Open(true);
  };

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
  const [content, setContent] = useState("");

  useEffect(() => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const memberid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${memberid}`)
        .then((res) => {
          setUser(res.data);
          setLoggedIn(true);
        })
        .catch((err) => {
          setUser();
        });
      Service.client
        .get(`/articles/${id}`)
        .then((res1) => {
          getFields(res1.data);
        })
        .catch(() => {});
    }
  }, []);

  const [debouncedText] = useDebounce(articleDetails, 1000);
  const [saveState, setSaveState] = useState(true);

  useEffect(() => {
    if (debouncedText) {
      if (!articleDetails.is_published && articleDetails.title !== "") {
        Service.client
          .put(`/articles/${id}`, articleDetails)
          .then((res) => {
            setSaveState(true);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedText]);

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
      console.log("useeffect 2");
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
            if (userType === "member") {
              history.push(`/article/member/${res.data.id}`);
            } else if (userType === "partner") {
              history.push(`/article/partner/${res.data.id}`);
            } else if (userType === "admin") {
              history.push(`/article/admin/${res.data.id}`);
            }
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

      Service.client
        .put(`/articles/${id}`, data)
        .then((res) => {
          console.log(data);
          setSaveState(true);
          if (userType === "member") {
            history.push(`/article/member/${id}`);
          } else if (userType === "partner") {
            history.push(`/article/partner/${id}`);
          } else if (userType === "admin") {
            history.push(`/article/admin/${id}`);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const backToArticle = () => {
    if (userType === "member") {
      history.push(`/article/member/${id}`);
    } else if (userType === "partner") {
      history.push(`/article/partner/${id}`);
    } else if (userType === "admin") {
      history.push(`/article/admin/${id}`);
    }
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

  const loggedInNavbar = (
    <Fragment>
      {userType === "member" && (
        <ListItem style={{ whiteSpace: "nowrap" }}>
          <Avatar
            onClick={handleClick}
            src={user && user.profile_photo}
            alt=""
            style={{ width: "34px", height: "34px", cursor: "pointer" }}
          />
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
          >
            <div className={classes.popover}>
              <div className={classes.toprow}>
                <Avatar
                  src={user && user.profile_photo}
                  alt=""
                  style={{ width: "55px", height: "55px", marginRight: "15px" }}
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
                      color: "#757575",
                      cursor: "pointer",
                    }}
                  >
                    Manage your profile
                  </Typography>
                </div>
              </div>

              <Divider style={{ marginBottom: "5px" }} />

              <Typography
                className={classes.typography}
                onClick={() => {
                  //history.push("/member/dashboard");
                  alert("Clicked on Dashboard");
                }}
              >
                Dashboard
              </Typography>
              <Typography
                className={classes.typography}
                onClick={() => {
                  history.push("/member/courses");
                }}
              >
                Courses
              </Typography>
              <Typography
                className={classes.typography}
                onClick={() => {
                  history.push("/member/consultations");
                }}
              >
                Consultations
              </Typography>
              <Typography
                className={classes.typography}
                onClick={() => {
                  history.push("/member/articles");
                }}
              >
                Articles
              </Typography>
              <Typography
                className={classes.typography}
                onClick={() => {
                  //history.push("/");
                  alert("clicked on Industry projects");
                }}
              >
                Industry Projects
              </Typography>
              <Typography
                className={classes.typography}
                onClick={() => {
                  //history.push("/");
                  alert("clicked on Helpdesk");
                }}
              >
                Helpdesk
              </Typography>
              <Typography
                className={classes.typography}
                onClick={() => {
                  history.push("/member/payment");
                }}
              >
                My Payments
              </Typography>
              <Typography
                className={classes.typography}
                onClick={() => {
                  Service.removeCredentials();
                  setLoggedIn(false);
                  history.push("/");
                }}
              >
                Log out
              </Typography>
            </div>
          </Popover>
        </ListItem>
      )}
      {(userType === "partner" || userType === "admin") && (
        <ListItem style={{ whiteSpace: "nowrap" }}>
          <Button
            variant="contained"
            color="primary"
            style={{
              textTransform: "capitalize",
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
            theme={"snow"}
            value={content}
            modules={editor}
            format={format}
            id="content"
            name="content"
            style={{ height: "75vh" }}
            onChange={(event) => {
              setSaveState(false);
              setContent(event);
            }}
            placeholder="Compose an epic..."
          />
        </Grid>
        <Grid item xs={4} className={classes.gridlayout}>
          <div style={{ marginBottom: "30px" }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Course Language (Choose at least 1)
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
          {articleDetails && articleDetails.is_published && (
            <>
              <Button
                variant="contained"
                className={classes.greenButton}
                style={{ marginBottom: "10px" }}
                onClick={(e) => saveAndPublishArticle(e)}
              >
                Save and publish
              </Button>
              <Button
                variant="contained"
                style={{
                  textTransform: "capitalize",
                  marginLeft: "15px",
                  marginRight: "15px",
                  marginBottom: "10px",
                }}
                onClick={() => {
                  setDialog2Open(true);
                }}
              >
                Back to Article
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{
                  textTransform: "capitalize",
                  marginBottom: "10px",
                }}
                onClick={(e) => unpublishArticle()}
              >
                Unpublish
              </Button>
            </>
          )}
          {articleDetails && !articleDetails.is_published && (
            <Button
              variant="contained"
              className={classes.greenButton}
              style={{
                marginRight: "15px",
              }}
              onClick={(e) => publishArticle(e)}
            >
              Publish
            </Button>
          )}
          <Button
            variant="contained"
            className={classes.redButton}
            onClick={handleClickOpen}
          >
            Delete Article
          </Button>
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
