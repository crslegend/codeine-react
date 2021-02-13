import React, { Fragment, useState, useEffect } from "react";
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
  Typography,
} from "@material-ui/core";

import Service from "../../../AxiosService";
import { Add, Clear, Delete, Edit } from "@material-ui/icons";

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
}));

const QuestionDialog = ({
  editMode,
  setEditMode,
  editQuestionDialog,
  setEditQuestionDialog,
  addQuestionDialog,
  setAddQuestionDialog,
  quizId,
  setQuizId,
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
}) => {
  const classes = useStyles();
  //   console.log(question);

  const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);

  const handleQuestionInputChange = (e) => {
    setQuestion({
      ...question,
      title: e.target.value,
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
    setOptions(values);
  };

  const handleDeleteOption = (index) => {
    if (questionType === "mrq") {
      const value = options[index];
      setCorrectAnswer(correctAnswer.filter((answer) => answer !== value));
    }
    setOptions(options.filter((option) => options.indexOf(option) !== index));
  };

  //   console.log(correctAnswer);

  const handleDeleteQuestion = () => {
    Service.client
      .delete(`/quiz/${quizId}/questions/${question.id}`)
      .then((res) => {
        console.log(res);
        setEditMode(false);
        setDeleteQuestionDialog(false);
        setEditQuestionDialog(false);
        setQuizId();
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
      Service.client
        .put(`/quiz/${quizId}/questions/${question.id}`, data, {
          params: { type: "mcq" },
        })
        .then((res) => {
          console.log(res);
          setEditMode(false);
          setEditQuestionDialog(false);
          setQuizId();
          setQuestion();
          setQuestionType();
          setOptions();
          setCorrectAnswer();
          getCourse();
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

      Service.client
        .put(`/quiz/${quizId}/questions/${question.id}`, data, {
          params: { type: "mrq" },
        })
        .then((res) => {
          console.log(res);
          setEditMode(false);
          setEditQuestionDialog(false);
          setQuizId();
          setQuestion();
          setQuestionType();
          setOptions();
          setCorrectAnswer();
          getCourse();
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

      Service.client
        .put(`/quiz/${quizId}/questions/${question.id}`, data, {
          params: { type: "shortanswer" },
        })
        .then((res) => {
          console.log(res);
          setEditMode(false);
          setEditQuestionDialog(false);
          setQuizId();
          setQuestion();
          setQuestionType();
          setOptions();
          setCorrectAnswer();
          getCourse();
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

      Service.client
        .post(`/quiz/${quizId}/questions`, data, { params: { type: "mcq" } })
        .then((res) => {
          console.log(res);
          setAddQuestionDialog(false);
          setQuizId();
          setQuestion();
          setQuestionType();
          setOptions();
          setCorrectAnswer();
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

      Service.client
        .post(`/quiz/${quizId}/questions`, data, { params: { type: "mrq" } })
        .then((res) => {
          console.log(res);
          setAddQuestionDialog(false);
          setQuizId();
          setQuestion();
          setQuestionType();
          setOptions();
          setCorrectAnswer();
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

      Service.client
        .post(`/quiz/${quizId}/questions`, data, {
          params: { type: "shortanswer" },
        })
        .then((res) => {
          console.log(res);
          setAddQuestionDialog(false);
          setQuizId();
          setQuestion();
          setQuestionType();
          setOptions();
          setCorrectAnswer();
          getCourse();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Fragment>
      <Dialog
        open={editQuestionDialog || addQuestionDialog}
        onClose={() => {
          if (editQuestionDialog) {
            setEditMode(false);
            setEditQuestionDialog(false);
          }
          if (addQuestionDialog) {
            setAddQuestionDialog(false);
          }

          setQuizId();
          setQuestion();
          setQuestionType();
          setOptions();
          setCorrectAnswer();
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        {editQuestionDialog && (
          <DialogTitle>
            Question {question && question.order}
            <div style={{ float: "right" }}>
              <IconButton size="small" onClick={() => setEditMode(true)}>
                <Edit />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setDeleteQuestionDialog(true)}
              >
                <Delete />
              </IconButton>
            </div>
          </DialogTitle>
        )}
        {addQuestionDialog && <DialogTitle>Add New Question</DialogTitle>}

        <DialogContent>
          <FormControl fullWidth margin="dense" className={classes.formControl}>
            <InputLabel>Question Type</InputLabel>
            <Select
              label="Question Type"
              variant="outlined"
              value={questionType ? questionType : ""}
              onChange={(e) => {
                handleQuestionTypeChange(e);
              }}
              disabled={editQuestionDialog}
            >
              <MenuItem value="">
                <em>Select a question type</em>
              </MenuItem>
              <MenuItem value="mcq">MCQ</MenuItem>
              <MenuItem value="mrq">MRQ</MenuItem>
              <MenuItem value="shortanswer">Short Answer</MenuItem>
            </Select>
          </FormControl>
          <label htmlFor="question">
            <Typography variant="body1">Question</Typography>
          </label>
          <TextField
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
            disabled={!editMode && editQuestionDialog}
          />
          {questionType && (
            <Fragment>
              <label htmlFor="question">
                <Typography variant="body1" style={{ marginTop: "10px" }}>
                  Marks
                </Typography>
              </label>
              <TextField
                id="question"
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
                      return question.shortanswer.marks
                        ? question.shortanswer.marks
                        : "";
                    }
                  }
                })()}
                onChange={(e) => handleMarksChange(e)}
                disabled={!editMode && editQuestionDialog}
                style={{ marginBottom: "10px" }}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Fragment>
          )}

          {options && correctAnswer && questionType === "mcq" && (
            <FormControl
              fullWidth
              margin="dense"
              className={classes.formControl}
            >
              <InputLabel>Select Correct Answer</InputLabel>
              <Select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                disabled={!editMode && editQuestionDialog}
                label="Select Correct Answer"
                variant="outlined"
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
            <FormControl
              fullWidth
              margin="dense"
              className={classes.formControl}
            >
              <InputLabel>Select Correct Answer</InputLabel>
              <Select
                multiple
                value={correctAnswer}
                onChange={(e) => handleSelectMultiSelectAnswers(e)}
                disabled={!editMode && editQuestionDialog}
                label="Select Correct Answer"
                variant="outlined"
                renderValue={(selected) => {
                  return selected.join(", ");
                }}
              >
                {options.map((option, index) => (
                  <MenuItem key={index} value={option}>
                    <Checkbox
                      checked={correctAnswer.includes(option) && option !== ""}
                    />
                    <ListItemText primary={option} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {questionType === "shortanswer" && (
            <Fragment>
              <label htmlFor="shortanswer">
                <Typography variant="body1">Keywords as Answers</Typography>
              </label>
              <TextField
                id="shortanswer"
                placeholder="Enter keywords (separated by commas)"
                type="text"
                autoComplete="off"
                variant="outlined"
                margin="dense"
                fullWidth
                value={correctAnswer && correctAnswer}
                onChange={(e) => {
                  handleShortAnswerInput(e);
                }}
                disabled={!editMode && editQuestionDialog}
              />
            </Fragment>
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
                        disabled={!editMode && editQuestionDialog}
                        style={{ marginBottom: "10px" }}
                        onChange={(e) => handleOptionInputChange(e, index)}
                      />

                      {options && options.length > 1 && (
                        <IconButton
                          size="small"
                          style={{ marginLeft: "25px" }}
                          onClick={() => {
                            handleDeleteOption(index);
                          }}
                          disabled={!editMode && editQuestionDialog}
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
                          disabled={!editMode && editQuestionDialog}
                        >
                          <Add />
                        </IconButton>
                      )}
                    </div>
                  </Fragment>
                );
              }
            })}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              if (editQuestionDialog) {
                setEditMode(false);
                setEditQuestionDialog(false);
              }
              if (addQuestionDialog) {
                setAddQuestionDialog(false);
              }

              setQuizId();
              setQuestion();
              setQuestionType();
              setOptions();
              setCorrectAnswer();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            disabled={!editMode && editQuestionDialog}
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
