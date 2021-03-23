import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Info, LooksOne, LooksTwo, Looks3 } from "@material-ui/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  numbers: {
    color: theme.palette.primary.main,
  },
  paper: {
    padding: theme.spacing(4),
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    marginBottom: "30px",
  },
  statsDiv: {
    display: "flex",
    flexDirection: "column",
    // border: "2px solid #e2e2e2",
    backgroundColor: "#eeeeee",
    padding: theme.spacing(2),
    borderRadius: "5px",
    width: "290px",
    justifyContent: "space-between",
  },
  result: {
    width: "100%",
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    border: "2px solid #e2e2e2",
    borderRadius: "5px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const CourseReport = ({
  firstCoursesRanking,
  coursesRanking,
  courseSearches,
}) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper className={classes.paper}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "10px" }}
        >
          Courses Report
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => history.push(`/admin/analytics/courses`)}
        >
          View More Course-Related Analysis
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            <Typography variant="h6">First-Enrollment Courses</Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Number of users who registered and enrolled in their
                  respective first courses
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </TooltipMui>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={firstCoursesRanking && firstCoursesRanking}
              margin={{
                top: 0,
                right: 30,
                left: 20,
                bottom: 25,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title">
                <Label
                  value={`First-Enrolled Courses on Codeine`}
                  position="bottom"
                  offset={5}
                  style={{ textAnchor: "middle" }}
                />
              </XAxis>
              <YAxis>
                <Label
                  value="Number of Enrollments"
                  position="left"
                  angle={-90}
                  offset={-10}
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip />

              <Bar dataKey="Enrollment" fill="#164D8F" />
            </BarChart>
          </ResponsiveContainer>
          <Divider
            style={{ marginTop: "20px", marginBottom: "10px", height: 2 }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            <Typography variant="h6">Popularity Ranking</Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Ranking of popularity of courses by number of enrollments
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </TooltipMui>
          </div>
          {coursesRanking && coursesRanking && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "flex-end",
                }}
              >
                <div className={classes.statsDiv} style={{ minHeight: 180 }}>
                  <div style={{ textAlign: "center" }}>
                    <LooksTwo
                      style={{
                        fontSize: 55,
                        color: "#A9A9A9",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      {coursesRanking[1] ? coursesRanking[1].title : "-"}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {coursesRanking[1] ? coursesRanking[1].Enrollment : "-"}
                    </Typography>
                  </div>
                </div>
                <div className={classes.statsDiv} style={{ minHeight: 220 }}>
                  <div style={{ textAlign: "center" }}>
                    <LooksOne
                      style={{
                        fontSize: 70,
                        color: "#d4af37",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      {coursesRanking[0] ? coursesRanking[0].title : "-"}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {coursesRanking[0] ? coursesRanking[0].Enrollment : "-"}
                    </Typography>
                  </div>
                </div>
                <div className={classes.statsDiv} style={{ minHeight: 180 }}>
                  <div style={{ textAlign: "center" }}>
                    <Looks3
                      style={{
                        fontSize: 55,
                        color: "#cd7f32",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      {coursesRanking[2] ? coursesRanking[2].title : "-"}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {coursesRanking[2] ? coursesRanking[2].Enrollment : "-"}
                    </Typography>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "30px" }}>
                {coursesRanking.length > 0 &&
                  coursesRanking.map((course, index) => {
                    if (index === 0) {
                      return (
                        <div className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              color: "#d4af37",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #1
                          </Typography>

                          <Typography variant="h6">{course.title}</Typography>
                          <Typography variant="h6">
                            Occurence: {course.Enrollment}
                          </Typography>
                        </div>
                      );
                    } else if (index === 1) {
                      return (
                        <div className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              color: "#A9A9A9",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #2
                          </Typography>

                          <Typography variant="h6">{course.title}</Typography>
                          <Typography variant="h6">
                            Occurence: {course.Enrollment}
                          </Typography>
                        </div>
                      );
                    } else if (index === 2) {
                      return (
                        <div className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              color: "#cd7f32",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #3
                          </Typography>

                          <Typography variant="h6">{course.title}</Typography>
                          <Typography variant="h6">
                            Occurence: {course.Enrollment}
                          </Typography>
                        </div>
                      );
                    } else {
                      return (
                        <div className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #{index + 1}
                          </Typography>

                          <Typography variant="h6">{course.title}</Typography>
                          <Typography variant="h6">
                            Occurence: {course.Enrollment}
                          </Typography>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          )}
          <Divider
            style={{ marginTop: "20px", marginBottom: "10px", height: 2 }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            <Typography variant="h6">Course Searches</Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Keywords entered by the students when searching for courses on
                  Codeine and the respective occurences
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </TooltipMui>
          </div>
          {courseSearches && courseSearches && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "flex-end",
                }}
              >
                <div className={classes.statsDiv} style={{ minHeight: 130 }}>
                  <div style={{ textAlign: "center" }}>
                    <LooksTwo
                      style={{
                        fontSize: 55,
                        color: "#A9A9A9",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Keywords:{" "}
                      {courseSearches[1] ? courseSearches[1].keyword : "-"}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {courseSearches[1] ? courseSearches[1].Occurences : "-"}
                    </Typography>
                  </div>
                </div>
                <div className={classes.statsDiv} style={{ minHeight: 150 }}>
                  <div style={{ textAlign: "center" }}>
                    <LooksOne
                      style={{
                        fontSize: 70,
                        color: "#d4af37",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Keywords:{" "}
                      {courseSearches[0] ? courseSearches[0].keyword : "-"}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {courseSearches[0] ? courseSearches[0].Occurences : "-"}
                    </Typography>
                  </div>
                </div>
                <div className={classes.statsDiv} style={{ minHeight: 130 }}>
                  <div style={{ textAlign: "center" }}>
                    <Looks3
                      style={{
                        fontSize: 55,
                        color: "#cd7f32",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Keywords:{" "}
                      {courseSearches[2] ? courseSearches[2].keyword : "-"}
                    </Typography>
                    <Typography variant="h6" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {courseSearches[2] ? courseSearches[2].Occurences : "-"}
                    </Typography>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "30px" }}>
                {courseSearches.length > 0 &&
                  courseSearches.map((result, index) => {
                    if (index === 0) {
                      return (
                        <div className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              color: "#d4af37",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #1
                          </Typography>

                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    } else if (index === 1) {
                      return (
                        <div className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              color: "#A9A9A9",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #2
                          </Typography>
                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    } else if (index === 2) {
                      return (
                        <div className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{ color: "#cd7f32", fontWeight: 600 }}
                          >
                            #3
                          </Typography>
                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    } else {
                      return (
                        <div className={classes.result}>
                          <Typography variant="h3" style={{ fontWeight: 600 }}>
                            #{index + 1}
                          </Typography>
                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default CourseReport;
