import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Draggable } from "react-beautiful-dnd";
import LinkMui from "@material-ui/core/Link";
import { Avatar } from "@material-ui/core";
import Toast from "../../../components/Toast";

// import Service from "../../../AxiosService";
import QuestionDialog from "./QuestionDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid lightgrey",
    borderRadius: "10px",
    padding: 8,
    marginBottom: "8px",
    backgroundColor: "#fff",
    display: "flex",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
    alignItems: "center",
  },
  containerDragging: {
    border: "2px solid blue",
    borderRadius: "10px",
    padding: 8,
    marginBottom: "8px",
    backgroundColor: "#e0e0e0",
    display: "flex",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
    alignItems: "center",
  },
  handle: {
    marginRight: "10px",
  },
  title: {
    cursor: "pointer",
    display: "inline-block",
    maxWidth: 150,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const SubTask = ({ task, subtask, getCourse, index }) => {
  const classes = useStyles();
  console.log(subtask);

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

  // console.log(task);

  const [editMode, setEditMode] = useState(false);

  const [editQuestionDialog, setEditQuestionDialog] = useState(false);
  // const [editQuestion, setEditQuestion] = useState(false);

  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState();

  const [quizId, setQuizId] = useState();

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Draggable draggableId={subtask.id} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              className={
                snapshot.isDragging
                  ? classes.containerDragging
                  : classes.container
              }
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <div {...provided.dragHandleProps} className={classes.handle}>
                <Avatar
                  variant="rounded"
                  style={{
                    height: "25px",
                    width: "25px",
                    backgroundColor: "#000",
                  }}
                >
                  {index + 1}
                </Avatar>
              </div>

              <LinkMui
                className={classes.title}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  if (subtask.mcq) {
                    setQuestionType("mcq");
                    setOptions(subtask.mcq.options);
                    setCorrectAnswer(subtask.mcq.correct_answer);
                  } else if (subtask.mrq) {
                    setQuestionType("mrq");
                    setOptions(subtask.mrq.options);
                    setCorrectAnswer(subtask.mrq.correct_answer);
                  } else {
                    setQuestionType("shortanswer");
                    setCorrectAnswer(subtask.shortanswer.keywords.join(","));
                  }

                  setQuestion(subtask);
                  setQuizId(task.quiz.id);
                  setEditQuestionDialog(true);
                }}
              >
                {subtask.title}
              </LinkMui>
            </div>
          );
        }}
      </Draggable>

      <QuestionDialog
        editMode={editMode}
        setEditMode={setEditMode}
        editQuestionDialog={editQuestionDialog}
        setEditQuestionDialog={setEditQuestionDialog}
        quizId={quizId}
        setQuizId={setQuizId}
        question={question}
        setQuestion={setQuestion}
        questionType={questionType}
        setQuestionType={setQuestionType}
        options={options}
        setOptions={setOptions}
        correctAnswer={correctAnswer}
        setCorrectAnswer={setCorrectAnswer}
        getCourse={getCourse}
        sbOpen={sbOpen}
        setSbOpen={setSbOpen}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
    </Fragment>
  );
};

export default SubTask;
