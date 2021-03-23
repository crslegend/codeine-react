import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Help } from "@material-ui/icons";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { ToggleButton } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 450,
  },
  insideDrawer: {
    display: "flex",
    flexDirection: "column",
    paddingTop: theme.spacing(5),
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    minHeight: "100vh",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  languageButtons: {
    width: 80,
    marginRight: "15px",
    height: 30,
  },
  categoryButtons: {
    marginBottom: "10px",
    height: 30,
  },
  textarea: {
    resize: "both",
  },
}));

const CourseDetailsDrawer = ({
  drawerOpen,
  setDrawerOpen,
  coursePicAvatar,
  setCoursePicAvatar,
  courseDetails,
  setCourseDetails,
  languages,
  setLanguages,
  categories,
  setCategories,
  handleSaveCourseDetails,
  drawerPageNum,
  setDrawerPageNum,
  codeLanguage,
  setCodeLanguage,
  courseId,
  setSbOpen,
  setSnackbar,
}) => {
  const classes = useStyles();

  const [coursePicDialog, setCoursePicDialog] = useState(false);
  const [coursePic, setCoursePic] = useState();

  console.log(courseDetails);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(false);
    setDrawerPageNum(1);
  };

  const handleNextPage = () => {
    if (!coursePicAvatar) {
      setSbOpen(true);
      setSnackbar({
        message: "Please give a picture for your course!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (
      courseDetails.title === "" ||
      courseDetails.description === "" ||
      courseDetails.learning_objectives.length === 0 ||
      courseDetails.requirements.length === 0
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter required fields!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    setDrawerPageNum(2);
  };

  const drawerPage1 = (
    <Fragment>
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <IconButton onClick={() => setCoursePicDialog(true)}>
          {coursePicAvatar ? (
            <Avatar className={classes.avatar} src={coursePicAvatar[0].data} />
          ) : (
            <Avatar className={classes.avatar} style={{ padding: "10px" }}>
              Upload Course Logo
            </Avatar>
          )}
        </IconButton>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="title">
          <Typography variant="body2">Course Title (Required)</Typography>
        </label>
        <TextField
          id="title"
          variant="outlined"
          placeholder="Enter course title"
          margin="dense"
          fullWidth
          value={courseDetails && courseDetails.title}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              title: e.target.value,
            })
          }
          required
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="description">
          <Typography variant="body2">Course Description (Required)</Typography>
        </label>
        <TextField
          id="description"
          variant="outlined"
          placeholder="Enter course description"
          margin="dense"
          fullWidth
          multiline
          rows={4}
          inputProps={{ className: classes.textarea }}
          value={courseDetails && courseDetails.description}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              description: e.target.value,
            })
          }
          required
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="requirements">
            <Typography variant="body2" style={{ marginRight: "5px" }}>
              Course Requirements (Required)
            </Typography>
          </label>
          <Tooltip
            title={
              <Typography variant="body2">
                Separate the requirements with commas (eg. NodeJS,HTML,CSS)
              </Typography>
            }
          >
            <IconButton disableRipple size="small">
              <Help fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </div>
        <TextField
          id="requirements"
          variant="outlined"
          placeholder="eg. Node.JS,Java EE"
          margin="dense"
          fullWidth
          value={courseDetails && courseDetails.requirements}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              requirements: e.target.value,
            })
          }
          required
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="requirements">
            <Typography variant="body2" style={{ marginRight: "5px" }}>
              Course Learning Objectives (Required)
            </Typography>
          </label>
          <Tooltip
            title={
              <Typography variant="body2">
                Separate the objectives with commas (eg. to gain knowledge,to
                make use of)
              </Typography>
            }
          >
            <IconButton disableRipple size="small">
              <Help fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </div>
        <TextField
          id="objectives"
          variant="outlined"
          placeholder="Enter learning objectives"
          margin="dense"
          fullWidth
          multiline
          rows={4}
          inputProps={{ className: classes.textarea }}
          value={courseDetails && courseDetails.learning_objectives}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              learning_objectives: e.target.value,
            })
          }
          required
        />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          onClick={() => handleNextPage()}
        >
          Next
        </Button>
      </div>
    </Fragment>
  );

  const drawerPage2 = (
    <Fragment>
      <div style={{ marginBottom: "30px" }}>
        <Typography variant="body2" style={{ paddingBottom: "10px" }}>
          Course Language (Choost at least 1)
        </Typography>
        <div>
          <ToggleButton
            value=""
            size="small"
            selected={languages && languages.ENG}
            onChange={() => {
              setLanguages({ ...languages, ENG: !languages.ENG });
            }}
            className={classes.languageButtons}
          >
            English
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={languages && languages.MAN}
            onChange={() => {
              setLanguages({ ...languages, MAN: !languages.MAN });
            }}
            className={classes.languageButtons}
          >
            中文
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={languages && languages.FRE}
            onChange={() => {
              setLanguages({ ...languages, FRE: !languages.FRE });
            }}
            className={classes.languageButtons}
          >
            français
          </ToggleButton>
        </div>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Typography variant="body2" style={{ paddingBottom: "10px" }}>
          Category (Choost at least 1)
        </Typography>
        <div>
          <ToggleButton
            value=""
            size="small"
            selected={categories && categories.SEC}
            onChange={() => {
              setCategories({ ...categories, SEC: !categories.SEC });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Security
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={categories && categories.DB}
            onChange={() => {
              setCategories({ ...categories, DB: !categories.DB });
            }}
            className={`${classes.categoryButtons}`}
          >
            Database Administration
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={categories && categories.FE}
            onChange={() => {
              setCategories({ ...categories, FE: !categories.FE });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Frontend
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={categories && categories.BE}
            onChange={() => {
              setCategories({ ...categories, BE: !categories.BE });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Backend
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={categories && categories.UI}
            onChange={() => {
              setCategories({ ...categories, UI: !categories.UI });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            UI/UX
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={categories && categories.ML}
            onChange={() => {
              setCategories({ ...categories, ML: !categories.ML });
            }}
            className={`${classes.categoryButtons}`}
          >
            Machine Learning
          </ToggleButton>
        </div>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Typography variant="body2" style={{ paddingBottom: "10px" }}>
          Coding Language/Framework (Choost at least 1)
        </Typography>
        <div>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.PY}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, PY: !codeLanguage.PY });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Python
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.JAVA}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, JAVA: !codeLanguage.JAVA });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Java
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.JS}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, JS: !codeLanguage.JS });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Javascript
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.CPP}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, CPP: !codeLanguage.CPP });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            C++
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.CS}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, CS: !codeLanguage.CS });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            C#
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.HTML}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, HTML: !codeLanguage.HTML });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            HTML
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.CSS}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, CSS: !codeLanguage.CSS });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            CSS
          </ToggleButton>
          <ToggleButton
            value=""
            size="small"
            selected={codeLanguage && codeLanguage.RUBY}
            onChange={() => {
              setCodeLanguage({ ...codeLanguage, RUBY: !codeLanguage.RUBY });
            }}
            className={`${classes.languageButtons} ${classes.categoryButtons}`}
          >
            Ruby
          </ToggleButton>
        </div>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="preview">
          <Typography variant="body2">
            Introduction Preview Video URL (Required)
          </Typography>
        </label>
        <TextField
          id="preview"
          variant="outlined"
          margin="dense"
          fullWidth
          placeholder="eg. URL of video hosted on youtube"
          value={courseDetails && courseDetails.introduction_video_url}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              introduction_video_url: e.target.value,
            })
          }
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <label htmlFor="github_repo">
            <Typography variant="body2">Github Repository URL</Typography>
          </label>
          <Tooltip
            title={
              <Typography variant="body2">
                The repository URL will be used for the integrated coding
                environment.
              </Typography>
            }
          >
            <IconButton disableRipple size="small">
              <Help fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </div>

        <TextField
          id="github_repo"
          variant="outlined"
          margin="dense"
          fullWidth
          placeholder="eg. URL of github repository"
          value={courseDetails && courseDetails.github_repo}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              github_repo: e.target.value,
            })
          }
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="points">
          <Typography variant="body2">Experience Points</Typography>
        </label>
        <TextField
          id="points"
          variant="outlined"
          margin="dense"
          fullWidth
          type="number"
          InputProps={{
            inputProps: { min: 0 },
          }}
          value={courseDetails && courseDetails.exp_points}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              exp_points: e.target.value,
            })
          }
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="duration">
          <Typography variant="body2">Course Duration (in hours)</Typography>
        </label>
        <TextField
          id="duration"
          variant="outlined"
          margin="dense"
          fullWidth
          type="number"
          InputProps={{
            inputProps: { min: 0 },
          }}
          value={courseDetails && courseDetails.duration}
          onChange={(e) =>
            setCourseDetails({
              ...courseDetails,
              duration: e.target.value,
            })
          }
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={courseDetails && courseDetails.pro}
              onChange={() =>
                setCourseDetails({
                  ...courseDetails,
                  pro: !courseDetails.pro,
                })
              }
            />
          }
          label="Course For Pro Members Only"
          labelPlacement="start"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingBottom: "20px",
        }}
      >
        <Button variant="contained" onClick={() => setDrawerPageNum(1)}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSaveCourseDetails()}
        >
          Save
        </Button>
      </div>
    </Fragment>
  );
  // console.log(courseDetails);
  return (
    <Fragment>
      <div>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer(false)}
          classes={{ paper: classes.drawer }}
        >
          <div className={classes.insideDrawer}>
            {drawerPageNum && drawerPageNum === 1 ? drawerPage1 : drawerPage2}
          </div>
        </Drawer>
      </div>

      <Dialog
        disableEscapeKeyDown
        open={coursePicDialog}
        onClose={() => setCoursePicDialog(false)}
        PaperProps={{
          style: {
            minWidth: "400px",
            maxWidth: "400px",
          },
        }}
      >
        <DialogContent>
          <DropzoneAreaBase
            dropzoneText="Drag and drop an image or click here&nbsp;"
            acceptedFiles={["image/*"]}
            filesLimit={1}
            maxFileSize={5000000}
            fileObjects={coursePic}
            onAdd={(newPhoto) => {
              // console.log("onAdd", newPhoto);
              setCoursePic(newPhoto);
              // setValidatePhoto(false);
            }}
            onDelete={(deletePhotoObj) => {
              // console.log("onDelete", deletePhotoObj);
              setCoursePic();
            }}
            previewGridProps={{
              item: {
                xs: "auto",
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setCoursePic();
              setCoursePicDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCoursePicAvatar(coursePic && coursePic);
              setCoursePic();
              setCoursePicDialog(false);
            }}
            disabled={!coursePic}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CourseDetailsDrawer;
