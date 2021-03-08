import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { Link, useHistory } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import logo from "../assets/CodeineLogos/Member.svg";

import Service from "../AxiosService";
import Cookies from "js-cookie";
import "./sidenotes.css";
import { AnchorBase, InlineAnchor, Sidenote } from "sidenotes";
import TextSelector from "text-selection-react";
import store from "../redux/store";
import { deselectSidenote } from "../redux/actions";
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
}));

const ViewCodeReviewDetails = () => {
  const classes = styles();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [code, setCode] = useState();
  const [codeComments, setCodeComments] = useState([]);

  const [addCommentDialog, setAddCommentDialog] = useState(false);
  const [comment, setComment] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const deselect = () => store.dispatch(deselectSidenote(code && code.id));

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

  const docId = "article";
  const baseAnchor = "anchor";
  const blue = "blue";
  const red = "red";

  const sampleStr =
    "Must see all the sidenotes at once, so they should be in the margins!";

  const applyInlineAnchor = (str) => {
    let formatted;
    // const arr = ["sidenotes", "once"];

    for (let i = 0; i < codeComments.length; i++) {
      if (i === 0) {
        formatted = reactStringReplace(
          str,
          codeComments[i].highlighted_code,
          (match) => (
            <InlineAnchor sidenote={codeComments[i].id}>{match}</InlineAnchor>
          )
        );
      } else {
        formatted = reactStringReplace(
          formatted,
          codeComments[i].highlighted_code,
          (match) => (
            <InlineAnchor sidenote={codeComments[i].id}>{match}</InlineAnchor>
          )
        );
      }
    }
    // console.log(formatted);
    return formatted;
  };
  //   console.log(selectedValue);

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
              {codeComments &&
                codeComments.length > 0 &&
                codeComments.map((comment) => {
                  return (
                    <Sidenote sidenote={comment.id} base={baseAnchor}>
                      <div style={{ width: 250, height: 100, padding: "20px" }}>
                        {comment.comment}
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
