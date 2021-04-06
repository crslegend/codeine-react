import React, { useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Avatar, Typography, Link, Chip, IconButton } from "@material-ui/core";
import { Reply } from "@material-ui/icons";

import { calculateDateInterval } from "../../utils.js";
import CommentTextArea from "./CommentTextArea.jsx";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    width: "100%",
    height: "80vh",
    position: "sticky",
    top: 100,
    left: 0,
    padding: theme.spacing(2),
    overflow: "hidden",
    overflowY: "scroll",
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
    background: theme.palette.grey[100],
    padding: theme.spacing(1),
  },
  commentAuthor: {
    marginLeft: theme.spacing(1.5),
  },
  commentTimestamp: {
    color: theme.palette.grey[500],
    fontSize: "12px",
  },
  link: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  createIcon: {
    margin: theme.spacing(0, 1),
    height: 24,
    fontSize: "12px",
  },
  commentBody: {
    margin: theme.spacing(1),
  },
  flexItem: {
    flexGrow: 1,
  },
  iconButton: {
    padding: 0,
    margin: "-4px 8px",
    fontSize: "22px",
    color: theme.palette.grey[400],
    transition: "all .15s ease-in-out",
    "&:hover": {
      color: theme.palette.primary.main,
      background: "transparent",
      transform: "scale(1.2)",
    },
  },
  commentCardRoot: {
    border: `1px solid ${theme.palette.grey[200]}`,
    margin: theme.spacing(0.5),
    "&::after": {
      content: "''",
      position: "absolute",
      left: 0,
      top: "20%",
      width: 0,
      height: 0,
      border: "22px solid transparent",
      borderRightColor: theme.palette.primary.main,
      borderLeft: 0,
      marginTop: -22,
      marginLeft: -22,
    },
  },
  replyCardRoot: {
    marginLeft: theme.spacing(3),
    margin: theme.spacing(0.5),
    borderLeft: `3px solid ${theme.palette.primary.main}`,
    border: `1px solid ${theme.palette.grey[200]}`,
  },
}));

const ReplyCommentCard = ({ comment, classes, reviewAuthor }) => {
  return (
    <div className={classes.replyCardRoot}>
      <div className={classes.commentHeader}>
        <Avatar alt={comment.user.email} src={comment.user.profile_photo} style={{ width: 32, height: 32 }} />
        <div className={classes.flexItem}>
          <Typography className={classes.commentAuthor} variant="body2">
            <Link className={classes.link} href={`/member/profile/${comment.user.id}`}>
              {comment.user.first_name} {comment.user.last_name}
            </Link>{" "}
            <span className={classes.commentTimestamp}>{calculateDateInterval(comment.timestamp)}</span>
          </Typography>
          {reviewAuthor.id === comment.user.id && <Chip className={classes.createIcon} label="OP" />}
        </div>
      </div>
      <div className={classes.commentBody} dangerouslySetInnerHTML={{ __html: comment.comment }} />
    </div>
  );
};

const CommentCard = ({ comment, classes, reviewAuthor, getCodeReviewComments }) => {
  const [replyComment, setReplyComment] = useState();
  const { id } = useParams();

  const createComment = () => {
    Service.client
      .post(`/code-reviews/${id}/comments`, {
        comment: replyComment,
        code_line_index: comment.code_line_index,
        parent_comment_id: comment.id,
      })
      .then((res) => {
        setReplyComment();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

  if (!comment || !comment.user) {
    return null;
  }

  return (
    <Fragment>
      <div className={classes.commentCardRoot}>
        <div className={classes.commentHeader}>
          <Avatar alt={comment.user.email} src={comment.user.profile_photo} style={{ width: 32, height: 32 }} />
          <div className={classes.flexItem}>
            <Typography className={classes.commentAuthor} variant="body2">
              <Link className={classes.link} href={`/member/profile/${comment.user.id}`}>
                {comment.user.first_name} {comment.user.last_name}
              </Link>{" "}
              <span className={classes.commentTimestamp}>{calculateDateInterval(comment.timestamp)}</span>
            </Typography>
            {reviewAuthor.id === comment.user.id && <Chip className={classes.createIcon} label="OP" />}
          </div>
          <div>
            <IconButton
              disableRipple
              classes={{ root: classes.iconButton }}
              size="small"
              onClick={() => setReplyComment(" ")}
            >
              <Reply fontSize="inherit" />
            </IconButton>
          </div>
        </div>
        <div className={classes.commentBody} dangerouslySetInnerHTML={{ __html: comment.comment }} />
      </div>
      {replyComment && (
        <CommentTextArea
          comment={replyComment}
          setComment={setReplyComment}
          closeCommentTextArea={() => setReplyComment()}
          onSubmit={() => createComment()}
          header="Reply"
          reply
        />
      )}
      {comment.replies &&
        comment.replies.map((reply, i) => (
          <ReplyCommentCard key={i} comment={reply} classes={classes} reviewAuthor={reviewAuthor} />
        ))}
    </Fragment>
  );
};

const CommentSection = ({ comments, selectedLine, reviewAuthor, getCodeReviewComments }) => {
  const classes = useStyles();

  const filteredComments = comments.filter((comment) => comment.code_line_index === selectedLine);

  return (
    <Card className={classes.cardRoot} raised>
      {filteredComments && filteredComments.length > 0 ? (
        filteredComments.map((comment, i) => (
          <CommentCard
            key={i}
            comment={comment}
            classes={classes}
            reviewAuthor={reviewAuthor}
            getCodeReviewComments={getCodeReviewComments}
          />
        ))
      ) : (
        <div style={{ display: "grid", placeItems: "center" }}>
          <Typography variant="body2">No comments</Typography>
        </div>
      )}
    </Card>
  );
};

export default CommentSection;
