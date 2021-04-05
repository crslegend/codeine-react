import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { useHistory } from "react-router-dom";
// import logo from "../assets/CodeineLogos/Member.svg";
import { calculateDateInterval } from "../utils.js";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import components from "./components/NavbarComponents";
// import PageTitle from "../components/PageTitle";
import { Avatar, Button, Chip, Paper, Typography } from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import { Add, Favorite, Forum, People, Person } from "@material-ui/icons";
// import { ToggleButton } from "@material-ui/lab";
import Toast from "../components/Toast.js";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import AddSnippetDialog from "./components/AddSnippetDialog";
// import AceEditor from "react-ace";
// import "ace-builds/src-noconflict/mode-javascript";
// import "ace-builds/src-noconflict/theme-monokai";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  content: {
    paddingTop: "65px",
    minHeight: "calc(100vh - 220px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
  },
  title: {
    paddingTop: theme.spacing(5),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  heading: {
    lineHeight: "50px",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  codeReview: {
    marginBottom: "10px",
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  linkMui: {
    fontSize: 28,
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
      color: "#065cc4",
    },
  },
  linkMui1: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
      color: "#065cc4",
    },
  },
}));

const ViewAllCodeReviews = () => {
  const classes = styles();
  const history = useHistory();

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
  const [user, setUser] = useState();

  const [snippet, setSnippet] = useState("");
  const [snippetTitle, setSnippetTitle] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("python");

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const [addSnippetDialog, setAddSnippetDialog] = useState(false);

  const [viewMySnippet, setViewMySnippet] = useState(false);
  const [codeReviews, setCodeReviews] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);

      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);
          if (res.data.member) {
            setUser("member");
          } else {
            if (res.data.partner) {
              setUser("partner");
            } else {
              setUser("admin");
            }
          }
        })
        .catch((err) => {});
    }
  };

  const getAllCodeReview = (text) => {
    if (text) {
      Service.client
        .get(`/code-reviews/member/`)
        .then((res) => {
          console.log(res);
          setCodeReviews(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/code-reviews`)
        .then((res) => {
          console.log(res);
          setCodeReviews(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    getAllCodeReview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resuableChip = (label, index, backgroundColor, fontColor) => {
    return (
      <Chip
        key={index}
        label={label}
        style={{
          marginRight: "10px",
          marginBottom: "10px",
          color: fontColor ? fontColor : "#000",
          fontWeight: 600,
          backgroundColor: backgroundColor,
        }}
      />
    );
  };

  const handleAddNewSnippet = () => {
    if (!snippetTitle || snippetTitle === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Title cannot be empty",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (!snippet || snippet === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Code snippet cannot be empty",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    let neverChooseOne = true;
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
      return;
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 coding language/framework",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    let data = {
      title: snippetTitle,
      code: snippet,
      coding_languages: [codeLanguage],
      languages: ["ENG"],
      categories: [],
    };

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
      .post(`/code-reviews`, data)
      .then((res) => {
        // console.log(res);
        history.push(`/codereview/${res.data.id}`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Navbar
        logo={components.navLogo}
        bgColor="#fff"
        navbarItems={
          loggedIn && loggedIn
            ? components.loggedInNavbar(() => {
                Service.removeCredentials();
                setLoggedIn(false);
                history.push("/");
              }, user && user)
            : components.memberNavbar
        }
      />
      <div className={classes.content}>
        <div className={classes.title}>
          <Typography variant="h2" className={classes.heading}>
            code review
          </Typography>
          <div>
            {loggedIn &&
              (viewMySnippet ? (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<People />}
                  style={{ height: 30 }}
                  onClick={() => {
                    setViewMySnippet(false);
                    getAllCodeReview();
                  }}
                >
                  View All Snippets
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Person />}
                  style={{ height: 30 }}
                  onClick={() => {
                    setViewMySnippet(true);
                    getAllCodeReview("my");
                  }}
                >
                  View My Snippets
                </Button>
              ))}
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Add />}
              onClick={() => setAddSnippetDialog(true)}
              style={{ height: 30, marginLeft: "10px" }}
              disabled={!loggedIn}
            >
              Add Code Snippet
            </Button>
          </div>
        </div>
        <div
          style={{
            marginTop: "40px",
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          {codeReviews && codeReviews.length > 0 ? (
            codeReviews.map((code, index) => {
              return (
                <Paper key={index} className={classes.codeReview}>
                  <div>
                    <LinkMui
                      className={classes.linkMui}
                      onClick={() => history.push(`/codereview/${code.id}`)}
                    >
                      {code.title}
                    </LinkMui>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    {code &&
                      code.categories.length > 0 &&
                      code.categories.map((category, index) => {
                        if (category === "FE") {
                          return resuableChip("Frontend", index, "#DD8B8B");
                        } else if (category === "BE") {
                          return resuableChip("Backend", index, "#A0DD8B");
                        } else if (category === "DB") {
                          return resuableChip(
                            "Database Administration",
                            index,
                            "#8B95DD"
                          );
                        } else if (category === "SEC") {
                          return resuableChip("Security", index, "#DDB28B");
                        } else if (category === "UI") {
                          return resuableChip("UI/UX", index, "#DDD58B");
                        } else if (category === "ML") {
                          return resuableChip(
                            "Machine Learning",
                            index,
                            "#8BD8DD"
                          );
                        } else {
                          return null;
                        }
                      })}
                    {code &&
                      code.coding_languages.length > 0 &&
                      code.coding_languages.map((language, index) => {
                        if (language === "PY") {
                          return resuableChip(
                            "Python",
                            index,
                            "#3675A9",
                            "#fff"
                          );
                        } else if (language === "JAVA") {
                          return resuableChip("Java", index, "#E57001", "#fff");
                        } else if (language === "JS") {
                          return resuableChip("Javascript", index, "#F7DF1E");
                        } else if (language === "RUBY") {
                          return resuableChip("Ruby", index, "#CC0000");
                        } else if (language === "CPP") {
                          return resuableChip("C++", index, "#004482", "#fff");
                        } else if (language === "CS") {
                          return resuableChip("C#", index, "#6A1577", "#fff");
                        } else if (language === "HTML") {
                          return resuableChip("HTML", index, "#E44D26", "#fff");
                        } else if (language === "CSS") {
                          return resuableChip("CSS", index, "#264DE4", "#fff");
                        } else {
                          return null;
                        }
                      })}
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Favorite style={{ marginRight: "5px" }} />
                      {`${code && code.likes}`}
                    </div>
                    <div
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                      }}
                    >
                      <div>
                        {code.user.profile_photo && code.user.profile_photo ? (
                          <Avatar
                            style={{ marginRight: "15px" }}
                            src={code.user && code.user.profile_photo}
                          />
                        ) : (
                          <Avatar style={{ marginRight: "15px" }}>
                            {code.user && code.user.first_name.charAt(0)}
                          </Avatar>
                        )}
                      </div>
                      <div style={{ flexDirection: "column" }}>
                        <LinkMui className={classes.linkMui1}>
                          {`${code && code.user.first_name} ${
                            code && code.user.last_name
                          }`}
                        </LinkMui>
                        <Typography variant="body2" style={{ opacity: 0.8 }}>
                          {` asked ${
                            code && calculateDateInterval(code.timestamp)
                          }`}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Paper>
              );
            })
          ) : (
            <div style={{ textAlign: "center" }}>
              <Forum fontSize="large" />
              <Typography variant="h2">
                No Code Snippets for Review Yet
              </Typography>
            </div>
          )}
        </div>
      </div>
      <AddSnippetDialog
        addSnippetDialog={addSnippetDialog}
        setAddSnippetDialog={setAddSnippetDialog}
        snippetTitle={snippetTitle}
        setSnippetTitle={setSnippetTitle}
        categories={categories}
        setCategories={setCategories}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        handleAddNewSnippet={handleAddNewSnippet}
        snippet={snippet}
        setSnippet={setSnippet}
      />
    </div>
  );
};

export default ViewAllCodeReviews;
