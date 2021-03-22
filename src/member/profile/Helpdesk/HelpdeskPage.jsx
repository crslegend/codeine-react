import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toast from "../../../components/Toast.js";

const useStyles = makeStyles((theme) => ({}));

const Helpdesk = () => {
  const classes = useStyles();

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

  return (
    <Fragment className={classes.paper}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
    </Fragment>
  );
};

export default Helpdesk;
