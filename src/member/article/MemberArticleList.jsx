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

  // const navLogo = (
  //   <Fragment>
  //     <div style={{ display: "flex", alignItems: "center" }}>
  //       <Link
  //         to="/"
  //         style={{
  //           paddingTop: "10px",
  //           paddingBottom: "10px",
  //           paddingLeft: "10px",
  //           marginRight: "35px",
  //           width: 100,
  //         }}
  //       >
  //         <img src={logo} width="120%" alt="codeine logo" />
  //       </Link>
  //       {user && !articleDetails.is_published && (
  //         <div style={{ display: "flex", alignItems: "center" }}>
  //           <Typography
  //             variant="h6"
  //             style={{ fontSize: "15px", color: "#000000" }}
  //           >
  //             Draft in {user.first_name + " " + user.last_name}
  //           </Typography>
  //           <Typography
  //             variant="h6"
  //             style={{ fontSize: "15px", color: "#0000008a" }}
  //           >
  //             {saveState ? "-Saved" : "-Saving"}
  //           </Typography>
  //         </div>
  //       )}
  //     </div>
  //   </Fragment>
  // );

  // const loggedInNavbar = (
  //   <Fragment>
  //     <ListItem style={{ whiteSpace: "nowrap" }}>
  //       <Link
  //         to="/member/home"
  //         style={{
  //           textDecoration: "none",
  //         }}
  //       >
  //         <Typography
  //           variant="h6"
  //           style={{ fontSize: "15px", color: "#437FC7" }}
  //         >
  //           Dashboard
  //         </Typography>
  //       </Link>
  //     </ListItem>
  //     <ListItem style={{ whiteSpace: "nowrap" }}>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         style={{
  //           textTransform: "capitalize",
  //         }}
  //         onClick={() => {
  //           Service.removeCredentials();
  //           setLoggedIn(false);
  //           history.push("/");
  //         }}
  //       >
  //         <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
  //           Logout
  //         </Typography>
  //       </Button>
  //     </ListItem>
  //   </Fragment>
  // );

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
