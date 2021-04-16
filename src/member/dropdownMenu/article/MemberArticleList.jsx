import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import MemberNavBar from "../../MemberNavBar";
import {
  Button,
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Divider,
  AppBar,
  Tabs,
  Tab,
  Box,
  Popover,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import parse, { attributesToProps } from "html-react-parser";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Toast from "../../../components/Toast.js";
import { useHistory, Link } from "react-router-dom";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import PageTitle from "../../../components/PageTitle.js";

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
  typography: {
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
  redButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  chip: {
    marginRight: "10px",
    marginBottom: "10px",
    borderRadius: "3px",
    backgroundColor: "#f2f2f2",
  },
  pop: {
    padding: theme.spacing(1),
  },
  viewAll: {
    fontWeight: 600,
    margin: "25px 15px 20px 0px",
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
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

const MemberArticleList = (props) => {
  const classes = useStyles();
  const history = useHistory();

  // Tabs variable
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

  const handlePopoverOpen = (event, articleId) => {
    setPopover({
      popoverId: articleId,
      anchorEl: event.currentTarget,
    });
  };

  const handlePopoverClose = () => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
  };

  const [dialogStatus, setDialogStatus] = useState({
    dialogId: null,
  });

  const handleDialogOpen = (articleId) => {
    setDialogStatus({
      dialogId: articleId,
    });
  };

  const handleDialogClose = () => {
    setDialogStatus({
      dialogId: null,
    });
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

  const unpublishArticle = (articleid) => {
    Service.client
      .patch(`/articles/${articleid}/unpublish`)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Article unpublished successfully!",
          severity: "success",
        });
        getArticles();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteArticle = (articleid) => {
    Service.client
      .delete(`/articles/${articleid}`)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Article deleted successfully!",
          severity: "success",
        });
        getArticles();
      })
      .catch((err) => {
        console.log(err);
      });
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
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    checkIfLoggedIn();
    getArticles();
    getAllArticles();
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
    const formData = new FormData();
    formData.append("title", emptyArticle.title);
    formData.append("content", emptyArticle.content);
    formData.append("categories", []);
    formData.append("coding_languages", []);
    formData.append("languages", []);

    Service.client
      .post(`/articles`, formData)
      .then((res) => {
        history.push("/article/edit/member/" + res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllArticles = () => {
    const userid = jwt_decode(Service.getJWT()).user_id;

    Service.client
      .get(`/articles`)
      .then((res) => {
        res.data = res.data
          .filter((item) => item.user.id !== userid)
          .sort((a, b) => b.date_created - a.date_created)
          .slice(0, 3);
        console.log(res.data);

        setAllArticles(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <div
          style={{
            display: "flex",
            marginBottom: "30px",
            alignItems: "center",
          }}
        >
          <PageTitle title="My Articles" />

          <div style={{ marginLeft: "auto" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => createNewArticle()}
            >
              <Add style={{ color: "#FFFFFF" }} />
              New Article
            </Button>
          </div>
        </div>
        <Grid container>
          <Grid item xs={8}>
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
              </Tabs>
            </AppBar>

            <TabPanel value={value} index={0}>
              {articleList
                .filter((article) => !article.is_published)
                .map((article, index) => {
                  return (
                    <div key={article.id} className={classes.articlelists}>
                      <Typography
                        style={{ fontWeight: "700", cursor: "pointer" }}
                        onClick={() => {
                          history.push(`/article/edit/member/${article.id}`);
                        }}
                      >
                        {article.title.length === 0
                          ? "Untitled article"
                          : article.title}
                      </Typography>
                      <div style={{ display: "flex" }}>
                        <Typography
                          style={{ fontSize: "14px", color: "#757575" }}
                        >
                          Last edited{" "}
                          {calculateDateInterval(article.date_edited) +
                            " ~ " +
                            article.content.length +
                            " words so far"}
                        </Typography>
                        <ExpandMoreIcon
                          style={{ color: "#757575" }}
                          onClick={(e) => handlePopoverOpen(e, article.id)}
                        />
                        <Popover
                          open={popover.popoverId === article.id}
                          anchorEl={popover.anchorEl}
                          onClose={handlePopoverClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <div className={classes.pop}>
                            <Typography
                              variant="body2"
                              className={classes.typography}
                              onClick={() => {
                                history.push(
                                  `/article/edit/member/${article.id}`
                                );
                              }}
                            >
                              Edit Draft
                            </Typography>
                            <Typography
                              variant="body2"
                              className={classes.typography}
                              onClick={() => {
                                handleDialogOpen(article.id);
                                handlePopoverClose();
                              }}
                            >
                              Delete Draft
                            </Typography>
                          </div>
                        </Popover>
                      </div>

                      <div className={classes.divider}>
                        <Divider />
                      </div>
                      <Dialog
                        open={dialogStatus.dialogId === article.id}
                        onClose={handleDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Delete Article?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this article?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleDialogClose}
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              deleteArticle(article.id);
                            }}
                            variant="contained"
                            className={classes.redButton}
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  );
                })}
            </TabPanel>
            <TabPanel value={value} index={1}>
              {articleList
                .filter((article) => article.is_published)
                .map((article, index) => {
                  return (
                    <div key={article.id} className={classes.articlelists}>
                      <div style={{ display: "flex" }}>
                        <div>
                          <Typography
                            style={{
                              fontWeight: "700",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              history.push(`/article/${article.id}`);
                            }}
                          >
                            {article.title}
                          </Typography>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                          {!article.is_activated && (
                            <Typography
                              style={{ fontWeight: "700", color: "red" }}
                            >
                              Deactivated
                            </Typography>
                          )}
                        </div>
                      </div>

                      <div style={{ display: "flex" }}>
                        <Typography
                          style={{ fontSize: "14px", color: "#757575" }}
                        >
                          Published {calculateDateInterval(article.date_edited)}
                        </Typography>
                        <ExpandMoreIcon
                          style={{ color: "#757575" }}
                          onClick={(e) => handlePopoverOpen(e, article.id)}
                        />
                        <Popover
                          open={popover.popoverId === article.id}
                          anchorEl={popover.anchorEl}
                          onClose={handlePopoverClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                        >
                          <div style={{ padding: "5px" }}>
                            <Typography
                              variant="body2"
                              className={classes.typography}
                              onClick={() =>
                                history.push(
                                  `/article/edit/member/${article.id}`
                                )
                              }
                            >
                              Edit article
                            </Typography>
                            <Typography
                              variant="body2"
                              className={classes.typography}
                              onClick={() => {
                                unpublishArticle(article.id);
                                handlePopoverClose();
                              }}
                            >
                              Unpublish Article
                            </Typography>
                            <Typography
                              variant="body2"
                              className={classes.typography}
                              onClick={() => {
                                handleDialogOpen(article.id);
                                handlePopoverClose();
                              }}
                            >
                              Delete
                            </Typography>
                          </div>
                        </Popover>
                      </div>

                      <div className={classes.divider}>
                        <Divider />
                      </div>
                      <Dialog
                        open={dialogStatus.dialogId === article.id}
                        onClose={handleDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Delete Article?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this article?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleDialogClose}
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              deleteArticle(article.id);
                              handlePopoverClose();
                            }}
                            variant="contained"
                            className={classes.redButton}
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  );
                })}
            </TabPanel>
          </Grid>
          <Grid item xs={4}>
            <Card
              style={{
                marginLeft: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label>
                  <Typography
                    variant="h6"
                    style={{
                      fontWeight: 600,
                      margin: "20px 0px 20px 15px",
                    }}
                  >
                    More from Articles
                  </Typography>
                </label>
                <Link
                  style={{ textDecoration: "none" }}
                  onClick={() => history.push(`/viewarticles`)}
                >
                  <Typography variant="body2" className={classes.viewAll}>
                    VIEW ALL
                  </Typography>
                </Link>
              </div>
              {allArticles && allArticles.length > 0 ? (
                allArticles.map((article, index) => {
                  return (
                    <CardActionArea
                      onClick={() => history.push(`/article/${article.id}`)}
                      key={index}
                      style={{ borderTop: "1px solid #F3F3F3" }}
                    >
                      <CardContent>
                        <Typography
                          variant="body1"
                          style={{ marginBottom: "10px" }}
                        >
                          {article && article.title}
                        </Typography>
                        {article && article.coding_languages.length > 0
                          ? article.coding_languages.map((language, index) => {
                              if (language === "PY") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Python"
                                    className={classes.chip}
                                  />
                                );
                              } else if (language === "JAVA") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Java"
                                    className={classes.chip}
                                  />
                                );
                              } else if (language === "JS") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Javascript"
                                    className={classes.chip}
                                  />
                                );
                              } else if (language === "CPP") {
                                return (
                                  <Chip
                                    key={index}
                                    label="C++"
                                    className={classes.chip}
                                  />
                                );
                              } else if (language === "CS") {
                                return (
                                  <Chip
                                    key={index}
                                    label="C#"
                                    className={classes.chip}
                                  />
                                );
                              } else if (language === "RUBY") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Ruby"
                                    className={classes.chip}
                                  />
                                );
                              } else {
                                return (
                                  <Chip
                                    key={index}
                                    label={language}
                                    className={classes.chip}
                                  />
                                );
                              }
                            })
                          : ""}
                        {article && article.categories.length > 0
                          ? article.categories.map((category, index) => {
                              if (category === "FE") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Frontend"
                                    className={classes.chip}
                                  />
                                );
                              } else if (category === "BE") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Backend"
                                    className={classes.chip}
                                  />
                                );
                              } else if (category === "UI") {
                                return (
                                  <Chip
                                    key={index}
                                    label="UI/UX"
                                    className={classes.chip}
                                  />
                                );
                              } else if (category === "DB") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Database Administration"
                                    className={classes.chip}
                                  />
                                );
                              } else if (category === "ML") {
                                return (
                                  <Chip
                                    key={index}
                                    label="Machine Learning"
                                    className={classes.chip}
                                  />
                                );
                              } else {
                                return (
                                  <Chip
                                    key={index}
                                    label="Security"
                                    className={classes.chip}
                                  />
                                );
                              }
                            })
                          : ""}
                      </CardContent>
                    </CardActionArea>
                  );
                })
              ) : (
                <CardContent
                  style={{
                    height: "150px",
                    borderTop: "1px solid #F3F3F3",
                  }}
                >
                  <Typography
                    variant="body1"
                    style={{
                      textAlign: "center",
                      marginTop: "35px",
                      color: "#C4C4C4",
                    }}
                  >
                    No recommended articles
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default MemberArticleList;
