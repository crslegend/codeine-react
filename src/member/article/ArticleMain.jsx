import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, ListItem, Typography } from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Service from "../../AxiosService";
import logo from "../../assets/CodeineLogos/Member.svg";
import Navbar from "../../components/Navbar";
import CommentDrawer from "./ArticleComments";
import ViewArticle from "./ViewArticle";
import EditArticle from "./EditArticle";
import ArticleIDE from "./ArticleIDE";
import Footer from "./Footer";
import Cookies from "js-cookie";
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

  const [loggedIn, setLoggedIn] = useState(false);

  const [user, setUser] = useState(null);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
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
        setArticleDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openIDE, setOpenIDE] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/partner" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Teach on Codeine
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/member/register"
          style={{
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
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
      <Link
        to="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" alt="codeine logo" />
      </Link>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Navbar
        logo={navLogo}
        bgColor="#fff"
        navbarItems={loggedIn && loggedIn ? loggedInNavbar : memberNavbar}
      />

      <CommentDrawer
        user={user}
        openIDE={openIDE}
        setOpenIDE={setOpenIDE}
        openEditor={openEditor}
        setOpenEditor={setOpenEditor}
        articleDetails={articleDetails}
        setArticleDetails={setArticleDetails}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        setSnackbar={setSnackbar}
        setSbOpen={setSbOpen}
      />
      {openIDE ? (
        <ArticleIDE
          user={user}
          openIDE={openIDE}
          setOpenIDE={setOpenIDE}
          openEditor={openEditor}
          setOpenEditor={setOpenEditor}
          articleDetails={articleDetails}
          setArticleDetails={setArticleDetails}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          setSnackbar={setSnackbar}
          setSbOpen={setSbOpen}
        />
      ) : (
        <div>
          {openEditor ? (
            <EditArticle
              user={user}
              openIDE={openIDE}
              setOpenIDE={setOpenIDE}
              openEditor={openEditor}
              setOpenEditor={setOpenEditor}
              articleDetails={articleDetails}
              setArticleDetails={setArticleDetails}
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              setSnackbar={setSnackbar}
              setSbOpen={setSbOpen}
            />
          ) : (
            <ViewArticle
              user={user}
              openIDE={openIDE}
              setOpenIDE={setOpenIDE}
              openEditor={openEditor}
              setOpenEditor={setOpenEditor}
              articleDetails={articleDetails}
              setArticleDetails={setArticleDetails}
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              setSnackbar={setSnackbar}
              setSbOpen={setSbOpen}
            />
          )}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ArticleMain;
