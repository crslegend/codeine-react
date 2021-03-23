import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MemberNavBar from "../MemberNavBar";
import {
  Button,
  Container,
  Typography,
  Divider,
  AppBar,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Service from "../../AxiosService";
import Cookies from "js-cookie";
import Toast from "../../components/Toast.js";

const useStyles = makeStyles((theme) => ({
  root: { paddingTop: "65px" },
  tabPanel: {
    padding: "0px",
  },
  tabs: {
    backgroundColor: "#00000000",
    fontWeight: "800",
  },
  appbar: {
    backgroundColor: "#00000000",
    boxShadow: "none",
    marginBottom: "20px",
  },
  articlelists: {
    paddingTop: theme.spacing(2),
  },
  divider: {
    marginTop: theme.spacing(2),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ViewAllArticles = () => {
  const classes = useStyles();
  const history = useHistory();

  // Tabs variable
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const calculateDateInterval = (timestamp) => {
    const dateBefore = new Date(timestamp);
    const dateNow = new Date();

    let seconds = Math.floor((dateNow - dateBefore) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          return `${seconds} seconds ago`;
        }

        if (minutes === 1) {
          return `${minutes} minute ago`;
        }
        return `${minutes} minutes ago`;
      }

      if (hours === 1) {
        return `${hours} hour ago`;
      }
      return `${hours} hours ago`;
    }

    if (days === 1) {
      return `${days} day ago`;
    }
    return `${days} days ago`;
  };

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

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    checkIfLoggedIn();
    getArticles();
  }, []);

  const getArticles = () => {
    Service.client
      .get(`/articles/user/`)
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
        if (res.data.user.member !== null) {
          history.push("/member/article/edit/" + res.data.id);
        } else if (res.data.user.partner !== null) {
          history.push("/partner/article/edit/" + res.data.id);
        } else if (res.data.is_admin) {
          history.push("/admin/article/edit/" + res.data.id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

        <div
          style={{ display: "flex", marginTop: "50px", marginBottom: "30px" }}
        >
          <Typography variant="h1" style={{ fontWeight: "700" }}>
            Your articles
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => createNewArticle()}
            style={{ marginLeft: "auto" }}
          >
            New Article
          </Button>
        </div>

        <AppBar
          position="static"
          classes={{
            root: classes.appbar,
          }}
        >
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="simple tabs example"
            classes={{
              root: classes.tabs,
            }}
          >
            <Tab label="Drafts" {...a11yProps(0)} />
            <Tab label="Published" {...a11yProps(1)} />
            {/* <Tab label="Admin" {...a11yProps(2)} /> */}
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0}>
          {articleList.map((article, index) => {
            return (
              <Fragment>
                {!article.is_published && (
                  <div
                    key={article.id}
                    onClick={() => {
                      history.push(`/member/article/edit/${article.id}`);
                    }}
                    className={classes.articlelists}
                  >
                    <Typography
                      style={{ fontWeight: "700", cursor: "pointer" }}
                    >
                      {article.title.length === 0
                        ? "Untitled article"
                        : article.title}
                    </Typography>
                    <Typography style={{ fontSize: "14px", color: "#757575" }}>
                      Last edited{" "}
                      {calculateDateInterval(article.date_edited) +
                        " ~ " +
                        article.content.length +
                        " words so far"}
                    </Typography>
                    <div className={classes.divider}>
                      <Divider />
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </TabPanel>
        <TabPanel value={value} index={1}>
          {articleList.map((article, index) => {
            return (
              <Fragment>
                {article.is_published && (
                  <div
                    key={article.id}
                    onClick={() => {
                      history.push(`/article/${article.id}`);
                    }}
                    className={classes.articlelists}
                  >
                    <Typography
                      style={{
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      {article.title}
                    </Typography>
                    <Typography style={{ fontSize: "14px", color: "#757575" }}>
                      Published {calculateDateInterval(article.date_edited)}
                    </Typography>
                    <div className={classes.divider}>
                      <Divider />
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })}
        </TabPanel>
      </div>
    </Container>
  );
};

export default ViewAllArticles;
