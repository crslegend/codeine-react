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
import "react-quill/dist/quill.snow.css";
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
import hljs from "highlight.js";
import "highlight.js/styles/darcula.css";
import EditSnippetDialog from "./components/EditSnippetDialog";
import Toast from "../components/Toast.js";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
// const reactStringReplace = require("react-string-replace");
hljs.configure({
  languages: ["javascript", "ruby", "python", "rust", "java", "html", "css"],
});
const editor = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
};

const editorSnow = {
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

const formatSnow = [
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

  const [loggedIn, setLoggedIn] = useState(false);
  const [selectedValue, setSelectedValue] = useState();
  const [code, setCode] = useState();
  const [codeComments, setCodeComments] = useState([]);

  const [editSnippetDialog, setEditSnippetDialog] = useState(false);
  const [snippet, setSnippet] = useState("");
  const [snippetTitle, setSnippetTitle] = useState("");
  const [codeLanguage, setCodeLanguage] = useState({
    PY: false,
    JAVA: false,
    JS: false,
    CPP: false,
    CS: false,
    HTML: false,
    CSS: false,
    RUBY: false,
  });

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

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

  const handleUpdateSnippet = () => {
    if (!snippetTitle || snippetTitle === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Title cannot be empty",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (!snippet || snippet === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Code snippet cannot be empty",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    let neverChooseOne = true;
    for (const property in categories) {
      if (categories[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 category",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    neverChooseOne = true;
    for (const property in codeLanguage) {
      if (codeLanguage[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 coding language/framework",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    let data = {
      title: snippetTitle,
      code: snippet,
      coding_languages: [],
      languages: ["ENG"],
      categories: [],
    };

    for (const property in categories) {
      if (categories[property]) {
        data.categories.push(property);
      }
    }

    for (const property in codeLanguage) {
      if (codeLanguage[property]) {
        data.coding_languages.push(property);
      }
    }

    Service.client
      .put(`/code-reviews/${id}`, data)
      .then((res) => {
        console.log(res);
        setEditSnippetDialog(false);
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
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

  const loadDataForEditSnippet = () => {
    if (code) {
      setSnippetTitle(code.title);
      setSnippet(code.code);

      let data = { ...codeLanguage };
      for (let i = 0; i < code.coding_languages.length; i++) {
        data = {
          ...data,
          [code.coding_languages[i]]: true,
        };
      }
      setCodeLanguage(data);

      data = { ...categories };
      for (let i = 0; i < code.categories.length; i++) {
        data = {
          ...data,
          [code.categories[i]]: true,
        };
      }
      setCategories(data);
      setEditSnippetDialog(true);
    }
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Navbar
        logo={navLogo}
        bgColor="#fff"
        navbarItems={loggedIn && loggedIn ? loggedInNavbar : memberNavbar}
      />
      <div className={classes.content}>
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
            alignItems: "center",
          }}
        >
          <Typography variant="h1">{code && code.title}</Typography>
          {loggedIn && code && checkIfOwnerOfComment(code.member.id) && (
            <div style={{ marginLeft: "auto" }}>
              <IconButton onClick={() => loadDataForEditSnippet()}>
                <Edit />
              </IconButton>
              <IconButton>
                <Delete />
              </IconButton>
            </div>
          )}
        </div>

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
            value={code && code.code ? code.code : ""}
            readOnly={true}
            theme={"bubble"}
            modules={editor}
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
      <EditSnippetDialog
        editSnippetDialog={editSnippetDialog}
        setEditSnippetDialog={setEditSnippetDialog}
        snippetTitle={snippetTitle}
        setSnippetTitle={setSnippetTitle}
        categories={categories}
        setCategories={setCategories}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        handleUpdateSnippet={handleUpdateSnippet}
        snippet={snippet}
        setSnippet={setSnippet}
      />
    </div>
  );
};

export default ViewCodeReviewDetails;
