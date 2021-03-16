import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import CourseCard from "./components/CourseCard";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "60px",
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

const FeaturedCourses = () => {
  const classes = styles();
  const [courses, setCourses] = useState([]);

  const getFeaturedCourses = () => {
    Service.client
      .get(`/courses`)
      .then((res) => {
        res.data.results = res.data.results.slice(0, 3);
        setCourses(res.data.results);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getFeaturedCourses();
  }, []);

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            featured courses
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {courses &&
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
          </div>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default FeaturedCourses;
