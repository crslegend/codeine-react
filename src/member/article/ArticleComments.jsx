import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  Fragment,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Card,
  CardContent,
  Avatar,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../../AxiosService";
import Toast from "../../components/Toast.js";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  drawer: {
    width: "550px",
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const ArticleComment = (props) => {
  const classes = useStyles();
  const { id } = useParams();

  const {
    articleDetails,
    setArticleDetails,
    drawerOpen,
    setDrawerOpen,
    openEditor,
    setOpenEditor,
    openIDE,
    setOpenIDE,
    setSbOpen,
    setSnackbar,
  } = props;

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(false);
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

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    getArticleComments();
  }, []);

  const getArticleComments = () => {
    Service.client
      .get(`/articles/${articleDetails.id}/comments`)
      .then((res) => {
        console.log(res.data);
        setCommentList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleAddComment = (id) => {
    if (comment === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Comment cannot be empty",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    // Service.client
    //   .post(`/articles/${id}/comments`, commentDialogValue)
    //   .then((res) => {
    //     console.log(res);
    //     setAddCommentDialog(false);
    //     setCommentDialogValue("");
    //     getCourseMaterialComments();
    //   })
    //   .catch((err) => console.log(err));
  };

  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState("");

  return (
    <div>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        classes={{ paper: classes.drawer }}
      >
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={toggleDrawer(false)}
        >
          <CloseIcon />
        </IconButton>
        <Typography
          variant="h5"
          style={{ fontWeight: "600", marginBottom: "20px" }}
        >
          Responses (xx)
        </Typography>

        <Card>
          <CardContent>
            {articleDetails.member && (
              <div>
                <Avatar src={articleDetails.member.profile_photo} alt="" />
                <Typography>
                  {articleDetails.member.first_name}
                  {articleDetails.member.last_name}
                </Typography>
              </div>
            )}

            <TextField
              margin="normal"
              id="comment"
              name="comment"
              fullWidth
              value={comment}
              multiline
              rows={4}
              rowsMax={7}
              placeholder="What are your thoughts..."
              //error={firstNameError}
              onChange={(event) => setComment(event.target.value)}
            />
            <Button>Respond</Button>
          </CardContent>
        </Card>
      </Drawer>
    </div>
  );
};

export default ArticleComment;
