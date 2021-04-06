import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Avatar, Typography, Chip, Link } from "@material-ui/core";

import { calculateDateInterval } from "../../utils.js";
import { CreateSharp } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    width: "100%",
    height: "80vh",
    position: "sticky",
    top: 100,
    left: 0,
    padding: theme.spacing(2),
  },
  commentHeader: {
    display: "flex",
    alignItems: "center",
  },
  commentAuthor: {
    marginLeft: theme.spacing(1.5),
  },
  commentTimestamp: {
    color: theme.palette.grey[500],
  },
  link: {
    "&:hover": {
      cursor: "pointer",
    },
  },
  createIcon: {
    margin: theme.spacing(0, 1),
  },
}));

const CommentCard = ({ comment, classes, reviewAuthor }) => {
  if (!comment) {
    return;
  }

  return (
    <div>
      <div className={classes.commentHeader}>
        <Avatar alt={comment.user.email} src={comment.user.profile_photo} style={{ width: 32, height: 32 }} />
        <div>
          <Typography className={classes.commentAuthor} variant="body2">
            <Link className={classes.link}>
              {comment.user.first_name} {comment.user.last_name}
            </Link>{" "}
            <span className={classes.commentTimestamp}>{calculateDateInterval(comment.timestamp)}</span>
          </Typography>
        </div>
        {reviewAuthor.id === comment.user.id && <CreateSharp className={classes.createIcon} color="primary" />}
      </div>

      <div dangerouslySetInnerHTML={{ __html: comment.comment }} />
    </div>
  );
};

const CommentSection = ({ comments, selectedLine, reviewAuthor }) => {
  const classes = useStyles();

  const filteredComments = comments.filter((comment) => comment.code_line_index === selectedLine);

  return (
    <Card className={classes.cardRoot}>
      {filteredComments && filteredComments.length > 0 ? (
        filteredComments.map((comment) => (
          <CommentCard comment={comment} classes={classes} reviewAuthor={reviewAuthor} />
        ))
      ) : (
        <Typography variant="h6">No comments</Typography>
      )}
    </Card>
  );
};

export default CommentSection;
