import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Draggable } from "react-beautiful-dnd";
import LinkMui from "@material-ui/core/Link";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import Toast from "../../../components/Toast";

import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid lightgrey",
    borderRadius: "10px",
    padding: 8,
    marginBottom: "8px",
    backgroundColor: "#fff",
    display: "flex",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
    alignItems: "center",
  },
  containerDragging: {
    border: "2px solid blue",
    borderRadius: "10px",
    padding: 8,
    marginBottom: "8px",
    backgroundColor: "#e0e0e0",
    display: "flex",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
    alignItems: "center",
  },
}));

const SubTask = ({ task, subtask, getCourse, index }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <Draggable draggableId={subtask.id} index={index}>
        {(provided, snapshot) => {
          console.log(subtask);
          return (
            <div
              className={
                snapshot.isDragging
                  ? classes.containerDragging
                  : classes.container
              }
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <div {...provided.dragHandleProps}>
                <Avatar
                  variant="rounded"
                  style={{
                    height: "25px",
                    width: "25px",
                    backgroundColor: "#000",
                  }}
                >
                  {index + 1}
                </Avatar>
              </div>
            </div>
          );
        }}
      </Draggable>
    </Fragment>
  );
};

export default SubTask;
