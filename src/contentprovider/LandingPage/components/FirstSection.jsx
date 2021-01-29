import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import image1 from "../../../assets/first-section-img.png";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: theme.palette.primary.main,
    paddingTop: "65px",
    paddingRight: theme.spacing(5),
    paddingLeft: theme.spacing(15),
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "70px",
  },
  rightCol: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  typography: {
    color: "#fff",
    paddingBottom: "10px",
  },
  startButton: {
    width: 150,
    color: theme.palette.primary.main,
    backgroundColor: "#fff",
    fontWeight: 600,
    "&:hover": {
      backgroundColor: "#E3E3E3",
    },
  },
}));

const FirstSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.leftCol}>
        <Typography
          variant="h5"
          className={classes.typography}
          style={{ textTransform: "uppercase", fontWeight: 600 }}
        >
          Teach Online
        </Typography>
        <Typography
          variant="h1"
          className={classes.typography}
          style={{ fontWeight: 700 }}
        >
          Exceptional{" "}
          <span style={{ color: "#437FC7", backgroundColor: "#fff" }}>
            Opportunities
          </span>
        </Typography>
        <Typography
          variant="h5"
          className={classes.typography}
          style={{ paddingTop: "20px" }}
        >
          Create an online video course and earn money
          <br />
          teaching people around the world.
        </Typography>
        <Button className={classes.startButton} style={{ marginTop: "40px" }}>
          Start Now
        </Button>
      </div>
      <div className={classes.rightCol}>
        <img
          src={image1}
          alt="Exceptional Opportunities in Teaching"
          width="80%"
        />
      </div>
    </div>
  );
};

export default FirstSection;
