import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Divider,
  Grid,
  Button,
  Typography,
  ListItem,
} from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import { useHistory, Link } from "react-router-dom";
import MemberNavBar from "../member/MemberNavBar";
import Navbar from "../components/Navbar";
import partnerLogo from "../assets/CodeineLogos/Partner.svg";
import adminLogo from "../assets/CodeineLogos/Admin.svg";
import SearchBar from "material-ui-search-bar";
import Service from "../AxiosService";
import PageTitle from "../components/PageTitle";
import CLogo from "../assets/CodeineLogos/C.svg";
import TrendingCard from "./component/TrendingArticle";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
    paddingLeft: theme.spacing(10),
    paddingRight: theme.spacing(10),
    // backgroundColor: "#fff",
  },
  linkMui: {
    fontWeight: 700,
    fontSize: "25px",
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
    },
  },
}));

const ViewAllArticles = () => {
  const classes = useStyles();
  const history = useHistory();

  const [listOfArticles, setListOfArticles] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const formatDate = (date) => {
    const options = {
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  // const checkIfLoggedIn = () => {
  //   if (Cookies.get("t1")) {
  //     setLoggedIn(true);
  //   } else {
  //     setUserType("guest");
  //   }
  // };

  // const [user, setUser] = useState();
  const [userType, setUserType] = useState();

  const getUserDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${userid}`)
        .then((res) => {
          // setUser(res.data);
          setLoggedIn(true);
          if (res.data.is_admin) {
            setUserType("admin");
          } else if (res.data.member) {
            setUserType("member");
          } else if (res.data.partner) {
            setUserType("partner");
          }
        })
        .catch(() => {});
    } else {
      setLoggedIn(false);
      setUserType("guest");
    }
  };

  useEffect(() => {
    //checkIfLoggedIn();
    getAllArticles();
    getUserDetails();
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

    Service.client
      .get(`/articles`, { params: { ...queryParams } })
      .then((res) => {
        setListOfArticles(res.data);
      })
      .catch((err) => {
        //setProfile(null);
      });
  };

  useEffect(() => {
    if (searchValue === "") {
      getArticleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const navLogo = (
    <Fragment>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            marginRight: "35px",
            width: 100,
          }}
        >
          {userType === "partner" && (
            <img src={partnerLogo} width="120%" alt="codeine logo" />
          )}
          {userType === "admin" && (
            <img src={adminLogo} width="120%" alt="codeine logo" />
          )}
        </Link>
      </div>
    </Fragment>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            if (userType === "partner") {
              history.push("/partner");
            } else if (userType === "admin") {
              history.push("/admin");
            }
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      {(userType === "member" || userType === "guest") && (
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}
      {(userType === "partner" || userType === "admin") && (
        <Navbar logo={navLogo} bgColor="#fff" navbarItems={loggedInNavbar} />
      )}
      <PageTitle title="All Articles" />

      <Grid container spacing={3}>
        <Grid item xs={8}>
          <div>
            <SearchBar
              style={{
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
                  <div
                    key={article.id}
                    style={{
                      padding: "16px",
                      backgroundColor: "#fff",
                      marginBottom: "20px",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <Avatar
                        src={
                          article.user.is_admin && !article.user.profile_photo
                            ? CLogo
                            : article.user.profile_photo
                        }
                        alt=""
                        style={{
                          height: "18px",
                          width: "18px",
                          marginRight: "5px",
                        }}
                      ></Avatar>

                      {article.user.is_admin &&
                      article.user.first_name === null &&
                      article.user.last_name === null
                        ? "Codeine Admin in "
                        : article.user.first_name +
                          " " +
                          article.user.last_name +
                          " in "}

                      {article &&
                        article.categories &&
                        article.categories.length > 0 &&
                        article.categories.map((category, index) => {
                          if (category === "FE") {
                            return "Frontend ";
                          } else if (category === "BE") {
                            return "Backend ";
                          } else if (category === "UI") {
                            return "UI/UX ";
                          } else if (category === "DB") {
                            return "Database Administration ";
                          } else if (category === "ML") {
                            return "Machine Learning ";
                          } else {
                            return "Security ";
                          }
                        })}
                    </div>
                    <div>
                      <LinkMui
                        onClick={() => {
                          if (setLoggedIn) {
                            if (userType === "admin") {
                              history.push(`/article/admin/${article.id}`);
                            } else if (userType === "member") {
                              history.push(`/article/member/${article.id}`);
                            } else if (userType === "partner") {
                              history.push(`/article/partner/${article.id}`);
                            } else if (userType === "guest") {
                              history.push(`/article/guest/${article.id}`);
                            }
                          } else {
                            history.push(`/article/guest/${article.id}`);
                          }
                        }}
                        className={classes.linkMui}
                      >
                        {article.title}
                      </LinkMui>
                    </div>

                    <Typography style={{ fontSize: "12px", color: "#757575" }}>
                      {formatDate(article.date_created)}
                    </Typography>

                    <Divider
                      style={{ marginTop: "10px", marginBottom: "10px" }}
                    />
                  </div>
                );
              })}
          </div>
        </Grid>
        <Grid item xs={4}>
          <div>
            <Typography style={{ fontWeight: 700 }}>
              TRENDING ON CODEINE
            </Typography>

            {listOfArticles &&
              listOfArticles.length > 0 &&
              listOfArticles[0] && (
                <TrendingCard
                  number={"01"}
                  history={history}
                  setLoggedIn={setLoggedIn}
                  article={listOfArticles[0]}
                  userType={userType}
                />
              )}
            {listOfArticles &&
              listOfArticles.length > 1 &&
              listOfArticles[1] && (
                <TrendingCard
                  number={"02"}
                  history={history}
                  setLoggedIn={setLoggedIn}
                  article={listOfArticles[1]}
                  userType={userType}
                />
              )}
            {listOfArticles &&
              listOfArticles.length > 2 &&
              listOfArticles[2] && (
                <TrendingCard
                  number={"03"}
                  history={history}
                  setLoggedIn={setLoggedIn}
                  article={listOfArticles[2]}
                  userType={userType}
                />
              )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default ViewAllArticles;
