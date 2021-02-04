import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    width: "6vw",
    height: "5vh",
    marginTop: "0.5vh",
    [theme.breakpoints.down("md")]: {
      height: "5.5vh",
      width: "8vw",
    },
    [theme.breakpoints.down("sm")]: {
      width: "18vw",
    },
  },
}));

const CodeReviewLabel = (props) => {
  const classes = styles();
  const { color, label } = props;

  return (
    <Card
      style={{
        backgroundColor: `${color}`,
      }}
      className={classes.root}
    >
      <CardContent>
        <Typography
          variant="body1"
          style={{
            lineHeight: "13px",
            textAlign: "center",
            color: "#FFFFFF",
          }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CodeReviewLabel;
