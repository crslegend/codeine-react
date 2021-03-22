import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Info } from "@material-ui/icons";
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
    // marginRight: "30px",
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
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={coursesRanking && coursesRanking}
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
                  value={`Courses on Codeine`}
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
                  Keywords entered by the students and the respective occurences
                  when searching for courses on Codeine
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </TooltipMui>
          </div>
          <ResponsiveContainer width="100%" height={430}>
            <BarChart
              data={courseSearches && courseSearches}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword">
                <Label
                  value={`Keywords Entered by Members`}
                  position="bottom"
                  offset={5}
                  style={{ textAnchor: "middle" }}
                />
              </XAxis>
              <YAxis>
                <Label
                  value="Number of Occurences for that keyword"
                  position="left"
                  angle={-90}
                  offset={5}
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip />

              <Bar dataKey="Occurences" fill="#164D8F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Paper>
  );
};

export default CourseReport;
