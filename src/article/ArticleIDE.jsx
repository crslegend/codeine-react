import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Chip,
  Avatar,
  Typography,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import Service from "../AxiosService";
// import Toast from "../components/Toast.js";
import { ArrowBack } from "@material-ui/icons";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import CommentIcon from "@material-ui/icons/Comment";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import parse, { attributesToProps } from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  tile: {
    height: "100%",
    padding: theme.spacing(3),
    overflow: "auto",
  },
  split: {
    height: "100vh",
  },
  chip: {
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "3px",
    backgroundColor: "#f2f2f2",
  },
  loader: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const MemberArticleIDE = (props) => {
  const classes = useStyles();
  const { id } = useParams();

  const {
    articleDetails,
    setArticleDetails,
    setDrawerOpen,
    openIDE,
    setOpenIDE,
    setSbOpen,
    setSnackbar,
    articleEngagement,
    setArticleEngagement,
  } = props;

  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const [portNum, setPortNum] = useState();
  const [loadingIDE, setLoadingIDE] = useState(true);

  const startIDE = () => {
    Service.client
      .get(`ide`, {
        params: {
          git_url: "https://github.com/ptm108/Graspfood2",
          course_name: "",
        },
      })
      .then((res) => {
        //   console.log(res);
        setPortNum(res.data.port);
        setLoadingIDE(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getNumOfLikes();
    startIDE();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.name === "img") {
        const props = attributesToProps(domNode.attribs);
        return <img style={{ width: "100%" }} alt="" {...props} />;
      }
    },
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const [numOfLikes, setNumOfLikes] = useState(0);

  const getNumOfLikes = () => {
    let likes = 0;
    Service.client
      .get(`/articles/${id}/engagement`)
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          likes = likes + res.data[i].like;
        }
        setNumOfLikes(likes);
      })
      .catch((err1) => {
        console.log(err1);
      });
  };

  const handleLikeArticle = (e) => {
    if (user) {
      setArticleDetails({
        ...articleDetails,
        current_user_liked: setArticleDetails.current_user_liked,
      });
      let queryParams = {
        is_user: true,
      };
      Service.client
        .get(`/articles/${articleDetails.id}/engagement`, {
          params: { ...queryParams },
        })
        .then((res) => {
          if (res.data.length === 0) {
            Service.client
              .post(`/articles/${articleDetails.id}/engagement`, {
                like: 1,
              })
              .then((res1) => {
                getNumOfLikes();
              })
              .catch((err1) => {
                console.log(err1);
              });
          } else {
            if (res.data[0].like === 0) {
              Service.client
                .put(`/articles/${id}/engagement/${res.data[0].id}`, {
                  like: 1,
                })
                .then((res1) => {
                  getNumOfLikes();
                })
                .catch((err1) => {
                  console.log(err1);
                });
            } else {
              Service.client
                .put(`/articles/${id}/engagement/${res.data[0].id}`, {
                  like: 0,
                })
                .then((res1) => {
                  getNumOfLikes();
                })
                .catch((err1) => {
                  console.log(err1);
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert(
        "please login! - to discuss the flow, should we redirect to member login page? but not all viewers of article are members..."
      );
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.split}>
        <Splitter direction={SplitDirection.Horizontal} initialSizes={[55, 65]}>
          <div className={classes.tile}>
            <div style={{ height: "100%" }}>
              <IconButton onClick={() => setOpenIDE(false)}>
                <ArrowBack />
              </IconButton>
              <Typography
                variant="h1"
                style={{ fontWeight: "600", marginBottom: "10px" }}
              >
                {articleDetails.title}
              </Typography>

              {articleDetails.user && (
                <div
                  style={{
                    display: "flex",
                    marginRight: "15px",
                    alignItems: "right",
                    marginBottom: "20px",
                    order: 2,
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <Avatar
                      src={articleDetails.user.profile_photo}
                      alt=""
                      style={{ marginRight: "15px" }}
                    ></Avatar>
                  </div>
                  <div style={{ flexDirection: "column" }}>
                    <Typography
                      style={{ display: "flex", fontWeight: "550" }}
                      variant="body2"
                    >
                      {articleDetails.user.first_name +
                        " " +
                        articleDetails.user.last_name}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(articleDetails.date_created)}
                    </Typography>
                  </div>
                </div>
              )}

              <div style={{ fontSize: "20px", marginBottom: "30px" }}>
                {parse(articleDetails.content, options)}

                {articleDetails &&
                  articleDetails.coding_languages &&
                  articleDetails.coding_languages.length > 0 &&
                  articleDetails.coding_languages.map((language, index) => {
                    if (language === "PY") {
                      return (
                        <Chip
                          key={index}
                          label="Python"
                          className={classes.chip}
                        />
                      );
                    } else if (language === "JAVA") {
                      return (
                        <Chip
                          key={index}
                          label="Java"
                          className={classes.chip}
                        />
                      );
                    } else if (language === "JS") {
                      return (
                        <Chip
                          key={index}
                          label="Javascript"
                          className={classes.chip}
                        />
                      );
                    } else if (language === "CPP") {
                      return (
                        <Chip
                          key={index}
                          label="C++"
                          className={classes.chip}
                        />
                      );
                    } else if (language === "CS") {
                      return (
                        <Chip key={index} label="C#" className={classes.chip} />
                      );
                    } else if (language === "RUBY") {
                      return (
                        <Chip
                          key={index}
                          label="Ruby"
                          className={classes.chip}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          key={index}
                          label={language}
                          className={classes.chip}
                        />
                      );
                    }
                  })}
                {articleDetails &&
                  articleDetails.categories &&
                  articleDetails.categories.length > 0 &&
                  articleDetails.categories.map((category, index) => {
                    if (category === "FE") {
                      return (
                        <Chip
                          key={index}
                          label="Frontend"
                          className={classes.chip}
                        />
                      );
                    } else if (category === "BE") {
                      return (
                        <Chip
                          key={index}
                          label="Backend"
                          className={classes.chip}
                        />
                      );
                    } else if (category === "UI") {
                      return (
                        <Chip
                          key={index}
                          label="UI/UX"
                          className={classes.chip}
                        />
                      );
                    } else if (category === "DB") {
                      return (
                        <Chip
                          key={index}
                          label="Database Administration"
                          className={classes.chip}
                        />
                      );
                    } else if (category === "ML") {
                      return (
                        <Chip
                          key={index}
                          label="Machine Learning"
                          className={classes.chip}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          key={index}
                          label="Security"
                          className={classes.chip}
                        />
                      );
                    }
                  })}

                <div
                  style={{
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <UseAnimations
                    animation={heart}
                    size={30}
                    reverse={articleDetails.current_user_liked}
                    onClick={(e) => handleLikeArticle(e)}
                  />
                  <Typography style={{ marginRight: "15px" }}>
                    {numOfLikes} likes
                  </Typography>
                  <CommentIcon onClick={() => setDrawerOpen(true)} />
                  <Typography style={{ display: "inline-flex" }}>
                    {articleDetails.top_level_comments.length} responses
                  </Typography>
                </div>
                {/* <Divider style={{ marginTop: "20px" }} /> */}
              </div>

              {/* <div style={{ display: "flex" }}>
                <div style={{ display: "flex" }}>
                  <Avatar
                    src={
                      articleDetails.user && articleDetails.user.profile_photo
                    }
                    alt=""
                    style={{
                      width: "60px",
                      height: "60px",
                      marginRight: "15px",
                    }}
                  ></Avatar>
                </div>
                <div style={{ flexDirection: "column" }}>
                  <Typography
                    style={{ display: "flex", fontWeight: "550" }}
                    variant="body2"
                  >
                    WRITTEN BY
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: "600" }}>
                    {articleDetails.user && articleDetails.user.first_name}{" "}
                    {articleDetails.user && articleDetails.user.last_name}
                    {articleDetails.user && articleDetails.user.bio}
                  </Typography>
                </div>
              </div> */}
              {/* <Typography
                variant="body1"
                style={{ fontWeight: 600, marginBottom: "10px" }}
              >
                Categories this article falls under:
              </Typography> */}
            </div>
          </div>
          <div style={{ height: "100%", overflow: "auto" }}>
            {!loadingIDE && portNum ? (
              // eslint-disable-next-line jsx-a11y/iframe-has-title
              <iframe
                width="100%"
                height="100%"
                src={`http://localhost:${portNum}`}
              />
            ) : (
              <div className={classes.loader}>
                <CircularProgress />
                <Typography variant="h6" style={{ paddingTop: "10px" }}>
                  Fetching your IDE...
                </Typography>
              </div>
            )}
          </div>
        </Splitter>
      </div>
    </div>
  );
};

export default MemberArticleIDE;
