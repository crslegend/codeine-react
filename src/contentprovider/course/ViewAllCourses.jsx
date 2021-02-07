import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import PageTitle from "../../components/PageTitle";

const useStyles = makeStyles((theme) => ({}));

const ViewAllCourses = () => {
  const classes = useStyles();

  return (
    <div>
      <PageTitle title="Your Courses" />
    </div>
  );
};

export default ViewAllCourses;
