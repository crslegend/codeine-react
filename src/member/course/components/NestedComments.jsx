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
import {
  ArrowBack,
  Block,
  Chat,
  Delete,
  Edit,
  ThumbUp,
} from "@material-ui/icons";
import Toast from "../../../components/Toast.js";

const styles = makeStyles((theme) => ({
  dialogButtons: {
    width: 100,
  },
  parentComment: {
    display: "flex",
    marginBottom: "20px",
    border: "2px solid lightgrey",
    borderRadius: "6px",
    padding: "20px",
  },
  childComment: {
    display: "flex",
    marginBottom: "20px",
    border: "2px solid lightgrey",
    borderRadius: "6px",
    padding: "20px",
    width: "90%",
    marginLeft: "auto",
  },
}));

const NestedComments = ({
  materialId,
  referencedCommentId,
  setReferencedCommentId,
  setPageNum,
  calculateDateInterval,
  checkIfOwnerOfComment,
  commentDialogValue,
  setCommentDialogValue,
  deletedParentComment,
  deletedChildComment,
}) => {
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

  const [comment, setComment] = useState();

  const [editNestedCommentDialog, setEditNestedCommentDialog] = useState(false);
  const [deleteNestedCommentDialog, setDeleteNestedCommentDialog] = useState(
    false
  );
  const [replyNestedCommentDialog, setReplyNestedCommentDialog] = useState(
    false
  );

  const [chosenCommentId, setChosenCommentId] = useState();

  const getNestedComments = () => {
    Service.client
      .get(`/course-comments/${referencedCommentId}`)
      .then((res) => {
        console.log(res);
        setComment(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getNestedComments();
  }, []);

  const handleReplyComment = (mId, cId) => {
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

    const data = {
      comment: commentDialogValue.comment,
      reply_to: cId,
    };

    Service.client
      .post(`/materials/${mId}/course-comments`, data)
      .then((res) => {
        console.log(res);
        setReplyNestedCommentDialog(false);
        setCommentDialogValue("");
        getNestedComments();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateComment = (id) => {
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
      .patch(`/course-comments/${id}`, commentDialogValue)
      .then((res) => {
        console.log(res);
        setEditNestedCommentDialog(false);
        setCommentDialogValue("");
        setReferencedCommentId();
        getNestedComments();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteComment = (id) => {
    Service.client
      .delete(`/course-comments/${id}`)
      .then((res) => {
        console.log(res);
        setDeleteNestedCommentDialog(false);
        setReferencedCommentId();
        getNestedComments();
      })
      .catch((err) => console.log(err));
  };

  const handleLikeUnlikeComment = (id, liked) => {
    if (liked) {
      Service.client
        .delete(`/course-comments/${id}/engagements`)
        .then((res) => {
          console.log(res);
          getNestedComments();
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/course-comments/${id}/engagements`)
        .then((res) => {
          console.log(res);
          getNestedComments();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "10px" }}>
          <IconButton onClick={() => setPageNum(1)}>
            <ArrowBack />
          </IconButton>
        </div>
        {comment && comment && (
          <Fragment>
            {comment.user ? (
              <Fragment>
                <div className={classes.parentComment}>
                  {comment.user.profile_photo ? (
                    <Avatar
                      style={{ marginRight: "15px" }}
                      src={comment.user.profile_photo}
                    />
                  ) : (
                    <Avatar style={{ marginRight: "15px" }}>
                      {comment.user.first_name.charAt(0)}
                    </Avatar>
                  )}
                  <div style={{ flexDirection: "column", width: "100%" }}>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      {comment.user && comment.user.first_name}{" "}
                      {comment.user && comment.user.last_name}
                    </Typography>
                    <div style={{ display: "flex" }}>
                      <Typography variant="body2">
                        #{comment.display_id}
                      </Typography>
                      <Typography
                        variant="body2"
                        style={{ paddingLeft: "10px", opacity: 0.7 }}
                      >
                        {comment && calculateDateInterval(comment.timestamp)}
                      </Typography>
                      {comment && checkIfOwnerOfComment(comment.user.id) && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            order: 2,
                            marginLeft: "auto",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              setChosenCommentId(comment.id);
                              setCommentDialogValue({
                                comment: comment.comment,
                              });
                              setEditNestedCommentDialog(true);
                            }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setChosenCommentId(comment.id);
                              setDeleteNestedCommentDialog(true);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      )}
                    </div>

                    <Typography
                      variant="body1"
                      style={{
                        paddingTop: "5px",
                        paddingBottom: "10px",
                      }}
                    >
                      {comment.comment}
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
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
                            comment.current_member_liked ? "primary" : "inherit"
                          }
                        />
                      </IconButton>
                      <Button
                        variant="contained"
                        color="primary"
                        style={{
                          order: 2,
                          marginLeft: "auto",
                        }}
                        onClick={() => {
                          setReferencedCommentId(comment.id);
                          setReplyNestedCommentDialog(true);
                        }}
                      >
                        <Typography variant="body2">Reply</Typography>
                      </Button>
                    </div>
                  </div>
                </div>

                {comment.replies && comment.replies.length > 0 ? (
                  comment.replies.map((reply, replyIndex) => {
                    if (reply.user) {
                      return (
                        <div
                          key={`reply` + replyIndex}
                          className={classes.childComment}
                        >
                          {reply.user.profile_photo ? (
                            <Avatar
                              style={{ marginRight: "15px" }}
                              src={reply.user.profile_photo}
                            />
                          ) : (
                            <Avatar style={{ marginRight: "15px" }}>
                              {reply.user.first_name.charAt(0)}
                            </Avatar>
                          )}

                          <div
                            style={{
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 600 }}
                            >
                              {reply.user && reply.user.first_name}{" "}
                              {reply.user && reply.user.last_name}
                            </Typography>
                            <div style={{ display: "flex" }}>
                              <Typography variant="body2">
                                Reply to #{reply.reply_to.display_id}
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{
                                  paddingLeft: "10px",
                                  opacity: 0.7,
                                }}
                              >
                                {reply &&
                                  calculateDateInterval(reply.timestamp)}
                              </Typography>
                              {reply && checkIfOwnerOfComment(reply.user.id) && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    order: 2,
                                    marginLeft: "auto",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setChosenCommentId(reply.id);
                                      setCommentDialogValue({
                                        comment: reply.comment,
                                      });
                                      setEditNestedCommentDialog(true);
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setChosenCommentId(reply.id);
                                      setDeleteNestedCommentDialog(true);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </div>
                              )}
                            </div>

                            <Typography
                              variant="body1"
                              style={{
                                paddingTop: "5px",
                                paddingBottom: "10px",
                              }}
                            >
                              {reply.comment}
                            </Typography>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body2"
                                style={{
                                  opacity: 0.7,
                                  paddingRight: "20px",
                                }}
                              >
                                Likes: {reply.likes}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleLikeUnlikeComment(
                                    reply.id,
                                    reply.current_member_liked
                                  )
                                }
                              >
                                <ThumbUp
                                  color={
                                    reply.current_member_liked
                                      ? "primary"
                                      : "inherit"
                                  }
                                />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return deletedChildComment;
                    }
                  })
                ) : (
                  <div style={{ marginTop: "30px", textAlign: "center" }}>
                    <Chat fontSize="large" />
                    <Typography variant="body1">No Reply Yet</Typography>
                  </div>
                )}
              </Fragment>
            ) : (
              <Fragment>
                {deletedParentComment}
                {comment.replies && comment.replies.length > 0 ? (
                  comment.replies.map((reply, replyIndex) => {
                    if (reply.user) {
                      return (
                        <div
                          key={`reply` + replyIndex}
                          className={classes.childComment}
                        >
                          {reply.user.profile_photo ? (
                            <Avatar
                              style={{ marginRight: "15px" }}
                              src={reply.user.profile_photo}
                            />
                          ) : (
                            <Avatar style={{ marginRight: "15px" }}>
                              {reply.user.first_name.charAt(0)}
                            </Avatar>
                          )}

                          <div
                            style={{
                              flexDirection: "column",
                              width: "100%",
                            }}
                          >
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 600 }}
                            >
                              {reply.user && reply.user.first_name}{" "}
                              {reply.user && reply.user.last_name}
                            </Typography>
                            <div style={{ display: "flex" }}>
                              <Typography variant="body2">
                                Reply to #{reply.reply_to.display_id}
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{
                                  paddingLeft: "10px",
                                  opacity: 0.7,
                                }}
                              >
                                {reply &&
                                  calculateDateInterval(reply.timestamp)}
                              </Typography>
                              {reply && checkIfOwnerOfComment(reply.user.id) && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    order: 2,
                                    marginLeft: "auto",
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setChosenCommentId(reply.id);
                                      setCommentDialogValue({
                                        comment: reply.comment,
                                      });
                                      setEditNestedCommentDialog(true);
                                    }}
                                  >
                                    <Edit />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setChosenCommentId(reply.id);
                                      setDeleteNestedCommentDialog(true);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                </div>
                              )}
                            </div>

                            <Typography
                              variant="body1"
                              style={{
                                paddingTop: "5px",
                                paddingBottom: "10px",
                              }}
                            >
                              {reply.comment}
                            </Typography>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                variant="body2"
                                style={{
                                  opacity: 0.7,
                                  paddingRight: "20px",
                                }}
                              >
                                Likes: {reply.likes}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleLikeUnlikeComment(
                                    reply.id,
                                    reply.current_member_liked
                                  )
                                }
                              >
                                <ThumbUp
                                  color={
                                    reply.current_member_liked
                                      ? "primary"
                                      : "inherit"
                                  }
                                />
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return deletedChildComment;
                    }
                  })
                ) : (
                  <div style={{ marginTop: "30px", textAlign: "center" }}>
                    <Chat fontSize="large" />
                    <Typography variant="body1">No Reply Yet</Typography>
                  </div>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
      </div>

      <Dialog
        open={replyNestedCommentDialog}
        onClose={() => setReplyNestedCommentDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Reply To Comment</DialogTitle>
        <DialogContent>
          <label htmlFor="comment">
            <Typography variant="body1">Enter your reply below</Typography>
          </label>
          <TextField
            id="comment"
            variant="outlined"
            margin="dense"
            fullWidth
            placeholder="Your reply here"
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
              setReplyNestedCommentDialog(false);
              setCommentDialogValue("");
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleReplyComment(materialId, referencedCommentId);
            }}
          >
            Reply
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editNestedCommentDialog}
        onClose={() => {
          setChosenCommentId();
          setEditNestedCommentDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Edit Comment</DialogTitle>
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
              setEditNestedCommentDialog(false);
              setCommentDialogValue("");
              setChosenCommentId();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleUpdateComment(chosenCommentId);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteNestedCommentDialog}
        onClose={() => {
          setChosenCommentId();
          setDeleteNestedCommentDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete Comment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            This action cannot be reverted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setDeleteNestedCommentDialog(false);
              setChosenCommentId();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleDeleteComment(chosenCommentId);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default NestedComments;
