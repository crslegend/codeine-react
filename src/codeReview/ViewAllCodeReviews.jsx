import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { useHistory } from "react-router-dom";
import { calculateDateInterval } from "../utils.js";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import components from "./components/NavbarComponents";
import { Avatar, Button, Chip, Paper, Typography } from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import { Add, Grade, People, Person, SpeakerNotesOff } from "@material-ui/icons";
import Toast from "../components/Toast.js";
import AddSnippetDialog from "./components/AddSnippetDialog";

import hljs from "highlight.js";
import MemberNavBar from "../member/MemberNavBar";
import PartnerNavbar from "../components/PartnerNavbar";

const useStyles = makeStyles((theme) => ({
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
  paperRoot: {
    display: "flex",
    marginBottom: theme.spacing(2),
  },
  codePreview: {
    width: "25%",
    height: "200px",
    padding: theme.spacing(1),
    opacity: 0.7,
    background: "rgba(164, 201, 245, 0.2)",
  },
  codeReview: {
    flexGrow: 1,
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
  },
  linkMui: {
    margin: theme.spacing(1),
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
  chip: {
    fontSize: "12px",
    height: 28,
    margin: theme.spacing(1, 0),
  },
  codeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 2),
    display: "flex",
    overflow: "hidden",
  },
  likesContainer: {
    color: theme.palette.yellow.main,
  },
}));

const ViewAllCodeReviews = () => {
  const classes = useStyles();
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

  console.log(codeReviews);

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
        .get(`/code-reviews/user/`)
        .then((res) => {
          // console.log(res);
          setCodeReviews(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/code-reviews`)
        .then((res) => {
          // console.log(res);
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

  const reusableChip = (label, index, backgroundColor, fontColor) => {
    return (
      <Chip
        key={index}
        label={label}
        className={classes.chip}
        style={{
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
        // console.log(res.data);
        history.push(`/codereview/${res.data.id}`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      {user === "member" && (
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}
      {user === "partner" && <PartnerNavbar />}
      {!loggedIn && (
        <Navbar
          logo={components.navLogo}
          bgColor="#fff"
          navbarItems={components.loggedOutNavbar}
        />
      )}

      <div className={classes.content}>
        <div className={classes.title}>
          <Typography variant="h2" className={classes.heading}>
            code reviews
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
                <Paper key={index} className={classes.paperRoot}>
                  <div className={classes.codePreview}>
                    {code &&
                      code.code
                        .split("\n")
                        .slice(0, 6)
                        .map((line) => (
                          <div className={classes.codeBody}>
                            <pre style={{ margin: 0 }}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: hljs.highlightAuto(line, [code.coding_languages[0]]).value,
                                }}
                              />
                            </pre>
                          </div>
                        ))}
                  </div>
                  <div className={classes.codeReview}>
                    <LinkMui className={classes.linkMui} onClick={() => history.push(`/codereview/${code.id}`)}>
                      {code.title}
                    </LinkMui>
                    <div>
                      {code &&
                        code.categories.length > 0 &&
                        code.categories.map((category, index) => {
                          if (category === "FE") {
                            return reusableChip("Frontend", index, "#DD8B8B");
                          } else if (category === "BE") {
                            return reusableChip("Backend", index, "#A0DD8B");
                          } else if (category === "DB") {
                            return reusableChip("Database Administration", index, "#8B95DD");
                          } else if (category === "SEC") {
                            return reusableChip("Security", index, "#DDB28B");
                          } else if (category === "UI") {
                            return reusableChip("UI/UX", index, "#DDD58B");
                          } else if (category === "ML") {
                            return reusableChip("Machine Learning", index, "#8BD8DD");
                          } else {
                            return null;
                          }
                        })}
                      {code &&
                        code.coding_languages.length > 0 &&
                        code.coding_languages.map((language, index) => {
                          if (language === "PY") {
                            return reusableChip("Python", index, "#3675A9", "#fff");
                          } else if (language === "JAVA") {
                            return reusableChip("Java", index, "#E57001", "#fff");
                          } else if (language === "JS") {
                            return reusableChip("Javascript", index, "#F7DF1E");
                          } else if (language === "RUBY") {
                            return reusableChip("Ruby", index, "#CC0000");
                          } else if (language === "CPP") {
                            return reusableChip("C++", index, "#004482", "#fff");
                          } else if (language === "CS") {
                            return reusableChip("C#", index, "#6A1577", "#fff");
                          } else if (language === "HTML") {
                            return reusableChip("HTML", index, "#E44D26", "#fff");
                          } else if (language === "CSS") {
                            return reusableChip("CSS", index, "#264DE4", "#fff");
                          } else {
                            return null;
                          }
                        })}
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Grade style={{ marginRight: "8px" }} className={classes.likesContainer} />
                        Likes: {code && code.likes}
                      </div>
                      <div
                        style={{
                          marginLeft: "auto",
                          display: "flex",
                        }}
                      >
                        <div>
                          {code.user.profile_photo && code.user.profile_photo ? (
                            <Avatar style={{ marginRight: "15px" }} src={code.user && code.user.profile_photo} />
                          ) : (
                            <Avatar style={{ marginRight: "15px" }}>
                              {code.user && code.user.first_name.charAt(0)}
                            </Avatar>
                          )}
                        </div>
                        <div style={{ flexDirection: "column" }}>
                          <LinkMui className={classes.linkMui1}>
                            {`${code && code.user.first_name} ${code && code.user.last_name}`}
                          </LinkMui>
                          <Typography variant="body2" style={{ opacity: 0.8 }}>
                            {` submitted ${code && calculateDateInterval(code.timestamp)}`}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </div>
                </Paper>
              );
            })
          ) : (
            <div style={{ textAlign: "center", height: "60vh", display: "grid", placeItems: "center" }}>
              <div>
                <SpeakerNotesOff style={{ color: "#676767" }} fontSize="large" />
                <Typography style={{ color: "#676767" }} variant="h5">
                  No code reviews submitted
                </Typography>
              </div>
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
