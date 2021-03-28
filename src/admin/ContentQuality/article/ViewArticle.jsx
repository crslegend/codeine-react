import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Breadcrumbs,
  Chip,
  Typography,
  Avatar,
  Divider,
  Link,
} from "@material-ui/core";
import { Language } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import Service from "../../../AxiosService";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import CommentIcon from "@material-ui/icons/Comment";
import CommentDrawer from "./ArticleComments";
import Toast from "../../../components/Toast.js";
// import NavigateNextIcon from "@material-ui/icons/NavigateNext";
// import jwt_decode from "jwt-decode";
// import Cookies from "js-cookie";
import parse, { attributesToProps } from "html-react-parser";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    minHeight: "100vh",
    flexDirection: "column",
    fontDisplay: "swap",
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

  const options = {
    replace: (domNode) => {
      if (domNode.attribs && domNode.name === "img") {
        const props = attributesToProps(domNode.attribs);
        return <img style={{ width: "100%" }} alt="" {...props} />;
      }
    },
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
                <Chip key={index} label="Python" className={classes.chip} />
              );
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
            //onClick={(e) => handleLikeArticle(e)}
          />
          <Typography style={{ marginRight: "15px" }}>
            {articleDetails.engagements.length}
          </Typography>
          <CommentIcon onClick={() => setDrawerOpen(true)} />
          <Typography style={{ display: "inline-flex" }}>
            {articleDetails.top_level_comments.length}
          </Typography>
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
