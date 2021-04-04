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
import Chat from "@material-ui/icons/ChatBubbleOutline";
import Menu from "@material-ui/icons/MoreHoriz";
import UseAnimations from "react-useanimations";
import heart from "react-useanimations/lib/heart";
import Service from "../AxiosService";
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
  childcommentheader: {
    display: "flex",
    maringTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  parentcommentdivider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  childcommentdivider: {
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
    paddingTop: theme.spacing(2),
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
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
      backgroundColor: "#f5f5f5",
    },
  },
  pop: {
    padding: theme.spacing(1),
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
          return `a few seconds ago`;
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

  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    getArticleComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addTextFieldStatus = (list) => {
    for (let i = 0; i < list.length; i++) {
      list[i].editfield = false;
      list[i].editValue = list[i].comment;
      list[i].replyfield = false;
      list[i].replyValue = "";
      list[i].viewReply = false;
      for (let j = 0; j < list[i].replies.length; j++) {
        list[i].replies[j].editfield = false;
        list[i].replies[j].editValue = list[i].replies[j].comment;
      }
    }
    return list;
  };

  const openEditTextField = (commentid, status) => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
    let newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        newArray[i].editfield = status;
        commentList[i].editValue = commentList[i].comment;
        break;
      }
    }
    setCommentList(newArray);
  };

  const openEditReplyTextField = (commentid, replyid, status) => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
    let newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        for (let j = 0; j < commentList[i].replies.length; j++) {
          if (commentList[i].replies[j].id === replyid) {
            commentList[i].replies[j].editfield = status;
            break;
          }
        }
        break;
      }
    }
    setCommentList(newArray);
  };

  const openReplyTextField = (commentid, status) => {
    let newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        newArray[i].replyfield = status;
        if (!status) {
          commentList[i].replyValue = "";
        }
        break;
      }
    }
    setCommentList(newArray);
  };

  const openReply = (commentid, status) => {
    let newArray = [...commentList];
    for (let i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        newArray[i].viewReply = status;
        break;
      }
    }
    setCommentList(newArray);
  };

  const handleEditTextFieldValue = (commentid, value) => {
    // check if editing same field, then no need loop through array again
    let newArray;
    let i;
    newArray = [...commentList];
    for (i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        newArray[i].editValue = value;
        break;
      }
    }
    setCommentList(newArray);
  };

  const handleReplyTextFieldValue = (commentid, value) => {
    // check if editing same field, then no need loop through array again
    let newArray;
    let i;
    newArray = [...commentList];
    for (i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        newArray[i].replyValue = value;
        break;
      }
    }
    setCommentList(newArray);
  };

  const handleEditReplyTextFieldValue = (commentid, replyid, value) => {
    // check if editing same field, then no need loop through array again
    let newArray;
    let i;
    newArray = [...commentList];
    for (i = 0; i < commentList.length; i++) {
      if (commentList[i].id === commentid) {
        for (let j = 0; j < commentList[i].replies.length; j++) {
          if (commentList[i].replies[j].id === replyid) {
            newArray[i].replies[j].editValue = value;
            break;
          }
        }
        break;
      }
    }
    setCommentList(newArray);
  };

  const handleUpdateComment = (commentid) => {
    let tempcomment;
    for (let i = 0; i < commentList.length; i++) {
      if (commentid === commentList[i].id) {
        commentList[i].editfield = false;
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
        openEditTextField(commentid, false);
      })
      .catch((err) => console.log(err));
  };

  const handleReplyComment = (commentid) => {
    console.log("commentid = " + commentid);
    let tempcomment;
    let i;
    for (i = 0; i < commentList.length; i++) {
      if (commentid === commentList[i].id) {
        tempcomment = commentList[i].replyValue;
        break;
      }
    }
    Service.client
      .post(`/articles/${id}/comments`, {
        comment: tempcomment,
        reply_to: commentid,
      })
      .then((res) => {
        let data = {
          ...res.data,
          editValue: res.data.comment,
        };
        commentList[i].replies.unshift(data);
        openReplyTextField(commentid, false);
        openReply(commentid, true);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateReplyComment = (commentid, replyid) => {
    let tempcomment;
    for (let i = 0; i < commentList.length; i++) {
      if (commentid === commentList[i].id) {
        for (let j = 0; j < commentList[i].replies.length; j++) {
          if (commentList[i].replies[j].id === replyid) {
            commentList[i].replies[j].editfield = false;
            commentList[i].replies[j].comment =
              commentList[i].replies[j].editValue;
            tempcomment = commentList[i].replies[j].editValue;
            break;
          }
        }
        break;
      }
    }
    Service.client
      .put(`/articles/${id}/comments/${replyid}`, {
        comment: tempcomment,
      })
      .then((res) => {
        console.log(res);
        openEditTextField(commentid, false);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteComment = (commentid, replyid, type) => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });

    let newArray;
    newArray = [...commentList];

    if (type === "parent") {
      for (let i = 0; i < commentList.length; i++) {
        if (commentid === commentList[i].id) {
          delete newArray[i];
          Service.client
            .delete(`/articles/${id}/comments/${commentid}`)
            .then(() => {})
            .catch((err) => console.log(err));
          break;
        }
      }
    } else {
      for (let i = 0; i < commentList.length; i++) {
        if (commentid === commentList[i].id) {
          for (let j = 0; j < commentList[i].replies.length; j++) {
            if (commentList[i].replies[j].id === replyid) {
              console.log("reply length: " + newArray[i].replies.length);
              newArray[i].replies = newArray[i].replies.filter(
                (item) => item !== newArray[i].replies[j]
              );
              console.log("reply length: " + newArray[i].replies.length);
              Service.client
                .delete(`/articles/${id}/comments/${replyid}`)
                .then(() => {})
                .catch((err) => console.log(err));
              break;
            }
          }
        }
      }
    }
    setCommentList(newArray);
  };

  const getArticleComments = () => {
    Service.client
      .get(`/articles/${id}/comments`)
      .then((res) => {
        let newCommentList = addTextFieldStatus(res.data);
        setCommentList(newCommentList);
        setArticleDetails({
          ...articleDetails,
          top_level_comments: newCommentList,
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
        //console.log(res);
        setComment({
          comment: "",
        });
        getArticleComments();
      })
      .catch((err) => console.log(err));
  };

  // const handleEditReplyTextField = (replyid, status) => {
  //   let newArray = [...commentList];
  //   for (let i = 0; i < commentList.length; i++) {
  //     if (commentList[i].id === replyid) {
  //       newArray[i].replyfield = status;
  //       commentList[i].replyValue = commentList[i].editReplyValue;
  //     }
  //   }
  //   setCommentList(newArray);
  // };

  const checkIfOwnerOfComment = (userId) => {
    const decoded = jwt_decode(Cookies.get("t1"));
    if (decoded.user_id === userId) {
      return true;
    }
    return false;
  };

  const handleLikeUnlikeParentComment = (commentid, status) => {
    if (status) {
      Service.client
        .delete(`/articles/${id}/comments/${commentid}/engagements`)
        .then((res) => {
          let newArray = [...commentList];
          for (let i = 0; i < commentList.length; i++) {
            if (commentid === commentList[i].id) {
              newArray[i].current_user_liked = false;
              newArray[i].likes -= 1;
              setCommentList(newArray);
              break;
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/articles/${id}/comments/${commentid}/engagements`)
        .then((res) => {
          let newArray = [...commentList];
          for (let i = 0; i < commentList.length; i++) {
            if (commentid === commentList[i].id) {
              newArray[i].current_user_liked = true;
              newArray[i].likes += 1;
              setCommentList(newArray);
              break;
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const handleLikeUnlikeReplyComment = (commentid, replyid, status) => {
    if (status) {
      Service.client
        .delete(`/articles/${id}/comments/${replyid}/engagements`)
        .then((res) => {
          let newArray = [...commentList];
          for (let i = 0; i < commentList.length; i++) {
            if (commentid === commentList[i].id) {
              for (let j = 0; j < commentList[i].replies.length; j++) {
                if (replyid === commentList[i].replies[j].id) {
                  newArray[i].replies[j].current_user_liked = false;
                  newArray[i].replies[j].likes -= 1;
                  setCommentList(newArray);
                  break;
                }
              }
              break;
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/articles/${id}/comments/${replyid}/engagements`)
        .then((res) => {
          let newArray = [...commentList];
          for (let i = 0; i < commentList.length; i++) {
            if (commentid === commentList[i].id) {
              for (let j = 0; j < commentList[i].replies.length; j++) {
                if (replyid === commentList[i].replies[j].id) {
                  newArray[i].replies[j].current_user_liked = true;
                  newArray[i].replies[j].likes += 1;
                  setCommentList(newArray);
                  break;
                }
              }
              break;
            }
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const childComment = (commentid, reply, index, repliesLength) => {
    return (
      <>
        <div className={classes.childcommentheader} style={{ display: "flex" }}>
          {reply.user && (
            <Avatar
              style={{ marginRight: "15px" }}
              src={reply.user.profile_photo}
              alt=""
            />
          )}
          <div style={{ flexDirection: "column", width: "100%" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="body2">
                {reply.user && reply.user.first_name}{" "}
                {reply.user && reply.user.last_name}
              </Typography>
            </div>
            <div style={{ display: "flex" }}>
              <Typography variant="body2" style={{ opacity: 0.7 }}>
                {reply && calculateDateInterval(reply.timestamp)}
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              order: 2,
              marginLeft: "auto",
            }}
          >
            {reply && reply.user && checkIfOwnerOfComment(reply.user.id) && (
              <div>
                <Menu
                  style={{ cursor: "pointer" }}
                  onClick={(e) => handleClick(e, reply.id)}
                />
                <Popover
                  open={popover.popoverId === reply.id}
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
                  <div className={classes.pop}>
                    <Typography
                      variant="body2"
                      className={classes.typography}
                      onClick={() => {
                        openEditReplyTextField(commentid, reply.id, true);
                      }}
                    >
                      Edit this response
                    </Typography>
                    <Typography
                      variant="body2"
                      className={classes.typography}
                      onClick={() => {
                        handleDeleteComment(commentid, reply.id, "reply");
                      }}
                    >
                      Delete
                    </Typography>
                  </div>
                </Popover>
              </div>
            )}
          </div>
        </div>
        {reply.editfield ? (
          <div className={classes.editCommentCard}>
            <Card>
              <CardContent>
                <TextField
                  margin="normal"
                  id="comment"
                  name="comment"
                  fullWidth
                  value={reply.editValue}
                  multiline
                  rows={4}
                  inputProps={{ style: { resize: "vertical" } }}
                  InputProps={{
                    classes: {
                      input: classes.resize,
                    },
                  }}
                  placeholder="What are your thoughts..."
                  //error={firstNameError}
                  onChange={(event) =>
                    handleEditReplyTextFieldValue(
                      commentid,
                      reply.id,
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
                      openEditReplyTextField(commentid, reply.id, false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={reply.comment === "" ? true : false}
                    onClick={() =>
                      handleUpdateReplyComment(commentid, reply.id)
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
            {reply.comment}
          </Typography>
        )}
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <UseAnimations
            animation={heart}
            size={30}
            reverse={reply.current_user_liked}
            wrapperStyle={{
              display: "inline-flex",
            }}
            onClick={() =>
              handleLikeUnlikeReplyComment(
                commentid,
                reply.id,
                reply.current_user_liked
              )
            }
          />
          <Typography
            variant="body2"
            style={{
              marginRight: "5px",
              cursor: "pointer",
            }}
          >
            {reply.likes}
          </Typography>
        </div>
        {index + 1 !== repliesLength && (
          <div className={classes.childcommentdivider}>
            <Divider />
          </div>
        )}
      </>
    );
  };

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

      {user && (
        <Card className={classes.commentcard}>
          <CardContent>
            <div>
              <div className={classes.cardheadername}>
                <Avatar
                  src={user && user.profile_photo}
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
                inputProps={{ style: { resize: "vertical" } }}
                InputProps={{
                  classes: {
                    input: classes.resize,
                  },
                }}
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
          </CardContent>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column" }}>
        <Fragment>
          {commentList.length > 0 ? (
            <div style={{ marginTop: "30px" }}>
              {commentList.map((comment, index) => {
                return (
                  <div key={comment.id} className={classes.parentcommentcard}>
                    <div className={classes.parentcommentheader}>
                      {comment.user && (
                        <Avatar
                          style={{ marginRight: "15px" }}
                          src={comment.user.profile_photo}
                          alt=""
                        />
                      )}
                      <div style={{ flexDirection: "column", width: "100%" }}>
                        <div style={{ display: "flex" }}>
                          <Typography variant="body2">
                            {comment.user && comment.user.first_name}{" "}
                            {comment.user && comment.user.last_name}
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
                              <Menu
                                style={{ cursor: "pointer" }}
                                onClick={(e) => handleClick(e, comment.id)}
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
                                <div className={classes.pop}>
                                  <Typography
                                    variant="body2"
                                    className={classes.typography}
                                    onClick={() => {
                                      openEditTextField(comment.id, true);
                                    }}
                                  >
                                    Edit this reponse
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className={classes.typography}
                                    onClick={() => {
                                      handleDeleteComment(
                                        comment.id,
                                        -1,
                                        "parent"
                                      );
                                    }}
                                  >
                                    Delete
                                  </Typography>
                                </div>
                              </Popover>
                            </div>
                          )}
                        </div>
                        <Typography variant="body2" style={{ opacity: 0.7 }}>
                          {comment && calculateDateInterval(comment.timestamp)}
                        </Typography>
                      </div>
                    </div>
                    <div>
                      {comment.editfield ? (
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
                                inputProps={{ style: { resize: "vertical" } }}
                                InputProps={{
                                  classes: {
                                    input: classes.resize,
                                  },
                                }}
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
                                    openEditTextField(comment.id, false);
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
                          cursor: "pointer",
                        }}
                      >
                        <UseAnimations
                          animation={heart}
                          size={30}
                          reverse={comment.current_user_liked}
                          wrapperStyle={{
                            display: "inline-flex",
                          }}
                          onClick={() =>
                            handleLikeUnlikeParentComment(
                              comment.id,
                              comment.current_user_liked
                            )
                          }
                        />
                        <Typography
                          variant="body2"
                          style={{
                            marginRight: "5px",
                            cursor: "pointer",
                          }}
                        >
                          {comment.likes}
                        </Typography>
                        {comment.replies.length >= 1 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Chat
                              onClick={() => {
                                openReply(comment.id, true);
                              }}
                              style={{ marginRight: "3px" }}
                            />
                            {!comment.viewReply && (
                              <div
                                onClick={() => {
                                  openReply(comment.id, true);
                                }}
                              >
                                {comment.replies.length === 1 ? (
                                  <Typography
                                    variant="body2"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {comment.replies.length} reply
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    style={{ cursor: "pointer" }}
                                  >
                                    {comment.replies.length} replies
                                  </Typography>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {comment.viewReply && comment.replies.length !== 0 && (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              openReply(comment.id, false);
                            }}
                          >
                            <Typography
                              variant="body2"
                              style={{ cursor: "pointer" }}
                            >
                              Hide Replies
                            </Typography>
                          </div>
                        )}

                        <Typography
                          style={{
                            order: 2,
                            marginLeft: "auto",
                            cursor: "pointer",
                          }}
                          variant="body2"
                          onClick={() => {
                            //setReferencedCommentId(comment.id);
                            openReplyTextField(comment.id, true);
                          }}
                        >
                          Reply
                        </Typography>
                      </div>
                    </div>

                    {(comment.replyfield || comment.viewReply) && (
                      <div className={classes.replyCommentCard}>
                        {comment.replyfield && (
                          <Card style={{ marginBottom: "20px" }}>
                            <CardContent>
                              <TextField
                                margin="normal"
                                id="comment"
                                name="comment"
                                fullWidth
                                value={comment.editReplyValue}
                                multiline
                                rows={4}
                                inputProps={{ style: { resize: "vertical" } }}
                                InputProps={{
                                  classes: {
                                    input: classes.resize,
                                  },
                                }}
                                placeholder={
                                  "Replying to " +
                                  comment.user.first_name +
                                  " " +
                                  comment.user.last_name
                                }
                                //error={firstNameError}
                                onChange={(event) =>
                                  handleReplyTextFieldValue(
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
                                    openReplyTextField(comment.id, false);
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
                                    comment.replyValue === "" ? true : false
                                  }
                                  onClick={() => {
                                    handleReplyComment(comment.id);
                                  }}
                                >
                                  Respond
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {comment.replies.length !== 0 &&
                          comment.viewReply &&
                          comment.replies &&
                          comment.replies.length > 0 &&
                          comment.replies.map((reply, replyIndex) => {
                            return (
                              <div key={`reply` + replyIndex}>
                                {childComment(
                                  comment.id,
                                  reply,
                                  replyIndex,
                                  comment.replies.length
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}

                    <div className={classes.parentcommentdivider}>
                      <Divider variant="middle" />
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
      </div>
    </Drawer>
  );
};

export default ArticleComment;
