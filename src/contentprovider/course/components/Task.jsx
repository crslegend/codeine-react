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
import {
  Assignment,
  AttachFile,
  Delete,
  Edit,
  Movie,
} from "@material-ui/icons";
import validator from "validator";
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
  handle: {
    marginRight: "10px",
  },
  title: {
    cursor: "pointer",
    display: "inline-block",
    width: 170,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dialogButtons: {
    width: 100,
  },
}));

const Task = ({ task, index, getCourse }) => {
  const classes = useStyles();
  console.log(task);

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [editMode, setEditMode] = useState(false);
  const [courseMaterialDialog, setCourseMaterialDialog] = useState(false);
  const [materialType, setMaterialType] = useState();
  const [courseMaterialId, setCourseMaterialId] = useState();

  const [editFile, setEditFile] = useState();
  const [editVideo, setEditVideo] = useState();
  const [editQuiz, setEditQuiz] = useState();

  const [deleteCourseMaterialDialog, setDeleteCourseMaterialDialog] = useState(
    false
  );

  const handleUpdateCourseMaterial = () => {
    if (materialType === "video") {
      // check for empty fields
      if (
        editVideo.title === "" ||
        editVideo.description === "" ||
        editVideo.video_url === ""
      ) {
        setSbOpen(true);
        setSnackbar({
          message: "Please fill up all fields!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      // check if video URL is a valid URL
      if (
        !validator.isURL(editVideo.video_url, {
          protocols: ["http", "https"],
          require_protocol: true,
          allow_underscores: true,
        })
      ) {
        setSbOpen(true);
        setSnackbar({
          message: "Please enter a valid URL!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      Service.client
        .put(`/materials/${courseMaterialId}/videos`, editVideo)
        .then((res) => {
          console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setEditVideo();
          setEditMode(false);
          setCourseMaterialId();
          getCourse();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDeleteCourseMaterial = () => {
    Service.client
      .delete(`/materials/${courseMaterialId}`)
      .then((res) => {
        console.log(res);
        setCourseMaterialDialog(false);
        setDeleteCourseMaterialDialog(false);
        setMaterialType();
        setEditVideo();
        setEditMode(false);
        setCourseMaterialId();
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Draggable draggableId={task.id} index={index}>
        {(provided) => {
          return (
            <div
              className={classes.container}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              {(() => {
                if (task.material_type === "FILE") {
                  return (
                    <div
                      {...provided.dragHandleProps}
                      className={classes.handle}
                    >
                      <Avatar
                        variant="rounded"
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: "#000",
                        }}
                      >
                        <AttachFile fontSize="small" />
                      </Avatar>
                    </div>
                  );
                } else if (task.material_type === "VIDEO") {
                  return (
                    <div
                      {...provided.dragHandleProps}
                      className={classes.handle}
                    >
                      <Avatar
                        variant="rounded"
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: "#000",
                        }}
                      >
                        <Movie fontSize="small" />
                      </Avatar>
                    </div>
                  );
                } else if (task.material_type === "QUIZ") {
                  return (
                    <div
                      {...provided.dragHandleProps}
                      className={classes.handle}
                    >
                      <Avatar
                        variant="rounded"
                        style={{
                          height: "30px",
                          width: "30px",
                          backgroundColor: "#000",
                        }}
                      >
                        <Assignment fontSize="small" />
                      </Avatar>
                    </div>
                  );
                }
              })()}

              <LinkMui
                className={classes.title}
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setCourseMaterialDialog(true);

                  if (task.material_type === "VIDEO") {
                    setEditVideo({
                      title: task.title,
                      description: task.description,
                      video_url: task.video.video_url,
                    });
                    setMaterialType("video");
                    setCourseMaterialId(task.id);
                  }
                }}
              >
                {task.title}
              </LinkMui>
            </div>
          );
        }}
      </Draggable>

      <Dialog
        open={courseMaterialDialog}
        onClose={() => {
          setCourseMaterialDialog(false);
          setEditFile();
          setEditVideo();
          setEditQuiz();
          setEditMode(false);
          setCourseMaterialId();
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>
          Course Material{" "}
          <span style={{ textTransform: "capitalize" }}>({materialType})</span>
          <div style={{ float: "right" }}>
            <IconButton size="small" onClick={() => setEditMode(true)}>
              <Edit />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setDeleteCourseMaterialDialog(true)}
            >
              <Delete />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {(() => {
            if (materialType === "file") {
            } else if (materialType === "video") {
              return (
                <Fragment>
                  <label htmlFor="title">
                    <Typography variant="body2">Title of Video</Typography>
                  </label>
                  <TextField
                    id="title"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editVideo && editVideo.title}
                    onChange={(e) => {
                      setEditVideo({
                        ...editVideo,
                        title: e.target.value,
                      });
                    }}
                    required
                    placeholder="Enter Title"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
                  />
                  <label htmlFor="description">
                    <Typography variant="body2">
                      Description of Video
                    </Typography>
                  </label>
                  <TextField
                    id="description"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editVideo && editVideo.description}
                    onChange={(e) => {
                      setEditVideo({
                        ...editVideo,
                        description: e.target.value,
                      });
                    }}
                    required
                    placeholder="Enter Description"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
                  />
                  <label htmlFor="url">
                    <Typography variant="body2">Video URL</Typography>
                  </label>
                  <TextField
                    id="url"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editVideo && editVideo.video_url}
                    onChange={(e) => {
                      setEditVideo({
                        ...editVideo,
                        video_url: e.target.value,
                      });
                    }}
                    required
                    placeholder="https://www.google.com"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
                  />
                </Fragment>
              );
            } else if (materialType === "quiz") {
            }
          })()}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setCourseMaterialDialog(false);
              setEditFile();
              setEditVideo();
              setEditQuiz();
              setEditMode(false);
              setCourseMaterialId();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            disabled={!editMode}
            onClick={() => handleUpdateCourseMaterial()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteCourseMaterialDialog}
        onClose={() => setDeleteCourseMaterialDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete this course material?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setDeleteCourseMaterialDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              handleDeleteCourseMaterial();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Task;
