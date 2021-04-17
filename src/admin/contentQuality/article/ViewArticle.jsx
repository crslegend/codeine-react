import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Breadcrumbs,
  Chip,
  Typography,
  Avatar,
  Link,
  IconButton,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import Service from "../../../AxiosService";
import CommentDrawer from "./ArticleComments";
import Toast from "../../../components/Toast.js";
import ReactQuill from "react-quill";
import "../../../article/quill.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-regular-svg-icons";
import { InsertEmoticon } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    minHeight: "100vh",
    flexDirection: "column",
    fontDisplay: "swap",
    backgroundColor: "#fff",
    padding: theme.spacing(3),
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
  chip: {
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "3px",
    backgroundColor: "#f2f2f2",
  },
  redButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  greenButton: {
    backgroundColor: theme.palette.green.main,
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkgreen.main,
    },
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
      cursor: "pointer",
    },
  },
}));

const ViewArticle = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

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

  const [articleDetails, setArticleDetails] = useState({
    title: "",
    content: "",
    top_level_comments: [],
    engagements: [],
  });

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getArticleDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDeactivate = () => {
    Service.client
      .patch(`/articles/${id}/deactivate`)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Article is deactivated",
          severity: "success",
        });
        setArticleDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleActivate = () => {
    Service.client
      .patch(`/articles/${id}/activate`)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Article is activated",
          severity: "success",
        });
        setArticleDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <Link
            color="primary"
            onClick={() => {
              history.push("/admin/contentquality");
            }}
            className={classes.backLink}
          >
            Content Quality
          </Link>
          <Typography variant="body1" style={{ marginRight: "8px" }}>
            Article
          </Typography>
        </Breadcrumbs>
        <div>
          {articleDetails.is_activated ? (
            <Button
              className={classes.redButton}
              onClick={() => handleDeactivate()}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              className={classes.greenButton}
              onClick={() => handleActivate()}
            >
              Activate
            </Button>
          )}
        </div>
      </div>

      <Typography
        variant="h1"
        style={{
          fontWeight: "800",
          marginBottom: "10px",
          fontFamily: "Helvetica",
        }}
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

      {articleDetails &&
        articleDetails.coding_languages &&
        articleDetails.coding_languages.length > 0 &&
        articleDetails.coding_languages.map((language, index) => {
          if (language === "PY") {
            return <Chip key={index} label="Python" className={classes.chip} />;
          } else if (language === "JAVA") {
            return <Chip key={index} label="Java" className={classes.chip} />;
          } else if (language === "JS") {
            return (
              <Chip key={index} label="Javascript" className={classes.chip} />
            );
          } else if (language === "CPP") {
            return <Chip key={index} label="C++" className={classes.chip} />;
          } else if (language === "CS") {
            return <Chip key={index} label="C#" className={classes.chip} />;
          } else if (language === "RUBY") {
            return <Chip key={index} label="Ruby" className={classes.chip} />;
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
            return <Chip key={index} label="UI/UX" className={classes.chip} />;
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

      <div style={{ fontSize: "20px" }}>
        {/* {parse(articleDetails.content, options)} */}
        <div style={{ width: "75%" }}>
          <img
            alt="thumbnail"
            src={articleDetails && articleDetails.thumbnail}
            width="100%"
          />
        </div>
        <div>
          <ReactQuill
            //modules={modules}
            value={articleDetails.content}
            readOnly={true}
            theme={"bubble"}
          />
        </div>

        <div
          style={{
            alignItems: "center",
            display: "flex",
          }}
        >
          {/* <UseAnimations
            animation={heart}
            size={30}
            reverse={articleDetails.current_user_liked}
            //onClick={(e) => handleLikeArticle(e)}
          /> */}
          <IconButton
            disableRipple
            classes={{
              root: articleDetails.current_user_liked
                ? classes.activeIconButton
                : classes.iconButton,
            }}
            size="small"
          >
            <InsertEmoticon />
            <span style={{ fontSize: "12px", margin: "0 2px" }}>
              {articleDetails.engagements.length}
            </span>
          </IconButton>
          {/* <Typography style={{ marginRight: "15px" }}>
            {articleDetails.engagements.length}
          </Typography>
          <CommentIcon onClick={() => setDrawerOpen(true)} />
          <Typography style={{ display: "inline-flex" }}>
            {articleDetails.top_level_comments.length}
          </Typography> */}
          <IconButton
            disableRipple
            classes={{
              root: classes.iconButtonComment,
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <FontAwesomeIcon
              icon={faCommentAlt}
              style={{
                height: "20px",
                width: "20px",
                cursor: "pointer",
                marginRight: "2px",
              }}
            />
            <span style={{ fontSize: "12px", margin: "0 2px" }}>
              {articleDetails.top_level_comments.length}
            </span>
          </IconButton>
        </div>
      </div>
      <CommentDrawer
        articleDetails={articleDetails}
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
      />
    </div>
  );
};

export default ViewArticle;
