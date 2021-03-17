import React, { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Avatar,
} from "@material-ui/core";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DropzoneAreaBase } from "material-ui-dropzone";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Toast from "../../../components/Toast.js";
import validator from "validator";
import Badge from "@material-ui/core/Badge";
import EditIcon from "../../../assets/editIcon.svg";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    "@global": {
      ".MuiDropzoneArea-text.MuiTypography-h5": {
        textTransform: "none",
        fontSize: "16px",
      },
    },
  },
  paper: {
    height: "calc(100vh - 185px)",
    padding: theme.spacing(3),
    width: "100%",
  },
  avatar: {
    fontSize: "80px",
    width: "150px",
    height: "150px",
  },
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    marginTop: "20px",
  },
}));

const Helpdesk = (props) => {
  const classes = useStyles();

  const { setProfile } = props;

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

  const [loading, setLoading] = useState(false);

  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = () => {
    Service.client
      .get(`/articles`)
      .then((res) => {
        setArticleList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment className={classes.paper}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Typography variant="h3" style={{ fontWeight: "600" }}>
        Your articles
      </Typography>
      <Typography variant="h5" style={{ fontWeight: "600" }}>
        Drafts
      </Typography>

      {articleList.map((article, index) => {
        return (
          <Fragment>
            <div key={article.id}>{article.id + " - " + article.title}</div>
          </Fragment>
        );
      })}

      <Typography variant="h5" style={{ fontWeight: "600" }}>
        Published
      </Typography>
      <Typography variant="h5" style={{ fontWeight: "600" }}>
        Your articles
      </Typography>
    </Fragment>
  );
};

export default Helpdesk;
