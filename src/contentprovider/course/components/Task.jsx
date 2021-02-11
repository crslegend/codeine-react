import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Draggable } from "react-beautiful-dnd";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid lightgrey",
    borderRadius: "2px",
    padding: 8,
    marginBottom: "8px",
    backgroundColor: "#fff",
    display: "flex",
  },
  handle: {
    width: 20,
    height: 20,
    backgroundColor: "orange",
    borderRadius: "4px",
    marginRight: "10px",
  },
}));

const Task = ({ task, index }) => {
  const classes = useStyles();
  console.log(task);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => {
        return (
          <div
            className={classes.container}
            {...provided.draggableProps}
            ref={provided.innerRef}
          >
            <div className={classes.handle} {...provided.dragHandleProps}></div>
            {task.title}
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
