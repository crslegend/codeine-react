import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Chip, Avatar } from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import Service from "../AxiosService";
import components from "./components/NavbarComponents";
import Navbar from "../components/Navbar";
import { calculateDateInterval } from "../utils.js";
import CommentSection from "./components/CommentSection";
import CodeLine from "./components/CodeLine";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  content: {
    padding: theme.spacing(4, 8),
    width: "80%",
    margin: `${theme.spacing(8)}px auto`,
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  container: {
    display: "flex",
    width: "100%",
  },
  codeContainer: {
    width: "70%",
    marginRight: theme.spacing(2),
  },
  commentContainer: {
    width: "30%",
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
}));

const reusableChip = (label, index, backgroundColor, fontColor) => {
  return (
    <Chip
      key={index}
      label={label}
      size="small"
      style={{
        color: fontColor ? fontColor : "#000",
        fontWeight: 600,
        backgroundColor: backgroundColor,
        margin: 8,
      }}
    />
  );
};

const CodeReviewDetails = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  // navbar states
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();

  // initializing states
  const [code, setCode] = useState();
  const [codeComments, setCodeComments] = useState([]);
  const [replyToCommentArr, setReplyToCommentArr] = useState([]);
  const [selectedLine, setSelectedLine] = useState(1);

  console.log(code);
  console.log(codeComments);
  console.log(replyToCommentArr);
  console.log(selectedLine);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);

      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res.data);
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err);
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
        // console.log(res.data);

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
        {/* <Typography variant="h2">{code && code.title}</Typography> */}
        <div className={classes.flex} style={{ marginBottom: "8px" }}>
          <Avatar
            className={classes.avatar}
            alt={user ? user.first_name : "Profile photo"}
            src={user && user.profile_photo}
          />
          <div>
            <Typography variant="h6">
              <LinkMui className={classes.linkMui}>
                {`${code && code.user.first_name} ${code && code.user.last_name}`}
              </LinkMui>
              /{code && code.title}
            </Typography>
            <Typography variant="body2" style={{ opacity: 0.8 }}>
              Created {code && calculateDateInterval(code.timestamp)}
            </Typography>
          </div>
        </div>
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center" }}>
          <Typography variant="body2">Categories: </Typography>
          {code &&
            code.categories.length > 0 &&
            code.categories.map((category, index) => {
              if (category === "FE") {
                return reusableChip(category, index, "#DD8B8B");
              } else if (category === "BE") {
                return reusableChip(category, index, "#A0DD8B");
              } else if (category === "DB") {
                return reusableChip(category, index, "#8B95DD");
              } else if (category === "SEC") {
                return reusableChip(category, index, "#DDB28B");
              } else if (category === "UI") {
                return reusableChip(category, index, "#DDD58B");
              } else if (category === "ML") {
                return reusableChip(category, index, "#8BD8DD");
              } else {
                return null;
              }
            })}
        </div>
        <div className={classes.container}>
          <div className={classes.codeContainer}>
            {code &&
              code.code
                .split("\n")
                .map((line, i) => (
                  <CodeLine
                    key={i}
                    index={i + 1}
                    code={line}
                    language={code.coding_languages[0]}
                    selectedLine={selectedLine}
                    setSelectedLine={setSelectedLine}
                    loggedIn={loggedIn}
                    getCodeReviewComments={getCodeReviewComments}
                  />
                ))}
          </div>
          <div className={classes.commentContainer}>
            <CommentSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewDetails;
