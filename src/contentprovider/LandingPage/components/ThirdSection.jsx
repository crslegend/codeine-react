import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import image from "../../../assets/third-section-img.png";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    height: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(15),
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "70px",
    paddingRight: theme.spacing(2),
  },
  rightCol: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "50%",
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

const ThirdSection = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.leftCol}>
        <Typography
          variant="h6"
          className={classes.typography}
          style={{ textTransform: "uppercase" }}
        >
          Flexible and Rewarding
        </Typography>
        <Typography
          variant="h1"
          className={classes.typography}
          style={{ paddingTop: "40px", fontWeight: 600 }}
        >
          Earn money at home
        </Typography>
        <Typography
          variant="h5"
          className={classes.typography}
          style={{ paddingTop: "40px" }}
        >
          Earn money every time a student purchases your course.
          <br /> Get paid monthly through your bank account!
        </Typography>
      </div>
      <div className={classes.rightCol}>
        <img src={image} alt="Earn Money From Home" width="100%" />
      </div>
    </div>
  );
};

export default ThirdSection;
