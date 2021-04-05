import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    width: "100%",
    height: "80vh",
    position: "sticky",
    top: 65,
    left: 0,
  },
}));

const CommentSection = () => {
  const classes = useStyles();
  return <Card className={classes.cardRoot}>Comments</Card>;
};

export default CommentSection;
