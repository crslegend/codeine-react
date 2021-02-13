import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Service from "../../../AxiosService";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import QuizColumn from "./QuizColumn";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
  },
}));

const QuizKanbanBoard = ({
  finalQuiz,
  getCourse,
  finalQuizQuestions,
  setFinalQuizQuestions,
  questionsOrder,
  setQuestionsOrder,
}) => {
  const classes = useStyles();

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
  };

  return (
    <Fragment>
      <DragDropContext onDragEnd={handleDragEnd}>
        <QuizColumn
          key={finalQuiz && finalQuiz.id}
          column={finalQuiz && finalQuiz}
          getCourse={getCourse}
          tasks={finalQuizQuestions}
          questionsOrder={questionsOrder}
          setQuestionsOrder={setQuestionsOrder}
        />
      </DragDropContext>
    </Fragment>
  );
};

export default QuizKanbanBoard;
