import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import Service from "../../../AxiosService";
import { Chat } from "@material-ui/icons";
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
  }, []);

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
              <div></div>
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
