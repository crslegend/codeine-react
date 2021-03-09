import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { Link, useHistory } from "react-router-dom";
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
import logo from "../assets/CodeineLogos/Member.svg";

import { calculateDateInterval } from "../utils.js";
import Service from "../AxiosService";
import Cookies from "js-cookie";
import "./sidenotes.css";
import { AnchorBase, InlineAnchor, Sidenote } from "sidenotes";
import TextSelector from "text-selection-react";
import store from "../redux/store";
import { deselectSidenote, repositionSidenotes } from "../redux/actions";
import jwt_decode from "jwt-decode";
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
}));

const ViewCodeReviewDetails = () => {
  const classes = styles();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [code, setCode] = useState();
  const [codeComments, setCodeComments] = useState([]);
  const [init, setInit] = useState(false);

  const [addCommentDialog, setAddCommentDialog] = useState(false);
  const [comment, setComment] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const deselect = () => store.dispatch(deselectSidenote(code && code.id));
  const reposition = () => store.dispatch(repositionSidenotes(code && code.id));

  const getCodeReview = () => {
    Service.client
      .get(`/code-reviews/1ce87555-d5fa-4391-b852-d607982040aa`)
      .then((res) => {
        console.log(res);
        setCode(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getCodeReviewComments = () => {
    Service.client
      .get(`/code-reviews/1ce87555-d5fa-4391-b852-d607982040aa/comments`)
      .then((res) => {
        console.log(res);
        setCodeComments(res.data);
        reposition();
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
        (match) => (
          <InlineAnchor sidenote={codeComments[i].id}>{match}</InlineAnchor>
        )
      );
    }

    if (!init) {
      setInit(true);
    }
    // console.log(formatted);
    return formatted;
  };
  //   console.log(selectedValue);

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

  const handleAddComment = (e) => {
    e.preventDefault();

    const data = {
      highlighted_code: selectedValue,
      comment: comment,
    };

    Service.client
      .post(`/code-reviews/1ce87555-d5fa-4391-b852-d607982040aa/comments`, data)
      .then((res) => {
        console.log(res);
        // setCodeComments(res.data);
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

  const handleDeleteComment = (cId) => {
    Service.client
      .delete(
        `/code-reviews/1ce87555-d5fa-4391-b852-d607982040aa/comments/${cId}`
      )
      .then((res) => {
        console.log(res);
        // setCodeComments(res.data);
        reposition();
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

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
                handler: (html, text) => handleSelectText(text),
              },
            ]}
            color={"#F8E4B1"}
            colorText={false}
            unmark={false}
          />
          <div className="main-panel">
            <AnchorBase anchor={baseAnchor} style={{ width: "70%" }}>
              {code && applyInlineAnchor(code.code)}
            </AnchorBase>
            <div className="sidenotes">
              {init &&
                codeComments &&
                codeComments.length > 0 &&
                codeComments.map((comment, index) => {
                  console.log(comment);
                  return (
                    <Sidenote sidenote={comment.id} base={baseAnchor}>
                      <div key={index} className={classes.commentCard}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: "10px",
                          }}
                        >
                          {comment.user.profile_photo &&
                          comment.user.profile_photo ? (
                            <Avatar
                              style={{ marginRight: "15px" }}
                              src={comment.user && comment.user.profile_photo}
                            />
                          ) : (
                            <Avatar style={{ marginRight: "15px" }}>
                              {comment.user &&
                                comment.user.first_name.charAt(0)}
                            </Avatar>
                          )}
                          <div style={{ flexDirection: "column" }}>
                            <Typography
                              variant="body2"
                              style={{ fontWeight: 600 }}
                            >
                              {comment.user && comment.user.first_name}{" "}
                              {comment.user && comment.user.last_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
                              {comment &&
                                calculateDateInterval(comment.timestamp)}
                            </Typography>
                          </div>
                          {checkIfOwnerOfComment(
                            comment.user && comment.user.id
                          ) && (
                            <div
                              style={{
                                flexDirection: "row",
                                order: 2,
                                marginLeft: "auto",
                              }}
                            >
                              <IconButton size="small">
                                <Edit fontSize="small" />
                              </IconButton>

                              <IconButton
                                size="small"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </div>
                          )}
                        </div>
                        <div>
                          <Typography style={{ fontSize: 12 }}>
                            {comment.comment}
                          </Typography>
                        </div>
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
        <form onSubmit={handleAddComment}>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogContent>
            <span style={{ fontWeight: 600 }}>Text Selected:</span>
            <br />
            {selectedValue && selectedValue}
            <TextField
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
              type="submit"
              style={{ width: 100 }}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default ViewCodeReviewDetails;
