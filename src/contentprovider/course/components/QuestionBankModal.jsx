import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  mainContainer: {
    display: "flex",
    minWidth: "800px",
    margin: "16px 0 8px",
  },
  leftContainer: {
    width: "35%",
  },
  rightContainer: {
    width: "65%",
  },
}));

const QuestionBankModal = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">Question Bank</Typography>
      <div className={classes.mainContainer}>
        <div className={classes.leftContainer}>Left</div>
        <div className={classes.rightContainer}>Right</div>
      </div>
    </div>
  );
};

export default QuestionBankModal;
