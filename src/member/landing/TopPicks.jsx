import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Typography, Grid, Tabs, Tab, Box, Divider } from "@material-ui/core";
import CourseCard from "./components/CourseCard";
import ArticleCard from "./components/ArticleCard";
import ProjectCard from "./components/ProjectCard";
import CodeReviewCard from "./components/CodeReviewCard";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "60px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "40px",
  },
  heading: {
    lineHeight: "50px",
    paddingBottom: "30px",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TopPicks = () => {
  const classes = styles();

  // Tabs variable
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [courses, setCourses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [codeReviews, setCodeReviews] = useState([]);
  const [articles, setArticles] = useState([]);

  const getTopCourses = () => {
    Service.client
      .get(`/courses`, {
        params: { sortRating: "-rating" },
      })
      .then((res) => {
        res.data.results = res.data.results.slice(0, 4);
        setCourses(res.data.results);
      })
      .catch((err) => console.log(err));
  };

  const getTopProjects = () => {
    // Service.client
    //   .get(`/industry-projects`, {
    //     params: { isAvailable: "true" },
    //   })
    //   .then((res) => {
    //     res.data = res.data.slice(0, 3);
    //     setProjects(res.data);
    //   })
    //   .catch((err) => console.log(err));
  };

  const getTopCodeReviews = () => {
    Service.client
      .get(`/code-reviews`)
      .then((res) => {
        res.data = res.data.slice(0, 4);
        setCodeReviews(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getTopArticles = () => {
    Service.client
      .get(`/articles`)
      .then((res) => {
        res.data = res.data.slice(0, 3);
        setArticles(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTopCourses();
    getTopProjects();
    getTopCodeReviews();
    getTopArticles();
  }, []);

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            our top picks for you
          </Typography>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="simple tabs example"
            classes={{
              root: classes.tabs,
            }}
          >
            <Tab
              style={{
                fontSize: 20,
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="courses"
              {...a11yProps(0)}
            />
            <Tab
              style={{
                fontSize: 20,
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="code reviews"
              {...a11yProps(1)}
            />
            <Tab
              style={{
                fontSize: 20,
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="articles"
              {...a11yProps(2)}
            />
            <Tab
              style={{
                fontSize: 20,
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="industry projects"
              {...a11yProps(3)}
            />
          </Tabs>
          <Divider
            style={{
              height: "1px",
              backgroundColor: "#000000",
              width: "100%",
            }}
          />
          {/* Courses Tab */}
          <TabPanel value={value} index={0}>
            <div
              style={{
                display: "flex",
              }}
            >
              {courses &&
                courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
            </div>
          </TabPanel>
          {/* Code Reviews Tab */}
          <TabPanel value={value} index={1}>
            <div
              style={{
                display: "flex",
              }}
            >
              {codeReviews &&
                codeReviews.map((codeReview) => (
                  <CodeReviewCard key={codeReview.id} codeReview={codeReview} />
                ))}
            </div>
          </TabPanel>
          {/* Articles Tab */}
          <TabPanel value={value} index={2}>
            <div>
              {articles &&
                articles.map((article, index) => (
                  <ArticleCard
                    key={article.id}
                    index={index}
                    article={article}
                  />
                ))}
            </div>
          </TabPanel>
          {/* Projects Tab */}
          <TabPanel value={value} index={3}>
            <div
              style={{
                display: "flex",
              }}
            >
              {projects &&
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
            </div>
          </TabPanel>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default TopPicks;
