import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import QuizColumn from "./QuizColumn";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Service from "../../../AxiosService";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
  },
}));

const QuizKanbanBoard = () => {
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
        {(provided) => {}}
      </DragDropContext>
    </Fragment>
  );
};

export default QuizKanbanBoard;
