import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Card, CardActions, CardContent, Typography } from "@material-ui/core";

import "react-quill/dist/quill.snow.css";
import "./quill.css";
import ReactQuill from "react-quill";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    margin: theme.spacing(1, 0),
    boxShadow: "none",
  },
  quill: {
    minHeight: "100px",
  },
  cardActions: {
    padding: theme.spacing(1),
    marginRight: theme.spacing(1),
    paddingTop: 0,
    justifyContent: "flex-end",
  },
  button: {
    textTransform: "none",
  },
  header: {
    fontSize: "12px",
    margin: theme.spacing(1, 0),
    color: theme.palette.grey[500],
  },
}));

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "code-block"],
    ["link", "image"],
  ],
};

const formats = ["bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link"];

const CommentTextArea = ({ comment, setComment, closeCommentTextArea, onSubmit, header, reply }) => {
  const classes = useStyles();

  return (
    <Card className={classes.cardRoot}>
      <CardContent style={{ paddingTop: reply ? 0 : "" }}>
        {header && <Typography className={classes.header}>{header}</Typography>}
        <ReactQuill
          theme="snow"
          modules={modules}
          formats={formats}
          value={comment}
          onChange={(content) => setComment(content)}
        />
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button className={classes.button} variant="outlined" size="small" onClick={() => closeCommentTextArea()}>
          Cancel
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={comment === ""}
          onClick={() => onSubmit()}
          size="small"
        >
          {reply ? "Reply" : "Add"} comment
        </Button>
      </CardActions>
    </Card>
  );
};

export default CommentTextArea;
