import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  ListItem,
  Grid,
  Chip,
  Typography,
} from "@material-ui/core";
import { Language } from "@material-ui/icons";
import { Link, useHistory, useParams } from "react-router-dom";
import Service from "../../AxiosService";
import Toast from "../../components/Toast.js";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import CommentIcon from "@material-ui/icons/Comment";
import ReactQuill from "react-quill";

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
}));

const ViewArticle = (props) => {
  const classes = useStyles();
  const { id } = useParams();

  const {
    articleDetails,
    setArticleDetails,
    drawerOpen,
    setDrawerOpen,
    openEditor,
    setOpenEditor,
    openIDE,
    setOpenIDE,
    setSbOpen,
    setSnackbar,
  } = props;

  useEffect(() => {
    getNumStatus();
    getNumOfLikes();
  }, []);

  const [numOfLikes, setNumOfLikes] = useState(0);
  const [articleLikedStatus, setArticleLikedStatus] = useState(false);

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

  const getNumStatus = () => {
    let queryParams = {
      is_user: true,
    };
    Service.client
      .get(`/articles/${id}/engagement`, {
        params: { ...queryParams },
      })
      .then((res) => {
        if (res.data[0].like === 0) {
          setArticleLikedStatus(false);
        } else {
          setArticleLikedStatus(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLikeArticle = (e) => {
    setArticleLikedStatus(!articleLikedStatus);
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
            .post(`/articles/${articleDetails.id}`)
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
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid container alignItems="center" justify="center">
          <Grid md={3} item>
            <UseAnimations
              animation={heart}
              size={30}
              reverse={articleLikedStatus}
              wrapperStyle={{
                display: "inline-flex",
              }}
              onClick={(e) => handleLikeArticle(e)}
            />
            <Typography style={{ display: "inline-flex" }}>
              {numOfLikes}
            </Typography>
            <br />
            <CommentIcon onClick={() => setDrawerOpen(true)} />
            <Typography style={{ display: "inline-flex" }}>xx</Typography>
            <div style={{ display: "flex" }}>
              <Language style={{ marginRight: "10px" }} />
              {articleDetails &&
                articleDetails.languages &&
                articleDetails.languages.length > 0 &&
                articleDetails.languages.map((language, index) => {
                  if (index + 1 !== articleDetails.languages.length) {
                    if (language === "ENG") {
                      return <Typography key={index}>English, </Typography>;
                    } else if (language === "MAN") {
                      return <Typography key={index}>中文, </Typography>;
                    } else {
                      return <Typography key={index}>Français, </Typography>;
                    }
                  } else {
                    if (language === "ENG") {
                      return <Typography key={index}>English</Typography>;
                    } else if (language === "MAN") {
                      return <Typography key={index}>中文</Typography>;
                    } else {
                      return <Typography key={index}>Français</Typography>;
                    }
                  }
                })}
            </div>
            <Typography
              variant="body1"
              style={{ fontWeight: 600, marginBottom: "10px" }}
            >
              Categories this article falls under:
            </Typography>
            {articleDetails &&
              articleDetails.categories &&
              articleDetails.categories.length > 0 &&
              articleDetails.categories.map((category, index) => {
                if (category === "FE") {
                  return (
                    <Chip
                      key={index}
                      label="Frontend"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (category === "BE") {
                  return (
                    <Chip
                      key={index}
                      label="Backend"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (category === "UI") {
                  return (
                    <Chip
                      key={index}
                      label="UI/UX"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (category === "DB") {
                  return (
                    <Chip
                      key={index}
                      label="Database Administration"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (category === "ML") {
                  return (
                    <Chip
                      key={index}
                      label="Machine Learning"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else {
                  return (
                    <Chip
                      key={index}
                      label="Security"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                }
              })}
            <Typography
              variant="body1"
              style={{
                fontWeight: 600,
                marginBottom: "10px",
                marginTop: "20px",
              }}
            >
              Coding Languages/Frameworks:
            </Typography>
            {articleDetails &&
              articleDetails.coding_languages &&
              articleDetails.coding_languages.length > 0 &&
              articleDetails.coding_languages.map((language, index) => {
                if (language === "PY") {
                  return (
                    <Chip
                      key={index}
                      label="Python"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (language === "JAVA") {
                  return (
                    <Chip
                      key={index}
                      label="Java"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (language === "JS") {
                  return (
                    <Chip
                      key={index}
                      label="Javascript"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (language === "CPP") {
                  return (
                    <Chip
                      key={index}
                      label="C++"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (language === "CS") {
                  return (
                    <Chip
                      key={index}
                      label="C#"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else if (language === "RUBY") {
                  return (
                    <Chip
                      key={index}
                      label="Ruby"
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                } else {
                  return (
                    <Chip
                      key={index}
                      label={language}
                      style={{ marginRight: "10px", marginBottom: "10px" }}
                    />
                  );
                }
              })}
          </Grid>
          <Grid md={6} item className={classes.demo}>
            <Typography>{articleDetails.title}</Typography>

            <ReactQuill
              theme={"bubble"}
              value={articleDetails.content}
              readOnly={openEditor}
            />
          </Grid>
          <Grid md={3} item></Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewArticle;
