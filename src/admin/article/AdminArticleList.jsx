import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  Button,
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
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Service from "../../AxiosService";
// import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "calc(100vh - 145px)",
  },
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
    color: "#5c5c5c",
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
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

const AdminArticleList = (props) => {
  const classes = useStyles();
  const { history, snackbar, setSbOpen, setSnackbar } = props;

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

  // const [loggedIn, setLoggedIn] = useState(false);

  // const checkIfLoggedIn = () => {
  //   if (Cookies.get("t1")) {
  //     setLoggedIn(true);
  //   }
  // };

  const [articleList, setArticleList] = useState([]);

  useEffect(() => {
    // checkIfLoggedIn();
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
        history.push("/article/edit/admin/" + res.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <div style={{ display: "flex", marginTop: "30px", marginBottom: "30px" }}>
        <Typography variant="h1" style={{ fontWeight: "700" }}>
          Your Articles
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
          indicatorColor="secondary"
          textColor="secondary"
          onChange={handleChange}
          aria-label="simple tabs example"
          classes={{
            root: classes.tabs,
          }}
        >
          <Tab label="Published Articles" {...a11yProps(0)} />
          <Tab label="Drafts" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={1}>
        {articleList
          .filter((article) => !article.is_published)
          .map((article, index) => {
            return (
              <div key={article.id} className={classes.articlelists}>
                <Typography
                  style={{ fontWeight: "700", cursor: "pointer" }}
                  onClick={() => {
                    history.push(`/article/edit/admin/${article.id}`);
                  }}
                >
                  {article.title.length === 0
                    ? "Untitled article"
                    : article.title}
                </Typography>
                <div style={{ display: "flex" }}>
                  <Typography style={{ fontSize: "14px", color: "#757575" }}>
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
                    <div style={{ padding: "5px" }}>
                      <Typography
                        variant="body2"
                        className={classes.typography}
                        onClick={() => {
                          history.push(`/article/edit/admin/${article.id}`);
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
                    <Button onClick={handleDialogClose} variant="outlined">
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
      <TabPanel value={value} index={0}>
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
                      <Typography style={{ fontWeight: "700", color: "red" }}>
                        Deactivated
                      </Typography>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <Typography style={{ fontSize: "14px", color: "#757575" }}>
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
                        onClick={() => {
                          history.push(`/article/edit/admin/${article.id}`);
                        }}
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
                    <Button onClick={handleDialogClose} variant="outlined">
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
    </div>
  );
};

export default AdminArticleList;
