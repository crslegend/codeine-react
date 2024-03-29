import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";

import Service from "../../../AxiosService";
import { Add, Clear, Delete, Help } from "@material-ui/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { DropzoneAreaBase } from "material-ui-dropzone";
import LinkMui from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  dialogButtons: {
    width: 100,
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "7px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  dropzoneContainer: {
    minHeight: "120px",
    "@global": {
      ".MuiDropzoneArea-root": {
        minHeight: "120px",
      },
    },
  },
  dropzoneText: {
    fontSize: "14px",
  },
  resizeFont: {
    fontSize: "14px",
  },
}));

const QuestionDialog = ({
  editMode,
  setEditMode,
  editQuestionDialog,
  setEditQuestionDialog,
  addQuestionDialog,
  setAddQuestionDialog,
  question,
  setQuestion,
  questionType,
  setQuestionType,
  options,
  setOptions,
  correctAnswer,
  setCorrectAnswer,
  getCourse,
  sbOpen,
  setSbOpen,
  snackbar,
  setSnackbar,
  questionNum,
  selectedQuestionBank,
}) => {
  const classes = useStyles();
  // console.log(options);

  const editor = {
    toolbar: [
      [{ font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
    ],
  };

  const format = ["font", "size", "bold", "italic", "underline", "strike", "list", "bullet", "indent", "link"];

  const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);

  const [questionImage, setQuestionImage] = useState();

  const handleQuestionInputChange = (value) => {
    setQuestion({
      ...question,
      title: value,
    });
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    setQuestion({
      title: question && question.title,
      [e.target.value]: {},
    });

    if (e.target.value === "mcq" || e.target.value === "mrq") {
      const arr = [""];
      setOptions(arr);
      setCorrectAnswer([]);
    } else if (e.target.value === "shortanswer") {
      setOptions([]);
      setCorrectAnswer("");
    }
  };

  const handleMarksChange = (e) => {
    if (question) {
      if (question.mcq) {
        setQuestion({
          ...question,
          mcq: {
            ...question.mcq,
            marks: e.target.value,
          },
        });
      } else if (question.mrq) {
        setQuestion({
          ...question,
          mrq: {
            ...question.mrq,
            marks: e.target.value,
          },
        });
      } else if (question.shortanswer) {
        setQuestion({
          ...question,
          shortanswer: {
            ...question.shortanswer,
            marks: e.target.value,
          },
        });
      }
    }
  };

  const handleOptionInputChange = (e, index) => {
    const values = [...options];
    values[index] = e.target.value;
    setOptions(values);
  };

  const handleSelectMultiSelectAnswers = (e) => {
    setCorrectAnswer(e.target.value);
  };

  const handleShortAnswerInput = (e) => {
    setCorrectAnswer(e.target.value);
  };

  const handleAddOption = () => {
    const values = [...options];
    values.push("");
    // console.log(values);
    setOptions(values);
  };

  const handleDeleteOption = (index) => {
    // console.log(index);
    if (questionType === "mrq") {
      const value = options[index];
      setCorrectAnswer(correctAnswer.filter((answer) => answer !== value));
    }
    let arr = [...options];
    arr.splice(index, 1); // use this instead of filter to cover the case where all values are the same
    // console.log(arr);
    setOptions(arr);
  };

  //   console.log(correctAnswer);

  const handleDeleteQuestion = () => {
    Service.client
      .delete(`/question-banks/${selectedQuestionBank.id}/questions/${question.id}`)
      .then((res) => {
        // console.log(res);
        setEditMode(false);
        setDeleteQuestionDialog(false);
        setEditQuestionDialog(false);
        setQuestion();
        setQuestionType();
        setOptions();
        setCorrectAnswer();
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const validateMCQQuestion = () => {
    if (!question.mcq.marks) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the marks awarded for this question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return false;
    }

    if (correctAnswer.length === 0) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please choose the correct answer for this question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return false;
    }
    return true;
  };

  const validateMRQQuestion = () => {
    if (!question.mrq.marks) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the marks awarded for this question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return false;
    }

    if (correctAnswer.length === 0) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please choose the correct answer(s) for this question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return false;
    }
    return true;
  };

  const validateShortAnswer = () => {
    if (!question.shortanswer.marks) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the marks awarded for this question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return false;
    }

    if (correctAnswer === "" || !correctAnswer) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter keywords for this question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return false;
    }
    return true;
  };

  const handleUpdateQuestion = () => {
    if (question.title === "" || !question.title) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (questionType !== "shortanswer" && options && options.includes("")) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter all options for the questions",
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
      title: question.title,
    };

    if (questionType === "mcq") {
      const validation = validateMCQQuestion();
      if (!validation) {
        return;
      }

      data = {
        ...data,
        marks: parseInt(question.mcq.marks),
        options: options,
        correct_answer: correctAnswer,
      };
      //   console.log(data);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("marks", data.marks);
      formData.append("options", JSON.stringify(data.options));
      formData.append("correct_answer", data.correct_answer);
      if (questionImage) {
        formData.append("image", questionImage[0].file);
      }

      Service.client
        .put(`/question-banks/${selectedQuestionBank.id}/questions/${question.id}`, formData, {
          params: { type: "mcq" },
        })
        .then((res) => {
          // console.log(res);
          setEditMode(false);
          setEditQuestionDialog(false);
          setTimeout(() => {
            setQuestionImage();
            setQuestion();
            setQuestionType();
            setOptions();
            setCorrectAnswer();
            getCourse();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (questionType === "mrq") {
      const validation = validateMRQQuestion();
      if (!validation) {
        return;
      }

      data = {
        ...data,
        marks: question.mrq.marks,
        options: options,
        correct_answer: correctAnswer,
      };

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("marks", data.marks);
      formData.append("options", JSON.stringify(data.options));
      formData.append("correct_answer", JSON.stringify(data.correct_answer));
      if (questionImage) {
        formData.append("image", questionImage[0].file);
      }

      Service.client
        .put(`/question-banks/${selectedQuestionBank.id}/questions/${question.id}`, formData, {
          params: { type: "mrq" },
        })
        .then((res) => {
          // console.log(res);
          setEditMode(false);
          setEditQuestionDialog(false);
          setTimeout(() => {
            setQuestionImage();
            setQuestion();
            setQuestionType();
            setOptions();
            setCorrectAnswer();
            getCourse();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (questionType === "shortanswer") {
      const validation = validateShortAnswer();
      if (!validation) {
        return;
      }

      const arr = correctAnswer.split(",");

      let data = {
        title: question.title,
        marks: question.shortanswer.marks,
        options: [],
        keywords: arr,
      };

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("marks", data.marks);
      formData.append("options", JSON.stringify(data.options));
      formData.append("keywords", JSON.stringify(data.keywords));
      if (questionImage) {
        formData.append("image", questionImage[0].file);
      }

      Service.client
        .put(`/question-banks/${selectedQuestionBank.id}/questions/${question.id}`, formData, {
          params: { type: "shortanswer" },
        })
        .then((res) => {
          // console.log(res);
          setEditMode(false);
          setEditQuestionDialog(false);
          setTimeout(() => {
            setQuestionImage();
            setQuestion();
            setQuestionType();
            setOptions();
            setCorrectAnswer();
            getCourse();
          }, 500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleAddQuestion = () => {
    if (question.title === "" || !question.title) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter question",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (questionType !== "shortanswer" && options && options.includes("")) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter all options for the questions",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (questionType === "mcq") {
      const validation = validateMCQQuestion();
      if (!validation) {
        return;
      }

      let data = {
        title: question.title,
        marks: question.mcq.marks,
        options: options,
        correct_answer: correctAnswer,
      };
      //   console.log(data);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("marks", data.marks);
      formData.append("options", JSON.stringify(data.options));
      formData.append("correct_answer", data.correct_answer);
      if (questionImage) {
        formData.append("image", questionImage[0].file);
      }

      Service.client
        .post(`/question-banks/${selectedQuestionBank.id}/questions`, formData, {
          params: { type: "mcq" },
        })
        .then((res) => {
          // console.log(res);
          setAddQuestionDialog(false);
          setTimeout(() => {
            setQuestionImage();
            setQuestion();
            setQuestionType();
            setOptions();
            setCorrectAnswer();
          }, 500);
          getCourse();
        })
        .catch((err) => console.log(err));
    }

    if (questionType === "mrq") {
      const validation = validateMRQQuestion();
      if (!validation) {
        return;
      }

      let data = {
        title: question.title,
        marks: question.mrq.marks,
        options: options,
        correct_answer: correctAnswer,
      };
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("marks", data.marks);
      formData.append("options", JSON.stringify(data.options));
      formData.append("correct_answer", JSON.stringify(data.correct_answer));
      if (questionImage) {
        formData.append("image", questionImage[0].file);
      }

      Service.client
        .post(`/question-banks/${selectedQuestionBank.id}/questions`, formData, {
          params: { type: "mrq" },
        })
        .then((res) => {
          // console.log(res);
          setAddQuestionDialog(false);
          setTimeout(() => {
            setQuestionImage();
            setQuestion();
            setQuestionType();
            setOptions();
            setCorrectAnswer();
          }, 500);
          getCourse();
        })
        .catch((err) => console.log(err));
    }

    if (questionType === "shortanswer") {
      const validation = validateShortAnswer();
      if (!validation) {
        return;
      }

      const arr = correctAnswer.split(",");

      let data = {
        title: question.title,
        marks: question.shortanswer.marks,
        options: [],
        keywords: arr,
      };
      //   console.log(data);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("marks", data.marks);
      formData.append("options", JSON.stringify(data.options));
      formData.append("keywords", JSON.stringify(data.keywords));
      if (questionImage) {
        formData.append("image", questionImage[0].file);
      }

      Service.client
        .post(`/question-banks/${selectedQuestionBank.id}/questions`, formData, {
          params: { type: "shortanswer" },
        })
        .then((res) => {
          // console.log(res);
          setAddQuestionDialog(false);
          setTimeout(() => {
            setQuestionImage();
            setQuestion();
            setQuestionType();
            setOptions();
            setCorrectAnswer();
          }, 500);
          getCourse();
        })
        .catch((err) => console.log(err));
    }
  };
  // console.log(questionImage);

  return (
    <Fragment>
      <Dialog
        open={editQuestionDialog || addQuestionDialog}
        onClose={() => {
          if (editQuestionDialog) {
            setEditQuestionDialog(false);
            setEditMode(false);
          }
          if (addQuestionDialog) {
            setAddQuestionDialog(false);
          }

          setTimeout(() => {
            setQuestion();
            setQuestionType();
            setOptions();
            setCorrectAnswer();
          }, 500);
        }}
        PaperProps={{
          style: {
            width: "600px",
            maxHeight: "70vh",
          },
        }}
      >
        {questionNum && (
          <DialogTitle>
            {addQuestionDialog && "Add Question"}
            {editQuestionDialog && `Question ${questionNum && questionNum}`}
            <div style={{ float: "right" }}>
              {/* <IconButton size="small" onClick={() => setEditMode(true)}>
                <Edit />
              </IconButton> */}
              <IconButton size="small" onClick={() => setDeleteQuestionDialog(true)}>
                <Delete />
              </IconButton>
            </div>
          </DialogTitle>
        )}
        {!questionNum && <DialogTitle>Add New Question</DialogTitle>}

        <DialogContent>
          <FormControl fullWidth margin="dense" className={classes.formControl}>
            <InputLabel style={{ fontSize: "14px" }}>Question Type</InputLabel>
            <Select
              label="Question Type"
              variant="outlined"
              value={questionType ? questionType : ""}
              onChange={(e) => {
                handleQuestionTypeChange(e);
              }}
              disabled={editQuestionDialog}
            >
              <MenuItem classes={{ root: classes.resizeFont }} value="">
                <em>Select a question type</em>
              </MenuItem>
              <MenuItem classes={{ root: classes.resizeFont }} value="mcq">
                MCQ
              </MenuItem>
              <MenuItem classes={{ root: classes.resizeFont }} value="mrq">
                MRQ
              </MenuItem>
              <MenuItem classes={{ root: classes.resizeFont }} value="shortanswer">
                Short Answer
              </MenuItem>
            </Select>
          </FormControl>

          <label htmlFor="question">
            <Typography variant="body1">Question</Typography>
          </label>
          <ReactQuill
            value={question && question.title ? question.title : ""}
            onChange={handleQuestionInputChange}
            modules={editor}
            format={format}
          />

          <div>
            <Typography variant="body1" style={{ margin: "16px 0 8px" }}>
              Upload Image (Optional)
            </Typography>
            <DropzoneAreaBase
              dropzoneText="Drag and drop a image or click&nbsp;here"
              dropzoneParagraphClass={classes.dropzoneText}
              dropzoneClass={classes.dropzoneContainer}
              // dropzoneProps={{ disabled: true }}
              filesLimit={1}
              maxFileSize={5000000000}
              fileObjects={questionImage}
              useChipsForPreview={true}
              onAdd={(newFile) => {
                setQuestionImage(newFile);
              }}
              onDelete={(fileObj) => {
                setQuestionImage();
              }}
              previewGridProps={{
                item: {
                  xs: "auto",
                },
              }}
            />
          </div>

          {question && question.image && (
            <div style={{ display: "flex", marginTop: "5px" }}>
              <Typography variant="body2" style={{ marginTop: "5px", marginRight: "10px" }}>
                <LinkMui
                  href={question.image ? question.image.replace("#", "") : "#"}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Question Image
                </LinkMui>
              </Typography>
            </div>
          )}

          {/* <TextField
            id="question"
            placeholder="Enter Question"
            type="text"
            autoComplete="off"
            variant="outlined"
            margin="dense"
            fullWidth
            value={question && question.title}
            onChange={(e) => {
              handleQuestionInputChange(e);
            }}
          /> */}
          {questionType && (
            <div style={{ margin: "8px 0" }}>
              <label htmlFor="marks">
                <Typography variant="body1" style={{ marginTop: "10px" }}>
                  Marks
                </Typography>
              </label>
              <TextField
                id="marks"
                type="number"
                autoComplete="off"
                variant="outlined"
                margin="dense"
                fullWidth
                value={(() => {
                  if (question) {
                    if (question.mcq) {
                      return question.mcq.marks ? question.mcq.marks : "";
                    } else if (question.mrq) {
                      return question.mrq.marks ? question.mrq.marks : "";
                    } else if (question.shortanswer) {
                      return question.shortanswer.marks ? question.shortanswer.marks : "";
                    }
                  }
                })()}
                onChange={(e) => handleMarksChange(e)}
                InputProps={{
                  inputProps: { min: 0, style: { fontSize: "14px" } },
                }}
              />
            </div>
          )}

          {questionType && questionType !== "shortanswer" && (editMode || addQuestionDialog) && (
            <Typography variant="body1" style={{ paddingTop: "10px", paddingBottom: "5px" }}>
              Enter option(s) below in the field
            </Typography>
          )}

          {options &&
            options.map((option, index) => {
              if (questionType === "mcq" || questionType === "mrq") {
                return (
                  <Fragment>
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        value={option}
                        placeholder="Enter option"
                        style={{ marginBottom: "10px" }}
                        onChange={(e) => handleOptionInputChange(e, index)}
                        inputProps={{ style: { fontSize: "14px" } }}
                      />

                      {options && options.length > 1 && (
                        <IconButton
                          size="small"
                          style={{ marginLeft: "25px" }}
                          onClick={() => {
                            handleDeleteOption(index);
                          }}
                        >
                          <Clear />
                        </IconButton>
                      )}
                      {options && index === options.length - 1 && (
                        <IconButton
                          size="small"
                          style={{ marginLeft: "5px" }}
                          onClick={() => {
                            handleAddOption();
                          }}
                        >
                          <Add />
                        </IconButton>
                      )}
                    </div>
                  </Fragment>
                );
              } else {
                return null;
              }
            })}

          {options && correctAnswer && questionType === "mcq" && (
            <FormControl fullWidth margin="dense" className={classes.formControl}>
              <InputLabel>Select Correct Answer</InputLabel>
              <Select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                label="Select Correct Answer"
                variant="outlined"
                disabled={options && options.includes("")}
              >
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {options && correctAnswer && questionType === "mrq" && (
            <FormControl fullWidth margin="dense" className={classes.formControl}>
              <InputLabel>Select Correct Answer</InputLabel>
              <Select
                multiple
                value={correctAnswer}
                onChange={(e) => handleSelectMultiSelectAnswers(e)}
                label="Select Correct Answer"
                variant="outlined"
                renderValue={(selected) => {
                  return selected.join(", ");
                }}
                disabled={options && options.includes("")}
              >
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    <Checkbox checked={correctAnswer.includes(option) && option !== ""} />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {questionType === "shortanswer" && (
            <Fragment>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label htmlFor="shortanswer">
                  <Typography variant="body1">Keywords as Answers</Typography>
                </label>
                <Tooltip
                  title={
                    <Typography variant="body2">Separate the keywords with commas (eg. keyword 1,keyword 2)</Typography>
                  }
                >
                  <IconButton disableRipple size="small">
                    <Help fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
              <TextField
                id="shortanswer"
                placeholder="Enter keywords (separated by commas)"
                type="text"
                autoComplete="off"
                variant="outlined"
                inputProps={{ style: { fontSize: "14px" } }}
                margin="dense"
                fullWidth
                value={correctAnswer && correctAnswer}
                onChange={(e) => {
                  handleShortAnswerInput(e);
                }}
              />
            </Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              if (editQuestionDialog) {
                setEditQuestionDialog(false);
                setEditMode(false);
              }
              if (addQuestionDialog) {
                setAddQuestionDialog(false);
              }
              setTimeout(() => {
                setQuestion();
                setQuestionType();
                setOptions();
                setCorrectAnswer();
              }, 500);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              if (editQuestionDialog) {
                handleUpdateQuestion();
              } else if (addQuestionDialog) {
                handleAddQuestion();
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteQuestionDialog}
        onClose={() => setDeleteQuestionDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete this question?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setDeleteQuestionDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              handleDeleteQuestion();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default QuestionDialog;
