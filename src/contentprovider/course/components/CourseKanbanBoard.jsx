import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Column from "./Column";
import { DragDropContext } from "react-beautiful-dnd";

const data = {
  tasks: {
    "task-1": { id: "task-1", content: "Take out the garbage" },
    "task-2": { id: "task-2", content: "Watch my favorite show" },
    "task-3": { id: "task-3", content: "Charge my phone" },
    "task-4": { id: "task-4", content: "Cook dinner" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-2", "task-3", "task-4"],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1"],
};
const useStyles = makeStyles((theme) => ({}));

const CourseKanbanBoard = () => {
  const classes = useStyles();

  const [state, setState] = useState(data);

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

    const column = state.columns[source.droppableId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.splice(source.index, 1);
    newTaskIds.splice(destination.index, 0, draggableId);

    const newColumn = {
      ...column,
      taskIds: newTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newColumn.id]: newColumn,
      },
    };

    setState(newState);
  };

  return (
    state &&
    state.columnOrder.map((columnId, index) => {
      const column = state.columns[columnId];
      const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);

      return (
        <DragDropContext onDragEnd={handleDragEnd} key={index}>
          <Column key={column.id} column={column} tasks={tasks} />
        </DragDropContext>
      );
    })
  );
};

export default CourseKanbanBoard;
