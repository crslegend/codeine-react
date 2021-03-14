import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Fragment,
  ListItem,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import Service from "../../AxiosService";
import Toast from "../../components/Toast.js";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import ReactQuill from "react-quill";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  tile: {
    height: "100%",
  },
  split: {
    height: "calc(100vh - 65px)",
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

  const [loading, setLoading] = useState(false);

  return (
    <div className={classes.root}>
      <div className={classes.split}>
        <Splitter direction={SplitDirection.Horizontal}>
          <div className={classes.tile}>
            <div style={{ height: "100%" }}>
              <Typography>{articleDetails.title}</Typography>
              <ReactQuill
                value={articleDetails.content}
                readOnly={true}
                theme={"bubble"}
              />

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
