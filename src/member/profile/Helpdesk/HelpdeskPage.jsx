import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Toast from "../../../components/Toast.js";

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

  const { setProfile, history } = props;

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

  let emptyArticle = {
    title: "",
    content: "",
    coding_languages: [],
    languages: [],
    categories: [],
  };

  const createNewArticle = () => {
    Service.client
      .post(`/articles`, emptyArticle)
      .then((res) => {
        history.push("/article/edit/" + res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Fragment className={classes.paper}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div style={{ display: "flex" }}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          Your articles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onclick={createNewArticle()}
        >
          New Article
        </Button>
      </div>

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
