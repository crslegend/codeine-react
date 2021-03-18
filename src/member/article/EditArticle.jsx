import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Typography,
  Grid,
  ListItem,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import logo from "../../assets/CodeineLogos/Member.svg";
import Service from "../../AxiosService";
import { useDebounce } from "use-debounce";
import ReactQuill from "react-quill";
import { ToggleButton } from "@material-ui/lab";
import Toast from "../../components/Toast.js";
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
}));

const EditArticle = () => {
  const classes = useStyles();
  const history = useHistory();
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

  useEffect(() => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const memberid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${memberid}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          setUser();
        });
      Service.client
        .get(`/articles/${id}`)
        .then((res1) => {
          console.log(res1.data);
          //setArticleDetails(res1.data);
          getFields(res1.data);
        })
        .catch(() => {});
    }
  }, []);

  const [debouncedText] = useDebounce(articleDetails, 1500);
  const [saveState, setSaveState] = useState(true);

  // useEffect(() => {
  //   if (debouncedText) {
  //     setSaveState(true);
  //     if (!articleDetails.is_published) {
  //       Service.client
  //         .put(`/articles/${id}`, articleDetails)
  //         .then((res) => {
  //           setSaveState(true);
  //         })
  //         .catch((err) => {
  //           console.log(err);
  //         });
  //     }
  //   }
  // }, [debouncedText]);

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

  const getFields = (currentarticle) => {
    setArticleDetails(currentarticle);
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
  };

  const saveFields = () => {
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

  const handleSubmit = () => {
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

    saveFields();

    Service.client
      .put(`/articles/${id}`, articleDetails)
      .then((res) => {
        setArticleDetails(res.data);
        setSbOpen(true);
        setSnackbar({
          message: "Article updated successfully",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
          <img src={logo} width="120%" alt="codeine logo" />
        </Link>
        {user && articleDetails && !articleDetails.is_published && (
          <div style={{ display: "flex", alignItems: "center" }}>
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
      </div>
    </Fragment>
  );

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
            //setLoggedIn(false);
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
            value={articleDetails && articleDetails.content}
            modules={editor}
            format={format}
            id="content"
            name="content"
            style={{ height: "78vh", marginBottom: "50px" }}
            onChange={(event) => {
              setArticleDetails({
                ...articleDetails,
                content: event,
              });
              setSaveState(false);
            }}
            placeholder="Compose an epic..."
          />
        </Grid>
        <Grid item xs={4} className={classes.gridlayout}>
          <div style={{ marginBottom: "30px" }}>
            <Button
              variant="contained"
              color="primary"
              style={{
                textTransform: "capitalize",
              }}
              onClick={(e) => handleSubmit(e)}
            >
              {articleDetails && articleDetails.is_published
                ? "Save and publish"
                : "Publish"}
            </Button>
            <Button
              variant="contained"
              style={{
                textTransform: "capitalize",
              }}
              onClick={() => history.push(`/article/${id}`)}
            >
              Back to article
            </Button>
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
    </div>
  );
};

export default EditArticle;
