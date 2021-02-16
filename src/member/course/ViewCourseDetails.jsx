import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Footer from "../landing/Footer";

import Service from "../../AxiosService";
import Cookies from "js-cookie";
import {
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  FiberManualRecord,
  Language,
  Movie,
} from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import components from "./components/NavbarComponents";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  mainSection: {
    paddingTop: "65px",
    minHeight: "calc(100vh - 10px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(10),
  },
  courseSection: {
    display: "flex",
    marginTop: "15px",
  },
  learningObjectives: {
    marginTop: theme.spacing(8),
    border: "1px solid",
    borderRadius: "5px",
    minHeight: "100px",
    padding: theme.spacing(3),
  },
  courseContent: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  requirements: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  descriptionSection: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  reviews: {},
  cardOnRight: {
    width: 400,
    margin: "auto",
    marginTop: "25px",
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
}));

const ViewCourseDetails = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [course, setCourse] = useState();

  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getCourse = () => {
    Service.client
      .get(`/courses/${id}`)
      .then((res) => {
        // console.log(res);
        setCourse(res.data);
      })
      .catch((err) => console.log(err));
  };
  console.log(course);

  useEffect(() => {
    checkIfLoggedIn();
    getCourse();
  }, []);

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  return (
    <div className={classes.root}>
      <Navbar
        logo={components.navLogo}
        bgColor="#fff"
        navbarItems={
          loggedIn && loggedIn
            ? components.loggedInNavbar(() => {
                Service.removeCredentials();
                setLoggedIn(false);
                history.push("/");
              })
            : components.memberNavbar
        }
      />
      <div className={classes.mainSection}>
        <div style={{ marginTop: "20px" }}>
          <IconButton onClick={() => history.push("/courses")}>
            <ArrowBack />
          </IconButton>
        </div>
        <div className={classes.courseSection}>
          <div style={{ flexGrow: 3 }}>
            <Typography
              variant="h3"
              style={{ fontWeight: 600, paddingBottom: "10px" }}
            >
              {course && course.title}
            </Typography>
            <Typography variant="h6" style={{ paddingBottom: "30px" }}>
              Experience Points: {course && course.exp_points}
            </Typography>
            <Rating
              name="read-only"
              readOnly
              value={course && course.rating ? parseFloat(course.rating) : 0}
            />
            <Typography variant="body1" style={{ paddingBottom: "10px" }}>
              Published on: {formatDate(course && course.published_date)}
            </Typography>
            <div style={{ display: "flex" }}>
              <Language style={{ marginRight: "10px" }} />
              {course &&
                course.languages.length > 0 &&
                course.languages.map((language, index) => {
                  if (index + 1 !== course.languages.length) {
                    if (language === "ENG") {
                      return <Typography key={index}>English, </Typography>;
                    } else if (language === "MAN") {
                      return <Typography key={index}>中文, </Typography>;
                    } else {
                      return <Typography key={index}>Français, </Typography>;
                    }
                  } else {
                    if (language === "ENG") {
                      return <Typography key={index}>English</Typography>;
                    } else if (language === "MAN") {
                      return <Typography key={index}>中文</Typography>;
                    } else {
                      return <Typography key={index}>Français</Typography>;
                    }
                  }
                })}
            </div>
            <div className={classes.learningObjectives}>
              <Typography
                variant="h6"
                style={{ fontWeight: 600, paddingBottom: "10px" }}
              >
                Learning Objectives
              </Typography>
              {course &&
                course.learning_objectives.length > 0 &&
                course.learning_objectives.map((objective, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <FiberManualRecord
                        fontSize="small"
                        style={{ marginRight: "10px", fontSize: "13px" }}
                      />
                      <Typography>{objective}</Typography>
                    </div>
                  );
                })}
            </div>
            <div className={classes.courseContent}>
              <Typography
                variant="h5"
                style={{ fontWeight: 600, paddingBottom: "10px" }}
              >
                Course Content
              </Typography>
              <Typography variant="body2" style={{ paddingBottom: "5px" }}>
                {course &&
                  (course.chapters.length === 1
                    ? "1 Chapter (excluding Course Overview)"
                    : `${course.chapters.length} Chapters (excluding Course Overview)`)}
              </Typography>
              <Accordion
                expanded={expanded === `overview`}
                onChange={handleChange(`overview`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  id={`overview`}
                  style={{ backgroundColor: "#F4F4F4" }}
                >
                  <Typography>Course Overview</Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <iframe
                    width="420"
                    height="345"
                    src={course && course.introduction_video_url}
                  />
                </AccordionDetails>
              </Accordion>
              {course &&
                course.chapters.length > 0 &&
                course.chapters.map((chapter, index) => {
                  return (
                    <Accordion
                      expanded={expanded === `${index}`}
                      onChange={handleChange(`${index}`)}
                      key={index}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        id={`${index}`}
                        style={{ backgroundColor: "#F4F4F4" }}
                      >
                        <Typography>{chapter.title}</Typography>
                      </AccordionSummary>
                      <AccordionDetails
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          style={{ paddingBottom: "15px" }}
                        >
                          {chapter.course_materials &&
                          chapter.course_materials.length === 1
                            ? "1 Course Material"
                            : `${chapter.course_materials.length} Course Materials`}
                        </Typography>
                        {chapter.course_materials &&
                          chapter.course_materials.length > 0 &&
                          chapter.course_materials.map((material, index) => {
                            if (material.material_type === "FILE") {
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                  }}
                                >
                                  <AttachFile
                                    fontSize="small"
                                    style={{ marginRight: "10px" }}
                                  />
                                  {material.title}
                                </div>
                              );
                            } else if (material.material_type === "VIDEO") {
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                  }}
                                >
                                  <Movie
                                    fontSize="small"
                                    style={{ marginRight: "10px" }}
                                  />
                                  {material.title}
                                </div>
                              );
                            } else if (material.material_type === "QUIZ") {
                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "15px",
                                  }}
                                >
                                  <Assignment
                                    fontSize="small"
                                    style={{ marginRight: "10px" }}
                                  />
                                  {material.title}
                                </div>
                              );
                            }
                          })}
                      </AccordionDetails>
                    </Accordion>
                  );
                })}
            </div>
            <div className={classes.requirement}>
              <Typography
                variant="h5"
                style={{ fontWeight: 600, paddingBottom: "10px" }}
              >
                Requirements
              </Typography>
              {course &&
                course.requirements.length > 0 &&
                course.requirements.map((requirement, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <FiberManualRecord
                        style={{ marginRight: "10px", fontSize: "13px" }}
                      />
                      <Typography>{requirement}</Typography>
                    </div>
                  );
                })}
            </div>
            <div className={classes.descriptionSection}>
              <Typography
                variant="h5"
                style={{ fontWeight: 600, paddingBottom: "10px" }}
              >
                Description
              </Typography>
              <Typography variant="body1">
                {course && course.description}
              </Typography>
            </div>
            <div className={classes.reviews}>REVIEWS HERE</div>
          </div>
          <div style={{ flexGrow: 1 }}>
            <div
              style={{ maxWidth: 400, margin: "auto", marginBottom: "20px" }}
            >
              <img
                src={course && course.thumbnail}
                alt={course && course.title}
                style={{ width: "100%", borderRadius: "5px" }}
              />
            </div>

            <Card className={classes.cardOnRight}>
              <Button
                variant="contained"
                style={{ width: "80%", margin: "auto", marginBottom: "20px" }}
                color="primary"
              >
                Enroll
              </Button>
              <Button
                variant="contained"
                style={{ width: "80%", margin: "auto", marginBottom: "20px" }}
                color="primary"
                component={Link}
                to={`/courses/enroll/${id}`}
              >
                Continue Course
              </Button>

              <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
                <Typography variant="body1" style={{ marginBottom: "10px" }}>
                  Categories this course falls under:
                </Typography>
                {course &&
                  course.categories.length > 0 &&
                  course.categories.map((category, index) => {
                    if (category === "FE") {
                      return (
                        <Chip
                          key={index}
                          label="Frontend"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (category === "BE") {
                      return (
                        <Chip
                          key={index}
                          label="Backend"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (category === "UI") {
                      return (
                        <Chip
                          key={index}
                          label="UI/UX"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (category === "DB") {
                      return (
                        <Chip
                          key={index}
                          label="Database Administration"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (category === "ML") {
                      return (
                        <Chip
                          key={index}
                          label="Machine Learning"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          key={index}
                          label="Security"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    }
                  })}

                <Typography
                  variant="body1"
                  style={{ marginBottom: "10px", marginTop: "20px" }}
                >
                  Coding Languages/Frameworks:
                </Typography>
                {course &&
                  course.coding_languages.length > 0 &&
                  course.coding_languages.map((language, index) => {
                    if (language === "PY") {
                      return (
                        <Chip
                          key={index}
                          label="Python"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (language === "JAVA") {
                      return (
                        <Chip
                          key={index}
                          label="Java"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (language === "JS") {
                      return (
                        <Chip
                          key={index}
                          label="Javascript"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (language === "CPP") {
                      return (
                        <Chip
                          key={index}
                          label="C++"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (language === "CS") {
                      return (
                        <Chip
                          key={index}
                          label="C#"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else if (language === "RUBY") {
                      return (
                        <Chip
                          key={index}
                          label="Ruby"
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          key={index}
                          label={language}
                          style={{ marginRight: "10px", marginBottom: "10px" }}
                        />
                      );
                    }
                  })}
              </div>
            </Card>

            <Card className={classes.cardOnRight}>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                Instructor
              </Typography>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewCourseDetails;
