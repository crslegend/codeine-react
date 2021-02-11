import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Column from "./Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import Service from "../../../AxiosService";

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
    "column-2": {
      id: "column-2",
      title: "In progress",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "Done",
      taskIds: [],
    },
    "column-4": {
      id: "column-4",
      title: "Done",
      taskIds: [],
    },
    "column-5": {
      id: "column-5",
      title: "Done",
      taskIds: [],
    },
  },
  // Facilitate reordering of the columns
  columnOrder: ["column-1", "column-2", "column-3", "column-4", "column-5"],
  // columnOrder: [],
};
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
  },
}));

const CourseKanbanBoard = ({ courseId, state, setState, getCourse }) => {
  const classes = useStyles();
  console.log(state);
  // const [state, setState] = useState(data);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "column") {
      const newColumnOrder = Array.from(state.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...state,
        columnOrder: newColumnOrder,
      };
      setState(newState);
      handleUpdateChaptersOrdering(courseId, newColumnOrder);
      return;
    }

    const startColumn = state.columns[source.droppableId];
    const endColumn = state.columns[destination.droppableId];

    if (startColumn === endColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
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
    } else {
      // moving from one list to another
      const startTaskIds = Array.from(startColumn.taskIds);
      startTaskIds.splice(source.index, 1);
      const newStart = {
        ...startColumn,
        taskIds: startTaskIds,
      };

      const finishTaskIds = Array.from(endColumn.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...endColumn,
        taskIds: finishTaskIds,
      };

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      setState(newState);
    }
  };

  const handleUpdateChaptersOrdering = (courseId, newColumnOrder) => {
    Service.client
      .patch(`/courses/${courseId}/orderChapters`, newColumnOrder)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => {
          return (
            <div
              className={classes.container}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {state &&
                state.columnOrder &&
                state.columnOrder.map((columnId, index) => {
                  const column = state.columns[columnId];
                  const tasks =
                    column.taskIds &&
                    column.taskIds.map((taskId) => state.tasks[taskId]);

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks && tasks}
                      index={index}
                      courseId={courseId}
                      getCourse={getCourse}
                    />
                  );
                })}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};

export default CourseKanbanBoard;
