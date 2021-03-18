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
  Typography,
} from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import { calculateDateInterval } from "../../utils.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Delete, Edit } from "@material-ui/icons";

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
  divider: {
    borderTop: "1px solid #bbb",
    marginBottom: "20px",
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
  replyToCommentArr,
  comment,
  setComment,
  reply,
  setReply,
  loggedIn,
  handleAddComment,
  checkIfOwnerOfComment,
  setSelectedComment,
  selectedCommentId,
  setSelectedCommentId,
  editMode,
  setEditMode,
  deleteCommentDialog,
  setDeleteCommentDialog,
  handleDeleteComment,
  handleUpdateComment,
}) => {
  const classes = styles();

  return (
    <div>
      {codeComments && codeComments.length > 0 && (
        <div>
          <Typography variant="h5" style={{ paddingBottom: "10px" }}>
            Answers
          </Typography>
          {codeComments.map((codeComment) => {
            return (
              <div className="replyblock">
                <div
                  style={{
                    display: "flex",
                    marginBottom: "20px",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "90%" }}>
                    <ReactQuill
                      value={codeComment ? codeComment.comment : ""}
                      readOnly={true}
                      theme={"bubble"}
                      modules={editor}
                    />
                  </div>
                  <div style={{ width: "10%" }}>
                    {checkIfOwnerOfComment(
                      codeComment.user && codeComment.user.id
                    ) && (
                      <div>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setEditMode(true);
                            setSelectedCommentId(codeComment.id);
                            setSelectedComment(codeComment);
                          }}
                          disabled={
                            editMode && selectedCommentId === codeComment.id
                          }
                        >
                          <Edit fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedCommentId(codeComment.id);
                            setDeleteCommentDialog(true);
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                  }}
                >
                  <div>
                    {codeComment.user.profile_photo &&
                    codeComment.user.profile_photo ? (
                      <Avatar
                        style={{ marginRight: "15px" }}
                        src={codeComment.user && codeComment.user.profile_photo}
                      />
                    ) : (
                      <Avatar style={{ marginRight: "15px" }}>
                        {codeComment.user &&
                          codeComment.user.first_name.charAt(0)}
                      </Avatar>
                    )}
                  </div>
                  <div
                    style={{
                      flexDirection: "column",
                    }}
                  >
                    <LinkMui className={classes.linkMui}>
                      {`${codeComment && codeComment.user.first_name} ${
                        codeComment && codeComment.user.last_name
                      }`}
                    </LinkMui>
                    <Typography variant="subtitle1" style={{ opacity: 0.8 }}>
                      {` answered ${
                        codeComment &&
                        calculateDateInterval(codeComment.timestamp)
                      }`}
                    </Typography>
                  </div>
                </div>
              </div>
            );
          })}
          <div className={classes.divider} />
        </div>
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

      <Dialog
        open={deleteCommentDialog}
        onClose={() => {
          setDeleteCommentDialog(false);
          setSelectedCommentId();
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete Comment Thread?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setDeleteCommentDialog(false);
              setSelectedCommentId();
            }}
            style={{ width: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: 100 }}
            onClick={() => handleDeleteComment()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CommentSection;
