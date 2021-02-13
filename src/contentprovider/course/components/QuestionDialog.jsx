import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
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
    paddingTop: "15px",
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
}) => {
  const classes = useStyles();
  console.log(options);

  const [deleteQuestionDialog, setDeleteQuestionDialog] = useState(false);

  const handleQuestionInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value);
    setOptions([]);
  };

  const handleDeleteQuestion = () => {};

  return (
    <Fragment>
      <Dialog
        open={editQuestionDialog}
        onClose={() => {
          setEditMode(false);
          setEditQuestionDialog(false);
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
              disabled={!editMode}
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
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Question
            </Typography>
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
            disabled={!editMode}
            style={{ marginBottom: "20px" }}
          />

          {options &&
            options.map((option, index) => {
              if (questionType === "mcq") {
                return (
                  <Fragment>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <div key={index} style={{ marginBottom: "10px" }}>
                        <TextField
                          value={option}
                          placeholder="Enter option"
                          disabled={!editMode}
                        />
                      </div>
                      {options && options.length > 1 && (
                        <IconButton
                          size="small"
                          style={{ marginLeft: "25px" }}
                          onClick={() => {
                            //   handleDeleteOption(i);
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
                            // handleAddOption();
                          }}
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
              setEditMode(false);
              setEditQuestionDialog(false);
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
            disabled={!editMode}
            // onClick={() => handleUpdateCourseMaterial()}
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
