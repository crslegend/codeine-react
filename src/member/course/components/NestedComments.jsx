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
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

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

const NestedComments = ({ materialId, referencedCommentId, setPageNum }) => {
  const classes = styles();

  const [comment, setComment] = useState();

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
  }, [referencedCommentId]);

  return (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "10px" }}>
          <IconButton onClick={() => setPageNum(1)}>
            <ArrowBack />
          </IconButton>
        </div>
        {comment && comment && (
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
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default NestedComments;
