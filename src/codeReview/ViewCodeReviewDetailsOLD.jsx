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
import { Delete, Edit } from "@material-ui/icons";
import logo from "../assets/codeineLogos/Member.svg";

import { calculateDateInterval } from "../utils.js";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import "./sidenotes.css";
import { AnchorBase, InlineAnchor, Sidenote } from "sidenotes";
import TextSelector from "text-selection-react";
import store from "../redux/Store";
import {
  deselectSidenote,
  repositionSidenotes,
  disconnectSidenote,
  connectSidenote,
  selectSidenote,
  selectAnchor,
} from "../redux/Actions";
import jwt_decode from "jwt-decode";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
const reactStringReplace = require("react-string-replace");

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  content: {
    padding: theme.spacing(13),
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
}));

const ViewCodeReviewDetails = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [code, setCode] = useState();
  const [codeLineByLine, setCodeLineByLine] = useState([]);
  const [codeComments, setCodeComments] = useState([]);
  const [init, setInit] = useState(false);

  const [addCommentDialog, setAddCommentDialog] = useState(false);
  const [comment, setComment] = useState();
  const [indexes, setIndexes] = useState({
    start: 0,
    end: 0,
  });

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

  const deselect = () => {
    setTimeout(() => {
      select(replyParentId);
      setReplyParentId();
      setReplyParentComment();
    }, 0.1);
    setShowReplyField(false);
    store.dispatch(deselectSidenote(code && code.id));
  };
  const reposition = (docId) => store.dispatch(repositionSidenotes(docId));
  const select = (sId) => store.dispatch(selectAnchor(code && code.id, sId));
  // const connectNote = (sId) =>
  //   store.dispatch(connectSidenote(code && code.id, sId));

  const getCodeReview = () => {
    Service.client
      .get(`/code-reviews/${id}`)
      .then((res) => {
        console.log(res);
        setCode(res.data);
        let arr = res.data.code.split("\n");
        console.log(arr);
        setCodeLineByLine(arr);
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

  const baseAnchor = "anchor";

  const applyInlineAnchor = (str) => {
    let formatted = str;
    // const arr = ["sidenotes", "once"];

    for (let i = 0; i < codeComments.length; i++) {
      formatted = reactStringReplace(
        formatted,
        codeComments[i].highlighted_code,
        (match, index, offset) => {
          // console.log(match);
          // console.log(offset);

          if (offset === codeComments[i].start_index) {
            return (
              <InlineAnchor sidenote={codeComments[i].id}>{match}</InlineAnchor>
            );
          } else {
            return match;
          }
        }
      );
    }

    if (!init) {
      setInit(true);
    }
    // console.log(formatted);
    return formatted;
  };

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

                  setTimeout(() => {
                    select(comment.id);
                  }, 0.1);
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

                    setTimeout(() => {
                      select(selectedCommentId);
                      setSelectedCommentId();
                    }, 0.5);
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

  const handleSelectText = (text) => {
    console.log(text);
    setSelectedValue(text);
    setAddCommentDialog(true);
    // setTimeout(() => {
    //   if (window.getSelection) {
    //     window.getSelection().removeAllRanges();
    //   } else if (document.selection) {
    //     document.selection.empty();
    //   }
    // }, 3000);
  };

  const getIndex = () => {
    document.body.addEventListener(
      "mouseup",
      function () {
        if (window.getSelection().toString().length > 0) {
          if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            // console.log(sel);
            var range = sel.getRangeAt(0);
            // var parentNodeArr = sel.focusNode.parentNode.innerText.split("\n");
            // console.log(parentNodeArr);
            // var rangeIndex = 0;
            // var parentIndex = 0;
            // var max = sel.focusNode.parentNode.innerText.length - 1;
            // var range = sel.toString();
            // var rangeNodeArr = range.split("\n");
            // var rangeLen = rangeNodeArr.length - 1;

            // for (parentIndex = 0; parentIndex <= max; parentIndex++) {
            //   if (parentNodeArr[parentIndex] === rangeNodeArr[rangeIndex]) {
            //     if (rangeIndex === rangeLen) {
            //       break;
            //     }
            //     rangeIndex++;
            //   } else {
            //     rangeIndex = 0;
            //   }
            // }
            // var endOffset = parentIndex + 1;
            // var startOffset = parentIndex - rangeIndex;
            // console.log(startOffset);
            // console.log(endOffset);

            // console.log(range);
            // var priorRange = range.cloneRange();

            // priorRange.setEnd(range.startContainer, range.startOffset);
            // var startOffset = priorRange.toString().length;
            // var endOffset = startOffset + range.toString().length;

            var startOffset = range.startOffset;
            var endOffset = startOffset + range.toString().length;

            // console.log("Selection starts at: " + startOffset);
            // console.log("Selection ends at: " + endOffset);
            if (startOffset === 0 && endOffset === 0) {
              // do nothing
            } else {
              setIndexes({
                start: startOffset,
                end: endOffset,
              });
            }
          }
        }
      },
      false
    );
  };

  const handleAddComment = () => {
    const data = {
      highlighted_code: selectedValue,
      comment: comment,
      start_index: indexes.start,
      end_index: indexes.end,
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
        select(selectedCommentId);
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
        select(replyParentId);
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
      <div className={classes.content} onClick={deselect}>
        <article id={code && code.id}>
          <TextSelector
            events={[
              {
                text: "Add a Comment",
                handler: (html, text) => {
                  handleSelectText(text);
                },
              },
            ]}
            colorText={false}
            unmark={false}
          />
          <div className="main-panel">
            <AnchorBase anchor={baseAnchor} style={{ width: "100%" }}>
              <div
                id="ip"
                className="codeblock"
                style={{ whiteSpace: "pre-line" }}
                onClick={getIndex()}
              >
                {code && applyInlineAnchor(code.code)}
              </div>
              {/* {code && (
                <SyntaxHighlighter
                  language="htmlbars"
                  style={docco}
                  showLineNumbers
                  lineProps={(lineNumber) => ({
                    onClick() {
                      setLineNum(lineNumber);
                    },
                  })}
                  wrapLines={true}
                  startingLineNumber={1}
                >
                  {code && applyInlineAnchor(code.code)}
                </SyntaxHighlighter>
              )} */}
            </AnchorBase>
            <div className="sidenotes">
              {init &&
                codeComments &&
                codeComments.length > 0 &&
                codeComments.map((comment, index) => {
                  return (
                    <Sidenote sidenote={comment.id} base={baseAnchor}>
                      <div
                        key={index}
                        className={classes.commentCard}
                        onClick={() => {
                          setShowReplyField(true);
                          setReplyParentId(comment.id);
                          setReplyParentComment(comment);
                          setTimeout(() => {
                            select(comment.id);
                          }, 0.1);
                        }}
                      >
                        {singleComment(comment)}
                        {showReplyField && replyParentId === comment.id && (
                          <Fragment>
                            <div
                              style={{
                                borderTop: "1px solid #bbb",
                                marginTop: "10px",
                                marginBottom: "10px",
                              }}
                            />
                            {replyToCommentArr &&
                              replyToCommentArr.length > 0 &&
                              replyToCommentArr.map((reply) => {
                                if (reply.parent_comment.id === comment.id) {
                                  return (
                                    <div
                                      style={{
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      {singleComment(reply)}
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            <TextField
                              margin="dense"
                              variant="outlined"
                              value={reply && reply}
                              onChange={(e) => setReply(e.target.value)}
                              InputProps={{
                                classes: { input: classes.input },
                              }}
                              fullWidth
                              placeholder="Reply to Comment"
                              onClick={() => {
                                setReplyParentId(comment.id);
                                setReplyParentComment(comment);
                              }}
                            />
                            <div style={{ marginTop: "10px" }}>
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                style={{ marginRight: "10px" }}
                                onClick={() => handleReplyToComment()}
                                disabled={reply === "" || !reply}
                              >
                                Reply
                              </Button>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => {
                                  setShowReplyField(false);
                                  setTimeout(() => {
                                    select(replyParentId);
                                    setReplyParentId();
                                    setReplyParentComment();
                                  }, 0.1);
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </Sidenote>
                  );
                })}
            </div>
          </div>
        </article>
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
          {indexes.start + ` ` + indexes.end}
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
