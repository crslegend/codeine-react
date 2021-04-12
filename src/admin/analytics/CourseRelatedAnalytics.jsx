import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Service from "../../AxiosService";
import {
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { ArrowBack, Info } from "@material-ui/icons";
import { useHistory } from "react-router";
// import LinkMui from "@material-ui/core/Link";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
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
  numbers: {
    color: theme.palette.primary.main,
  },
  cardRoot: {
    width: "270px",
    padding: "10px 10px",
    border: "1px solid",
    borderRadius: 0,
    height: "100%",
  },
  individualStats: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: "5px",
  },
  formControl: {
    marginTop: "15px",
    marginBottom: "10px",
    width: "200px",
  },
  statsDiv: {
    display: "flex",
    flexDirection: "column",
    // border: "2px solid #e2e2e2",
    backgroundColor: "#eeeeee",
    padding: theme.spacing(2),
    borderRadius: "5px",
    marginRight: "30px",
  },
}));

const CourseRelatedAnalytics = () => {
  const classes = useStyles();
  const history = useHistory();

  const [courses, setCourses] = useState([]);
  const [overallData, setOverallData] = useState();
  const [finalQuizPerformance, setFinalQuizPerformance] = useState();
  const [numDays, setNumDays] = useState(7);

  const getConversionRate = () => {
    if (numDays && numDays !== "") {
      Service.client
        .get(`/analytics/course-conversion-rate`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
          // let arr = res.data.breakdown;
          setCourses(res.data.breakdown);
          setOverallData({
            enrollments: res.data.enrollments,
            overall_conversion_rate: res.data.overall_conversion_rate,
            overall_view: res.data.overall_view,
            total_enrollments: res.data.total_enrollments,
          });
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/analytics/course-conversion-rate`)
        .then((res) => {
          //   console.log(res);
          // let arr = res.data.breakdown;
          setCourses(res.data.breakdown);
          setOverallData({
            enrollments: res.data.enrollments,
            overall_conversion_rate: res.data.overall_conversion_rate,
            overall_view: res.data.overall_view,
            total_enrollments: res.data.total_enrollments,
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const getOverallAnalytics = async () => {
    // get conversion rates
    getConversionRate();

    // get final quiz performance for course
    Service.client
      .get(`/analytics/course-assessment-performance`)
      .then((res) => {
        // console.log(res);
        setFinalQuizPerformance(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getOverallAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getConversionRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <IconButton
          onClick={() =>
            history.push({ pathname: `/admin/analytics`, state: { tab: 2 } })
          }
          style={{ marginRight: "20px" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">Course-Related Analytics</Typography>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "auto",
        }}
      >
        <Typography variant="h6" style={{ paddingRight: "15px" }}>
          View By
        </Typography>
        <FormControl
          margin="dense"
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Date Range</InputLabel>
          <Select
            label="Date Range"
            value={numDays ? numDays : ""}
            onChange={(e) => {
              setNumDays(e.target.value);
            }}
            style={{ backgroundColor: "#fff" }}
          >
            <MenuItem value="">
              <em>Select a date range</em>
            </MenuItem>
            <MenuItem value="7">Past Week</MenuItem>
            <MenuItem value="14">Past 2 Weeks</MenuItem>
            <MenuItem value="30">Past Month</MenuItem>
            <MenuItem value="90">Past 3 Months</MenuItem>
            <MenuItem value="240">Past 6 Months</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "10px" }}
        >
          Enrollment and Conversion Statistics
        </Typography>
        <div style={{ display: "flex" }}>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                Overall Views
              </Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    The total number of views across all courses on Codeine
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.overall_view}
            </Typography>
          </div>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Overall Conversion Rate</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    % of total views across all of your courses converted to new
                    enrollments
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {overallData &&
                (overallData.overall_conversion_rate === 0 ? (
                  <span style={{ color: "#C74343" }}>{"0%"}</span>
                ) : overallData.overall_conversion_rate < 1 ? (
                  <span style={{ color: "#C74343" }}>{"<1%"}</span>
                ) : (
                  overallData.overall_conversion_rate.toFixed(4) + "%"
                ))}
            </Typography>
          </div>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Total Enrollments</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    The total number of enrollments across all courses on
                    Codeine
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {`${overallData && overallData.total_enrollments}`}
            </Typography>
          </div>
        </div>
        <Typography
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "10px", paddingTop: "20px" }}
        >
          Final Quizzes Performance
        </Typography>
        <div style={{ display: "flex" }}>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Overall Average Score</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    Overall average score in % of final quizzes attempted by
                    members across all courses on Codeine
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {finalQuizPerformance &&
                (finalQuizPerformance.overall_average_score < 0.5 ? (
                  <span style={{ color: "#C74343" }}>{`${(
                    finalQuizPerformance.overall_average_score * 100
                  ).toFixed(1)}%`}</span>
                ) : (
                  (finalQuizPerformance.overall_average_score * 100).toFixed(
                    1
                  ) + "%"
                ))}
            </Typography>
          </div>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Overall Passing Rate</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    Overall passing rate of final quizzes across all courses on
                    Codeine
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {finalQuizPerformance &&
                (finalQuizPerformance.overall_passing_rate < 0.5 ? (
                  <span style={{ color: "#C74343" }}>{`${(
                    finalQuizPerformance.overall_passing_rate * 100
                  ).toFixed(1)}%`}</span>
                ) : (
                  (finalQuizPerformance.overall_passing_rate * 100).toFixed(1) +
                  "%"
                ))}
            </Typography>
          </div>
        </div>
      </Paper>
      <Typography
        variant="h6"
        style={{ fontWeight: 600, paddingBottom: "20px" }}
      >
        Courses
      </Typography>
      <Grid container style={{ marginBottom: "25px" }}>
        {courses &&
          courses.length > 0 &&
          courses.map((course, index) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                style={{ marginBottom: "30px" }}
              >
                <Card elevation={0} className={classes.cardRoot}>
                  <CardActionArea
                    style={{ height: "100%" }}
                    onClick={() =>
                      history.push(
                        `/admin/analytics/courses/${course.course_id}`
                      )
                    }
                  >
                    <CardContent
                      style={{
                        height: "inherit",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                          paddingBottom: "10px",
                        }}
                        variant="h6"
                      >
                        {course.title}
                      </Typography>
                      <div>
                        <div className={classes.individualStats}>
                          <Typography
                            variant="body2"
                            style={{ paddingRight: "10px" }}
                          >
                            Number of Views
                          </Typography>
                          <Typography variant="h4" className={classes.numbers}>
                            {course.view_count}
                          </Typography>
                        </div>
                        <div className={classes.individualStats}>
                          <Typography
                            variant="body2"
                            style={{ paddingRight: "10px" }}
                          >
                            Number of Enrollments
                          </Typography>
                          <Typography variant="h4" className={classes.numbers}>
                            {course.enrollment_count}
                          </Typography>
                        </div>
                        <div className={classes.individualStats}>
                          <Typography
                            variant="body2"
                            style={{ paddingRight: "10px" }}
                          >
                            Conversion Rate
                          </Typography>
                          <Typography variant="h4" className={classes.numbers}>
                            {course.conversion_rate === 0 ? (
                              <span style={{ color: "#C74343" }}>{"0%"}</span>
                            ) : course.conversion_rate < 1 ? (
                              <span style={{ color: "#C74343" }}>{"<1%"}</span>
                            ) : (
                              course.conversion_rate.toFixed(4) + "%"
                            )}
                          </Typography>
                        </div>
                      </div>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default CourseRelatedAnalytics;
