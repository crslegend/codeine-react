import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Chip, Avatar, IconButton } from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

import Service from "../AxiosService";
import components from "./components/NavbarComponents";
import Navbar from "../components/Navbar";
import { calculateDateInterval } from "../utils.js";
import CommentSection from "./components/CommentSection";
import CodeLine from "./components/CodeLine";
import { Grade, GradeOutlined } from "@material-ui/icons";
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
    padding: theme.spacing(4, 8),
    width: "100%",
    margin: `${theme.spacing(8)}px auto 0`,
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  flexItem: {
    flexGrow: 1,
  },
  container: {
    display: "flex",
    width: "100%",
  },
  codeContainer: {
    width: "65%",
    marginRight: theme.spacing(2),
  },
  commentContainer: {
    width: "35%",
  },
  avatar: {
    marginRight: theme.spacing(1),
  },
  linkMui: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
      color: "#065cc4",
    },
  },
  iconButton: {
    padding: theme.spacing(0.5),
    margin: "-4px 8px",
    fontSize: "22px",
    color: theme.palette.grey[400],
    borderRadius: "10px",
    border: `1px solid ${theme.palette.grey[400]}`,
    "&:hover": {
      color: theme.palette.primary.main,
      border: `1px solid ${theme.palette.primary.main}`,
      background: "transparent",
    },
  },
  activeIconButton: {
    padding: theme.spacing(0.5),
    margin: "-4px 8px",
    fontSize: "22px",
    color: theme.palette.yellow.main,
    borderRadius: "10px",
    border: `1px solid ${theme.palette.yellow.main}`,
    "&:hover": {
      color: theme.palette.orange.main,
      border: `1px solid ${theme.palette.orange.main}`,
      background: "transparent",
    },
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

// const getCommentsByLine = () => {
//   // instantiate array
// }

const CodeReviewDetails = () => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();

  // navbar states
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  // initializing states
  const [code, setCode] = useState();
  const [codeComments, setCodeComments] = useState([]);
  const [selectedLine, setSelectedLine] = useState(1);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);

      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res.data);
          if (res.data.member) {
            setUser("member");
          } else if (res.data.partner) {
            setUser("partner");
          }
          // setUser(res.data);
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
        // console.log(res.data);
        setCode(res.data);
      })
      .catch((err) => {
        history.push("/codereview");
      })
      .then(() => setLoading(false));
  };

  const getCodeReviewComments = () => {
    Service.client
      .get(`/code-reviews/${id}/comments`)
      .then((res) => {
        // console.log(res.data);
        const flatComments = res.data.map((comment) => {
          if (comment.replies.length <= 0) {
            return comment;
          }

          const replies = comment.replies.flatMap((reply) =>
            reply.replies.length > 0 ? [reply, ...reply.replies] : [reply]
          );

          return {
            ...comment,
            replies: replies,
          };
        });

        setCodeComments(flatComments);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getCodeReview();
    getCodeReviewComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const likeCodeReview = () => {
    Service.client
      .post(`/code-reviews/${code.id}/engagements`)
      .then((res) => {
        // console.log(res.data);
        setCode(res.data);
      })
      .catch((err) => console.log(err));
  };

  const unlikeCodeReview = () => {
    Service.client
      .delete(`/code-reviews/${code.id}/engagements`)
      .then((res) => {
        console.log(res.data);
        setCode(res.data);
      })
      .catch((err) => console.log(err));
  };

  if (loading) {
    return "Loading...";
  }

  return (
    <div className={classes.root}>
      {user === "member" && <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
      {user === "partner" && <PartnerNavbar />}
      {!loggedIn && <Navbar logo={components.navLogo} bgColor="#fff" navbarItems={components.loggedOutNavbar} />}
      <div className={classes.content}>
        {/* <Typography variant="h2">{code && code.title}</Typography> */}
        <div className={classes.flex} style={{ marginBottom: "8px" }}>
          <Avatar
            className={classes.avatar}
            alt={code ? code.user.first_name : "Profile photo"}
            src={code && code.user.profile_photo}
          />
          <div>
            <Typography variant="h6">
              {code.user.member && code.user.member.pro ? (
                <LinkMui href={`/member/profile/${code && code.user.id}`} className={classes.linkMui}>
                  {`${code && code.user.first_name} ${code && code.user.last_name}`}
                </LinkMui>
              ) : (
                `${code && code.user.first_name} ${code && code.user.last_name}`
              )}
              /{code && code.title}
            </Typography>
            <Typography variant="body2" style={{ opacity: 0.8 }}>
              submitted {code && calculateDateInterval(code.timestamp)}
            </Typography>
          </div>
          <div className={classes.flex} style={{ margin: "8px 32px" }}>
            <IconButton
              disableRipple
              classes={{
                root: code && code.current_user_liked ? classes.activeIconButton : classes.iconButton,
              }}
              size="small"
              onClick={() => (code && code.current_user_liked ? unlikeCodeReview() : likeCodeReview())}
            >
              {code.current_user_liked ? <Grade /> : <GradeOutlined />}
              <span style={{ fontSize: "14px", margin: "0 8px" }}>Likes: {code.likes}</span>
            </IconButton>
          </div>
        </div>
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2">Categories: </Typography>
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
            <CommentSection
              comments={codeComments}
              selectedLine={selectedLine}
              reviewAuthor={code && code.user}
              getCodeReviewComments={getCodeReviewComments}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeReviewDetails;
