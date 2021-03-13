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
  demo: {
    [theme.breakpoints.up("md")]: {
      width: 770,
    },
  },
}));

const ViewArticle = (props) => {
  const classes = useStyles();

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

  const calculateDateInterval = (timestamp) => {
    const dateBefore = new Date(timestamp);
    const dateNow = new Date();

    let seconds = Math.floor((dateNow - dateBefore) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          return `${seconds} seconds ago`;
        }

        if (minutes === 1) {
          return `${minutes} minute ago`;
        }
        return `${minutes} minutes ago`;
      }

      if (hours === 1) {
        return `${hours} hour ago`;
      }
      return `${hours} hours ago`;
    }

    if (days === 1) {
      return `${days} day ago`;
    }
    return `${days} days ago`;
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

  useEffect(() => {}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (articleDetails.title === "" || articleDetails.content === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter required fields!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid container alignItems="center" justify="center">
          <Grid md={3} item>
            <Button
              variant="contained"
              color="primary"
              style={{
                textTransform: "capitalize",
              }}
              onClick={() => setDrawerOpen(true)}
            >
              Open Comments
            </Button>
            <UseAnimations
              animation={heart}
              size={56}
              style={{ cursor: "pointer", padding: 100, color: "red" }}
              onClick={() => console.log("like")}
            />

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
