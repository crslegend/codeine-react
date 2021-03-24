import React, { Fragment, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
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
import { Assignment, Delete, InsertDriveFile, Theaters, DragHandle } from "@material-ui/icons";
import validator from "validator";
import Toast from "../../../components/Toast";

import Service from "../../../AxiosService";
import { DropzoneAreaBase } from "material-ui-dropzone";
// import SubTask from "./SubTask";
import QuestionDialog from "./QuestionDialog";
import QuizCreationModal from "./QuizCreationModal";

const useStyles = makeStyles((theme) => ({
  container: {
    border: "1px solid lightgrey",
    borderRadius: "5px",
    marginBottom: "8px",
    backgroundColor: "#fcfcfc",
    display: "flex",
    flexDirection: "column",
    // boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
    boxShadow: "2px 3px 3px 0px rgba(0,0,0,0.16)",
    // alignItems: "center",
  },
  containerDragging: {
    border: "1px solid grey",
    borderRadius: "5px",
    marginBottom: "8px",
    backgroundColor: "#fcfcfc",
    display: "flex",
    flexDirection: "column",
    // boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 4px 0 rgba(0, 0, 0, 0.19)",
  },
  handle: {
    color: "#6e6e6e",
  },
  title: {
    cursor: "pointer",
    // display: "inline-block",
    // maxWidth: 170,
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
  },
  dialogButtons: {
    width: 100,
  },
  dropzoneContainer: {
    minHeight: "150px",
    "@global": {
      ".MuiDropzoneArea-root": {
        minHeight: "150px",
      },
    },
  },
  subtaskList: {
    padding: 8,
    flexGrow: 1,
    minHeight: "70px",
  },
  dropzoneText: {
    fontSize: "14px",
  },
}));

const Task = ({ task, index, getCourse, subtasks, courseId }) => {
  const classes = useStyles();
  const theme = useTheme();
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

  // eslint-disable-next-line no-unused-vars
  const [editMode, setEditMode] = useState(false);
  const [courseMaterialDialog, setCourseMaterialDialog] = useState(false);
  const [materialType, setMaterialType] = useState();
  const [courseMaterialId, setCourseMaterialId] = useState();

  const [editFile, setEditFile] = useState();
  const [zipFile, setZipFile] = useState();

  // const [uploadFileCheckbox, setUploadFileCheckbox] = useState(false);
  // const [fileURLCheckbox, setFileURLCheckbox] = useState(false);

  const [editVideo, setEditVideo] = useState();
  const [editQuiz, setEditQuiz] = useState();
  const [editQuizQuestionGroups, setEditQuizQuestionGroups] = useState([]);

  const [deleteCourseMaterialDialog, setDeleteCourseMaterialDialog] = useState(false);

  const [addQuestionDialog, setAddQuestionDialog] = useState(false);

  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState();

  const [quizId, setQuizId] = useState();

  const handleUpdateCourseMaterial = () => {
    if (materialType === "video") {
      // check for empty fields
      if (editVideo.title === "" || editVideo.description === "" || editVideo.video_url === "") {
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
          // console.log(res);
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
      }
      formData.append("google_drive_url", editFile.google_drive_url);

      Service.client
        .put(`/materials/${courseMaterialId}/files`, formData)
        .then((res) => {
          // console.log(res);
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
      if (editQuiz.title === "" || editQuiz.description === "" || editQuiz.passing_marks === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Check your fields",
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
          // console.log(res);
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
        // console.log(res);
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

  const getColor = () => {
    if (task.material_type === "VIDEO") {
      return theme.palette.secondary.main;
    } else if (task.material_type === "FILE") {
      return theme.palette.yellow.main;
    } else {
      return theme.palette.red.main;
    }
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => {
          return (
            <div
              className={snapshot.isDragging ? classes.containerDragging : classes.container}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  // justifyContent: "center",
                  padding: theme.spacing(1),
                  borderLeft: `5px solid ${getColor()}`,
                  borderRadius: "5px",
                }}
              >
                <div
                  style={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    marginRight: "3px",
                  }}
                >
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
                      } else if (task.material_type === "QUIZ") {
                        setEditQuiz({
                          cm_id: task.id,
                          quiz_id: task.quiz.id,
                          title: task.title,
                          description: task.description,
                          passing_marks: task.quiz.passing_marks,
                          instructions: task.quiz.instructions,
                          is_randomized: task.quiz.is_randomized,
                        });
                        setMaterialType("quiz");
                        setCourseMaterialId(task.id);
                        setEditQuizQuestionGroups(task.quiz.question_groups);
                      }
                    }}
                  >
                    {task.title}
                  </LinkMui>

                  {(() => {
                    if (task.material_type === "FILE") {
                      return (
                        <Avatar
                          style={{
                            height: theme.spacing(3),
                            width: theme.spacing(3),
                            backgroundColor: getColor(),
                            margin: "8px 0 0 3px",
                          }}
                        >
                          <InsertDriveFile
                            style={{
                              height: theme.spacing(2),
                              width: theme.spacing(2),
                            }}
                          />
                        </Avatar>
                      );
                    } else if (task.material_type === "VIDEO") {
                      return (
                        <Avatar
                          style={{
                            height: theme.spacing(3),
                            width: theme.spacing(3),
                            backgroundColor: getColor(),
                            margin: "8px 0 0 3px",
                          }}
                        >
                          <Theaters
                            style={{
                              height: theme.spacing(2),
                              width: theme.spacing(2),
                            }}
                          />
                        </Avatar>
                      );
                    } else if (task.material_type === "QUIZ") {
                      return (
                        <Avatar
                          style={{
                            height: theme.spacing(3),
                            width: theme.spacing(3),
                            backgroundColor: getColor(),
                            margin: "8px 0 0 3px",
                          }}
                        >
                          <Assignment
                            style={{
                              height: theme.spacing(2),
                              width: theme.spacing(2),
                            }}
                          />
                        </Avatar>
                      );
                    }
                  })()}
                </div>

                <div {...provided.dragHandleProps} className={classes.handle}>
                  <DragHandle />
                </div>
              </div>
              {/* {task.material_type === "QUIZ" && (
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
              )} */}
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
            minWidth: "600px",
            maxWidth: "none",
          },
        }}
      >
        <DialogTitle>
          Course Material <span style={{ textTransform: "capitalize" }}>({materialType})</span>
          <div style={{ float: "right" }}>
            {/* <IconButton size="small" onClick={() => setEditMode(true)}>
              <Edit />
            </IconButton> */}
            <IconButton size="small" onClick={() => setDeleteCourseMaterialDialog(true)}>
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
                    autoFocus
                    margin="dense"
                    value={editFile && editFile.title}
                    onChange={(e) => {
                      setEditFile({
                        ...editFile,
                        title: e.target.value,
                      });
                    }}
                    inputProps={{ style: { fontSize: "14px" } }}
                    required
                    placeholder="Enter Title"
                    style={{ marginBottom: "15px" }}
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
                    inputProps={{ style: { fontSize: "14px" } }}
                    required
                    placeholder="Enter Description"
                    multiline
                    rows={6}
                    style={{ marginBottom: "25px" }}
                  />
                  <div
                    style={{
                      display: "block",
                      borderTop: "1px solid #000",
                      marginBottom: "25px",
                    }}
                  />

                  <div>
                    <Typography variant="body2" style={{ marginTop: "10px" }}>
                      Upload File (to replace the current file)
                    </Typography>
                    {editFile && editFile.zip_file && (
                      <div style={{ display: "flex" }}>
                        <Typography variant="body2" style={{ margin: "5px 0" }}>
                          <LinkMui
                            href={editFile.zip_file ? editFile.zip_file.replace("#", "") : "#"}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            &gt; Uploaded File
                          </LinkMui>
                        </Typography>
                      </div>
                    )}
                    <DropzoneAreaBase
                      dropzoneText="Drag and drop a zip file or click&nbsp;here"
                      dropzoneParagraphClass={classes.dropzoneText}
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
                  </div>

                  <Typography variant="h6" style={{ textAlign: "center", marginTop: "10px" }}>
                    OR
                  </Typography>
                  <label htmlFor="url">
                    <Typography variant="body2">File URL</Typography>
                  </label>
                  <TextField
                    id="url"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editFile && editFile.google_drive_url !== null ? editFile.google_drive_url : ""}
                    onChange={(e) => {
                      setEditFile({
                        ...editFile,
                        google_drive_url: e.target.value,
                      });
                    }}
                    inputProps={{ style: { fontSize: "14px" } }}
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
                    autoFocus
                    margin="dense"
                    value={editVideo && editVideo.title}
                    onChange={(e) => {
                      setEditVideo({
                        ...editVideo,
                        title: e.target.value,
                      });
                    }}
                    inputProps={{ style: { fontSize: "14px" } }}
                    required
                    placeholder="Enter Title"
                    style={{ marginBottom: "15px" }}
                  />
                  <label htmlFor="description">
                    <Typography variant="body2">Description of Video</Typography>
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
                    inputProps={{ style: { fontSize: "14px" } }}
                    required
                    placeholder="Enter Description"
                    multiline
                    rows={6}
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
                    value={editVideo && editVideo.video_url}
                    onChange={(e) => {
                      setEditVideo({
                        ...editVideo,
                        video_url: e.target.value,
                      });
                    }}
                    inputProps={{ style: { fontSize: "14px" } }}
                    required
                    placeholder="e.g. https://www.youtube.com"
                    style={{ marginBottom: "15px" }}
                  />
                </Fragment>
              );
            } else if (materialType === "quiz") {
              return (
                <QuizCreationModal
                  quiz={editQuiz}
                  setQuiz={setEditQuiz}
                  courseId={courseId}
                  questionGroups={editQuizQuestionGroups}
                  setQuestionGroups={setEditQuizQuestionGroups}
                  closeDialog={() => {
                    setCourseMaterialDialog(false);
                    setEditFile();
                    setEditVideo();
                    setEditQuiz();
                    setEditMode(false);
                    setCourseMaterialId();
                    setZipFile();
                  }}
                />
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
        sbOpen={sbOpen}
        setSbOpen={setSbOpen}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
      />
    </Fragment>
  );
};

export default Task;
