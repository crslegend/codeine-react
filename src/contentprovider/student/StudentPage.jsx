import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  paper: {
    height: "calc(100vh - 115px)",
  },
}));

const StudentPage = () => {
  const classes = useStyles();

  return <div>Student Page</div>;
};

export default StudentPage;
