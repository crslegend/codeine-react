import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Fragment,
  ListItem,
  Container,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useLocation } from "react-router-dom";
import MemberNavBar from "../member/MemberNavBar";
import SearchBar from "material-ui-search-bar";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import Toast from "../components/Toast.js";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
  },
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
  const [searchValue, setSearchValue] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
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

  const getArticleData = () => {
    let queryParams = {
      search: searchValue,
    };

    if (searchValue !== "") {
      queryParams = {
        search: searchValue,
      };
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/articles`, { params: { ...queryParams } })
        .then((res) => {
          setListOfArticles(res.data);
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  useEffect(() => {
    if (searchValue === "") {
      getArticleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Typography>All Articles</Typography>
        <SearchBar
          style={{
            width: "70%",
            marginBottom: "20px",
            elavation: "0px",
          }}
          placeholder="Search article"
          value={searchValue}
          onChange={(newValue) => setSearchValue(newValue)}
          onCancelSearch={() => setSearchValue("")}
          onRequestSearch={getArticleData}
        />

        {listOfArticles &&
          listOfArticles.length > 0 &&
          listOfArticles.map((article, index) => {
            return (
              <div key={article.id}>
                {article.id} - {article.title}
              </div>
            );
          })}
      </Container>
    </div>
  );
};

export default ViewAllArticles;
