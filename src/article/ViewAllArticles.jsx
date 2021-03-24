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

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const ViewAllArticles = () => {
  const classes = useStyles();
  const history = useHistory();
  const { state } = useLocation();

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

  const [listOfArticles, setListOfArticles] = useState();

  useEffect(() => {
    getAllArticles();
  }, []);

  const getAllArticles = () => {
    Service.client
      .get(`/articles`)
      .then((res) => {
        // console.log(res);
        setListOfArticles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div className={classes.root}>
        <Typography>All Articles</Typography>
      </div>
    </div>
  );
};

export default ViewAllArticles;
