import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Paper, Tooltip, Typography } from "@material-ui/core";
import { Info } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    minWidth: "70%",
    display: "flex",
    flexDirection: "column",
    // marginBottom: "30px",
    justifyContent: "center",
    // alignItems: "center",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    width: "200px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "5px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  tooltip: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: theme.spacing(1),
  },
}));

const FinalQuizAnalysis = ({ finalQuizPerformance, courseId }) => {
  const classes = useStyles();
  //   console.log(finalQuizPerformance);
  //   console.log(courseId);

  const [finalQuiz, setFinalQuiz] = useState();

  const loadFinalQuizForSelectedCourse = () => {
    // console.log(finalQuizPerformance);
    if (finalQuizPerformance) {
      for (
        let i = 0;
        i < finalQuizPerformance.breakdown_by_course.length;
        i++
      ) {
        if (
          finalQuizPerformance.breakdown_by_course[i].course_id === courseId
        ) {
          setFinalQuiz(finalQuizPerformance.breakdown_by_course[i]);
          break;
        }
      }
    }
  };
  // console.log(finalQuiz);

  useEffect(() => {
    loadFinalQuizForSelectedCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 600,
            paddingBottom: "20px",
            textAlign: "center",
          }}
        >
          Final Quiz Perfomance for The Course
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Overall Average Score</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    Overall average score in % of final quizzes attempted by
                    your students across all of your courses
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {finalQuiz &&
                (finalQuiz.average_score < 0.5 ? (
                  <span style={{ color: "#C74343" }}>{`${(
                    finalQuiz.average_score * 100
                  ).toFixed(1)}%`}</span>
                ) : (
                  (finalQuiz.average_score * 100).toFixed(1) + "%"
                ))}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Overall Passing Rate</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    Overall passing rate of final quizzes across all of your
                    courses
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {finalQuiz &&
                (finalQuiz.passing_rate < 0.5 ? (
                  <span style={{ color: "#C74343" }}>{`${(
                    finalQuiz.passing_rate * 100
                  ).toFixed(1)}%`}</span>
                ) : (
                  (finalQuiz.passing_rate * 100).toFixed(1) + "%"
                ))}
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default FinalQuizAnalysis;
