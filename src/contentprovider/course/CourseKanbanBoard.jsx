import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import { Edit, Folder } from "@material-ui/icons";
import { DropzoneAreaBase } from "material-ui-dropzone";

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: 450,
  },
  insideDrawer: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(7),
    minHeight: "100vh",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
}));

const CourseKanbanBoard = () => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerPageNum, setDrawerPageNum] = useState(1);

  const [coursePicDialog, setCoursePicDialog] = useState(false);
  const [coursePic, setCoursePic] = useState();
  const [coursePicAvatar, setCoursePicAvatar] = useState();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(false);
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
            <Avatar className={classes.avatar}>
              <Folder fontSize="large" />
            </Avatar>
          )}
        </IconButton>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="title">
          <Typography variant="body2">Course Title</Typography>
        </label>
        <TextField
          id="title"
          variant="outlined"
          placeholder="Enter course title"
          margin="dense"
          fullWidth
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="description">
          <Typography variant="body2">Course Description</Typography>
        </label>
        <TextField
          id="description"
          variant="outlined"
          placeholder="Enter course description"
          margin="dense"
          fullWidth
          multiline
          rows={2}
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="requirements">
          <Typography variant="body2">Course Requirements</Typography>
        </label>
        <TextField
          id="requirements"
          variant="outlined"
          placeholder="eg. Node.JS, Java EE"
          margin="dense"
          fullWidth
        />
      </div>
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="objectives">
          <Typography variant="body2">Course Learning Objectives</Typography>
        </label>
        <TextField
          id="objectives"
          variant="outlined"
          placeholder="Enter learning objectives"
          margin="dense"
          fullWidth
          multiline
          rows={2}
        />
      </div>
      <div>
        <Button
          variant="contained"
          color="primary"
          style={{ float: "right" }}
          onClick={() => setDrawerPageNum(2)}
        >
          Next
        </Button>
      </div>
    </Fragment>
  );

  const drawerPage2 = (
    <Fragment>
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
        />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={() => setDrawerPageNum(1)}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          // onClick={() => setDrawerPageNum(2)}
        >
          Update
        </Button>
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      <div>
        <Button startIcon={<Edit />} onClick={() => setDrawerOpen(true)}>
          Edit Course Details
        </Button>
      </div>
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
              console.log("onDelete", deletePhotoObj);
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
              setCoursePic(coursePicAvatar);
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
              setCoursePicDialog(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default CourseKanbanBoard;
