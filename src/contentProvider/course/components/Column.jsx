import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Task from "./Task";
import { Assignment, Delete, DragIndicator, InsertDriveFile, Theaters } from "@material-ui/icons";
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
  Tooltip,
} from "@material-ui/core";
import validator from "validator";
import { DropzoneAreaBase } from "material-ui-dropzone";
import Toast from "../../../components/Toast";
import axios from "axios";

import Service from "../../../AxiosService";
import QuizCreationModel from "./QuizCreationModal";
import VideoCreationModal from "./VideoCreationModal";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: 8,
    border: "1px solid lightgrey",
    borderRadius: 2,
    width: 300,
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
    maxWidth: 200,
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
    marginTop: "5px",
    minHeight: "110px",
    "@global": {
      ".MuiDropzoneArea-root": {
        minHeight: "110px",
      },
    },
  },
  dropzoneText: {
    fontSize: "14px",
  },
}));

const Column = ({ column, tasks, index, courseId, getCourse, state, setQuestionBankModalOpen }) => {
  const classes = useStyles();
  // console.log(tasks);

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

  // eslint-disable-next-line no-unused-vars
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
  const [codeSnippetArr, setCodeSnippetArr] = useState([]);

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    passing_marks: 0,
    is_randomized: false,
    instructions: "",
  });
  const [questionGroups, setQuestionGroups] = useState([]);
  const [chapterIdForCouseMaterial, setChapterIdForCourseMaterial] = useState();

  const handleUpdateChapterDetails = (e) => {
    e.preventDefault();
    Service.client
      .put(`/courses/${courseId}/chapters/${column.id}`, editChapter)
      .then((res) => {
        // console.log(res);
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
        // console.log(res);
        setDeleteChapterId();
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const handleCreateCourseMaterial = () => {
    if (materialType === "video") {
      // check for empty fields
      if (video.title === "" || video.description === "" || video.video_url === "") {
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
      const videoObj = {
        ...video,
        video_code_snippets: codeSnippetArr,
      };
      Service.client
        .post(`/chapters/${chapterIdForCouseMaterial}/videos`, videoObj)
        .then((res) => {
          // console.log(res);
          setCourseMaterialDialog(false);
          setMaterialType();
          setChapterIdForCourseMaterial();
          setEditMode(false);
          setVideo({
            title: "",
            description: "",
            video_url: "",
          });
          setCodeSnippetArr([]);
          getCourse();
        })
        .catch((err) => console.log(err));
    } else if (materialType === "file") {
      if (file.title === "" || file.description === "" || (file.google_drive_url === "" && !zipFile)) {
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
          // console.log(res);
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
      // console.log(questionGroups)
      if (quiz.title === "" || quiz.description === "" || quiz.passing_marks === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Missing fields!",
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
          let quizId = res.data.quiz.id;

          axios
            .all(
              questionGroups.map((qg) => {
                return Service.client.put(`/quiz/${quizId}/question-groups`, qg).then((res) => console.log(res));
              })
            )
            .then((res) => {
              setCourseMaterialDialog(false);
              setMaterialType();
              setChapterIdForCourseMaterial();
              setEditMode(false);
              setQuiz({
                title: "",
                description: "",
                passing_marks: 0,
                is_randomized: false,
                instructions: "",
              });
              setQuestionGroups([]);
              getCourse();
            });
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
            <div className={classes.container} {...provided.draggableProps} ref={provided.innerRef}>
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
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "8px 0 16px",
                }}
              >
                <Typography variant="body2">Add Material:</Typography>
                <Tooltip title="File">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      setMaterialType("file");
                      setCourseMaterialDialog(true);
                      setChapterIdForCourseMaterial(column.id);
                    }}
                  >
                    <InsertDriveFile />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Video">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      setMaterialType("video");
                      setCourseMaterialDialog(true);
                      setChapterIdForCourseMaterial(column.id);
                    }}
                  >
                    <Theaters />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Quiz">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => {
                      setMaterialType("quiz");
                      setCourseMaterialDialog(true);
                      setChapterIdForCourseMaterial(column.id);
                    }}
                  >
                    <Assignment />
                  </IconButton>
                </Tooltip>
              </div>

              <Droppable droppableId={column.id} type="task">
                {(provided, snapshot) => {
                  return (
                    <div
                      className={classes.taskList}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        backgroundColor: snapshot.isDraggingOver ? "#e0e0e0" : "#fff",
                      }}
                    >
                      {tasks &&
                        tasks.map((task, index) => (
                          <Task
                            key={task.id}
                            task={task}
                            index={index}
                            getCourse={getCourse}
                            courseId={courseId}
                            setQuestionBankModalOpen={setQuestionBankModalOpen}
                          />
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
          setEditMode(false);
        }}
        PaperProps={{
          style: {
            minWidth: "600px",
          },
        }}
      >
        <form onSubmit={handleUpdateChapterDetails}>
          <DialogTitle>
            {column.title}
            <div style={{ float: "right" }}>
              {/* <IconButton size="small" onClick={() => setEditMode(true)}>
                <Edit />
              </IconButton> */}
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
              inputProps={{ style: { fontSize: "14px" } }}
              style={{ marginBottom: "20px" }}
              size="small"
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
              inputProps={{ style: { fontSize: "14px" } }}
              required
              multiline
              rows={8}
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
            <Button variant="contained" color="primary" className={classes.dialogButtons} type="submit">
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
          // setMaterialType();
          setChapterIdForCourseMaterial();
        }}
        PaperProps={{
          style: {
            minWidth: "600px",
            maxWidth: "none",
          },
        }}
      >
        <form onSubmit={handleCreateCourseMaterial}>
          <DialogTitle>Add Course Material</DialogTitle>
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
                      value={file && file.title}
                      onChange={(e) => {
                        setFile({
                          ...file,
                          title: e.target.value,
                        });
                      }}
                      required
                      inputProps={{ style: { fontSize: "14px" } }}
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
                      value={file && file.description}
                      onChange={(e) => {
                        setFile({
                          ...file,
                          description: e.target.value,
                        });
                      }}
                      inputProps={{ style: { fontSize: "14px" } }}
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
                      <Typography variant="body2">Upload File</Typography>
                    </label>
                    <DropzoneAreaBase
                      dropzoneText="Drag and drop a zip file or click&nbsp;here"
                      dropzoneParagraphClass={classes.dropzoneText}
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
                    <Typography variant="h6" style={{ textAlign: "center", marginTop: "10px" }}>
                      OR
                    </Typography>
                    <label htmlFor="url">
                      <Typography variant="body2">Add Link</Typography>
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
                      inputProps={{ style: { fontSize: "14px" } }}
                      required
                      placeholder="https://drive.google.com"
                      style={{ marginBottom: "15px" }}
                    />
                  </Fragment>
                );
              } else if (materialType === "video") {
                return (
                  <VideoCreationModal
                    video={video}
                    setVideo={setVideo}
                    codeSnippetArr={codeSnippetArr}
                    setCodeSnippetArr={setCodeSnippetArr}
                  />
                );
              } else if (materialType === "quiz") {
                return (
                  <QuizCreationModel
                    quiz={quiz}
                    setQuiz={setQuiz}
                    courseId={courseId}
                    closeDialog={() => {
                      setCourseMaterialDialog(false);
                      // setMaterialType();
                      setChapterIdForCourseMaterial();
                    }}
                    setQuestionBankModalOpen={setQuestionBankModalOpen}
                    questionGroups={questionGroups}
                    setQuestionGroups={setQuestionGroups}
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
                // setMaterialType();
                setChapterIdForCourseMaterial();
                setVideo({
                  title: "",
                  description: "",
                  video_url: "",
                });
                setCodeSnippetArr([]);
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
