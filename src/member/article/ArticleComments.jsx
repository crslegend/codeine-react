import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  Fragment,
  Drawer,
  IconButton,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../../AxiosService";
import Toast from "../../components/Toast.js";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  drawer: {
    width: "450px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const MemberArticleComment = ({ drawerOpen, setDrawerOpen }) => {
  const classes = useStyles();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(false);
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

  useEffect(() => {
    //checkIfLoggedIn();
  }, []);

  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: classes.drawer }}
      >
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={toggleDrawer(false)}
        >
          <CloseIcon />
        </IconButton>
        Comments
      </Drawer>
    </div>
  );
};

export default MemberArticleComment;
