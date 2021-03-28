import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Divider,
  Container,
  Button,
  Typography,
  ListItem,
} from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";
import MemberNavBar from "../member/MemberNavBar";
import Navbar from "../components/Navbar";
import partnerLogo from "../assets/CodeineLogos/Partner.svg";
import adminLogo from "../assets/CodeineLogos/Admin.svg";
import SearchBar from "material-ui-search-bar";
import Service from "../AxiosService";
import CLogo from "../assets/CodeineLogos/C.svg";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "65px",
  },
}));

const ViewAllArticles = () => {
  const classes = useStyles();
  const history = useHistory();

  const [listOfArticles, setListOfArticles] = useState();
  const [searchValue, setSearchValue] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  // const checkIfLoggedIn = () => {
  //   if (Cookies.get("t1")) {
  //     setLoggedIn(true);
  //   } else {
  //     setUserType("guest");
  //   }
  // };

  const [user, setUser] = useState();
  const [userType, setUserType] = useState();

  const getUserDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${userid}`)
        .then((res) => {
          setUser(res.data);
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
      <Container maxWidth="md">
        {(userType === "member" || userType === "guest") && (
          <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )}
        {(userType === "partner" || userType === "admin") && (
          <Navbar logo={navLogo} bgColor="#fff" navbarItems={loggedInNavbar} />
        )}
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
              <div key={article.id} style={{ padding: "5px" }}>
                <div
                  style={{ display: "flex", cursor: "pointer" }}
                  onClick={() => {
                    if (setLoggedIn) {
                      if (userType === "admin") {
                        history.push(`/article/admin/${article.id}`);
                      } else if (userType === "member") {
                        history.push(`/article/member/${article.id}`);
                      } else if (userType === "partner") {
                        history.push(`/article/partner/${article.id}`);
                      }
                    } else {
                      history.push(`/article/guest/${article.id}`);
                    }
                  }}
                >
                  <Avatar
                    src={
                      article.user.first_name !== null &&
                      article.user.last_name !== null &&
                      !article.user.profile_photo
                        ? article.user.profile_photo
                        : CLogo
                    }
                    alt=""
                    style={{ height: "20px", width: "20px" }}
                  ></Avatar>
                  {article.user.first_name === null &&
                  article.user.last_name === null
                    ? "Codeine Admin"
                    : article.user.first_name + " " + article.user.last_name}
                </div>
                {article.title}

                <Divider />
              </div>
            );
          })}
      </Container>
    </div>
  );
};

export default ViewAllArticles;
