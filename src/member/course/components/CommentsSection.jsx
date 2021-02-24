import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import Service from "../../../AxiosService";
import { Chat, ThumbUp } from "@material-ui/icons";
import Toast from "../../../components/Toast.js";

const styles = makeStyles((theme) => ({
  dialogButtons: {
    width: 100,
  },
}));

const CommentsSection = ({ materialId }) => {
  const classes = styles();

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

  const [pageNum, setPageNum] = useState(1);
  const [comments, setComments] = useState([]);

  const [addCommentDialog, setAddCommentDialog] = useState(false);
  const [commentDialogValue, setCommentDialogValue] = useState({
    comment: "",
  });

  const getCourseMaterialComments = () => {
    Service.client
      .get(`/materials/${materialId}/course-comments`)
      .then((res) => {
        console.log(res);
        setComments(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCourseMaterialComments();
  }, [materialId]);

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

  const handleAddComment = (id) => {
    if (commentDialogValue === "") {
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

    Service.client
      .post(`/materials/${id}/course-comments`, commentDialogValue)
      .then((res) => {
        console.log(res);
        setAddCommentDialog(false);
        setCommentDialogValue("");
        getCourseMaterialComments();
      })
      .catch((err) => console.log(err));
  };

  const handleLikeUnlikeComment = (id, liked) => {
    if (liked) {
      Service.client
        .delete(`/course-comments/${id}/engagements`)
        .then((res) => {
          console.log(res);
          getCourseMaterialComments();
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/course-comments/${id}/engagements`)
        .then((res) => {
          console.log(res);
          getCourseMaterialComments();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" style={{ fontWeight: 600 }}>
            Comments Section
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ order: 2, marginLeft: "auto" }}
            onClick={() => setAddCommentDialog(true)}
          >
            Add Comment
          </Button>
        </div>
        {pageNum && pageNum === 1 ? (
          <Fragment>
            {comments && comments.length > 0 ? (
              <div style={{ marginTop: "30px" }}>
                {comments.map((comment, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        marginBottom: "20px",
                      }}
                    >
                      <Avatar style={{ marginRight: "15px" }} />
                      <div style={{ flexDirection: "column", width: "100%" }}>
                        <Typography variant="h6" style={{ fontWeight: 600 }}>
                          {comment.user && comment.user.first_name}{" "}
                          {comment.user && comment.user.last_name}
                        </Typography>
                        <div style={{ display: "flex" }}>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {comment &&
                              calculateDateInterval(comment.timestamp)}
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              order: 2,
                              marginLeft: "auto",
                            }}
                          >
                            <Typography
                              variant="body2"
                              style={{
                                opacity: 0.7,
                                paddingRight: "20px",
                              }}
                            >
                              Likes: {comment.likes}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleLikeUnlikeComment(
                                  comment.id,
                                  comment.current_member_liked
                                )
                              }
                            >
                              <ThumbUp
                                color={
                                  comment.current_member_liked ? "primary" : ""
                                }
                              />
                            </IconButton>
                          </div>
                        </div>

                        <Typography
                          variant="body1"
                          style={{ paddingTop: "5px", paddingBottom: "5px" }}
                        >
                          {comment.comment}
                        </Typography>
                        <div style={{ float: "right" }}>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            Replies: {comment.replies && comment.replies.length}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ marginTop: "30px", textAlign: "center" }}>
                <Chat fontSize="large" />
                <Typography variant="body1">No Comments Yet</Typography>
              </div>
            )}
          </Fragment>
        ) : (
          <div></div>
        )}
      </div>

      <Dialog
        open={addCommentDialog}
        onClose={() => setAddCommentDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Add New Comment</DialogTitle>
        <DialogContent>
          <label htmlFor="comment">
            <Typography variant="body1">Enter your comment below</Typography>
          </label>
          <TextField
            id="comment"
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Your comments here"
            multiline
            rows={4}
            value={commentDialogValue && commentDialogValue.comment}
            onChange={(e) =>
              setCommentDialogValue({
                comment: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setAddCommentDialog(false);
              setCommentDialogValue("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleAddComment(materialId);
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CommentsSection;
