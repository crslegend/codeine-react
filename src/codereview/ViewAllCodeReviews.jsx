import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { useHistory } from "react-router-dom";
import logo from "../assets/CodeineLogos/Member.svg";
import { calculateDateInterval } from "../utils.js";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import components from "./components/NavbarComponents";
import PageTitle from "../components/PageTitle";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
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
    paddingTop: theme.spacing(3),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  const [snippet, setSnippet] = useState("");
  const [snippetTitle, setSnippetTitle] = useState("");
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

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const [addSnippetDialog, setAddSnippetDialog] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      coding_languages: [],
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
        console.log(res);
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
              })
            : components.memberNavbar
        }
      />
      <div className={classes.content}>
        <div className={classes.title}>
          <PageTitle title="Code Review" />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddSnippetDialog(true)}
            style={{ height: 30 }}
          >
            Add Code Snippet
          </Button>
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
