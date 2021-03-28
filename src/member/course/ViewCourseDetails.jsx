import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../MemberNavBar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Breadcrumbs,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Footer from "../landing/Footer";

import Service from "../../AxiosService";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import {
  Assignment,
  AttachFile,
  ExpandMore,
  FiberManualRecord,
  Language,
  Movie,
  RateReview,
} from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
// import components from "./components/NavbarComponents";
import ReactPlayer from "react-player";
import { calculateDateInterval } from "../../utils.js";
import Toast from "../../components/Toast.js";

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
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
  courseSection: {
    display: "flex",
    marginTop: "15px",
  },
  learningObjectives: {
    marginTop: theme.spacing(8),
    backgroundColor: "#FFF",
    border: "2px solid",
    borderRadius: "3px",
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
  unenrollButton: {
    // margin: "auto",
    // marginBottom: "20px",
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: "#8E0000",
    },
  },
  reviews: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px",
  },
  profileLink: {
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  pro: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
  cardOnRight: {
    width: 400,
    margin: "auto",
    marginTop: "25px",
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
  instructorAvatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    marginRight: theme.spacing(3),
  },
}));

const ViewCourseDetails = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [decoded, setDecoded] = useState("");
  const [course, setCourse] = useState();
  const [courseReviews, setCourseReviews] = useState([]);
  const [progress, setProgress] = useState();

  const [expanded, setExpanded] = useState(false);
  const [unenrollDialog, setUnenrollDialog] = useState(false);

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

  const [onlyForProDialog, setOnlyForProDialog] = useState(false);

  const ref = React.createRef();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
      setDecoded(jwt_decode(Cookies.get("t1")));
    }
  };

  const getCourse = async () => {
    if (Cookies.get("t1")) {
      Service.client
        .get(`/private-courses/${id}`)
        .then((res) => {
          // console.log(res);
          setCourse(res.data);

          if (!res.data.is_member_enrolled) {
            // ANALYITCS: log course view by unenrolled members
            Service.client
              .post(
                `/analytics`,
                { payload: "course view" },
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
          }
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`enrollments`, { params: { courseId: id } })
        .then((res) => {
          // console.log(res);
          setProgress(res.data[0].progress);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/courses/${id}`)
        .then((res) => {
          // console.log(res);
          setCourse(res.data);
        })
        .catch((err) => console.log(err));
    }

    Service.client
      .get(`/courses/${id}/reviews`)
      .then((res) => {
        // console.log(res);
        setCourseReviews(res.data);
      })
      .catch((err) => console.log(err));
  };
  // console.log(course);

  useEffect(() => {
    checkIfLoggedIn();
    getCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleProfileLink = (reviewMember) => {
    if (reviewMember.id === (decoded && decoded.user_id)) {
      // console.log("hello");
      return "/member/profile";
    } else {
      if (reviewMember.member.membership_tier === "PRO") {
        // console.log("hell");
        return `/member/profile/${reviewMember.id}`;
      }
    }
  };

  const toRenderProfileLinkOrNot = (reviewMember) => {
    if (
      reviewMember.id === (decoded && decoded.user_id) ||
      reviewMember.member.membership_tier === "PRO"
    ) {
      return true;
    }
    return false;
  };

  const handleEnrollment = () => {
    if (Cookies.get("t1")) {
      if (course.pro) {
        Service.client
          .get(`/auth/members/${decoded.user_id}`)
          .then((res) => {
            // console.log(res);
            // to check whether member enrolling in course is pro-tier
            if (res.data.member.membership_tier !== "FREE") {
              Service.client
                .post(`/courses/${id}/enrollments`)
                .then((res) => {
                  // console.log(res);
                  history.push(`/courses/enroll/${id}`);
                })
                .catch((err) => console.log(err));
            } else {
              setOnlyForProDialog(true);
            }
          })
          .catch((err) => console.log(err));
      } else {
        Service.client
          .post(`/courses/${id}/enrollments`)
          .then((res) => {
            // console.log(res);
            history.push(`/courses/enroll/${id}`);
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleUnenrollment = () => {
    Service.client
      .delete(`/courses/${id}/enrollments`)
      .then((res) => {
        console.log(res);
        // setProgress(res.data.progress);
        setUnenrollDialog(false);
        setSbOpen(true);
        setSnackbar({
          message: "You have successfully unenrolled from this course.",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const resuableChip = (label, index, backgroundColor, fontColor) => {
    return (
      <Chip
        key={index}
        label={label}
        style={{
          marginRight: "10px",
          marginBottom: "10px",
          color: fontColor ? fontColor : "#000",
          fontWeight: 600,
          backgroundColor: backgroundColor,
        }}
      />
    );
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <div className={classes.mainSection}>
        <Breadcrumbs
          style={{ margin: "20px 0px" }}
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
          <Typography variant="body1">Overview</Typography>
        </Breadcrumbs>

        <div className={classes.courseSection}>
          <div style={{ width: "60%" }}>
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
              Published On: {formatDate(course && course.published_date)}
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

                        marginBottom: "10px",
                      }}
                    >
                      <FiberManualRecord
                        fontSize="small"
                        style={{
                          marginRight: "10px",
                          fontSize: "13px",
                          marginTop: "6px",
                        }}
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
                    ? "1 Chapter (excluding Course Overview) + Final Quiz"
                    : `${course.chapters.length} Chapters (excluding Course Overview) + Final Quiz`)}
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
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Course Overview
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <ReactPlayer
                    ref={ref}
                    url={course && course.introduction_video_url}
                    width="100%"
                    height="400px"
                    controls
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
                        <Typography variant="h6" style={{ fontWeight: 600 }}>
                          {chapter.title}
                        </Typography>
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
                          style={{ paddingBottom: "15px" }}
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
                            } else {
                              return null;
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
                        marginBottom: "10px",
                      }}
                    >
                      <FiberManualRecord
                        style={{
                          marginRight: "10px",
                          fontSize: "13px",
                          marginTop: "6px",
                        }}
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
            <div className={classes.reviews}>
              <Typography
                variant="h5"
                style={{ fontWeight: 600, paddingBottom: "10px" }}
              >
                Reviews
              </Typography>
              <Typography
                variant="h1"
                style={{
                  fontWeight: 600,
                  color: "#ffb400",
                  marginLeft: "35px",
                }}
              >
                {course && parseFloat(course.rating).toFixed(1)}
              </Typography>
              <Rating
                name="read-only"
                readOnly
                value={course && course.rating ? parseFloat(course.rating) : 0}
              />
              {courseReviews && courseReviews.length > 0 ? (
                <div style={{ marginTop: "30px" }}>
                  {courseReviews.map((review, index) => {
                    return (
                      <div
                        key={index}
                        style={{ display: "flex", marginBottom: "20px" }}
                      >
                        {toRenderProfileLinkOrNot(review.member) ? (
                          <Link
                            to={handleProfileLink(review.member)}
                            style={{ textDecoration: "none" }}
                          >
                            {review.member.profile_photo &&
                            review.member.profile_photo ? (
                              <Avatar
                                style={{ marginRight: "15px" }}
                                src={review.member.profile_photo}
                              />
                            ) : (
                              <Avatar style={{ marginRight: "15px" }}>
                                {review.member.first_name.charAt(0)}
                              </Avatar>
                            )}
                          </Link>
                        ) : review.member.profile_photo &&
                          review.member.profile_photo ? (
                          <Avatar
                            style={{ marginRight: "15px" }}
                            src={review.member.profile_photo}
                          />
                        ) : (
                          <Avatar style={{ marginRight: "15px" }}>
                            {review.member.first_name.charAt(0)}
                          </Avatar>
                        )}

                        <div style={{ flexDirection: "column" }}>
                          {toRenderProfileLinkOrNot(review.member) ? (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Link
                                to={handleProfileLink(review.member)}
                                className={classes.profileLink}
                              >
                                <Typography
                                  variant="h6"
                                  style={{ fontWeight: 600 }}
                                >
                                  {review.member && review.member.first_name}{" "}
                                  {review.member && review.member.last_name}
                                </Typography>
                              </Link>
                              {review.member.member.membership_tier ===
                                "PRO" && (
                                <div style={{ marginTop: "4px" }}>
                                  <Typography
                                    variant="subtitle1"
                                    className={classes.pro}
                                  >
                                    PRO
                                  </Typography>
                                </div>
                              )}
                            </div>
                          ) : (
                            <Typography
                              variant="h6"
                              style={{ fontWeight: 600 }}
                            >
                              {review.member && review.member.first_name}{" "}
                              {review.member && review.member.last_name}
                            </Typography>
                          )}

                          <div
                            style={{ display: "flex", marginBottom: "10px" }}
                          >
                            <Rating
                              name="read-only"
                              readOnly
                              value={
                                review && review.rating
                                  ? parseFloat(review.rating)
                                  : 0
                              }
                              size="small"
                              style={{ marginRight: "20px" }}
                            />
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
                              {review &&
                                calculateDateInterval(review.timestamp)}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="body2">
                              {review.description}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ marginTop: "30px", textAlign: "center" }}>
                  <RateReview fontSize="large" />
                  <Typography variant="h6">No Reviews Yet</Typography>
                </div>
              )}
            </div>
          </div>
          <div style={{ width: "5%" }} />
          <div style={{ width: "35%" }}>
            <div
              style={{
                maxWidth: 400,
                margin: "auto",
                marginBottom: "20px",
              }}
            >
              <img
                src={course && course.thumbnail}
                alt={course && course.title}
                style={{ width: "100%", borderRadius: "5px" }}
              />
            </div>

            <Card className={classes.cardOnRight}>
              {!loggedIn ? (
                <Button
                  variant="contained"
                  style={{ width: "90%", margin: "auto", marginBottom: "20px" }}
                  color="primary"
                  onClick={() =>
                    history.push({
                      pathname: "/member/login",
                      state: { courseId: id },
                    })
                  }
                >
                  Login to View Course Content
                </Button>
              ) : course && !course.is_member_enrolled ? (
                <Button
                  variant="contained"
                  style={{
                    width: "80%",
                    margin: "auto",
                    marginBottom: "20px",
                  }}
                  color="primary"
                  onClick={() => handleEnrollment()}
                >
                  Enroll
                </Button>
              ) : (
                <Fragment>
                  <div>
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
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/courses/enroll/${id}`}
                    >
                      Continue Course
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.unenrollButton}
                      onClick={() => setUnenrollDialog(true)}
                    >
                      Unenroll
                    </Button>
                  </div>
                </Fragment>
              )}

              <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
                <Typography variant="body1" style={{ marginBottom: "10px" }}>
                  Categories this course falls under:
                </Typography>
                {course &&
                  course.categories.length > 0 &&
                  course.categories.map((category, index) => {
                    if (category === "FE") {
                      return resuableChip("Frontend", index, "#DD8B8B");
                    } else if (category === "BE") {
                      return resuableChip("Backend", index, "#A0DD8B");
                    } else if (category === "DB") {
                      return resuableChip(
                        "Database Administration",
                        index,
                        "#8B95DD"
                      );
                    } else if (category === "SEC") {
                      return resuableChip("Security", index, "#DDB28B");
                    } else if (category === "UI") {
                      return resuableChip("UI/UX", index, "#DDD58B");
                    } else if (category === "ML") {
                      return resuableChip("Machine Learning", index, "#8BD8DD");
                    } else {
                      return null;
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
                      return resuableChip("Python", index, "#3675A9", "#fff");
                    } else if (language === "JAVA") {
                      return resuableChip("Java", index, "#E57001", "#fff");
                    } else if (language === "JS") {
                      return resuableChip("Javascript", index, "#F7DF1E");
                    } else if (language === "RUBY") {
                      return resuableChip("Ruby", index, "#CC0000");
                    } else if (language === "CPP") {
                      return resuableChip("C++", index, "#004482", "#fff");
                    } else if (language === "CS") {
                      return resuableChip("C#", index, "#6A1577", "#fff");
                    } else if (language === "HTML") {
                      return resuableChip("HTML", index, "#E44D26", "#fff");
                    } else if (language === "CSS") {
                      return resuableChip("CSS", index, "#264DE4", "#fff");
                    } else {
                      return null;
                    }
                  })}
              </div>
            </Card>

            <Card className={classes.cardOnRight}>
              <Typography
                variant="h6"
                style={{ fontWeight: 600, marginBottom: "10px" }}
              >
                Instructor
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "25px",
                }}
              >
                <Avatar
                  className={classes.instructorAvatar}
                  src={
                    course &&
                    course.partner.profile_photo &&
                    course.partner.profile_photo
                  }
                  alt="instructor"
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="body1">
                    {course && course.partner.first_name}{" "}
                    {course && course.partner.last_name}
                  </Typography>
                  <Typography variant="body2">
                    {course && course.partner.partner.job_title
                      ? course.partner.partner.job_title
                      : ""}
                    {course &&
                      course.partner.partner.organization &&
                      course.partner.partner.organization.organization_name &&
                      course.partner.partner.job_title &&
                      ", "}
                    {course &&
                      course.partner.partner.organization &&
                      course.partner.partner.organization.organization_name}
                  </Typography>
                </div>
              </div>
              <div>
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  Bio
                </Typography>
                <Typography variant="body2">
                  {course && course.partner.partner.bio
                    ? course.partner.partner.bio
                    : "-"}
                </Typography>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={onlyForProDialog}
        onClose={() => setOnlyForProDialog(false)}
        PaperProps={{
          style: {
            width: "500px",
          },
        }}
      >
        <DialogTitle>This course is only for pro-tier members</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setOnlyForProDialog(false);
            }}
          >
            Stay as Free-Tier
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // direct user to pay for pro-tier membership
              history.push(`/member/payment`);
            }}
          >
            Upgrade to Pro-Tier
          </Button>
        </DialogActions>
      </Dialog>

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
    </div>
  );
};

export default ViewCourseDetails;
