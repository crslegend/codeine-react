import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import CourseDetailsDrawer from "./components/CourseDetailsDrawer";

const useStyles = makeStyles((theme) => ({}));

const CourseCreation = () => {
  const classes = useStyles();

  const [drawerOpen, setDrawerOpen] = useState(true);

  const [coursePicAvatar, setCoursePicAvatar] = useState();

  return (
    <Fragment>
      <div>
        <Button startIcon={<Edit />} onClick={() => setDrawerOpen(true)}>
          Edit Course Details
        </Button>
      </div>
      <CourseDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        coursePicAvatar={coursePicAvatar}
        setCoursePicAvatar={setCoursePicAvatar}
      />
    </Fragment>
  );
};

export default CourseCreation;
