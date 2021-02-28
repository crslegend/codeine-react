import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    width: "80%",
    height: "20vh",
    marginTop: "6vh",
    borderRadius: 0,
    backgroundColor: "#000000",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  snippets: {
    textAlign: "center",
    color: "#FFFFFF",
    lineHeight: "50px",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",
  },
}));

const CodeReviewSnippet = (props) => {
  const classes = styles();
  const { code } = props;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h6" className={classes.snippets}>
          {code}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CodeReviewSnippet;
