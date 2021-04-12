import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import image from "../../../assets/SecondSection.png";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    paddingTop: "50px",
    paddingRight: theme.spacing(5),
  },
  leftCol: {
    display: "flex",
    flexDirection: "row",
    width: "80%",
    // justifyContent: "center",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "30px",
  },
  typography: {
    color: "#000",
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

const SecondSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.leftCol}>
        <img
          src={image}
          alt="growing selection of in-demand courses"
          width="80%"
        />
      </div>
      <div className={classes.rightCol}>
        <Typography
          variant="h6"
          className={classes.typography}
          style={{ textTransform: "uppercase" }}
        >
          Global Impact
        </Typography>
        <Typography
          variant="h1"
          className={classes.typography}
          style={{ paddingTop: "40px", fontWeight: 600 }}
        >
          Join our growing selection of in-demand courses
        </Typography>
        <Typography
          variant="h5"
          className={classes.typography}
          style={{ paddingTop: "40px" }}
        >
          Help people learn new skills, advance their careers, and
          <br /> explore their hobbies by sharing your knowledge.
        </Typography>
      </div>
    </div>
  );
};

export default SecondSection;
