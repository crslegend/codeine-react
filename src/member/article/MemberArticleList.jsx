import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
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
    <div className={classes.root}>
      <div style={{ display: "flex" }}>
        <Typography variant="h3" style={{ fontWeight: "600" }}>
          Your articles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onclick={() => createNewArticle()}
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
            {!article.is_published && (
              <div key={article.id}>
                <Typography
                  onClick={() => {
                    //history.push(`/article/edit/${article.id}`);
                  }}
                >
                  {article.id + " - " + article.title}
                </Typography>
              </div>
            )}
          </Fragment>
        );
      })}

      <Typography variant="h5" style={{ fontWeight: "600" }}>
        Published
      </Typography>
      {articleList.map((article, index) => {
        return (
          <Fragment>
            {article.is_published && (
              <div key={article.id}>
                <Typography
                  onClick={() => {
                    history.push(`/article/${article.id}`);
                  }}
                >
                  {article.id + " - " + article.title}
                </Typography>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
};

export default ViewAllArticles;
