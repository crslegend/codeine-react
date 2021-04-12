import React, { Fragment } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { DragDropContext } from "react-beautiful-dnd";

import Service from "../../../AxiosService";

import QuizColumn from "./QuizColumn";

// const useStyles = makeStyles((theme) => ({
//   container: {
//     display: "flex",
//   },
// }));

const QuizKanbanBoard = ({
  finalQuiz,
  getCourse,
  finalQuizQuestions,
  setFinalQuizQuestions,
}) => {
  // const classes = useStyles();

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrder = Array.from(finalQuizQuestions.taskIds);
    newOrder.splice(source.index, 1);
    newOrder.splice(destination.index, 0, draggableId);

    setFinalQuizQuestions({
      ...finalQuizQuestions,
      taskIds: newOrder,
    });
    handleUpdateQuestionOrdering(finalQuiz.id, newOrder);
  };

  const handleUpdateQuestionOrdering = (quizId, newOrder) => {
    Service.client
      .patch(`/quiz/${quizId}/order-questions`, newOrder)
      .then((res) => {
        // console.log(res);
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const handleFormatTasks = (questions) => {
    // console.log(questions);
    const tasks =
      questions &&
      questions.taskIds &&
      questions.taskIds.map((taskId) => questions.tasks[taskId]);
    // console.log(tasks);
    return tasks;
  };

  return (
    <Fragment>
      <DragDropContext onDragEnd={handleDragEnd}>
        <QuizColumn
          key={finalQuiz && finalQuiz.id}
          column={finalQuiz && finalQuiz}
          getCourse={getCourse}
          tasks={handleFormatTasks(finalQuizQuestions)}
        />
      </DragDropContext>
    </Fragment>
  );
};

export default QuizKanbanBoard;
