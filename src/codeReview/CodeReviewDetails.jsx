import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import hljs from "highlight.js";

import Service from "../AxiosService";
import components from "./components/NavbarComponents";
import Toast from "../components/Toast.js";
import Navbar from "../components/Navbar";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  content: {
    padding: theme.spacing(8),
    width: "80%",
    margin: `${theme.spacing(8)}px auto`,
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  gutter: {
    padding: theme.spacing(0.5, 2),
    background: "rgba(67, 127, 199, 0.2)",
    color: theme.palette.secondary.main,
  },
  codeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.5, 2),
    background: "rgba(164, 201, 245, 0.2)",
    color: "#1e1e1e",
  },
}));

const CodeLine = ({ index, code, language }) => {
  const classes = useStyles();

  return (
    <div className={classes.flex}>
      <div className={classes.gutter}>{index}</div>
      <div className={classes.codeBody}>
        <pre style={{ margin: 0 }}>
          <div dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code, [language]).value }} />
        </pre>
      </div>
    </div>
  );
};

const CodeReviewDetails = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  // snackbar props
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

  // navbar states
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();

  // initializing states
  const [code, setCode] = useState();
  const [codeComments, setCodeComments] = useState([]);
  const [replyToCommentArr, setReplyToCommentArr] = useState([]);

  console.log(code);
  console.log(codeComments);
  console.log(replyToCommentArr);

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
        .catch((err) => {
          history.push("/codereview");
        });
    }
  };

  const getCodeReview = () => {
    Service.client
      .get(`/code-reviews/${id}`)
      .then((res) => {
        console.log(res.data);
        setCode(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCodeReviewComments = () => {
    Service.client
      .get(`/code-reviews/${id}/comments`)
      .then((res) => {
        console.log(res.data);

        let parentCommentArr = [];
        let replyCommentArr = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].parent_comment) {
            replyCommentArr.push(res.data[i]);
          } else {
            parentCommentArr.push(res.data[i]);
          }
        }
        // setCodeComments([]); // to reset the state of sidenotes
        parentCommentArr.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        setCodeComments(parentCommentArr);
        replyCommentArr.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        setReplyToCommentArr(replyCommentArr);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getCodeReview();
    getCodeReviewComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Typography variant="h2">{code && code.title}</Typography>
        {code &&
          code.code
            .split("\n")
            .map((line, i) => <CodeLine index={i + 1} code={line} language={code.coding_languages[0]} />)}
      </div>
    </div>
  );
};

export default CodeReviewDetails;
