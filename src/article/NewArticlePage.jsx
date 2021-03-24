import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  ListItem,
  Typography,
  Grid,
} from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import Service from "../../AxiosService";
import logo from "../../assets/CodeineLogos/Member.svg";
import Toast from "../../components/Toast.js";
import ReactQuill, { Quill } from "react-quill";
import Footer from "./Footer";
import Navbar from "../../components/Navbar";
import Cookies from "js-cookie";
import { ToggleButton } from "@material-ui/lab";
import { useDebounce } from "use-debounce";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  createArticle: {
    paddingTop: "65px",
  },
  languageButtons: {
    minWidth: 80,
    marginRight: "15px",
    height: 30,
  },
  categoryButtons: {
    minWidth: 80,
    marginRight: "15px",
    marginBottom: "10px",
    height: 30,
  },
}));

function MemberNewArticlePage() {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useLocation();

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

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState();

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const [user, setUser] = useState();

  const getUserDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${userid}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          setUser();
        });
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    getUserDetails();
  }, []);

  const editor = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
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
    "font",
    "size",
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

  const [articleDetails, setArticleDetails] = useState({
    title: "",
    content: "",
    category: [],
    coding_languages: [],
    languages: [],
  });

  const [saveState, setSaveState] = useState(true);

  const [debouncedText] = useDebounce(articleDetails, 1500);

  useEffect(() => {
    if (debouncedText) {
      setSaveState(true);
      // Service.client
      //   .put(`/articles/`, articleDetails)
      //   .then((res) => {
      //     setSaveState(true);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    }
  }, [debouncedText]);

  const handleOnChangeTitle = (value) => {
    setArticleDetails({
      ...articleDetails,
      title: value,
    });
    setSaveState(false);
  };

  const handleOnChangeContent = (value) => {
    setArticleDetails({
      ...articleDetails,
      content: value,
    });
    setSaveState(false);
  };

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

  const handlePublish = () => {
    if (articleDetails.title === "" || articleDetails.content === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter required fields!",
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
      return;
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
      return;
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
      return;
    }

    // To publish article
    // Service.client
    //   .put(`/articles/`, articleDetails)
    //   .then((res) => {
    //     setSaveState(true);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const saveFields = (e) => {
    let data = {
      ...articleDetails,
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
  };

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link
          to="/member/home"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Dashboard
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            setLoggedIn(false);
            history.push("/");
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      {user && (
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
            <img src={logo} width="120%" alt="codeine logo" />
          </Link>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#000000" }}
          >
            Draft in {user.first_name + " " + user.last_name}
          </Typography>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#0000008a" }}
          >
            {saveState ? "-Saved" : "-Saving"}
          </Typography>
        </div>
      )}
    </Fragment>
  );

  return (
    <div className={classes.createArticle}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Navbar logo={navLogo} bgColor="#fff" navbarItems={loggedInNavbar} />

      <Grid container>
        <Grid item xs={8}>
          <TextField
            margin="normal"
            id="title"
            label="Title"
            name="title"
            fullWidth
            value={articleDetails.title}
            // error={firstNameError}
            onChange={(event) => handleOnChangeTitle(event.target.value)}
          />
          <ReactQuill
            theme="snow"
            value={articleDetails.content}
            modules={editor}
            format={format}
            id="content"
            name="content"
            onChange={(event) => handleOnChangeContent(event)}
            placeholder="Compose an epic..."
          />

          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            onClick={(e) => handlePublish(e)}
          >
            Submit
          </Button>
        </Grid>
        <Grid item xs={4}>
          <div style={{ marginBottom: "30px" }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Course Language (Choost at least 1)
            </Typography>
            <div>
              <ToggleButton
                value=""
                size="small"
                selected={languages && languages.ENG}
                onChange={() => {
                  setLanguages({ ...languages, ENG: !languages.ENG });
                  setSaveState(false);
                  saveFields();
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
                  saveFields();
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
                  saveFields();
                }}
                className={classes.languageButtons}
              >
                français
              </ToggleButton>
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Category (Choost at least 1)
            </Typography>
            <div>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.SEC}
                onChange={() => {
                  setCategories({ ...categories, SEC: !categories.SEC });
                  setSaveState(false);
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
                }}
                className={`${classes.categoryButtons}`}
              >
                Machine Learning
              </ToggleButton>
            </div>
          </div>
          <div style={{ marginBottom: "30px" }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Coding Language/Framework (Choost at least 1)
            </Typography>
            <div>
              <ToggleButton
                value=""
                size="small"
                selected={codeLanguage && codeLanguage.PY}
                onChange={() => {
                  setCodeLanguage({ ...codeLanguage, PY: !codeLanguage.PY });
                  setSaveState(false);
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
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
                  saveFields();
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Ruby
              </ToggleButton>
            </div>
          </div>
        </Grid>
      </Grid>

      <Footer />
    </div>
  );
}

export default MemberNewArticlePage;
