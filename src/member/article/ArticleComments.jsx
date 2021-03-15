import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Card,
  CardContent,
  Avatar,
  Popover,
  Divider,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/DeleteOutline";
import Chat from "@material-ui/icons/ChatBubbleOutline";
import Menu from "@material-ui/icons/MoreHoriz";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  drawer: {
    width: "450px",
    padding: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  parentcommentcard: {
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
  parentcommentheader: {
    display: "flex",
    marginBottom: theme.spacing(1),
  },
  parentcommentdivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cardheadername: {
    display: "flex",
  },
  commentcard: {
    marginBottom: theme.spacing(2),
    paddingBottom: "0px",
    minHeight: "220px",
  },
  replyCommentCard: {
    paddingLeft: theme.spacing(2),
    borderLeft: "0.3em solid grey",
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  editCommentCard: {
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  typography: {
    padding: theme.spacing(2),
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
    },
  },
}));

const ArticleComment = (props) => {
  const classes = useStyles();
  const { id } = useParams();

  const {
    user,
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
    window,
  } = props;

  //const [anchorEl, setAnchorEl] = useState(null);

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

  const handleClick = (event, courseId) => {
    setPopover({
      popoverId: courseId,
      anchorEl: event.currentTarget,
    });
  };

  const handleClose = () => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
  };

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

  const [comment, setComment] = useState({
    comment: "",
    textfield: "",
  });

  const [replyComment, setReplyComment] = useState({
    comment: "",
  });

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    getArticleComments();
  }, []);

  const addTextFieldStatus = (list) => {
    for (let i = 0; i < list.length; i++) {
      list[i].textfield = false;
      list[i].editValue = list[i].comment;
      list[i].replyfield = false;
      list[i].editReplyValue = "";
    }
    return list;
  };

  const handleEditTextField = (commentid, status) => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
    let newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        newArray[i].textfield = status;
        commentList[i].editValue = commentList[i].comment;
        break;
      }
    }
    setCommentList(newArray);
  };

  const handleReplyTextField = (commentid, status) => {
    let newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        newArray[i].replyfield = status;
        //commentList[i].replyValue = commentList[i].comment;
        break;
      }
    }
    setCommentList(newArray);
  };

  let tempCommentId = -1;

  const handleEditTextFieldValue = (commentid, value) => {
    // check if editing same field, then no need loop through array again
    let newArray;
    let i;
    if (tempCommentId !== commentid) {
      newArray = [...commentList];
      tempCommentId = commentid;
      for (i = 0; i < commentList.length; i++) {
        if (commentList[i].id === commentid) {
          newArray[i].editValue = value;
          break;
        }
      }
    } else {
      newArray[i].comment = value;
    }
    setCommentList(newArray);
  };

  const handleUpdateComment = (commentid) => {
    console.log("commentid = " + commentid);
    let tempcomment;
    for (let i = 0; i < commentList.length; i++) {
      if (commentid === commentList[i].id) {
        commentList[i].textfield = false;
        commentList[i].comment = commentList[i].editValue;
        tempcomment = commentList[i].editValue;
        break;
      }
    }
    Service.client
      .put(`/articles/${id}/comments/${commentid}`, {
        comment: tempcomment,
      })
      .then((res) => {
        console.log(res);
        handleEditTextField(commentid, false);
        // const { childCommentId, isNested } = checkIfCommentIsNested(id);
        // if (isNested) {
        //   getNestedComments(childCommentId);
        // }
      })
      .catch((err) => console.log(err));
  };

  //untested for now!!! till can reply first
  const handleDeleteComment = (commentid) => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
    let newArray;
    newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentid === commentList[i].id) {
        delete newArray[i];
        return;
      }
    }
    setCommentList(newArray);

    Service.client
      .delete(`/articles/${id}/comments/${commentid}`)
      .then((res) => {
        console.log(res);

        // const { childCommentId, isNested } = checkIfCommentIsNested(id);
        // if (isNested) {
        //   getNestedComments(childCommentId);
        // }
        // getArticleComments();
      })
      .catch((err) => console.log(err));
  };

  const getArticleComments = () => {
    Service.client
      .get(`/articles/${id}/comments`)
      .then((res) => {
        console.log(res.data);
        let newCommentList = addTextFieldStatus(res.data);
        setCommentList(newCommentList);
        setArticleDetails({
          ...articleDetails,
          top_level_comments: commentList,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleAddComment = (id) => {
    Service.client
      .post(`/articles/${articleDetails.id}/comments`, {
        comment: comment.comment,
      })
      .then((res) => {
        console.log(res);
        setComment({
          comment: "",
        });
        getArticleComments();
      })
      .catch((err) => console.log(err));
  };

  const handleEditReplyTextField = (replyid, status) => {
    let newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].id === replyid) {
        newArray[i].replyfield = status;
        commentList[i].replyValue = commentList[i].editReplyValue;
      }
    }
    setCommentList(newArray);
  };

  const handleReplyComment = (mId, cId) => {
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

    const data = {
      comment: comment,
      reply_to: cId,
    };

    // Service.client
    //   .post(`/articles/${mId}/course-comments`, data)
    //   .then((res) => {
    //     console.log(res);
    //     setReplyCommentDialog(false);
    //     setCommentDialogValue("");
    //     getArticleComments();
    //     getNestedComments(cId);
    //   })
    //   .catch((err) => console.log(err));
  };

  const checkIfOwnerOfComment = (userId) => {
    const decoded = jwt_decode(Cookies.get("t1"));
    if (decoded.user_id === userId) {
      return true;
    }
    return false;
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Drawer
      BackdropProps={{ invisible: true }}
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
        Responses ({articleDetails.top_level_comments.length})
      </Typography>

      <Card className={classes.commentcard}>
        <CardContent>
          {user && (
            <div>
              <div className={classes.cardheadername}>
                <Avatar
                  src={user.profile_photo}
                  alt=""
                  style={{ marginRight: "15px" }}
                />
                <Typography style={{ marginTop: "8px" }}>
                  {user.first_name} {user.last_name}
                </Typography>
              </div>
              <TextField
                margin="normal"
                id="comment"
                name="comment"
                fullWidth
                value={comment.comment}
                multiline
                rows={4}
                rowsMax={7}
                placeholder="What are your thoughts..."
                //error={firstNameError}
                onChange={(event) =>
                  setComment({
                    comment: event.target.value,
                  })
                }
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  order: 2,
                  marginLeft: "auto",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={comment.comment === "" ? true : false}
                  onClick={() => handleAddComment()}
                  style={{
                    order: 2,
                    marginLeft: "auto",
                    textTransform: "capitalize",
                  }}
                >
                  Respond
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Fragment>
          {commentList.length > 0 ? (
            <div style={{ marginTop: "30px" }}>
              {commentList.map((comment, index) => {
                if (comment.user) {
                  return (
                    <Fragment>
                      <div key={index} className={classes.parentcommentcard}>
                        <div className={classes.parentcommentheader}>
                          {comment.user.profile_photo && (
                            <Avatar
                              style={{ marginRight: "15px" }}
                              src={comment.user.profile_photo}
                              alt=""
                            />
                          )}
                          <div
                            style={{ flexDirection: "column", width: "100%" }}
                          >
                            <div style={{ display: "flex" }}>
                              <Typography variant="body2">
                                {comment.user && comment.user.first_name}{" "}
                                {comment.user && comment.user.last_name}
                              </Typography>
                              {comment &&
                                checkIfOwnerOfComment(comment.user.id) && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      order: 2,
                                      marginLeft: "auto",
                                    }}
                                  >
                                    <Menu
                                      onClick={(e) =>
                                        handleClick(e, comment.id)
                                      }
                                    />
                                    <Popover
                                      open={popover.popoverId === comment.id}
                                      onClose={handleClose}
                                      anchorEl={popover.anchorEl}
                                      anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "right",
                                      }}
                                      transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        className={classes.typography}
                                        onClick={() => {
                                          handleEditTextField(comment.id, true);
                                        }}
                                      >
                                        Edit this reponse
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        className={classes.typography}
                                        onClick={() => {
                                          // setDeleteCommentDialog(true);
                                        }}
                                      >
                                        Delete
                                      </Typography>
                                    </Popover>
                                  </div>
                                )}
                            </div>
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
                              {comment &&
                                calculateDateInterval(comment.timestamp)}
                            </Typography>
                          </div>
                        </div>
                        <div>
                          {comment.textfield ? (
                            <div className={classes.editCommentCard}>
                              <Card>
                                <CardContent>
                                  <TextField
                                    margin="normal"
                                    id="comment"
                                    name="comment"
                                    fullWidth
                                    value={comment.editValue}
                                    multiline
                                    rows={4}
                                    rowsMax={7}
                                    placeholder="What are your thoughts..."
                                    //error={firstNameError}
                                    onChange={(event) =>
                                      handleEditTextFieldValue(
                                        comment.id,
                                        event.target.value
                                      )
                                    }
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "right",
                                      order: 2,
                                    }}
                                  >
                                    <Button
                                      style={{
                                        order: 2,
                                        textTransform: "capitalize",
                                      }}
                                      onClick={() => {
                                        //setReferencedCommentId(comment.id);
                                        handleEditTextField(comment.id, false);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      disabled={
                                        comment.comment === "" ? true : false
                                      }
                                      onClick={() =>
                                        handleUpdateComment(comment.id)
                                      }
                                      style={{
                                        order: 2,
                                        marginLeft: "auto",
                                        textTransform: "capitalize",
                                      }}
                                    >
                                      Update
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ) : (
                            <Typography
                              variant="body1"
                              style={{
                                paddingTop: "5px",
                                paddingBottom: "10px",
                              }}
                            >
                              {comment.comment}
                            </Typography>
                          )}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Chat
                              color={
                                comment.current_member_liked
                                  ? "primary"
                                  : "inherit"
                              }
                            />
                            <Typography variant="body2">xx reply</Typography>

                            <Button
                              style={{
                                order: 2,
                                marginLeft: "auto",
                                textTransform: "capitalize",
                              }}
                              onClick={() => {
                                //setReferencedCommentId(comment.id);
                                handleReplyTextField(comment.id, true);
                              }}
                            >
                              <Typography variant="body2">Reply</Typography>
                            </Button>
                          </div>
                        </div>
                        {comment.replyfield && (
                          <div className={classes.replyCommentCard}>
                            <Card>
                              <CardContent>
                                <TextField
                                  margin="normal"
                                  id="comment"
                                  name="comment"
                                  fullWidth
                                  value={replyComment.comment}
                                  multiline
                                  rows={4}
                                  rowsMax={7}
                                  placeholder={
                                    "Replying to " +
                                    comment.user.first_name +
                                    " " +
                                    comment.user.last_name
                                  }
                                  //error={firstNameError}
                                  onChange={(event) =>
                                    setReplyComment({
                                      comment: event.target.value,
                                    })
                                  }
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "right",
                                    order: 2,
                                  }}
                                >
                                  <Button
                                    style={{
                                      order: 2,
                                      textTransform: "capitalize",
                                    }}
                                    onClick={() => {
                                      handleReplyTextField(comment.id, false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    style={{
                                      order: 2,
                                      marginLeft: "auto",
                                      textTransform: "capitalize",
                                    }}
                                    disabled={
                                      replyComment.comment === "" ? true : false
                                    }
                                    onClick={() => {
                                      //setOpenReplyTextField(false);
                                    }}
                                  >
                                    Respond
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                        <div className={classes.parentcommentdivider}>
                          <Divider variant="middle" />
                        </div>
                      </div>

                      {/* {comment.replies &&
                            comment.replies.length > 0 &&
                            comment.replies.map((reply, replyIndex) => {
                              if (reply.user) {
                                return (
                                  <Fragment>
                                    {childComment(reply, replyIndex)}
                                    {nestedComments &&
                                      nestedComments.length > 0 &&
                                      nestedComments.map((nestedComment) => {
                                        if (nestedComment.id === reply.id) {
                                          if (
                                            nestedComment.replies.length > 0
                                          ) {
                                            return nestedComment.replies.map(
                                              (nestedReply, nestedIndex) => {
                                                console.log(nestedReply);
                                                if (nestedReply.user) {
                                                  return nestedChildComment(
                                                    nestedReply,
                                                    nestedIndex
                                                  );
                                                }
                                                return deletedNestedComment;
                                              }
                                            );
                                          }
                                          return null;
                                        } else {
                                          return null;
                                        }
                                      })}
                                  </Fragment>
                                );
                              } else {
                                return (
                                  <Fragment>
                                    {deletedChildCommentWithButton(reply.id)}
                                    {nestedComments &&
                                      nestedComments.length > 0 &&
                                      nestedComments.map((nestedComment) => {
                                        if (nestedComment.id === reply.id) {
                                          if (
                                            nestedComment.replies.length > 0
                                          ) {
                                            return nestedComment.replies.map(
                                              (nestedReply, nestedIndex) => {
                                                console.log(nestedReply);
                                                if (nestedReply.user) {
                                                  return nestedChildComment(
                                                    nestedReply,
                                                    nestedIndex
                                                  );
                                                }
                                                return deletedNestedComment;
                                              }
                                            );
                                          }
                                          return null;
                                        } else {
                                          return null;
                                        }
                                      })}
                                  </Fragment>
                                );
                              }
                            })} */}
                    </Fragment>
                  );
                } else {
                  // return (
                  //   <Fragment>
                  //     {deletedParentComment}
                  //     {comment.replies &&
                  //       comment.replies.length > 0 &&
                  //       comment.replies.map((reply, replyIndex) => {
                  //         if (reply.user) {
                  //           return (
                  //             <Fragment>
                  //               {childComment(reply, replyIndex)}
                  //               {nestedComments &&
                  //                 nestedComments.length > 0 &&
                  //                 nestedComments.map((nestedComment) => {
                  //                   if (nestedComment.id === reply.id) {
                  //                     if (
                  //                       nestedComment.replies.length > 0
                  //                     ) {
                  //                       return nestedComment.replies.map(
                  //                         (nestedReply, nestedIndex) => {
                  //                           console.log(nestedReply);
                  //                           if (nestedReply.user) {
                  //                             return nestedChildComment(
                  //                               nestedReply,
                  //                               nestedIndex
                  //                             );
                  //                           }
                  //                           return deletedNestedComment;
                  //                         }
                  //                       );
                  //                     }
                  //                     return null;
                  //                   } else {
                  //                     return null;
                  //                   }
                  //                 })}
                  //             </Fragment>
                  //           );
                  //         } else {
                  //           return (
                  //             <Fragment>
                  //               {deletedChildCommentWithButton(reply.id)}
                  //               {nestedComments &&
                  //                 nestedComments.length > 0 &&
                  //                 nestedComments.map((nestedComment) => {
                  //                   if (nestedComment.id === reply.id) {
                  //                     if (
                  //                       nestedComment.replies.length > 0
                  //                     ) {
                  //                       return nestedComment.replies.map(
                  //                         (nestedReply, nestedIndex) => {
                  //                           console.log(nestedReply);
                  //                           if (nestedReply.user) {
                  //                             return nestedChildComment(
                  //                               nestedReply,
                  //                               nestedIndex
                  //                             );
                  //                           }
                  //                           return deletedNestedComment;
                  //                         }
                  //                       );
                  //                     }
                  //                     return null;
                  //                   } else {
                  //                     return null;
                  //                   }
                  //                 })}
                  //             </Fragment>
                  //           );
                  //         }
                  //       })}
                  //   </Fragment>
                  // );
                }
              })}
            </div>
          ) : (
            <div style={{ marginTop: "30px", textAlign: "center" }}>
              <Chat fontSize="large" />
              <Typography variant="body1">No Comments Yet</Typography>
            </div>
          )}
        </Fragment>
      </div>
    </Drawer>
  );
};

export default ArticleComment;
