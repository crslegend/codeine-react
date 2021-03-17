import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  content: {
    padding: theme.spacing(13),
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  commentCard: {
    width: 250,
    minHeight: 100,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    height: 10,
    fontSize: 13,
  },
  linkMui: {
    cursor: "pointer",
    "&:hover": {
      textDecoration: "none",
      color: "#065cc4",
    },
  },
}));

const editor = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const format = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

const CommentSection = ({
  codeComments,
  comment,
  setComment,
  reply,
  setReply,
  loggedIn,
  handleAddComment,
}) => {
  const classes = styles();

  return (
    <div>
      {codeComments && codeComments.length > 0 && (
        <Typography variant="h5" style={{ paddingBottom: "10px" }}>
          Answers
        </Typography>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" style={{ paddingBottom: "10px" }}>
          Your Answer
        </Typography>
        <div style={{ marginBottom: "20px" }}>
          <ReactQuill
            value={comment ? comment : ""}
            onChange={(value) => setComment(value)}
            modules={editor}
            format={format}
            theme="snow"
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            handleAddComment();
          }}
          style={{
            height: 30,
            width: 150,
            marginLeft: "auto",
          }}
          disabled={!loggedIn}
        >
          Post Answer
        </Button>
      </div>
    </div>
  );
};

export default CommentSection;
