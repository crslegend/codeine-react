import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, ListItem } from "@material-ui/core";
import { useHistory, useParams, useLocation, Link } from "react-router-dom";
import Service from "../AxiosService";
import CommentDrawer from "./ArticleComments";
import ViewArticle from "./ViewArticle";
import ArticleIDE from "./ArticleIDE";
import Footer from "./Footer";
import MemberNavBar from "../member/MemberNavBar";
import Navbar from "../components/Navbar";
import partnerLogo from "../assets/CodeineLogos/Partner.svg";
import adminLogo from "../assets/CodeineLogos/Admin.svg";
import Toast from "../components/Toast.js";
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
  const location = useLocation();
  const userType = location.pathname.split("/", 3)[2];
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
      const userid = jwt_decode(Service.getJWT()).user_id;
      if (userType === "member") {
        Service.client
          .get(`/auth/members/${userid}`)
          .then((res) => {
            setUser(res.data);
            setLoggedIn(true);
          })
          .catch((err) => {
            setUser(null);
          });
      } else if (userType === "partner") {
        Service.client
          .get(`/auth/partners/${userid}`)
          .then((res) => {
            setUser(res.data);
            setLoggedIn(true);
          })
          .catch((err) => {
            setUser(null);
          });
      } else if (userType === "admin") {
        Service.client
          .get(`/auth/admins/${userid}`)
          .then((res) => {
            setUser(res.data);
            setLoggedIn(true);
          })
          .catch((err) => {
            setUser(null);
          });
      }
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
