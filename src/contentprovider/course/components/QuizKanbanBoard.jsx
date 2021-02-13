import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Column from "./Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
  },
}));

const QuizKanbanBoard = () => {
  const classes = useStyles();
  return <div></div>;
};

export default QuizKanbanBoard;
