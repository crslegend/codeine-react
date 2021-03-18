import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
import Service from "../../AxiosService";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Info } from "@material-ui/icons";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(5),
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  cardRoot: {
    width: "300px",
    padding: "10px 10px",
    marginTop: "30px",
    marginRight: "50px",
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
}));

const DashboardPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [courses, setCourses] = useState([]);
  const [overallData, setOverallData] = useState();

  const getConversionRate = () => {
    Service.client
      .get(`/analytics/course-conversion-rate`, { params: { days: 1 } })
      .then((res) => {
        console.log(res);
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
  };

  useEffect(() => {
    getConversionRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageTitle title="Dashboard" />
      <Paper className={classes.paper}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6" style={{ paddingRight: "5px" }}>
              Overall Views
            </Typography>
            <Tooltip
              title={
                <Typography variant="body2">
                  The total number of views across all of your courses
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
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6">Overall Conversion Rate</Typography>
            <Tooltip
              title={
                <Typography variant="body2">
                  % of total views across all of courses converted to new
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
                <span style={{ color: "#C74343" }}>{"< 1%"}</span>
              ) : (
                overallData.overall_conversion_rate.toFixed(4) + "%"
              ))}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6">Total Enrollments</Typography>
            <Tooltip
              title={
                <Typography variant="body2">
                  The total number of enrollments across all of your courses
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
      </Paper>
      <Grid container>
        {courses &&
          courses.length > 0 &&
          courses.map((course, index) => {
            return (
              <Grid item xs={4} key={index}>
                <Card elevation={0} className={classes.cardRoot}>
                  <CardActionArea
                    style={{ height: "100%" }}
                    onClick={() =>
                      history.push(
                        `/partner/home/dashboard/${course.course_id}`
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
                              <span style={{ color: "#C74343" }}>{"< 1%"}</span>
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

export default DashboardPage;
