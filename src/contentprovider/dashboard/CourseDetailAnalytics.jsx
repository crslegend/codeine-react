import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Service from "../../AxiosService";
import { useParams } from "react-router";
import PageTitle from "../../components/PageTitle";
import { Avatar, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
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
    flexDirection: "column",
    // alignItems: "center",
    // marginBottom: "5px",
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    width: "200px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "7px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const CourseDetailAnalytics = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [overallData, setOverallData] = useState();
  const [courseDetail, setCourseDetail] = useState();
  const [coursePic, setCoursePic] = useState();
  const [timeTakenCourse, setTimeTakenCourse] = useState();
  const [timeTakenCourseMaterial, setTimeTakenCourseMaterial] = useState();

  const formatSecondsToHours = (time) => {
    let newTime = time / 3600;

    if (newTime.toString().length >= 5) {
      return newTime.toFixed(5);
    } else if (newTime.toString.length <= 3) {
      return newTime.toFixed(3);
    } else {
      return newTime.toFixed(newTime.toString.length);
    }
  };

  const getConversionRate = () => {
    Service.client
      .get(`/analytics/course-conversion-rate`)
      .then((res) => {
        console.log(res);
        // let arr = res.data.breakdown;
        for (let i = 0; i < res.data.breakdown.length; i++) {
          if (res.data.breakdown[i].course_id === id) {
            setOverallData(res.data.breakdown[i]);
            break;
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const getTimeTakenCourseMaterial = () => {
    Service.client
      .get(`/analytics/course-material-time`, {
        params: { course_id: id },
      })
      .then((res) => {
        console.log(res);
        setCoursePic(res.data.course_image);
        setTimeTakenCourseMaterial(res.data.chapters);
      })
      .catch((err) => console.log(err));
  };

  const getTimeTakenCourse = () => {
    Service.client
      .get(`/analytics/course-time`, {
        params: { course_id: id },
      })
      .then((res) => {
        console.log(res);
        setTimeTakenCourse(res.data.average_time_taken);
        setCourseDetail({
          course_title: res.data.course_title,
          description: res.data.description,
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getConversionRate();
    getTimeTakenCourseMaterial();
    getTimeTakenCourse();
  }, []);

  return (
    <div>
      <PageTitle title="Course Analysis" />

      <Paper className={classes.paper}>
        <div style={{ display: "flex" }}>
          <Avatar className={classes.avatar} src={coursePic && coursePic} />
          <div style={{ marginLeft: "20px" }}>
            <Typography
              variant="h5"
              style={{ fontWeight: 600, paddingBottom: "10px" }}
            >
              {courseDetail && courseDetail.course_title}
            </Typography>
            <Typography variant="body2">
              {courseDetail && courseDetail.description}
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Number of Views
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.view_count}
            </Typography>
          </div>
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Number of Enrollments
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.enrollment_count}
            </Typography>
          </div>
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Conversion Rate
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {overallData &&
                (overallData.conversion_rate === 0 ? (
                  <span style={{ color: "#C74343" }}>{"0%"}</span>
                ) : overallData.conversion_rate < 1 ? (
                  <span style={{ color: "#C74343" }}>{"< 1%"}</span>
                ) : (
                  overallData.conversion_rate.toFixed(4) + "%"
                ))}
            </Typography>
          </div>
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Average Time Taken
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {timeTakenCourse && formatSecondsToHours(timeTakenCourse) + `hrs`}
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default CourseDetailAnalytics;
