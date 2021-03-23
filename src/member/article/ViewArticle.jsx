import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Popover,
  Container,
  Chip,
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { Language } from "@material-ui/icons";
import { Link, useHistory, useParams } from "react-router-dom";
import Service from "../../AxiosService";
import Toast from "../../components/Toast.js";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import CommentIcon from "@material-ui/icons/Comment";
import Menu from "@material-ui/icons/MoreHoriz";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import ReactQuill from "react-quill";
import parse, { attributesToProps } from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
    paddingTop: "65px",
    backgroundColor: "#fff",
  },
  codeineLogo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10px",
    width: "25%",
    minWidth: "120px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    width: 120,
  },
  typography: {
    padding: theme.spacing(1),
    color: "#5c5c5c",
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
    },
  },
}));

const ViewArticle = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const {
    user,
    articleDetails,
    setArticleDetails,
    drawerOpen,
    setDrawerOpen,
    openIDE,
    setOpenIDE,
    setSbOpen,
    setSnackbar,
  } = props;

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

  const [dialogopen, setDialogOpen] = useState(false);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const checkIfOwnerOfComment = (userId) => {
    const decoded = jwt_decode(Cookies.get("t1"));
    if (decoded.user_id === userId) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    getNumStatus();
    getNumOfLikes();
  }, []);

  const [numOfLikes, setNumOfLikes] = useState(0);
  const [articleLikedStatus, setArticleLikedStatus] = useState(false);

  const getNumOfLikes = () => {
    if (user) {
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
    }
  };

  const getNumStatus = () => {
    let queryParams = {
      is_user: true,
    };
    if (user) {
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
    }
  };

  const handleLikeArticle = (e) => {
    if (user) {
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

  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.name === "img") {
        const props = attributesToProps(domNode.attribs);
        return <img style={{ width: "100%" }} alt="" {...props} />;
      }
    },
  };

  const openingIDE = () => {
    setOpenIDE(true);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverid = open ? "simple-popover" : undefined;

  const deleteArticle = () => {
    handleDialogClose();
    Service.client
      .delete(`/articles/${id}`)
      .then((res) => {
        alert("to check if member/admin/partner");
        history.push(`/member/articles`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unpublishArticle = () => {
    Service.client
      .patch(`/articles/${id}/unpublish`)
      .then((res) => {
        alert("to check if member/admin/partner");
        history.push(`/member/articles`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
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
            {user && checkIfOwnerOfComment(user.id) && (
              <div style={{ marginLeft: "auto" }}>
                {!openIDE && (
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      textTransform: "capitalize",
                    }}
                    onClick={() => openingIDE()}
                  >
                    Open IDE
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: "20px", marginBottom: "50px" }}>
          {parse(articleDetails.content, options)}
        </div>

        <div style={{ alignItems: "center", display: "flex" }}>
          <UseAnimations
            animation={heart}
            size={30}
            reverse={articleLikedStatus}
            onClick={(e) => handleLikeArticle(e)}
          />
          <Typography style={{ marginRight: "15px" }}>{numOfLikes}</Typography>
          <CommentIcon onClick={() => setDrawerOpen(true)} />
          <Typography style={{ display: "inline-flex" }}>
            {articleDetails.top_level_comments.length}
          </Typography>
          {user && checkIfOwnerOfComment(user.id) && (
            <Menu
              onClick={(e) => handleClick(e)}
              style={{ marginLeft: "auto", cursor: "pointer" }}
            />
          )}

          <Popover
            id={popoverid}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <div style={{ padding: "5px" }}>
              <Typography
                variant="body2"
                className={classes.typography}
                onClick={() => history.push(`/member/article/edit/${id}`)}
              >
                Edit article
              </Typography>
              <Typography
                variant="body2"
                className={classes.typography}
                onClick={() => unpublishArticle()}
              >
                Unpublish
              </Typography>
              <Typography
                variant="body2"
                className={classes.typography}
                onClick={handleClickOpen}
              >
                Delete
              </Typography>
            </div>
          </Popover>
        </div>

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

        {/* <ReactQuill
          value={articleDetails.content}
          readOnly={openEditor}
          theme={"bubble"}
        /> */}
      </Container>
      <Dialog
        open={dialogopen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Article?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this article?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => deleteArticle()}
            variant="contained"
            color="primary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewArticle;