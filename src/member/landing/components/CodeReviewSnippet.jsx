import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    height: "20vh",
    marginTop: "3vh",
    borderRadius: 0,
  },
  snippets: {
    textAlign: "center",
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
        <Typography
          variant="h4"
          style={{
            fontWeight: "600",
          }}
        >
          Title of code review
        </Typography>
        <Typography variant="h5">Author</Typography>
      </CardContent>
    </Card>
  );
};

export default CodeReviewSnippet;
