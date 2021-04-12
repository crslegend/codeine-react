import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import CourseCard from "./components/CourseCard";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "30px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "10px",
    marginBottom: "50px",
  },
  heading: {
    lineHeight: "50px",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
}));

const RecentCourses = () => {
  const classes = styles();
  const [courses, setCourses] = useState([]);

  const getRecentCourses = () => {
    Service.client
      .get(`/enrollments`)
      .then((res) => {
        res.data = res.data
          .filter((course) => course.course !== null)
          .slice(0, 4);
        setCourses(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getRecentCourses();
  }, []);

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            your recent courses
          </Typography>
          <div
            style={{
              display: "flex",
            }}
          >
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course.course} />
              ))
            ) : (
              <div
                style={{
                  height: "100px",
                  display: "grid",
                  margin: "0 auto",
                }}
              >
                <Typography
                  variant="h5"
                  style={{
                    fontFamily: "Roboto Mono",
                    margin: "15px auto",
                    color: "#9B9B9B",
                  }}
                >
                  You have not enrolled in any courses.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/Courses"
                  style={{
                    textTransform: "none",
                    margin: "0 auto",
                  }}
                >
                  <Typography variant="body2" style={{ color: "#fff" }}>
                    Start today!
                  </Typography>
                </Button>
              </div>
            )}
          </div>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default RecentCourses;
