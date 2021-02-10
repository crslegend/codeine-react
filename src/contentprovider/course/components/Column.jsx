import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import { Delete, DragIndicator, Edit } from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";

import Service from "../../../AxiosService";

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
  columnHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "5px",
  },
  title: {
    cursor: "pointer",
  },
  taskList: {
    padding: 8,
    flexGrow: 1,
    minHeight: "100px",
  },
  handle: {
    width: 20,
    marginRight: "10px",
  },
  dialogButtons: {
    width: 100,
  },
}));

const Column = ({ column, tasks, index, courseId }) => {
  const classes = useStyles();
  console.log(courseId);

  const [chapterDetailsDialog, setChapterDetailsDialog] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editChapter, setEditChapter] = useState();

  const handleUpdateChapterDetails = (e) => {
    e.preventDefault();
    Service.client
      .put(`/courses/${courseId}/chapters/${column.id}`)
      .then((res) => {
        console.log(res);
        setChapterDetailsDialog(false);
        setEditMode(false);
        setEditChapter();
      })
      .catch((err) => console.log(err));
  };

  console.log(column);

  return (
    <Fragment>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => {
          return (
            <div
              className={classes.container}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <div className={classes.columnHeader}>
                <div {...provided.dragHandleProps} className={classes.handle}>
                  <DragIndicator />
                </div>
                <LinkMui
                  className={classes.title}
                  onClick={() => {
                    setEditChapter({
                      title: column.title,
                      overview: column.overview,
                    });
                    setChapterDetailsDialog(true);
                  }}
                >
                  {column.title}
                </LinkMui>
              </div>

              <Droppable droppableId={column.id} type="task">
                {(provided) => {
                  return (
                    <div
                      className={classes.taskList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {tasks &&
                        tasks.map((task, index) => (
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
      <Dialog
        open={chapterDetailsDialog}
        onClose={() => {
          setChapterDetailsDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <form onSubmit={handleUpdateChapterDetails}>
          <DialogTitle>
            {column.title}
            <div style={{ float: "right" }}>
              <IconButton size="small" onClick={() => setEditMode(true)}>
                <Edit />
              </IconButton>
              <IconButton size="small">
                <Delete />
              </IconButton>
            </div>
          </DialogTitle>
          <DialogContent>
            <label htmlFor="title">
              <Typography variant="body2">Chapter Title</Typography>
            </label>
            <TextField
              id="title"
              variant="outlined"
              fullWidth
              margin="dense"
              value={editChapter && editChapter.title}
              onChange={(e) => {
                setEditChapter({
                  ...editChapter,
                  title: e.target.value,
                });
              }}
              required
              disabled={!editMode}
            />
            <label htmlFor="overview">
              <Typography variant="body2">Chapter Overview</Typography>
            </label>
            <TextField
              id="overview"
              variant="outlined"
              fullWidth
              margin="dense"
              value={editChapter && editChapter.overview}
              onChange={(e) => {
                setEditChapter({
                  ...editChapter,
                  overview: e.target.value,
                });
              }}
              required
              disabled={!editMode}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={classes.dialogButtons}
              onClick={() => {
                setChapterDetailsDialog(false);
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.dialogButtons}
              type="submit"
              disabled={!editMode}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
};

export default Column;
