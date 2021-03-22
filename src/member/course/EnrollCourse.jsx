import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../MemberNavBar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Breadcrumbs,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Footer from "../landing/Footer";

import Service from "../../AxiosService";
import Cookies from "js-cookie";
import {
  Announcement,
  Assignment,
  AttachFile,
  ExpandMore,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import ReactPlayer from "react-player";

import components from "./components/NavbarComponents";
import TakeQuiz from "./components/TakeQuiz";
import Toast from "../../components/Toast.js";
import { Rating } from "@material-ui/lab";
import jwt_decode from "jwt-decode";
import CommentsSection from "./components/CommentsSection";
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
    paddingBottom: theme.spacing(10),
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
  unenrollButton: {
    marginLeft: "25px",
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: "#8E0000",
    },
  },
  dialogButtons: {
    width: 100,
  },
  courseSection: {
    display: "flex",
    marginTop: "30px",
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
  linkMui: {
    cursor: "pointer",
  },
  buttonPaper: {
    width: "60%",
    backgroundColor: "#F4F4F4",
    height: "10vh",
  },
  consultationButton: {
    marginRight: "25px",
    // marginTop: "45px",
    // float: "right",
    color: "#FFFFFF",
    // textTransform: "none",
  },
}));

const EnrollCourse = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [loggedIn, setLoggedIn] = useState(false);
  const [course, setCourse] = useState();
  const [givenCourseReview, setGivenCourseReview] = useState(false);
  const [canBookConsult, setCanBookConsult] = useState(true);

  const [chosenCourseMaterial, setChosenCourseMaterial] = useState();
  const chosenCourseMaterialRef = useRef(null);
  chosenCourseMaterialRef.current = chosenCourseMaterial;

  const [expanded, setExpanded] = useState("overview");

  const [unenrollDialog, setUnenrollDialog] = useState(false);
  const [reviewDialog, setReviewDialog] = useState(false);

  const [review, setReview] = useState({
    rating: 0,
    description: "",
  });

  const [pageNum, setPageNum] = useState(-1);
  const [resultObj, setResultObj] = useState();

  const [progressArr, setProgressArr] = useState([]);
  const [progress, setProgress] = useState(0);

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

  const handleLogContinueCourse = () => {
    // ANALYTICS: log continue course by enrolled members
    Service.client
      .post(
        `/analytics`,
        { payload: "continue course" },
        {
          params: {
            course_id: id,
          },
        }
      )
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const handleLogPauseCourse = (material) => {
    // ANALYTICS: log stop course by enrolled members
    Service.client
      .post(
        `/analytics`,
        { payload: "stop course" },
        {
          params: {
            course_id: id,
          },
        }
      )
      .then((res) => {
        // console.log(res);
        // ANALYTICS: to log pause last viewed course material/quiz when pausing the course\
        if (material.material_type === "FINAL") {
          handleLogStopFinalQuiz(material.id);
        } else {
          handleLogPauseCourseMaterial(material && material.id, null);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLogContinueCourseMaterial = (courseMaterialId) => {
    // ANALYTICS: log continue course material by enrolled members
    if (courseMaterialId) {
      Service.client
        .post(
          `/analytics`,
          { payload: "continue course material" },
          {
            params: {
              course_material_id: courseMaterialId,
            },
          }
        )
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleLogPauseCourseMaterial = (
    courseMaterialId,
    nextCourseMaterial
  ) => {
    // ANALYTICS: log pause course material by enrolled members
    if (courseMaterialId) {
      // console.log(courseMaterialId);
      Service.client
        .post(
          `/analytics`,
          { payload: "stop course material" },
          {
            params: {
              course_material_id: courseMaterialId,
            },
          }
        )
        .then((res) => {
          // console.log(res);
          if (nextCourseMaterial) {
            if (nextCourseMaterial.material_type === "FINAL") {
              handleLogStartFinalQuiz(nextCourseMaterial.id);
            } else {
              handleLogContinueCourseMaterial(nextCourseMaterial.id);
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      if (nextCourseMaterial) {
        if (nextCourseMaterial.material_type === "FINAL") {
          handleLogStartFinalQuiz(nextCourseMaterial.id);
        } else {
          handleLogContinueCourseMaterial(nextCourseMaterial.id);
        }
      }
    }
  };

  const handleLogStartFinalQuiz = (quizId) => {
    // ANALYTICS: log start final quiz by enrolled members
    Service.client
      .post(
        `/analytics`,
        { payload: "continue assessment" },
        {
          params: {
            quiz_id: quizId,
          },
        }
      )
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const handleLogStopFinalQuiz = (quizId, materialId) => {
    // ANALYTICS: log stop final quiz by enrolled members
    Service.client
      .post(
        `/analytics`,
        { payload: "stop assessment" },
        {
          params: {
            quiz_id: quizId,
          },
        }
      )
      .then((res) => {
        // console.log(res);
        if (materialId) {
          handleLogContinueCourseMaterial(materialId);
        }
      })
      .catch((err) => console.log(err));
  };

  const getCourse = () => {
    if (Cookies.get("t1")) {
      Service.client
        .get(`/private-courses/${id}`)
        .then((res) => {
          // console.log(res);
          setCourse(res.data);
          setChosenCourseMaterial({
            material_type: "INTRO",
            introduction_video_url: res.data.introduction_video_url,
          });

          Service.client
            .get(`enrollments`, { params: { courseId: id } })
            .then((res) => {
              // console.log(res);
              setProgress(res.data[0].progress);
              if (!res.data[0].materials_done) {
                setProgressArr([]);
              } else {
                setProgressArr(res.data[0].materials_done);
              }
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  };

  const getCourseReviews = () => {
    const decoded = jwt_decode(Cookies.get("t1"));
    Service.client
      .get(`/courses/${id}/reviews`)
      .then((res) => {
        // console.log(res);
        if (res.data.length > 0) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].member.id === decoded.user_id) {
              setGivenCourseReview(true);
              break;
            }
          }
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(course);

  const checkIfCanBookConsultations = () => {
    Service.client
      .get("/consultations/member/applications", {
        params: { is_upcoming: "True" },
      })
      .then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (
            res.data[i].member.membership_tier === "FREE" &&
            new Date(res.data[i].consultation_slot.start_time).getMonth() ===
              new Date().getMonth()
          ) {
            setCanBookConsult(false);
            break;
          }
        }
        console.log(canBookConsult);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    checkIfLoggedIn();
    handleLogContinueCourse();
    getCourse();
    getCourseReviews();
    checkIfCanBookConsultations();

    return () => {
      // console.log(chosenCourseMaterial);
      handleLogPauseCourse(chosenCourseMaterialRef.current);
      // console.log("cleaned up");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitReview = () => {
    if (review.rating === 0 || review.description === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Please give a rating and description for the review!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    Service.client
      .post(`/courses/${id}/reviews`, review)
      .then((res) => {
        console.log(res);
        setReviewDialog(false);
        getCourseReviews();
        setSbOpen(true);
        setSnackbar({
          message: "Course review submitted successfully!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      })
      .catch((err) => console.log(err));
  };

  const handleChosenCourseMaterial = (material) => {
    console.log(material);
    if (
      chosenCourseMaterial &&
      chosenCourseMaterial.material_type === "FINAL"
    ) {
      // previously accessing final quiz
      handleLogStopFinalQuiz(
        chosenCourseMaterial && chosenCourseMaterial.id,
        material.id
      );
    } else {
      // previous accessing course material
      handleLogPauseCourseMaterial(
        chosenCourseMaterial && chosenCourseMaterial.id,
        material
      );
    }

    setChosenCourseMaterial(material);
  };

  const handleDuration = (duration) => {
    // console.log(duration);
  };

  const handleVideoProgress = (state, videoId) => {
    // console.log(state);
    // console.log(videoId);
    if (progressArr.includes(videoId)) {
      return;
    }

    if (state.played >= 0.9) {
      // console.log("FINISH");

      let arr = [...progressArr];
      arr.push(videoId);
      setProgressArr(arr);
      Service.client
        .patch(`/courses/${id}/enrollments`, arr)
        .then((res) => {
          console.log(res);
          setProgress(res.data.progress);
        })
        .catch((err) => console.log(err));
    }
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

  const handleCheckMaterial = (e, materialId) => {
    let arr = [];
    if (progressArr.length > 0) {
      arr = [...progressArr];
    }

    if (e.target.checked) {
      arr.push(materialId);
      setProgressArr(arr);
    } else {
      arr = arr.filter((id) => id !== materialId);
      console.log(arr);
      setProgressArr(arr);
    }

    Service.client
      .patch(`/courses/${id}/enrollments`, arr)
      .then((res) => {
        console.log(res);
        setProgress(res.data.progress);
      })
      .catch((err) => console.log(err));
  };

  const handleUnenrollment = () => {
    Service.client
      .delete(`/courses/${id}/enrollments`)
      .then((res) => {
        console.log(res);
        // setProgress(res.data.progress);
        history.push(`/courses/${id}`);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <div className={classes.mainSection}>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumbs
            style={{ margin: "10px 0px" }}
            separator="›"
            aria-label="breadcrumb"
          >
            <Link
              className={classes.backLink}
              onClick={() => history.push("/courses")}
            >
              <Typography style={{ marginRight: "8px" }} variant="body1">
                All Courses
              </Typography>
            </Link>
            <Link
              className={classes.backLink}
              onClick={() => history.push(`/courses/${id}`)}
            >
              <Typography style={{ marginRight: "8px" }} variant="body1">
                Overview
              </Typography>
            </Link>
            <Typography variant="body1">
              {course && course.title.length > 35
                ? `${course && course.title.substr(0, 35)}...`
                : course && course.title}
            </Typography>
          </Breadcrumbs>
          <div>
            <Button
              className={classes.consultationButton}
              color="primary"
              variant="contained"
              component={Link}
              disabled={canBookConsult ? false : true}
              to={`/courses/enroll/consultation/${course && course.partner.id}`}
            >
              Book consultation
            </Button>
            {givenCourseReview && givenCourseReview ? (
              <Button variant="contained" color="primary" disabled>
                Course Review Given
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => setReviewDialog(true)}
              >
                Give Course Review
              </Button>
            )}

            <Button
              variant="contained"
              className={classes.unenrollButton}
              onClick={() => setUnenrollDialog(true)}
            >
              Unenroll
            </Button>
          </div>
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
                      onProgress={(state) =>
                        handleVideoProgress(state, chosenCourseMaterial.id)
                      }
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
                      materialId={chosenCourseMaterial.id}
                      progressArr={progressArr}
                      setProgressArr={setProgressArr}
                      courseId={id}
                      progress={progress}
                      setProgress={setProgress}
                    />
                  </div>
                );
              } else if (chosenCourseMaterial.material_type === "INTRO") {
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
              } else {
                return null;
              }
            })()}
            {chosenCourseMaterial &&
              chosenCourseMaterial.material_type !== "FINAL" &&
              chosenCourseMaterial.material_type !== "INTRO" && (
                <div style={{ marginTop: "20px" }}>
                  <CommentsSection
                    materialId={chosenCourseMaterial.id}
                    user={"member"}
                  />
                </div>
              )}
          </div>

          <div style={{ width: "5%" }} />
          <div style={{ width: "35%" }}>
            <Typography variant="h6">Your Progress</Typography>
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress
                    variant="determinate"
                    value={parseInt(progress)}
                  />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2">
                    {progress && parseInt(progress).toFixed() + "%"}
                  </Typography>
                </Box>
              </Box>
            </div>

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
                  flexDirection: "column",
                  padding: "20px",
                }}
              >
                <Typography variant="body1" style={{ paddingBottom: "20px" }}>
                  {course && course.description}
                </Typography>
                <div style={{ display: "flex", alignItems: "center" }}>
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
                </div>

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
                                <div>
                                  <Checkbox
                                    style={{ marginBottom: "20px" }}
                                    checked={
                                      progressArr &&
                                      progressArr.length > 0 &&
                                      progressArr.includes(material.id)
                                    }
                                    onChange={(e) =>
                                      handleCheckMaterial(e, material.id)
                                    }
                                  />
                                </div>

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
                                    <LinkMui
                                      className={classes.linkMui}
                                      onClick={() =>
                                        handleChosenCourseMaterial(material)
                                      }
                                    >
                                      {material.title}
                                    </LinkMui>
                                    <div
                                      style={{ marginLeft: "auto", order: 2 }}
                                    >
                                      {material.course_file.zip_file &&
                                        material.course_file.zip_file && (
                                          <Button
                                            variant="outlined"
                                            style={{
                                              textTransform: "capitalize",
                                              height: 25,
                                            }}
                                            href={material.course_file.zip_file}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            Download File
                                          </Button>
                                        )}
                                      {material.course_file.google_drive_url &&
                                        material.course_file
                                          .google_drive_url && (
                                          <Button
                                            variant="outlined"
                                            style={{
                                              textTransform: "capitalize",
                                              height: 25,
                                              marginLeft: "10px",
                                            }}
                                            href={
                                              material.course_file
                                                .google_drive_url
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            File URL
                                          </Button>
                                        )}
                                    </div>
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
                                <div>
                                  <Checkbox
                                    style={{ marginBottom: "20px" }}
                                    checked={
                                      progressArr &&
                                      progressArr.length > 0 &&
                                      progressArr.includes(material.id)
                                    }
                                    onChange={(e) =>
                                      handleCheckMaterial(e, material.id)
                                    }
                                  />
                                </div>
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
                                      // alignItems: "center",
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
                                <div>
                                  <Checkbox
                                    style={{ marginBottom: "20px" }}
                                    checked={
                                      progressArr &&
                                      progressArr.length > 0 &&
                                      progressArr.includes(material.id)
                                    }
                                    onChange={(e) =>
                                      handleCheckMaterial(e, material.id)
                                    }
                                  />
                                </div>

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
                                      material.quiz.questions.length === 1
                                        ? material.quiz.questions.length +
                                          ` Question`
                                        : material.quiz.questions.length +
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "100%",
                  }}
                >
                  <Assignment fontSize="small" style={{ marginRight: "5px" }} />
                  <LinkMui
                    className={classes.linkMui}
                    onClick={() => {
                      handleChosenCourseMaterial({
                        material_type: "FINAL",
                        quiz: course.assessment,
                        id: course.assessment.id,
                      });
                      handleCreateQuizResult(course.assessment.id);
                    }}
                  >
                    Attempt Final Quiz
                  </LinkMui>
                  <Typography
                    variant="body2"
                    style={{
                      marginLeft: "auto",
                      order: 2,
                    }}
                  >
                    {course && course && course.assessment
                      ? course.assessment.questions.length + ` Question`
                      : ` Questions`}
                  </Typography>
                </div>
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
              handleUnenrollment();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={reviewDialog}
        onClose={() => setReviewDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Course Review</DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{ paddingBottom: "5px" }}>
            Give Rating
          </Typography>

          <Rating
            value={review && review.rating}
            onChange={(event, newValue) => {
              setReview({
                ...review,
                rating: newValue,
              });
            }}
            style={{ marginBottom: "20px" }}
          />
          <label htmlFor="description">
            <Typography variant="body1" style={{ paddingBottom: "5px" }}>
              Give Review Description
            </Typography>
          </label>
          <TextField
            id="description"
            variant="outlined"
            margin="dense"
            value={review && review.description}
            onChange={(e) =>
              setReview({
                ...review,
                description: e.target.value,
              })
            }
            fullWidth
            placeholder="Enter review description"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setReviewDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleSubmitReview();
            }}
          >
            Give Review
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EnrollCourse;
