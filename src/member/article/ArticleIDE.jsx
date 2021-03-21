import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Fragment,
  ListItem,
  Avatar,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import Service from "../../AxiosService";
import Toast from "../../components/Toast.js";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import ReactQuill from "react-quill";
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
}));

const MemberArticleIDE = (props) => {
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
    articleEngagement,
    setArticleEngagement,
  } = props;

  useEffect(() => {
    //checkIfLoggedIn();
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

  return (
    <div className={classes.root}>
      <div className={classes.split}>
        <Splitter direction={SplitDirection.Horizontal} initialSizes={[30, 70]}>
          <div className={classes.tile}>
            <div style={{ height: "100%" }}>
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
              <div style={{ fontSize: "20px" }}>
                {parse(articleDetails.content, options)}
              </div>
              {/* <ReactQuill
                value={articleDetails.content}
                readOnly={true}
                theme={"bubble"}
              /> */}

              <br />
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
            </div>
          </div>
          <div>
            <div className={classes.tile}>
              VS CODE IDE
              <br />
              <Button
                variant="contained"
                color="primary"
                style={{
                  textTransform: "capitalize",
                }}
                onClick={() => setOpenIDE(false)}
              >
                Close IDE
              </Button>
            </div>
          </div>
        </Splitter>
      </div>
    </div>
  );
};

export default MemberArticleIDE;
