import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({}));

const ReplyToComments = () => {
  const classes = styles();

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

  const [pageNum, setPageNum] = useState(1);
  const [comments, setComments] = useState([]);

  return <div></div>;
};

export default ReplyToComments;
