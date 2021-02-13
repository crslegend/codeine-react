import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Draggable, Droppable } from "react-beautiful-dnd";
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
  Add,
  Assignment,
  AttachFile,
  Delete,
  Edit,
  Movie,
} from "@material-ui/icons";
import validator from "validator";
import Toast from "../../../components/Toast";

import Service from "../../../AxiosService";
import { DropzoneAreaBase } from "material-ui-dropzone";
import SubTask from "./SubTask";
import QuestionDialog from "./QuestionDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid lightgrey",
    borderRadius: "10px",
    padding: 8,
    marginBottom: "8px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
    // alignItems: "center",
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
  handle: {
    marginRight: "10px",
  },
  title: {
    cursor: "pointer",
    display: "inline-block",
    maxWidth: 170,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  dialogButtons: {
    width: 100,
  },
  dropzoneContainer: {
    minHeight: "190px",
    "@global": {
      ".MuiDropzoneArea-root": {
        minHeight: "190px",
      },
    },
  },
  subtaskList: {
    padding: 8,
    flexGrow: 1,
    minHeight: "70px",
  },
}));

const Task = ({ task, index, getCourse, subtasks }) => {
  const classes = useStyles();
  // console.log(task);

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
  const [zipFile, setZipFile] = useState();

  const [editVideo, setEditVideo] = useState();
  const [editQuiz, setEditQuiz] = useState();

  const [deleteCourseMaterialDialog, setDeleteCourseMaterialDialog] = useState(
    false
  );

  const [addQuestionDialog, setAddQuestionDialog] = useState(false);

  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState();

  const [quizId, setQuizId] = useState();

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
    } else if (materialType === "file") {
      if (
        editFile.title === "" ||
        editFile.description === "" ||
        (editFile.google_drive_url === "" && editFile.zip_file === null)
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
        editFile.google_drive_url &&
        !validator.isURL(editFile.google_drive_url, {
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
      formData.append("title", editFile.title);
      formData.append("description", editFile.description);

      if (zipFile) {
        formData.append("zip_file", zipFile[0].file);
      } else {
        formData.append("google_drive_url", editFile.google_drive_url);
      }

      Service.client
        .put(`/materials/${courseMaterialId}/files`, formData)
        .then((res) => {
          console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setCourseMaterialId();
          setEditMode(false);
          setEditFile();
          setZipFile();
          getCourse();
        })
        .catch((err) => console.log(err));
    } else {
      if (
        editQuiz.title === "" ||
        editQuiz.description === "" ||
        editQuiz.passing_marks === "" ||
        editQuiz.instructions === ""
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

      Service.client
        .put(`/materials/${courseMaterialId}/quizzes`, editQuiz)
        .then((res) => {
          console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setCourseMaterialId();
          setEditMode(false);
          setEditQuiz();
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
        {(provided, snapshot) => {
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
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
                    } else if (task.material_type === "FILE") {
                      setEditFile({
                        title: task.title,
                        description: task.description,
                        google_drive_url: task.course_file.google_drive_url,
                        zip_file: task.course_file.zip_file,
                      });
                      setMaterialType("file");
                      setCourseMaterialId(task.id);
                    } else {
                      setEditQuiz({
                        title: task.title,
                        description: task.description,
                        passing_marks: task.quiz.passing_marks,
                        instructions: task.quiz.instructions,
                      });
                      setMaterialType("quiz");
                      setCourseMaterialId(task.id);
                    }
                  }}
                >
                  {task.title}
                </LinkMui>

                {task.material_type === "QUIZ" && (
                  <IconButton
                    size="small"
                    style={{ marginLeft: "auto", order: 2 }}
                    onClick={() => setAddQuestionDialog(true)}
                  >
                    <Add />
                  </IconButton>
                )}
              </div>

              {task.material_type === "QUIZ" && (
                <Droppable droppableId={task.id} type="subtask">
                  {(provided) => {
                    return (
                      <div
                        className={classes.subtaskList}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {subtasks &&
                          subtasks.map((subtask, index) => {
                            return (
                              <SubTask
                                key={subtask.id}
                                task={task}
                                subtask={subtask}
                                index={index}
                                getCourse={getCourse}
                              />
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              )}
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
          setZipFile();
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
                    value={editFile && editFile.title}
                    onChange={(e) => {
                      setEditFile({
                        ...editFile,
                        title: e.target.value,
                      });
                    }}
                    required
                    placeholder="Enter Title"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
                  />
                  <label htmlFor="description">
                    <Typography variant="body2">Description of File</Typography>
                  </label>
                  <TextField
                    id="description"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editFile && editFile.description}
                    onChange={(e) => {
                      setEditFile({
                        ...editFile,
                        description: e.target.value,
                      });
                    }}
                    required
                    placeholder="Enter Description"
                    style={{ marginBottom: "25px" }}
                    disabled={!editMode}
                  />
                  <div
                    style={{
                      display: "block",
                      borderTop: "1px solid #000",
                      marginBottom: "25px",
                    }}
                  />
                  {editMode && (
                    <Fragment>
                      <Typography variant="body2" style={{ marginTop: "10px" }}>
                        Upload a Zip File (to replace the current file)
                      </Typography>
                      <DropzoneAreaBase
                        dropzoneText="Drag and drop a zip file or click&nbsp;here"
                        dropzoneClass={classes.dropzoneContainer}
                        // dropzoneProps={{ disabled: true }}
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
                    </Fragment>
                  )}

                  {editFile && editFile.zip_file && (
                    <div style={{ display: "flex" }}>
                      <Typography
                        variant="body2"
                        style={{ marginTop: "5px", marginRight: "10px" }}
                      >
                        <LinkMui
                          href={
                            editFile.zip_file
                              ? editFile.zip_file.replace("#", "")
                              : "#"
                          }
                        >
                          Uploaded File
                        </LinkMui>
                      </Typography>
                    </div>
                  )}
                  <Typography
                    variant="h6"
                    style={{ textAlign: "center", marginTop: "10px" }}
                  >
                    OR
                  </Typography>
                  <label htmlFor="url">
                    <Typography variant="body2">Google Drive URL</Typography>
                  </label>
                  <TextField
                    id="url"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={
                      editFile && editFile.google_drive_url !== null
                        ? editFile.google_drive_url
                        : ""
                    }
                    onChange={(e) => {
                      setEditFile({
                        ...editFile,
                        google_drive_url: e.target.value,
                      });
                    }}
                    required
                    placeholder="https://drive.google.com"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
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
                    value={editQuiz && editQuiz.title}
                    onChange={(e) => {
                      setEditQuiz({
                        ...editQuiz,
                        title: e.target.value,
                      });
                    }}
                    required
                    placeholder="Enter Title"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
                  />
                  <label htmlFor="description">
                    <Typography variant="body2">Description of Quiz</Typography>
                  </label>
                  <TextField
                    id="description"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editQuiz && editQuiz.description}
                    onChange={(e) => {
                      setEditQuiz({
                        ...editQuiz,
                        description: e.target.value,
                      });
                    }}
                    required
                    placeholder="Enter Description"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
                  />
                  <label htmlFor="marks">
                    <Typography variant="body2">Passing Marks</Typography>
                  </label>
                  <TextField
                    id="marks"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editQuiz && editQuiz.passing_marks}
                    onChange={(e) => {
                      setEditQuiz({
                        ...editQuiz,
                        passing_marks: e.target.value,
                      });
                    }}
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                    required
                    style={{ marginBottom: "15px" }}
                    type="number"
                    disabled={!editMode}
                  />
                  <label htmlFor="marks">
                    <Typography variant="body2">Instructions</Typography>
                  </label>
                  <TextField
                    id="marks"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editQuiz && editQuiz.instructions}
                    onChange={(e) => {
                      setEditQuiz({
                        ...editQuiz,
                        instructions: e.target.value,
                      });
                    }}
                    required
                    placeholder="eg. Read the questions carefully"
                    style={{ marginBottom: "15px" }}
                    disabled={!editMode}
                  />
                </Fragment>
              );
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
              setZipFile();
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

      <QuestionDialog
        addQuestionDialog={addQuestionDialog}
        setAddQuestionDialog={setAddQuestionDialog}
        quizId={quizId}
        setQuizId={setQuizId}
        question={question}
        setQuestion={setQuestion}
        questionType={questionType}
        setQuestionType={setQuestionType}
        options={options}
        setOptions={setOptions}
        correctAnswer={correctAnswer}
        setCorrectAnswer={setCorrectAnswer}
        getCourse={getCourse}
      />
    </Fragment>
  );
};

export default Task;
