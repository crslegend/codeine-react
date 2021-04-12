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
import Service from "../../../../AxiosService";
import {
  Block,
  Chat,
  Delete,
  Edit,
  SubdirectoryArrowRight,
  ThumbUp,
} from "@material-ui/icons";
import Toast from "../../../../components/Toast.js";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import NestedComments from "./NestedComments";
import { calculateDateInterval } from "../../../../utils.js";

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
    backgroundColor: "#fff",
  },
  childComment: {
    display: "flex",
    marginBottom: "20px",
    border: "2px solid lightgrey",
    borderRadius: "6px",
    padding: "20px",
    width: "90%",
    marginLeft: "auto",
    backgroundColor: "#fff",
  },
  nestedChildComment: {
    display: "flex",
    marginBottom: "20px",
    border: "2px solid lightgrey",
    borderRadius: "6px",
    padding: "20px",
    width: "80%",
    marginLeft: "auto",
    backgroundColor: "#fff",
  },
  profileLink: {
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  pro: {
    background:
      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
}));

const CommentsSection = ({ materialId, user }) => {
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
  const [nestedComments, setNestedComments] = useState([]);

  const [addCommentDialog, setAddCommentDialog] = useState(false);
  const [replyCommentDialog, setReplyCommentDialog] = useState(false);
  const [editCommentDialog, setEditCommentDialog] = useState(false);
  const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);

  const [commentDialogValue, setCommentDialogValue] = useState({
    comment: "",
  });

  const [referencedCommentId, setReferencedCommentId] = useState();

  const getCourseMaterialComments = () => {
    Service.client
      .get(`/materials/${materialId}/course-comments`)
      .then((res) => {
        console.log(res.data);
        setComments(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCourseMaterialComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId, pageNum]);

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
        setReplyCommentDialog(false);
        setCommentDialogValue("");
        getCourseMaterialComments();
        getNestedComments(cId);
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
        setEditCommentDialog(false);
        setCommentDialogValue("");
        setReferencedCommentId();
        const { childCommentId, isNested } = checkIfCommentIsNested(id);
        if (isNested) {
          getNestedComments(childCommentId);
        }
        getCourseMaterialComments();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteComment = (id) => {
    Service.client
      .delete(`/course-comments/${id}`)
      .then((res) => {
        console.log(res);
        setDeleteCommentDialog(false);
        setReferencedCommentId();
        const { childCommentId, isNested } = checkIfCommentIsNested(id);
        if (isNested) {
          getNestedComments(childCommentId);
        }
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
          const { childCommentId, isNested } = checkIfCommentIsNested(id);
          if (isNested) {
            getNestedComments(childCommentId);
          }
          getCourseMaterialComments();
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/course-comments/${id}/engagements`)
        .then((res) => {
          console.log(res);
          const { childCommentId, isNested } = checkIfCommentIsNested(id);
          if (isNested) {
            getNestedComments(childCommentId);
          }
          getCourseMaterialComments();
        })
        .catch((err) => console.log(err));
    }
  };

  const checkIfOwnerOfComment = (userId) => {
    const decoded = jwt_decode(Cookies.get("t1"));

    if (decoded.user_id === userId) {
      return true;
    }
    return false;
  };

  const checkIfCommentInNestedCommentsArr = (id) => {
    for (let i = 0; i < nestedComments.length; i++) {
      if (nestedComments[i].id === id) {
        return true;
      }
    }
    return false;
  };

  const checkIfCommentIsNested = (id) => {
    for (let i = 0; i < nestedComments.length; i++) {
      for (let j = 0; j < nestedComments[i].replies.length; j++) {
        if (nestedComments[i].replies[j].id === id) {
          return { childCommentId: nestedComments[i].id, isNested: true };
        }
      }
    }
    return { childCommentId: null, isNested: false };
  };

  const getNestedComments = (id) => {
    Service.client
      .get(`/course-comments/${id}`)
      .then((res1) => {
        console.log(res1);
        let arr;
        if (nestedComments.length > 0) {
          arr = [...nestedComments];
        } else {
          arr = [];
        }

        if (checkIfCommentInNestedCommentsArr(id)) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
              arr[i] = {
                id: id,
                replies: res1.data.replies,
              };
            }
          }
        } else {
          arr.push({
            id: id,
            replies: res1.data.replies,
          });
        }

        console.log(arr);
        setNestedComments(arr);
        // setComment(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleProfileLink = (reviewMember) => {
    const decoded = jwt_decode(Cookies.get("t1"));

    if (reviewMember.member.membership_tier === "PRO") {
      if (reviewMember.member.unique_id === null) {
        return `/member/profile/${reviewMember.id}`;
      } else {
        return `/${reviewMember.member.unique_id}`;
      }
    }
  };

  const toRenderProfileLinkOrNot = (reviewMember) => {
    if (reviewMember.member) {
      const decoded = jwt_decode(Cookies.get("t1"));
      if (reviewMember.member.membership_tier === "PRO") {
        return true;
      }
    }
    return false;
  };

  const deletedParentComment = (
    <div
      style={{
        display: "flex",
        marginBottom: "20px",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid lightgrey",
        borderRadius: "6px",
        padding: "10px",
      }}
    >
      <Block style={{ marginRight: "10px" }} />
      <Typography variant="body2">This comment has been deleted</Typography>
    </div>
  );

  const deletedChildComment = (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "10%",
        }}
      >
        <SubdirectoryArrowRight fontSize="large" color="primary" />
      </div>
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid lightgrey",
          borderRadius: "6px",
          padding: "10px",
          width: "90%",
          marginLeft: "auto",
        }}
      >
        <Block style={{ marginRight: "10px" }} />
        <Typography variant="body2">This comment has been deleted</Typography>
      </div>
    </div>
  );

  const deletedNestedComment = (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "20%",
        }}
      >
        <SubdirectoryArrowRight fontSize="large" color="primary" />
      </div>
      <div
        style={{
          display: "flex",
          marginBottom: "20px",
          justifyContent: "center",
          alignItems: "center",
          border: "2px solid lightgrey",
          borderRadius: "6px",
          padding: "10px",
          width: "80%",
          marginLeft: "auto",
        }}
      >
        <Block style={{ marginRight: "10px" }} />
        <Typography variant="body2">This comment has been deleted</Typography>
      </div>
    </div>
  );

  const deletedChildCommentWithButton = (reply) => {
    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "10%",
          }}
        >
          <SubdirectoryArrowRight fontSize="large" color="primary" />
        </div>
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid lightgrey",
            borderRadius: "6px",
            padding: "10px",
            width: "90%",
            marginLeft: "auto",
          }}
        >
          <Block style={{ marginRight: "10px" }} />
          <Typography variant="body2">This comment has been deleted</Typography>
          {reply.reply_count > 0 && (
            <Button
              variant="contained"
              color="primary"
              style={{
                order: 2,
                marginLeft: "auto",
              }}
              onClick={() => {
                setReferencedCommentId(reply.id);
                getNestedComments(reply.id);
              }}
              disabled={checkIfCommentInNestedCommentsArr(reply.id)}
            >
              <Typography variant="body2">
                Replies {reply.reply_count}
              </Typography>
            </Button>
          )}
        </div>
      </div>
    );
  };

  const childComment = (reply, replyIndex) => {
    return (
      <div key={`reply` + replyIndex} style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "10%",
          }}
        >
          <SubdirectoryArrowRight fontSize="large" color="primary" />
        </div>
        <div className={classes.childComment}>
          {toRenderProfileLinkOrNot(reply.user) ? (
            <a
              href={handleProfileLink(reply.user)}
              style={{ textDecoration: "none" }}
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
            </a>
          ) : reply.user.profile_photo ? (
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
            {toRenderProfileLinkOrNot(reply.user) ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <a
                  href={handleProfileLink(reply.user)}
                  className={classes.profileLink}
                >
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {reply.user && reply.user.first_name}{" "}
                    {reply.user && reply.user.last_name}
                  </Typography>
                </a>
                {reply.user.member &&
                  reply.user.member.membership_tier === "PRO" && (
                    <div style={{ marginTop: "4px" }}>
                      <Typography variant="subtitle1" className={classes.pro}>
                        PRO
                      </Typography>
                    </div>
                  )}
              </div>
            ) : (
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                {reply.user && reply.user.first_name}{" "}
                {reply.user && reply.user.last_name}
              </Typography>
            )}

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
                {reply && calculateDateInterval(reply.timestamp)}
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
                      setReferencedCommentId(reply.id);
                      setCommentDialogValue({
                        comment: reply.comment,
                      });
                      setEditCommentDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setReferencedCommentId(reply.id);
                      setDeleteCommentDialog(true);
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
              {user && user === "member" && (
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
                    color={reply.current_member_liked ? "primary" : "inherit"}
                  />
                </IconButton>
              )}
              <div
                style={{
                  order: 2,
                  marginLeft: "auto",
                }}
              >
                {reply.reply_count > 0 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      setReferencedCommentId(reply.id);
                      getNestedComments(reply.id);
                      // setPageNum(2);
                    }}
                    disabled={checkIfCommentInNestedCommentsArr(reply.id)}
                  >
                    <Typography variant="body2">
                      Replies: {reply.reply_count}
                    </Typography>
                  </Button>
                )}
                {/* <Button
                  variant="contained"
                  color="primary"
                  style={{
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    setReferencedCommentId(reply.id);
                    setReplyCommentDialog(true);
                  }}
                >
                  <Typography variant="body2">Reply</Typography>
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const nestedChildComment = (nestedReply, nestedIndex) => {
    return (
      <div key={`nestedreply` + nestedIndex} style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "20%",
          }}
        >
          <SubdirectoryArrowRight fontSize="large" color="primary" />
        </div>
        <div className={classes.nestedChildComment}>
          {toRenderProfileLinkOrNot(nestedReply.user) ? (
            <a
              href={handleProfileLink(nestedReply.user)}
              style={{ textDecoration: "none" }}
            >
              {nestedReply.user.profile_photo ? (
                <Avatar
                  style={{
                    marginRight: "15px",
                  }}
                  src={nestedReply.user.profile_photo}
                />
              ) : (
                <Avatar
                  style={{
                    marginRight: "15px",
                  }}
                >
                  {nestedReply.user.first_name.charAt(0)}
                </Avatar>
              )}
            </a>
          ) : nestedReply.user.profile_photo ? (
            <Avatar
              style={{
                marginRight: "15px",
              }}
              src={nestedReply.user.profile_photo}
            />
          ) : (
            <Avatar
              style={{
                marginRight: "15px",
              }}
            >
              {nestedReply.user.first_name.charAt(0)}
            </Avatar>
          )}

          <div
            style={{
              flexDirection: "column",
              width: "100%",
            }}
          >
            {toRenderProfileLinkOrNot(nestedReply.user) ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <a
                  href={handleProfileLink(nestedReply.user)}
                  className={classes.profileLink}
                >
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {nestedReply.user && nestedReply.user.first_name}{" "}
                    {nestedReply.user && nestedReply.user.last_name}
                  </Typography>
                </a>
                {nestedReply.user.member &&
                  nestedReply.user.member.membership_tier === "PRO" && (
                    <div style={{ marginTop: "4px" }}>
                      <Typography variant="subtitle1" className={classes.pro}>
                        PRO
                      </Typography>
                    </div>
                  )}
              </div>
            ) : (
              <Typography
                variant="h6"
                style={{
                  fontWeight: 600,
                }}
              >
                {nestedReply.user && nestedReply.user.first_name}{" "}
                {nestedReply.user && nestedReply.user.last_name}
              </Typography>
            )}

            <div
              style={{
                display: "flex",
              }}
            >
              <Typography variant="body2">
                Reply to #{nestedReply.reply_to.display_id}
              </Typography>
              <Typography
                variant="body2"
                style={{
                  paddingLeft: "10px",
                  opacity: 0.7,
                }}
              >
                {nestedReply && calculateDateInterval(nestedReply.timestamp)}
              </Typography>
              {nestedReply && checkIfOwnerOfComment(nestedReply.user.id) && (
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
                      setReferencedCommentId(nestedReply.id);
                      setCommentDialogValue({
                        comment: nestedReply.comment,
                      });
                      setEditCommentDialog(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setReferencedCommentId(nestedReply.id);
                      setDeleteCommentDialog(true);
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
              {nestedReply.comment}
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
                Likes: {nestedReply.likes}
              </Typography>
              {user && user === "member" && (
                <IconButton
                  size="small"
                  onClick={() =>
                    handleLikeUnlikeComment(
                      nestedReply.id,
                      nestedReply.current_member_liked
                    )
                  }
                >
                  <ThumbUp
                    color={
                      nestedReply.current_member_liked ? "primary" : "inherit"
                    }
                  />
                </IconButton>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" style={{ fontWeight: 600 }}>
            Comments Section
          </Typography>
          {pageNum && user && user === "member" && pageNum === 1 && (
            <Button
              variant="contained"
              color="primary"
              style={{ order: 2, marginLeft: "auto" }}
              onClick={() => setAddCommentDialog(true)}
            >
              Add Comment
            </Button>
          )}
        </div>
        {pageNum && pageNum === 1 ? (
          <Fragment>
            {comments && comments.length > 0 ? (
              <div style={{ marginTop: "30px" }}>
                {comments.map((comment, index) => {
                  if (comment.user) {
                    return (
                      <Fragment>
                        <div key={index} className={classes.parentComment}>
                          {toRenderProfileLinkOrNot(comment.user) ? (
                            <a
                              href={handleProfileLink(comment.user)}
                              style={{ textDecoration: "none" }}
                            >
                              {comment.user.profile_photo &&
                              comment.user.profile_photo ? (
                                <Avatar
                                  style={{ marginRight: "15px" }}
                                  src={comment.user.profile_photo}
                                />
                              ) : (
                                <Avatar style={{ marginRight: "15px" }}>
                                  {comment.user.first_name.charAt(0)}
                                </Avatar>
                              )}
                            </a>
                          ) : comment.user.profile_photo &&
                            comment.user.profile_photo ? (
                            <Avatar
                              style={{ marginRight: "15px" }}
                              src={comment.user.profile_photo}
                            />
                          ) : (
                            <Avatar style={{ marginRight: "15px" }}>
                              {comment.user.first_name.charAt(0)}
                            </Avatar>
                          )}

                          <div
                            style={{ flexDirection: "column", width: "100%" }}
                          >
                            {toRenderProfileLinkOrNot(comment.user) ? (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <a
                                  href={handleProfileLink(comment.user)}
                                  className={classes.profileLink}
                                >
                                  <Typography
                                    variant="h6"
                                    style={{ fontWeight: 600 }}
                                  >
                                    {comment.user && comment.user.first_name}{" "}
                                    {comment.user && comment.user.last_name}
                                  </Typography>
                                </a>
                                {comment.user.member &&
                                  comment.user.member.membership_tier ===
                                    "PRO" && (
                                    <div style={{ marginTop: "4px" }}>
                                      <Typography
                                        variant="subtitle1"
                                        className={classes.pro}
                                      >
                                        PRO
                                      </Typography>
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <Typography
                                variant="h6"
                                style={{ fontWeight: 600 }}
                              >
                                {comment.user && comment.user.first_name}{" "}
                                {comment.user && comment.user.last_name}
                              </Typography>
                            )}

                            <div style={{ display: "flex" }}>
                              <Typography variant="body2">
                                #{comment.display_id}
                              </Typography>
                              <Typography
                                variant="body2"
                                style={{ paddingLeft: "10px", opacity: 0.7 }}
                              >
                                {comment &&
                                  calculateDateInterval(comment.timestamp)}
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
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setReferencedCommentId(comment.id);
                                        setCommentDialogValue({
                                          comment: comment.comment,
                                        });
                                        setEditCommentDialog(true);
                                      }}
                                    >
                                      <Edit />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setReferencedCommentId(comment.id);
                                        setDeleteCommentDialog(true);
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
                            <div
                              style={{ display: "flex", alignItems: "center" }}
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
                              {user && user === "member" && (
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
                                      comment.current_member_liked
                                        ? "primary"
                                        : "inherit"
                                    }
                                  />
                                </IconButton>
                              )}
                              {/* <Button
                                variant="contained"
                                color="primary"
                                style={{
                                  order: 2,
                                  marginLeft: "auto",
                                }}
                                onClick={() => {
                                  setReferencedCommentId(comment.id);
                                  setReplyCommentDialog(true);
                                }}
                              >
                                <Typography variant="body2">Reply</Typography>
                              </Button> */}
                            </div>
                          </div>
                        </div>

                        {comment.replies &&
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
                                        if (nestedComment.replies.length > 0) {
                                          return nestedComment.replies.map(
                                            (nestedReply, nestedIndex) => {
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
                                  {deletedChildCommentWithButton(reply)}
                                  {nestedComments &&
                                    nestedComments.length > 0 &&
                                    nestedComments.map((nestedComment) => {
                                      if (nestedComment.id === reply.id) {
                                        if (nestedComment.replies.length > 0) {
                                          return nestedComment.replies.map(
                                            (nestedReply, nestedIndex) => {
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
                          })}
                      </Fragment>
                    );
                  } else {
                    return (
                      <Fragment>
                        {deletedParentComment}
                        {comment.replies &&
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
                                        if (nestedComment.replies.length > 0) {
                                          return nestedComment.replies.map(
                                            (nestedReply, nestedIndex) => {
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
                                  {deletedChildCommentWithButton(reply)}
                                  {nestedComments &&
                                    nestedComments.length > 0 &&
                                    nestedComments.map((nestedComment) => {
                                      if (nestedComment.id === reply.id) {
                                        if (nestedComment.replies.length > 0) {
                                          return nestedComment.replies.map(
                                            (nestedReply, nestedIndex) => {
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
                          })}
                      </Fragment>
                    );
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
        ) : (
          <NestedComments
            materialId={materialId}
            referencedCommentId={referencedCommentId}
            setReferencedCommentId={setReferencedCommentId}
            setPageNum={setPageNum}
            calculateDateInterval={calculateDateInterval}
            checkIfOwnerOfComment={checkIfOwnerOfComment}
            commentDialogValue={commentDialogValue}
            setCommentDialogValue={setCommentDialogValue}
            deletedParentComment={deletedParentComment}
            deletedChildComment={deletedChildComment}
            user={user}
          />
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

      <Dialog
        open={replyCommentDialog}
        onClose={() => setReplyCommentDialog(false)}
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
              setReplyCommentDialog(false);
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
        open={editCommentDialog}
        onClose={() => {
          setReferencedCommentId();
          setEditCommentDialog(false);
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
              setEditCommentDialog(false);
              setCommentDialogValue("");
              setReferencedCommentId();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleUpdateComment(referencedCommentId);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteCommentDialog}
        onClose={() => {
          setReferencedCommentId();
          setDeleteCommentDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete Comment?</DialogTitle>
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
              setDeleteCommentDialog(false);
              setReferencedCommentId();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleDeleteComment(referencedCommentId);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CommentsSection;
