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
  },
}));

const Task = ({ task, index }) => {
  const classes = useStyles();

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => {
        return (
          <div
            className={classes.container}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {task.content}
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
