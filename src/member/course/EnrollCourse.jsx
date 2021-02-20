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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  GetApp,
  Language,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";

import components from "./components/NavbarComponents";
import TakeQuiz from "./components/TakeQuiz";

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
  unenrollButton: {
    marginRight: "45px",
    height: 40,
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      color: "#000",
    },
  },
  dialogButtons: {
    width: 100,
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

  const [unenrollDialog, setUnenrollDialog] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    // console.log(isExpanded);
    setExpanded(isExpanded ? panel : false);
  };

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getCourse = () => {
    if (Cookies.get("t1")) {
      Service.client
        .get(`/privateCourses/${id}`)
        .then((res) => {
          // console.log(res);
          setCourse(res.data);
        })
        .catch((err) => console.log(err));
    }
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
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton onClick={() => history.push(`/courses/${id}`)}>
            <ArrowBack />
          </IconButton>
          <Button
            variant="contained"
            className={classes.unenrollButton}
            onClick={() => setUnenrollDialog(true)}
          >
            Unenroll
          </Button>
        </div>
        <div className={classes.courseSection}>
          <div style={{ width: "45%" }}>
            {(() => {
              if (!chosenCourseMaterial) {
                return (
                  <Paper
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <Announcement fontSize="large" />
                    <Typography variant="body1">
                      Choose a course material on the right to start
                    </Typography>
                  </Paper>
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
                  </div>
                );
              } else if (chosenCourseMaterial.material_type === "QUIZ") {
                return (
                  <div>
                    <TakeQuiz
                      quiz={
                        chosenCourseMaterial.quiz && chosenCourseMaterial.quiz
                      }
                    />
                  </div>
                );
              }
            })()}
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
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  Course Overview
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
                <Movie fontSize="small" style={{ marginRight: "5px" }} />
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
                    key={index}
                    onChange={handleChange(`${index}`)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      id={`${index}`}
                      style={{
                        backgroundColor: "#F4F4F4",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="h6" style={{ fontWeight: 600 }}>
                          {chapter.title}
                        </Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "20px",
                      }}
                    >
                      <Typography
                        variant="body1"
                        style={{ paddingBottom: "20px" }}
                      >
                        {chapter.overview && chapter.overview}
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
                                  marginBottom: "20px",
                                }}
                              >
                                <Checkbox style={{ marginBottom: "20px" }} />
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      minWidth: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      style={{
                                        fontWeight: 600,
                                        marginRight: "10px",
                                      }}
                                    >
                                      {`${index + 1}.`}
                                    </Typography>

                                    <AttachFile fontSize="small" />
                                    {material.title}
                                    <IconButton
                                      size="small"
                                      style={{ marginLeft: "auto", order: 2 }}
                                      href={
                                        material.course_file.zip_file
                                          ? material.course_file.zip_file
                                          : material.course_file
                                              .google_drive_url
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <GetApp />
                                    </IconButton>
                                  </div>
                                  <Typography
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.7,
                                    }}
                                  >
                                    {material.description}
                                  </Typography>
                                </div>
                              </div>
                            );
                          } else if (material.material_type === "VIDEO") {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  marginBottom: "20px",
                                }}
                              >
                                <Checkbox style={{ marginBottom: "20px" }} />
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      minWidth: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      style={{
                                        fontWeight: 600,
                                        marginRight: "10px",
                                      }}
                                    >
                                      {`${index + 1}.`}
                                    </Typography>
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
                                  <Typography
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.7,
                                    }}
                                  >
                                    {material.description}
                                  </Typography>
                                </div>
                              </div>
                            );
                          } else if (material.material_type === "QUIZ") {
                            return (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  marginBottom: "20px",
                                }}
                              >
                                <Checkbox style={{ marginBottom: "20px" }} />
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    width: "100%",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      minWidth: "100%",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      style={{
                                        fontWeight: 600,
                                        marginRight: "10px",
                                      }}
                                    >
                                      {`${index + 1}.`}
                                    </Typography>
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
                                    <Typography
                                      variant="body2"
                                      style={{
                                        marginLeft: "auto",
                                        order: 2,
                                      }}
                                    >
                                      {material.quiz &&
                                        material.quiz.questions.length +
                                          ` questions`}
                                    </Typography>
                                  </div>
                                  <Typography
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.7,
                                    }}
                                  >
                                    {material.description}
                                  </Typography>
                                </div>
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
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  Final Quiz
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "20px",
                }}
              >
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

      <Dialog
        open={unenrollDialog}
        onClose={() => setUnenrollDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Unenroll from this course?</DialogTitle>
        <DialogContent>
          You will not be able to access the course contents after unenrollment.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setUnenrollDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              // to call unenroll endpoint
              history.push(`/courses/${id}`);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EnrollCourse;
