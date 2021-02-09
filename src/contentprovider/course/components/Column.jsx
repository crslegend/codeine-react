import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 8,
    border: "1px solid lightgrey",
    borderRadius: 2,
    width: 220,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  title: {
    padding: 8,
  },
  taskList: {
    padding: 8,
    flexGrow: 1,
    minHeight: "100px",
  },
}));

const Column = ({ column, tasks, index }) => {
  const classes = useStyles();

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => {
        return (
          <div
            className={classes.container}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className={classes.title} {...provided.dragHandleProps}>
              {column.title}
            </div>
            <Droppable droppableId={column.id} type="task">
              {(provided) => {
                return (
                  <div
                    className={classes.taskList}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {tasks.map((task, index) => (
                      <Task key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Column;
