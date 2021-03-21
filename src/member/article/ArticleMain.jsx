import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ListItem, Typography } from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Service from "../../AxiosService";
import CommentDrawer from "./ArticleComments";
import ViewArticle from "./ViewArticle";
import ArticleIDE from "./ArticleIDE";
import Footer from "./Footer";
import MemberNavBar from "../MemberNavBar";
import Toast from "../../components/Toast.js";
import jwt_decode from "jwt-decode";

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
}));

const ArticleMain = () => {
  const classes = useStyles();
  const history = useHistory();
  //const { state } = useLocation();
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

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
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

  const editorBubble = {
    toolbar: [],
  };

  useEffect(() => {
    checkIfLoggedIn();
    Service.client
      .get(`/articles/${id}`)
      .then((res) => {
        console.log(res.data);
        setArticleDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIDE, setOpenIDE] = useState(false);

  const [saveState, setSaveState] = useState(true);

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
          <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

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
          />
          <Footer />
        </>
      )}
    </div>
  );
};

export default ArticleMain;
