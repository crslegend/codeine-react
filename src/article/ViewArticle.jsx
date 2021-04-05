import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Breadcrumbs,
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
import { useHistory, useParams, Link } from "react-router-dom";
import Service from "../AxiosService";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import CommentIcon from "@material-ui/icons/Comment";
import Menu from "@material-ui/icons/MoreVert";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import ReactQuill, { Quill } from "react-quill";
import parse, { attributesToProps } from "html-react-parser";
import FlagDialog from "./FlagArticleDialog";
import Toast from "../components/Toast";
import hljs from "highlight.js";
import "highlight.js/styles/darcula.css";
import "./quill.css";

hljs.configure({
  languages: ["javascript", "ruby", "python", "rust", "java", "html", "css"],
});

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
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
      backgroundColor: "#f5f5f5",
    },
  },
  chip: {
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "3px",
    backgroundColor: "#f2f2f2",
  },
  redButton: {
    backgroundColor: theme.palette.red.main,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
  container: {
    width: "50%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  pop: {
    padding: theme.spacing(1),
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
    setDrawerOpen,
    openIDE,
    setOpenIDE,
    userType,
  } = props;

  const modules = {
    toolbar: [[{ size: ["18px"] }]],
    syntax: {
      highlight: (text) => hljs.highlightAuto(text).value,
    },
  };

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

  const handleLikeArticle = (e) => {
    if (user) {
      // setArticleDetails({
      //   ...articleDetails,
      //   current_user_liked: setArticleDetails.current_user_liked,
      // });
      if (articleDetails.current_user_liked) {
        Service.client
          .delete(`/articles/${articleDetails.id}/engagements`)
          .then((res) => {
            setArticleDetails(res.data);
          })
          .catch((err1) => {
            console.log(err1);
          });
      } else {
        Service.client
          .post(`/articles/${articleDetails.id}/engagements`)
          .then((res) => {
            getArticleDetails();
          })
          .catch((err1) => {
            console.log(err1);
          });
      }
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

  const [anchorEl, setAnchorEl] = useState(null);

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
        if (userType === "member") {
          history.push(`/member/articles`);
        } else if (userType === "partner") {
          history.push(`/partner/home/article`);
        } else if (userType === "admin") {
          history.push(`/admin/article`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unpublishArticle = () => {
    Service.client
      .patch(`/articles/${id}/unpublish`)
      .then((res) => {
        if (userType === "member") {
          history.push(`/member/articles`);
        } else if (userType === "partner") {
          history.push(`/partner/home/article`);
        } else if (userType === "admin") {
          history.push(`/admin/article`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const clickEditArticle = () => {
    if (userType === "member") {
      history.push(`/article/edit/member/${id}`);
    } else if (userType === "partner") {
      history.push(`/article/edit/partner/${id}`);
    } else if (userType === "admin") {
      history.push(`/article/edit/admin/${id}`);
    }
  };

  const [dialogFlagOpen, setDialogFlagOpen] = useState(false);

  const handleFlagClickOpen = () => {
    setDialogFlagOpen(true);
  };

  const handleFlagClickClose = () => {
    setDialogFlagOpen(false);
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.container}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <Link className={classes.backLink} to="/viewarticles">
            Articles
          </Link>
          <Typography>{articleDetails.title}</Typography>
        </Breadcrumbs>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h1"
            style={{
              fontWeight: "800",
              marginBottom: "10px",
              marginTop: "30px",
              fontFamily: "Helvetica",
            }}
          >
            {articleDetails.title}
          </Typography>
          <Menu
            onClick={(e) => handleClick(e)}
            style={{ marginLeft: "auto", cursor: "pointer" }}
          />
        </div>

        {articleDetails.user && (
          <div
            style={{
              display: "flex",
              alignItems: "right",
              marginBottom: "20px",
              order: 2,
            }}
          >
            <div style={{ display: "flex" }}>
              <Avatar
                src={articleDetails.user.profile_photo}
                alt=""
                style={{
                  marginRight: "15px",
                  border:
                    articleDetails.user &&
                    articleDetails.user.member &&
                    articleDetails.user.member.membership_tier === "PRO"
                      ? "3px solid green"
                      : "",
                }}
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
            {((userType === "member" &&
              user &&
              user.member &&
              user.member.membership_tier !== "FREE") ||
              userType === "partner" ||
              userType === "admin") && (
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
                    Code along
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        <div>
          {articleDetails &&
            articleDetails.coding_languages &&
            articleDetails.coding_languages.length > 0 &&
            articleDetails.coding_languages.map((language, index) => {
              if (language === "PY") {
                return (
                  <Chip key={index} label="Python" className={classes.chip} />
                );
              } else if (language === "JAVA") {
                return (
                  <Chip key={index} label="Java" className={classes.chip} />
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
                  <Chip key={index} label="C++" className={classes.chip} />
                );
              } else if (language === "CS") {
                return <Chip key={index} label="C#" className={classes.chip} />;
              } else if (language === "RUBY") {
                return (
                  <Chip key={index} label="Ruby" className={classes.chip} />
                );
              } else {
                return (
                  <Chip key={index} label={language} className={classes.chip} />
                );
              }
            })}

          {articleDetails &&
            articleDetails.categories &&
            articleDetails.categories.length > 0 &&
            articleDetails.categories.map((category, index) => {
              if (category === "FE") {
                return (
                  <Chip key={index} label="Frontend" className={classes.chip} />
                );
              } else if (category === "BE") {
                return (
                  <Chip key={index} label="Backend" className={classes.chip} />
                );
              } else if (category === "UI") {
                return (
                  <Chip key={index} label="UI/UX" className={classes.chip} />
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
                  <Chip key={index} label="Security" className={classes.chip} />
                );
              }
            })}
        </div>

        <div style={{ fontSize: "20px", marginBottom: "30px" }}>
          {/* {parse(articleDetails.content, options)} */}
          <div style={{ width: "100%" }}>
            <img
              alt="thumbnail"
              src={articleDetails && articleDetails.thumbnail}
              width="100%"
            />
          </div>
          <div style={{ fontSize: "18px" }}>
            <ReactQuill
              modules={modules}
              value={articleDetails.content}
              readOnly={true}
              theme={"bubble"}
              enable={false}
              onChange={(e) => e}
            />
          </div>

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
              style={{ cursor: "pointer" }}
            />
            <Typography style={{ marginRight: "15px" }}>
              {articleDetails.engagements.length}
            </Typography>
            <CommentIcon
              style={{ cursor: "pointer" }}
              onClick={() => setDrawerOpen(true)}
            />
            <Typography style={{ display: "inline-flex" }}>
              {articleDetails.top_level_comments.length}
            </Typography>

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
              <div className={classes.pop}>
                {user &&
                  articleDetails.user &&
                  checkIfOwnerOfComment(articleDetails.user.id) && (
                    <Fragment>
                      <Typography
                        variant="body2"
                        className={classes.typography}
                        onClick={() => clickEditArticle()}
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
                    </Fragment>
                  )}
                {articleDetails.user &&
                  !checkIfOwnerOfComment(articleDetails.user.id) && (
                    <Typography
                      variant="body2"
                      className={classes.typography}
                      onClick={handleFlagClickOpen}
                    >
                      Flag Article
                    </Typography>
                  )}
              </div>
            </Popover>
          </div>
          {/* <Divider style={{ marginTop: "20px" }} /> */}
        </div>
      </div>

      <FlagDialog
        id={id}
        sbOpen={sbOpen}
        setSbOpen={setSbOpen}
        setSnackbar={setSnackbar}
        dialogFlagOpen={dialogFlagOpen}
        handleFlagClickClose={handleFlagClickClose}
      />

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
          <Button onClick={() => deleteArticle()} className={classes.redButton}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewArticle;
