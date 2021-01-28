import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: theme.palette.primary.main,
    paddingTop: "65px",
    paddingBottom: "65px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  typography: {
    color: "#fff",
    paddingBottom: "10px",
  },
  startButton: {
    width: 180,
    color: theme.palette.primary.main,
    backgroundColor: "#fff",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#E3E3E3",
    },
  },
}));

const FourthSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography
        variant="h1"
        className={classes.typography}
        style={{ fontWeight: 700 }}
      >
        Become a content provider today!
      </Typography>
      <Typography variant="h6" className={classes.typography}>
        Join our expanding online learning marketplace.
      </Typography>
      <Button className={classes.startButton} style={{ marginTop: "30px" }}>
        Get Started
      </Button>
    </div>
  );
};

export default FourthSection;
