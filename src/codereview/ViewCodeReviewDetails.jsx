import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import { Delete, Edit } from "@material-ui/icons";
import logo from "../assets/CodeineLogos/Member.svg";

import { calculateDateInterval } from "../utils.js";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import "./sidenotes.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";
// import { AnchorBase, InlineAnchor, Sidenote } from "sidenotes";
// import TextSelector from "text-selection-react";
// import store from "../redux/store";
// import {
//   deselectSidenote,
//   repositionSidenotes,
//   disconnectSidenote,
//   connectSidenote,
//   selectSidenote,
//   selectAnchor,
// } from "../redux/actions";
import jwt_decode from "jwt-decode";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
// const reactStringReplace = require("react-string-replace");

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

const ViewCodeReviewDetails = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [code, setCode] = useState();
  const [codeComments, setCodeComments] = useState([]);

  const [addCommentDialog, setAddCommentDialog] = useState(false);
  const [comment, setComment] = useState();

  const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState();
  const [selectedComment, setSelectedComment] = useState();

  const [showReplyField, setShowReplyField] = useState(false);
  const [reply, setReply] = useState();
  const [replyToCommentArr, setReplyToCommentArr] = useState([]);

  const [replyParentId, setReplyParentId] = useState();
  const [replyParentComment, setReplyParentComment] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getCodeReview = () => {
    Service.client
      .get(`/code-reviews/${id}`)
      .then((res) => {
        console.log(res);
        setCode(res.data);
        // let arr = res.data.code.split("\n");
        // console.log(arr);
        // setCodeLineByLine(arr);
        // console.log(arr[0].length);
      })
      .catch((err) => console.log(err));
  };

  const getCodeReviewComments = () => {
    Service.client
      .get(`/code-reviews/${id}/comments`)
      .then((res) => {
        console.log(res);

        let parentCommentArr = [];
        let replyCommentArr = [];
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].parent_comment) {
            replyCommentArr.push(res.data[i]);
          } else {
            parentCommentArr.push(res.data[i]);
          }
        }
        setCodeComments([]); // to reset the state of sidenotes
        setCodeComments(parentCommentArr);
        replyCommentArr.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        setReplyToCommentArr(replyCommentArr);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getCodeReview();
    getCodeReviewComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/partner" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Teach on Codeine
          </Typography>
        </Link>
      </ListItem>
      {/* <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/industry" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Partners for Enterprise
          </Typography>
        </Link>
      </ListItem> */}
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/member/register"
          style={{
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link
          to="/member/home"
          style={{
            textDecoration: "none",
          }}
        >
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Dashboard
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          style={{
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            setLoggedIn(false);
            history.push("/");
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" alt="codeine logo" />
      </Link>
    </Fragment>
  );

  const singleComment = (comment) => {
    return (
      <Fragment>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {comment.user.profile_photo && comment.user.profile_photo ? (
            <Avatar
              style={{ marginRight: "15px" }}
              src={comment.user && comment.user.profile_photo}
            />
          ) : (
            <Avatar style={{ marginRight: "15px" }}>
              {comment.user && comment.user.first_name.charAt(0)}
            </Avatar>
          )}
          <div style={{ flexDirection: "column" }}>
            <Typography variant="body2" style={{ fontWeight: 600 }}>
              {comment.user && comment.user.first_name}{" "}
              {comment.user && comment.user.last_name}
            </Typography>
            <Typography variant="body2" style={{ opacity: 0.7 }}>
              {comment && calculateDateInterval(comment.timestamp)}
            </Typography>
          </div>
          {checkIfOwnerOfComment(comment.user && comment.user.id) && (
            <div
              style={{
                flexDirection: "row",
                order: 2,
                marginLeft: "auto",
              }}
            >
              <IconButton
                size="small"
                onClick={() => {
                  setEditMode(true);
                  setSelectedCommentId(comment.id);
                  setSelectedComment(comment);
                }}
                disabled={editMode && selectedCommentId === comment.id}
              >
                <Edit fontSize="small" />
              </IconButton>

              <IconButton
                size="small"
                onClick={() => {
                  setSelectedCommentId(comment.id);
                  setDeleteCommentDialog(true);
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </div>
          )}
        </div>
        <div>
          {editMode && selectedCommentId === comment.id ? (
            <Fragment>
              <TextField
                margin="dense"
                variant="outlined"
                value={selectedComment && selectedComment.comment}
                onChange={(e) =>
                  setSelectedComment({
                    ...selectedComment,
                    comment: e.target.value,
                  })
                }
                InputProps={{
                  classes: { input: classes.input },
                }}
                fullWidth
                autoFocus
              />
              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  style={{ marginRight: "10px" }}
                  onClick={() => handleUpdateComment()}
                  disabled={selectedComment.comment === ""}
                >
                  Save
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setEditMode(false);
                    setSelectedComment();
                    setSelectedCommentId();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Fragment>
          ) : (
            <Typography style={{ fontSize: 13, paddingTop: "10px" }}>
              {comment.comment}
            </Typography>
          )}
        </div>
      </Fragment>
    );
  };

  const checkIfOwnerOfComment = (userId) => {
    const decoded = jwt_decode(Cookies.get("t1"));

    if (decoded.user_id === userId) {
      return true;
    }
    return false;
  };

  const handleAddComment = () => {
    const data = {
      highlighted_code: selectedValue,
      comment: comment,
    };

    Service.client
      .post(`/code-reviews/${id}/comments`, data)
      .then((res) => {
        console.log(res);
        setAddCommentDialog(false);
        setTimeout(() => {
          setComment();
          setSelectedValue();
          getCodeReview();
          getCodeReviewComments();
        }, 500);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteComment = () => {
    Service.client
      .delete(`/code-reviews/${id}/comments/${selectedCommentId}`)
      .then((res) => {
        // console.log(res);
        setDeleteCommentDialog(false);
        setSelectedCommentId();
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateComment = () => {
    const data = {
      highlighted_code: selectedComment.highlighted_code,
      comment: selectedComment.comment,
    };

    Service.client
      .put(`/code-reviews/${id}/comments/${selectedCommentId}`, data)
      .then((res) => {
        console.log(res);
        setEditMode(false);
        setSelectedComment();
        setSelectedCommentId();
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

  const handleReplyToComment = () => {
    const data = {
      highlighted_code: replyParentComment.highlighted_code,
      comment: reply,
      parent_comment_id: replyParentId,
    };

    Service.client
      .post(`/code-reviews/${id}/comments`, data)
      .then((res) => {
        console.log(res);
        setReply();
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };
  // console.log(lineNum);

  return (
    <div className={classes.root}>
      <Navbar
        logo={navLogo}
        bgColor="#fff"
        navbarItems={loggedIn && loggedIn ? loggedInNavbar : memberNavbar}
      />
      <div className={classes.content}>
        <Typography variant="h1" style={{ paddingBottom: "20px" }}>
          {code && code.title}
        </Typography>
        <div style={{ marginBottom: "20px" }}>
          <Typography variant="body1" style={{ opacity: 0.8 }}>
            <LinkMui className={classes.linkMui}>
              {`${code && code.member.first_name} ${
                code && code.member.last_name
              }`}
            </LinkMui>
            {` asked ${code && calculateDateInterval(code.timestamp)}`}
          </Typography>
        </div>
        <div className="codeblock">
          <ReactQuill
            value={code && code.code}
            readOnly={true}
            theme={"bubble"}
          />
        </div>
      </div>
      <Dialog
        open={addCommentDialog}
        onClose={() => {
          setAddCommentDialog(false);

          setTimeout(() => {
            setComment();
            setSelectedValue();
            getCodeReview();
          }, 500);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <span style={{ fontWeight: 600 }}>Text Selected:</span>
          <br />
          {selectedValue && selectedValue}
          <TextField
            autoFocus
            variant="outlined"
            placeholder="Enter comment"
            margin="dense"
            value={comment && comment}
            onChange={(e) => setComment(e.target.value)}
            required
            fullWidth
            multiline
            rows={5}
            style={{ marginTop: "25px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setAddCommentDialog(false);
              setTimeout(() => {
                setComment();
                setSelectedValue();
                getCodeReview();
              }, 500);
            }}
            style={{ width: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: 100 }}
            disabled={!comment || comment === ""}
            onClick={() => handleAddComment()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

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

export default ViewCodeReviewDetails;
