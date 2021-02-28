import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable } from "react-beautiful-dnd";

// import LinkMui from "@material-ui/core/Link";
import Toast from "../../../components/Toast";

// import Service from "../../../AxiosService";
import { Button, Typography } from "@material-ui/core";
import { Assignment } from "@material-ui/icons";
import QuestionDialog from "./QuestionDialog";
import SubTask from "./SubTask";

const useStyles = makeStyles((theme) => ({
  container: {
    width: 250,
    margin: "auto",
    marginBottom: "30px",
    border: "1px solid lightgrey",
    borderRadius: "2px",
    backgroundColor: "#fff",
  },
  taskList: {
    padding: 8,
    flexGrow: 1,
    minHeight: "100px",
  },
  addQuestionButton: {
    marginBottom: "5px",
    textTransform: "capitalize",
    width: 150,
    color: theme.palette.primary.main,
    backgroundColor: "#fff",
  },
}));

const QuizColumn = ({ column, getCourse, tasks }) => {
  const classes = useStyles();
  //   console.log(tasks);

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

  const [addQuestionDialog, setAddQuestionDialog] = useState(false);

  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState();

  const [quizId, setQuizId] = useState();

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.container}>
        <div style={{ padding: "5px" }}>
          <Typography style={{ textAlign: "center" }}>Final Quiz</Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <Button
            variant="contained"
            startIcon={<Assignment />}
            className={classes.addQuestionButton}
            onClick={() => {
              setQuizId(column.id);
              setAddQuestionDialog(true);
            }}
          >
            Add Question
          </Button>
        </div>

        <Droppable droppableId="quiz-column">
          {(provided, snapshot) => {
            return (
              <div
                className={classes.taskList}
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  backgroundColor: snapshot.isDraggingOver ? "#e0e0e0" : "#fff",
                }}
              >
                {tasks &&
                  tasks.map((task, index) => {
                    const newTask = {
                      ...column,
                      quiz: column.id,
                    };

                    return (
                      <SubTask
                        key={task.id}
                        task={newTask}
                        subtask={task}
                        index={index}
                        getCourse={getCourse}
                      />
                    );
                  })}
              </div>
            );
          }}
        </Droppable>
      </div>

      <QuestionDialog
        addQuestionDialog={addQuestionDialog}
        setAddQuestionDialog={setAddQuestionDialog}
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

export default QuizColumn;
