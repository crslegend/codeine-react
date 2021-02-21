import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Footer from "../landing/Footer";

import Service from "../../AxiosService";
import Cookies from "js-cookie";
import {
  Announcement,
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  GetApp,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import ReactPlayer from "react-player";

import components from "./components/NavbarComponents";
import TakeQuiz from "./components/TakeQuiz";
// import calculate from "./components/CalculateDuration";

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

  const [expanded, setExpanded] = useState("overview");

  const [unenrollDialog, setUnenrollDialog] = useState(false);

  const [pageNum, setPageNum] = useState(-1);
  const [resultObj, setResultObj] = useState();

  const ref = React.createRef();

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
          setChosenCourseMaterial({
            material_type: "INTRO",
            introduction_video_url: res.data.introduction_video_url,
          });
        })
        .catch((err) => console.log(err));
    }
  };
  console.log(course);

  useEffect(() => {
    checkIfLoggedIn();
    getCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const formatDate = (date) => {
  //   const options = {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   };

  //   if (date !== null) {
  //     const newDate = new Date(date).toLocaleDateString(undefined, options);
  //     // console.log(newDate);
  //     return newDate;
  //   }
  //   return "";
  // };

  const handleChosenCourseMaterial = (material) => {
    console.log(material);
    setChosenCourseMaterial(material);
  };

  const handleDuration = (duration) => {
    // console.log(duration);
  };

  const handleCreateQuizResult = (quizId) => {
    Service.client
      .post(`/quiz/${quizId}/results`)
      .then((res) => {
        console.log(res);
        setResultObj(res.data);
        setPageNum(-1);
        // if (res.data.passed) {
        //   setPageNum(res.data.quiz_answers && res.data.quiz_answers.length);
        // } else {
        //   setPageNum(-1);
        // }
      })
      .catch((err) => console.log(err));
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
          <div style={{ width: "60%" }}>
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
                    <ReactPlayer
                      ref={ref}
                      url={
                        chosenCourseMaterial &&
                        chosenCourseMaterial.video.video_url
                      }
                      width="100%"
                      height="500px"
                      onDuration={handleDuration}
                      controls
                    />
                  </div>
                );
              } else if (
                chosenCourseMaterial.material_type === "QUIZ" ||
                chosenCourseMaterial.material_type === "FINAL"
              ) {
                return (
                  <div>
                    <TakeQuiz
                      quiz={
                        chosenCourseMaterial.quiz && chosenCourseMaterial.quiz
                      }
                      quizTitle={
                        chosenCourseMaterial.title && chosenCourseMaterial.title
                      }
                      quizType={chosenCourseMaterial.material_type}
                      pageNum={pageNum}
                      setPageNum={setPageNum}
                      resultObj={resultObj}
                      setResultObj={setResultObj}
                      handleCreateQuizResult={handleCreateQuizResult}
                    />
                  </div>
                );
              } else {
                return (
                  <div>
                    <ReactPlayer
                      ref={ref}
                      url={chosenCourseMaterial.introduction_video_url}
                      width="100%"
                      height="500px"
                      onDuration={handleDuration}
                      controls
                    />
                  </div>
                );
              }
            })()}
          </div>
          <div style={{ width: "5%" }} />
          <div style={{ width: "35%" }}>
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
                <LinkMui
                  className={classes.linkMui}
                  onClick={() => {
                    setChosenCourseMaterial({
                      material_type: "INTRO",
                      introduction_video_url: course.introduction_video_url,
                    });
                  }}
                >
                  Introduction Video
                </LinkMui>
                {/* {calculate.CalculateDuration(
                  course && course.introduction_video_url
                )} */}
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
                                    <Button
                                      variant="outlined"
                                      style={{
                                        marginLeft: "auto",
                                        order: 2,
                                        textTransform: "capitalize",
                                        height: 25,
                                      }}
                                      href={
                                        material.course_file.zip_file
                                          ? material.course_file.zip_file
                                          : material.course_file
                                              .google_drive_url
                                      }
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Download File
                                    </Button>
                                  </div>
                                  <Typography
                                    style={{
                                      fontSize: "12px",
                                      opacity: 0.7,
                                      marginTop: "5px",
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
                                      onClick={() => {
                                        handleChosenCourseMaterial(material);
                                        handleCreateQuizResult(
                                          material.quiz.id
                                        );
                                      }}
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
                                          ` Questions`}
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
                          } else {
                            return null;
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
                <LinkMui
                  className={classes.linkMui}
                  onClick={() => {
                    setChosenCourseMaterial({
                      material_type: "FINAL",
                      quiz: course.assessment,
                    });
                    handleCreateQuizResult(course.assessment.id);
                  }}
                >
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
