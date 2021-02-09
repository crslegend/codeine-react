import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable } from "react-beautiful-dnd";
import Task from "./Task";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 8,
    border: "1px solid lightgrey",
    borderRadius: 2,
    width: 220,
    display: "flex",
    flexDirection: "column",
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

const Column = ({ column, tasks }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.title}>{column.title}</div>
      <Droppable droppableId={column.id}>
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
};

export default Column;
