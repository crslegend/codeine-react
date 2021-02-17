import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Footer from "../landing/Footer";
import PageTitle from "../../components/PageTitle";

import Service from "../../AxiosService";
import Cookies from "js-cookie";
import {
  Announcement,
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  FiberManualRecord,
  Language,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";

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
  content: {
    minHeight: 400,
    padding: theme.spacing(3),
    // backgroundColor: "#000",
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
  linkMui: {
    cursor: "pointer",
  },
}));

const EnrollCourse = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [course, setCourse] = useState();

  const [chosenCourseMaterial, setChosenCourseMaterial] = useState();

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

  const handleChosenCourseMaterial = (material) => {
    console.log(material);
    setChosenCourseMaterial(material);
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
          <IconButton onClick={() => history.push(`/courses/${id}`)}>
            <ArrowBack />
          </IconButton>
        </div>
        <div className={classes.courseSection}>
          <div style={{ width: "45%" }}>
            <Paper className={classes.content} elevation={3}>
              {(() => {
                if (!chosenCourseMaterial) {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 300,
                      }}
                    >
                      <Announcement fontSize="large" />
                      <Typography variant="body1">
                        Choose a course material on the right to start
                      </Typography>
                    </div>
                  );
                } else if (chosenCourseMaterial.material_type === "FILE") {
                  return (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 300,
                      }}
                    >
                      <Paper
                        elevation={3}
                        style={{
                          marginBottom: "20px",
                          width: "60%",
                          padding: "10px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          style={{ paddingBottom: "15px" }}
                        >
                          <span style={{ fontWeight: 600 }}>Title</span>
                          <br /> {chosenCourseMaterial.title}
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 600 }}>Description</span>
                          <br />
                          {chosenCourseMaterial.description}
                        </Typography>
                      </Paper>
                      <Typography variant="body1">
                        You can access the file here:
                      </Typography>
                      <LinkMui
                        href={
                          chosenCourseMaterial.course_file.zip_file
                            ? chosenCourseMaterial.course_file.zip_file
                            : chosenCourseMaterial.course_file.google_drive_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "20px" }}
                      >
                        File
                      </LinkMui>
                    </div>
                  );
                } else if (chosenCourseMaterial.material_type === "VIDEO") {
                  return (
                    <div>
                      <iframe
                        width="100%"
                        height="345"
                        src={
                          chosenCourseMaterial &&
                          chosenCourseMaterial.video.video_url
                        }
                      />
                      <Paper
                        elevation={3}
                        style={{
                          marginTop: "20px",
                          padding: "10px",
                        }}
                      >
                        <Typography
                          variant="body1"
                          style={{ paddingBottom: "15px" }}
                        >
                          <span style={{ fontWeight: 600 }}>Title</span>
                          <br /> {chosenCourseMaterial.title}
                        </Typography>
                        <Typography variant="body1">
                          <span style={{ fontWeight: 600 }}>Description</span>
                          <br />
                          {chosenCourseMaterial.description}
                        </Typography>
                      </Paper>
                    </div>
                  );
                }
              })()}
            </Paper>
          </div>
          <div style={{ width: "5%" }} />
          <div style={{ width: "45%" }}>
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                <Checkbox />
                <LinkMui className={classes.linkMui}>
                  Introduction Video
                </LinkMui>
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
                                <Checkbox />
                                <AttachFile
                                  fontSize="small"
                                  style={{ marginRight: "5px" }}
                                />
                                <LinkMui
                                  className={classes.linkMui}
                                  onClick={() =>
                                    handleChosenCourseMaterial(material)
                                  }
                                >
                                  {material.title}
                                </LinkMui>
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
                                <Checkbox />
                                <Movie
                                  fontSize="small"
                                  style={{ marginRight: "5px" }}
                                />
                                <LinkMui
                                  className={classes.linkMui}
                                  onClick={() =>
                                    handleChosenCourseMaterial(material)
                                  }
                                >
                                  {material.title}
                                </LinkMui>
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
                                <Checkbox />
                                <Assignment
                                  fontSize="small"
                                  style={{ marginRight: "5px" }}
                                />
                                <LinkMui
                                  className={classes.linkMui}
                                  onClick={() =>
                                    handleChosenCourseMaterial(material)
                                  }
                                >
                                  {material.title}
                                </LinkMui>
                              </div>
                            );
                          }
                        })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            <Accordion
              expanded={expanded === `final`}
              onChange={handleChange(`final`)}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                id={`final`}
                style={{ backgroundColor: "#F4F4F4" }}
              >
                <Typography>Final Quiz</Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                <Checkbox disabled />
                <Assignment fontSize="small" style={{ marginRight: "5px" }} />
                <LinkMui className={classes.linkMui}>
                  Attempt Final Quiz
                </LinkMui>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EnrollCourse;
