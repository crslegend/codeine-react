import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import {
  Add,
  Assignment,
  AttachFile,
  Delete,
  DragIndicator,
  Edit,
  Movie,
  SentimentSatisfiedAltRounded,
} from "@material-ui/icons";
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
import validator from "validator";
import { DropzoneAreaBase } from "material-ui-dropzone";
import Toast from "../../../components/Toast";

import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 8,
    border: "1px solid lightgrey",
    borderRadius: 2,
    width: 250,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  columnHeader: {
    display: "flex",
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    padding: "5px",
  },
  title: {
    cursor: "pointer",
    display: "inline-block",
    maxWidth: 170,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  taskList: {
    padding: 8,
    flexGrow: 1,
    minHeight: "100px",
  },
  handle: {
    width: 20,
    marginRight: "10px",
    paddingTop: "5px",
  },
  dialogButtons: {
    width: 100,
  },
  courseMaterialButton: {
    marginBottom: "5px",
    textTransform: "capitalize",
    width: 150,
    color: theme.palette.primary.main,
    backgroundColor: "#fff",
  },
  dropzoneContainer: {
    minHeight: "190px",
    "@global": {
      ".MuiDropzoneArea-root": {
        minHeight: "190px",
      },
    },
  },
}));

const Column = ({ column, tasks, index, courseId, getCourse, state }) => {
  const classes = useStyles();
  // console.log(courseId);

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

  const [chapterDetailsDialog, setChapterDetailsDialog] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editChapter, setEditChapter] = useState();

  const [deleteChapterDialog, setDeleteChapterDialog] = useState(false);
  const [deleteChapterId, setDeleteChapterId] = useState(false);

  const [courseMaterialDialog, setCourseMaterialDialog] = useState(false);
  const [materialType, setMaterialType] = useState();
  const [file, setFile] = useState({
    title: "",
    description: "",
    google_drive_url: "",
  });
  const [zipFile, setZipFile] = useState();

  const [video, setVideo] = useState({
    title: "",
    description: "",
    video_url: "",
  });
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    passing_marks: 0,
    instructions: "",
  });
  const [chapterIdForCouseMaterial, setChapterIdForCourseMaterial] = useState();

  const handleUpdateChapterDetails = (e) => {
    e.preventDefault();
    Service.client
      .put(`/courses/${courseId}/chapters/${column.id}`, editChapter)
      .then((res) => {
        console.log(res);
        setChapterDetailsDialog(false);
        setEditMode(false);
        setEditChapter();
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteChapter = () => {
    setDeleteChapterDialog(false);
    Service.client
      .delete(`/courses/${courseId}/chapters/${deleteChapterId}`)
      .then((res) => {
        console.log(res);
        setDeleteChapterId();
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const handleCreateCourseMaterial = () => {
    if (materialType === "video") {
      // check for empty fields
      if (
        video.title === "" ||
        video.description === "" ||
        video.video_url === ""
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
        !validator.isURL(video.video_url, {
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
        .post(`/chapters/${chapterIdForCouseMaterial}/videos`, video)
        .then((res) => {
          console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setChapterIdForCourseMaterial();
          setEditMode(false);
          setVideo({
            title: "",
            description: "",
            video_url: "",
          });
          getCourse();
        })
        .catch((err) => console.log(err));
    } else if (materialType === "file") {
      if (
        file.title === "" ||
        file.description === "" ||
        (file.google_drive_url === "" && !zipFile)
      ) {
        setSbOpen(true);
        setSnackbar({
          message: "Please fill up all required fields!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      // check if google drive URL is a valid URL
      if (
        !validator.isURL(file.google_drive_url, {
          protocols: ["http", "https"],
          require_protocol: true,
          allow_underscores: true,
        }) &&
        !zipFile
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

      const formData = new FormData();
      formData.append("title", file.title);
      formData.append("description", file.description);

      if (zipFile) {
        formData.append("zip_file", zipFile[0].file);
      }

      formData.append("google_drive_url", file.google_drive_url);

      Service.client
        .post(`/chapters/${chapterIdForCouseMaterial}/files`, formData)
        .then((res) => {
          console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setChapterIdForCourseMaterial();
          setEditMode(false);
          setZipFile();
          setFile({
            title: "",
            description: "",
            google_drive_url: "",
          });
          getCourse();
        })
        .catch((err) => console.log(err));
    } else {
      // add quiz as course material
      if (
        quiz.title === "" ||
        quiz.description === "" ||
        quiz.passing_marks === "" ||
        quiz.instructions === ""
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

      Service.client
        .post(`/chapters/${chapterIdForCouseMaterial}/quizzes`, quiz)
        .then((res) => {
          console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setChapterIdForCourseMaterial();
          setEditMode(false);
          setQuiz({
            title: "",
            description: "",
            passing_marks: 0,
            instructions: "",
          });
          getCourse();
        })
        .catch((err) => console.log(err));
    }
  };

  // console.log(column);

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
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
                  style={{ textDecoration: "none" }}
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
                {/* <IconButton size="small">
                  <Add />
                </IconButton> */}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<AttachFile />}
                  className={classes.courseMaterialButton}
                  onClick={() => {
                    setMaterialType("file");
                    setCourseMaterialDialog(true);
                    setChapterIdForCourseMaterial(column.id);
                  }}
                >
                  Add File
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Movie />}
                  className={classes.courseMaterialButton}
                  onClick={() => {
                    setMaterialType("video");
                    setCourseMaterialDialog(true);
                    setChapterIdForCourseMaterial(column.id);
                  }}
                >
                  Add Video
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Assignment />}
                  className={classes.courseMaterialButton}
                  onClick={() => {
                    setMaterialType("quiz");
                    setCourseMaterialDialog(true);
                    setChapterIdForCourseMaterial(column.id);
                  }}
                >
                  Add Quiz
                </Button>
              </div>

              <Droppable droppableId={column.id} type="task">
                {(provided, snapshot) => {
                  return (
                    <div
                      className={classes.taskList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        backgroundColor: snapshot.isDraggingOver
                          ? "#e0e0e0"
                          : "#fff",
                      }}
                    >
                      {tasks &&
                        tasks.map((task, index) => {
                          let subtasks = [];
                          if (task.material_type === "QUIZ") {
                            subtasks =
                              task.subtaskIds &&
                              task.subtaskIds.map(
                                (subtaskId) => state.subtasks[subtaskId]
                              );
                          }

                          return (
                            <Task
                              key={task.id}
                              task={task}
                              index={index}
                              getCourse={getCourse}
                              subtasks={subtasks}
                            />
                          );
                        })}
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
          setEditMode(false);
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
              <IconButton
                size="small"
                onClick={() => {
                  setDeleteChapterId(column.id);
                  setDeleteChapterDialog(true);
                }}
              >
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

      <Dialog
        open={deleteChapterDialog}
        onClose={() => {
          setDeleteChapterId();
          setDeleteChapterDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete this chapter?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setDeleteChapterId();
              setDeleteChapterDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              handleDeleteChapter();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={courseMaterialDialog}
        onClose={() => {
          setCourseMaterialDialog(false);
          setMaterialType();
          setChapterIdForCourseMaterial();
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <form onSubmit={handleCreateCourseMaterial}>
          <DialogTitle>Add Course Material</DialogTitle>
          <DialogContent>
            {(() => {
              if (courseMaterialDialog) {
                if (materialType === "file") {
                  return (
                    <Fragment>
                      <label htmlFor="title">
                        <Typography variant="body2">Title of File</Typography>
                      </label>
                      <TextField
                        id="title"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={file && file.title}
                        onChange={(e) => {
                          setFile({
                            ...file,
                            title: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Title"
                        style={{ marginBottom: "15px" }}
                      />
                      <label htmlFor="description">
                        <Typography variant="body2">
                          Description of File
                        </Typography>
                      </label>
                      <TextField
                        id="description"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={file && file.description}
                        onChange={(e) => {
                          setFile({
                            ...file,
                            description: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Description"
                        style={{ marginBottom: "25px" }}
                      />
                      <div
                        style={{
                          display: "block",
                          borderTop: "1px solid #000",
                          marginBottom: "25px",
                        }}
                      />
                      <label htmlFor="url">
                        <Typography variant="body2">Upload Zip File</Typography>
                      </label>
                      <DropzoneAreaBase
                        dropzoneText="Drag and drop a zip file or click&nbsp;here"
                        dropzoneClass={classes.dropzoneContainer}
                        filesLimit={1}
                        maxFileSize={5000000000}
                        fileObjects={zipFile}
                        useChipsForPreview={true}
                        onAdd={(newFile) => {
                          setZipFile(newFile);
                        }}
                        onDelete={(fileObj) => {
                          setZipFile();
                        }}
                        previewGridProps={{
                          item: {
                            xs: "auto",
                          },
                        }}
                      />
                      <Typography
                        variant="h6"
                        style={{ textAlign: "center", marginTop: "10px" }}
                      >
                        OR
                      </Typography>
                      <label htmlFor="url">
                        <Typography variant="body2">
                          Google Drive URL
                        </Typography>
                      </label>
                      <TextField
                        id="url"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={file && file.google_drive_url}
                        onChange={(e) => {
                          setFile({
                            ...file,
                            google_drive_url: e.target.value,
                          });
                        }}
                        required
                        placeholder="https://drive.google.com"
                        style={{ marginBottom: "15px" }}
                      />
                    </Fragment>
                  );
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
                        value={video && video.title}
                        onChange={(e) => {
                          setVideo({
                            ...video,
                            title: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Title"
                        style={{ marginBottom: "15px" }}
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
                        value={video && video.description}
                        onChange={(e) => {
                          setVideo({
                            ...video,
                            description: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Description"
                        style={{ marginBottom: "15px" }}
                      />
                      <label htmlFor="url">
                        <Typography variant="body2">Video URL</Typography>
                      </label>
                      <TextField
                        id="url"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={video && video.video_url}
                        onChange={(e) => {
                          setVideo({
                            ...video,
                            video_url: e.target.value,
                          });
                        }}
                        required
                        placeholder="https://www.google.com"
                        style={{ marginBottom: "15px" }}
                      />
                    </Fragment>
                  );
                } else if (materialType === "quiz") {
                  return (
                    <Fragment>
                      <label htmlFor="title">
                        <Typography variant="body2">Title of Quiz</Typography>
                      </label>
                      <TextField
                        id="title"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={quiz && quiz.title}
                        onChange={(e) => {
                          setQuiz({
                            ...quiz,
                            title: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Title"
                        style={{ marginBottom: "15px" }}
                      />
                      <label htmlFor="description">
                        <Typography variant="body2">
                          Description of Quiz
                        </Typography>
                      </label>
                      <TextField
                        id="description"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={quiz && quiz.description}
                        onChange={(e) => {
                          setQuiz({
                            ...quiz,
                            description: e.target.value,
                          });
                        }}
                        required
                        placeholder="Enter Description"
                        style={{ marginBottom: "15px" }}
                      />
                      <label htmlFor="marks">
                        <Typography variant="body2">Passing Marks</Typography>
                      </label>
                      <TextField
                        id="marks"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={quiz && quiz.passing_marks}
                        onChange={(e) => {
                          setQuiz({
                            ...quiz,
                            passing_marks: e.target.value,
                          });
                        }}
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        required
                        style={{ marginBottom: "15px" }}
                        type="number"
                      />
                      <label htmlFor="marks">
                        <Typography variant="body2">Instructions</Typography>
                      </label>
                      <TextField
                        id="marks"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        value={quiz && quiz.instructions}
                        onChange={(e) => {
                          setQuiz({
                            ...quiz,
                            instructions: e.target.value,
                          });
                        }}
                        required
                        placeholder="eg. Read the questions carefully"
                        style={{ marginBottom: "15px" }}
                      />
                    </Fragment>
                  );
                }
              }
            })()}
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={classes.dialogButtons}
              onClick={() => {
                setCourseMaterialDialog(false);
                setMaterialType();
                setChapterIdForCourseMaterial();
                setVideo({
                  title: "",
                  description: "",
                  video_url: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.dialogButtons}
              onClick={() => {
                handleCreateCourseMaterial();
              }}
            >
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
};

export default Column;
