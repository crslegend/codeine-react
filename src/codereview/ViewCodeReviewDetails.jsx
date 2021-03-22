import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { useHistory, useParams } from "react-router-dom";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import LinkMui from "@material-ui/core/Link";
import {
  Add,
  ArrowBack,
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
} from "@material-ui/icons";
import components from "./components/NavbarComponents";

import AddSnippetDialog from "./components/AddSnippetDialog";
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
import CommentSection from "./components/CommentSection";
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
  const [user, setUser] = useState();

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

  const [newSnippet, setNewSnippet] = useState("");
  const [newSnippetTitle, setNewSnippetTitle] = useState("");
  const [newCodeLanguage, setNewCodeLanguage] = useState({
    PY: false,
    JAVA: false,
    JS: false,
    CPP: false,
    CS: false,
    HTML: false,
    CSS: false,
    RUBY: false,
  });

  const [newCategories, setNewCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });
  const [addSnippetDialog, setAddSnippetDialog] = useState(false);

  const [deleteSnippetDialog, setDeleteSnippetDialog] = useState(false);

  const [addCommentDialog, setAddCommentDialog] = useState(false);
  const [comment, setComment] = useState();

  const [deleteCommentDialog, setDeleteCommentDialog] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState();
  const [selectedComment, setSelectedComment] = useState();
  const [replyCommentDialog, setReplyCommentDialog] = useState();

  // const [showReplyField, setShowReplyField] = useState(false);
  const [reply, setReply] = useState();
  const [replyToCommentArr, setReplyToCommentArr] = useState([]);

  // const [replyParentId, setReplyParentId] = useState();
  // const [replyParentComment, setReplyParentComment] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);

      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);
          if (res.data.member) {
            setUser("member");
          } else {
            if (res.data.partner) {
              setUser("partner");
            } else {
              setUser("admin");
            }
          }
        })
        .catch((err) => {});
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
        // setCodeComments([]); // to reset the state of sidenotes
        parentCommentArr.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
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

  const resuableChip = (label, index, backgroundColor, fontColor) => {
    return (
      <Chip
        key={index}
        label={label}
        style={{
          marginRight: "10px",
          marginBottom: "10px",
          color: fontColor ? fontColor : "#000",
          fontWeight: 600,
          backgroundColor: backgroundColor,
        }}
      />
    );
  };

  // const singleComment = (comment) => {
  //   return (
  //     <Fragment>
  //       <div
  //         style={{
  //           display: "flex",
  //           flexDirection: "row",
  //         }}
  //       >
  //         {comment.user.profile_photo && comment.user.profile_photo ? (
  //           <Avatar
  //             style={{ marginRight: "15px" }}
  //             src={comment.user && comment.user.profile_photo}
  //           />
  //         ) : (
  //           <Avatar style={{ marginRight: "15px" }}>
  //             {comment.user && comment.user.first_name.charAt(0)}
  //           </Avatar>
  //         )}
  //         <div style={{ flexDirection: "column" }}>
  //           <Typography variant="body2" style={{ fontWeight: 600 }}>
  //             {comment.user && comment.user.first_name}{" "}
  //             {comment.user && comment.user.last_name}
  //           </Typography>
  //           <Typography variant="body2" style={{ opacity: 0.7 }}>
  //             {comment && calculateDateInterval(comment.timestamp)}
  //           </Typography>
  //         </div>
  //         {checkIfOwnerOfComment(comment.user && comment.user.id) && (
  //           <div
  //             style={{
  //               flexDirection: "row",
  //               order: 2,
  //               marginLeft: "auto",
  //             }}
  //           >
  //             <IconButton
  //               size="small"
  //               onClick={() => {
  //                 setEditMode(true);
  //                 setSelectedCommentId(comment.id);
  //                 setSelectedComment(comment);
  //               }}
  //               disabled={editMode && selectedCommentId === comment.id}
  //             >
  //               <Edit fontSize="small" />
  //             </IconButton>

  //             <IconButton
  //               size="small"
  //               onClick={() => {
  //                 setSelectedCommentId(comment.id);
  //                 setDeleteCommentDialog(true);
  //               }}
  //             >
  //               <Delete fontSize="small" />
  //             </IconButton>
  //           </div>
  //         )}
  //       </div>
  //       <div>
  //         {editMode && selectedCommentId === comment.id ? (
  //           <Fragment>
  //             <TextField
  //               margin="dense"
  //               variant="outlined"
  //               value={selectedComment && selectedComment.comment}
  //               onChange={(e) =>
  //                 setSelectedComment({
  //                   ...selectedComment,
  //                   comment: e.target.value,
  //                 })
  //               }
  //               InputProps={{
  //                 classes: { input: classes.input },
  //               }}
  //               fullWidth
  //               autoFocus
  //             />
  //             <div style={{ marginTop: "10px", marginBottom: "10px" }}>
  //               <Button
  //                 variant="contained"
  //                 color="primary"
  //                 size="small"
  //                 style={{ marginRight: "10px" }}
  //                 onClick={() => handleUpdateComment()}
  //                 disabled={selectedComment.comment === ""}
  //               >
  //                 Save
  //               </Button>
  //               <Button
  //                 variant="contained"
  //                 size="small"
  //                 onClick={() => {
  //                   setEditMode(false);
  //                   setSelectedComment();
  //                   setSelectedCommentId();
  //                 }}
  //               >
  //                 Cancel
  //               </Button>
  //             </div>
  //           </Fragment>
  //         ) : (
  //           <Typography style={{ fontSize: 13, paddingTop: "10px" }}>
  //             {comment.comment}
  //           </Typography>
  //         )}
  //       </div>
  //     </Fragment>
  //   );
  // };

  const handleAddNewSnippet = () => {
    if (!newSnippetTitle || newSnippetTitle === "") {
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

    if (!newSnippet || newSnippet === "") {
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
    for (const property in newCategories) {
      if (newCategories[property]) {
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
    for (const property in newCodeLanguage) {
      if (newCodeLanguage[property]) {
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
      title: newSnippetTitle,
      code: newSnippet,
      coding_languages: [],
      languages: ["ENG"],
      categories: [],
    };

    for (const property in newCategories) {
      if (newCategories[property]) {
        data.categories.push(property);
      }
    }

    for (const property in newCodeLanguage) {
      if (newCodeLanguage[property]) {
        data.coding_languages.push(property);
      }
    }

    Service.client
      .post(`/code-reviews`, data)
      .then((res) => {
        // console.log(res);
        setAddCommentDialog(false);
        history.push(`/codereview/${res.data.id}`);
        history.go();
      })
      .catch((err) => console.log(err));
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
        // console.log(res);
        setEditSnippetDialog(false);
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteSnippet = () => {
    Service.client
      .delete(`/code-reviews/${id}`)
      .then((res) => {
        // console.log(res);
        history.push(`/codereview`);
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
      comment: comment,
    };

    Service.client
      .post(`/code-reviews/${id}/comments`, data)
      .then((res) => {
        // console.log(res);
        setComment();
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteComment = () => {
    Service.client
      .delete(`/code-reviews/${id}/comments/${selectedCommentId}`)
      .then((res) => {
        // console.log(res);
        setDeleteCommentDialog(false);
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateComment = () => {
    const data = {
      comment: selectedComment.comment,
    };

    Service.client
      .put(`/code-reviews/${id}/comments/${selectedCommentId}`, data)
      .then((res) => {
        // console.log(res);
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
      comment: reply,
      parent_comment_id: selectedCommentId,
    };

    Service.client
      .post(`/code-reviews/${id}/comments`, data)
      .then((res) => {
        // console.log(res);
        setReplyCommentDialog(false);
        setReply();
        setSelectedCommentId();
        getCodeReview();
        getCodeReviewComments();
      })
      .catch((err) => console.log(err));
  };
  // console.log(lineNum);

  const handleLikeUnlikeComment = (commentId, isLiked) => {
    if (isLiked) {
      Service.client
        .delete(`/code-reviews/${id}/comments/${commentId}/engagements`)
        .then((res) => {
          getCodeReviewComments();
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/code-reviews/${id}/comments/${commentId}/engagements`)
        .then((res) => {
          getCodeReviewComments();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleLikeUnlikeSnippet = (isLiked) => {
    if (isLiked) {
      Service.client
        .delete(`/code-reviews/${id}/engagements`)
        .then((res) => {
          getCodeReview();
          getCodeReviewComments();
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/code-reviews/${id}/engagements`)
        .then((res) => {
          getCodeReview();
          getCodeReviewComments();
        })
        .catch((err) => console.log(err));
    }
  };

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
        logo={components.navLogo}
        bgColor="#fff"
        navbarItems={
          loggedIn && loggedIn
            ? components.loggedInNavbar(() => {
                Service.removeCredentials();
                setLoggedIn(false);
                history.push("/");
              }, user && user)
            : components.memberNavbar
        }
      />
      <div className={classes.content}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton onClick={() => history.push(`/codereview`)}>
              <ArrowBack />
            </IconButton>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Add />}
              style={{ height: 30, alignItems: "center" }}
              onClick={() => setAddSnippetDialog(true)}
              disabled={!loggedIn}
            >
              Add Code Snippet
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <Typography variant="h1">{code && code.title}</Typography>
            <div style={{ marginLeft: "auto", display: "flex" }}>
              {loggedIn && code && checkIfOwnerOfComment(code.user.id) && (
                <div>
                  <IconButton onClick={() => loadDataForEditSnippet()}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => setDeleteSnippetDialog(true)}>
                    <Delete />
                  </IconButton>
                </div>
              )}
              <div>
                <IconButton
                  onClick={() => {
                    handleLikeUnlikeSnippet(code && code.current_user_liked);
                  }}
                  disabled={!loggedIn}
                >
                  {code && code.current_user_liked ? (
                    <Favorite color="primary" />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>
                {`${code && code.likes}`}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <Typography variant="body1" style={{ opacity: 0.8 }}>
            <LinkMui className={classes.linkMui}>
              {`${code && code.user.first_name} ${code && code.user.last_name}`}
            </LinkMui>
            {` asked ${code && calculateDateInterval(code.timestamp)}`}
          </Typography>
        </div>
        <div style={{ marginBottom: "25px" }}>
          {code &&
            code.categories.length > 0 &&
            code.categories.map((category, index) => {
              if (category === "FE") {
                return resuableChip("Frontend", index, "#DD8B8B");
              } else if (category === "BE") {
                return resuableChip("Backend", index, "#A0DD8B");
              } else if (category === "DB") {
                return resuableChip(
                  "Database Administration",
                  index,
                  "#8B95DD"
                );
              } else if (category === "SEC") {
                return resuableChip("Security", index, "#DDB28B");
              } else if (category === "UI") {
                return resuableChip("UI/UX", index, "#DDD58B");
              } else if (category === "ML") {
                return resuableChip("Machine Learning", index, "#8BD8DD");
              } else {
                return null;
              }
            })}
          {code &&
            code.coding_languages.length > 0 &&
            code.coding_languages.map((language, index) => {
              if (language === "PY") {
                return resuableChip("Python", index, "#3675A9", "#fff");
              } else if (language === "JAVA") {
                return resuableChip("Java", index, "#E57001", "#fff");
              } else if (language === "JS") {
                return resuableChip("Javascript", index, "#F7DF1E");
              } else if (language === "RUBY") {
                return resuableChip("Ruby", index, "#CC0000");
              } else if (language === "CPP") {
                return resuableChip("C++", index, "#004482", "#fff");
              } else if (language === "CS") {
                return resuableChip("C#", index, "#6A1577", "#fff");
              } else if (language === "HTML") {
                return resuableChip("HTML", index, "#E44D26", "#fff");
              } else if (language === "CSS") {
                return resuableChip("CSS", index, "#264DE4", "#fff");
              } else {
                return null;
              }
            })}
        </div>

        <div className="codeblock">
          <ReactQuill
            value={code && code.code ? code.code : ""}
            readOnly={true}
            theme={"bubble"}
            modules={editor}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <CommentSection
            codeComments={codeComments}
            comment={comment}
            setComment={setComment}
            reply={reply}
            setReply={setReply}
            loggedIn={loggedIn}
            handleAddComment={handleAddComment}
            checkIfOwnerOfComment={checkIfOwnerOfComment}
            selectedComment={selectedComment}
            setSelectedComment={setSelectedComment}
            selectedCommentId={selectedCommentId}
            setSelectedCommentId={setSelectedCommentId}
            editMode={editMode}
            setEditMode={setEditMode}
            deleteCommentDialog={deleteCommentDialog}
            setDeleteCommentDialog={setDeleteCommentDialog}
            handleDeleteComment={handleDeleteComment}
            handleUpdateComment={handleUpdateComment}
            replyCommentDialog={replyCommentDialog}
            setReplyCommentDialog={setReplyCommentDialog}
            handleReplyToComment={handleReplyToComment}
            handleLikeUnlikeComment={handleLikeUnlikeComment}
            replyToCommentArr={replyToCommentArr}
          />
        </div>
      </div>
      <div style={{ width: "10%" }}></div>

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
        open={deleteSnippetDialog}
        onClose={() => {
          setDeleteSnippetDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete Code Snippet?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setDeleteSnippetDialog(false);
            }}
            style={{ width: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ width: 100 }}
            onClick={() => handleDeleteSnippet()}
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
      <AddSnippetDialog
        addSnippetDialog={addSnippetDialog}
        setAddSnippetDialog={setAddSnippetDialog}
        snippetTitle={newSnippetTitle}
        setSnippetTitle={setNewSnippetTitle}
        categories={newCategories}
        setCategories={setNewCategories}
        codeLanguage={newCodeLanguage}
        setCodeLanguage={setNewCodeLanguage}
        handleAddNewSnippet={handleAddNewSnippet}
        snippet={newSnippet}
        setSnippet={setNewSnippet}
      />
    </div>
  );
};

export default ViewCodeReviewDetails;
