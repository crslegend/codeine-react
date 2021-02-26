import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Card,
  Chip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Toast from "../../../components/Toast.js";

import Service from "../../../AxiosService";
import Cookies from "js-cookie";
import {
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  FiberManualRecord,
  Language,
  Movie,
  RateReview,
} from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import ReactPlayer from "react-player";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  mainSection: {
    minHeight: "calc(100vh - 10px)",
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
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
  reviews: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px",
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
  const [courseReviews, setCourseReviews] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const ref = React.createRef();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getCourse = async () => {
    if (Cookies.get("t1")) {
      Service.client
        .get(`/private-courses/${id}`)
        .then((res) => {
          // console.log(res);
          setCourse(res.data);
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
        console.log(res);
        setCourseReviews(res.data);
      })
      .catch((err) => console.log(err));
  };
  console.log(course);

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

  const calculateDateInterval = (timestamp) => {
    const dateBefore = new Date(timestamp);
    const dateNow = new Date();

    let seconds = Math.floor((dateNow - dateBefore) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;
    seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

    if (days === 0) {
      if (hours === 0) {
        if (minutes === 0) {
          return `${seconds} seconds ago`;
        }

        if (minutes === 1) {
          return `${minutes} minute ago`;
        }
        return `${minutes} minutes ago`;
      }

      if (hours === 1) {
        return `${hours} hour ago`;
      }
      return `${hours} hours ago`;
    }

    if (days === 1) {
      return `${days} day ago`;
    }
    return `${days} days ago`;
  };

  // const handleEnrollment = () => {
  //   if (Cookies.get("t1")) {
  //     Service.client
  //       .post(`/courses/${id}/enrollments`)
  //       .then((res) => {
  //         console.log(res);
  //         history.push(`/courses/enroll/${id}`);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  const handleDeactivation = () => {
    if (Cookies.get("t1")) {
      Service.client
        .patch(`/courses/${id}/deactivate`)
        .then((res) => {
          setCourse(res.data);
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Course has been deactivated successfully!",
            severity: "success",
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleActivation = () => {
    if (Cookies.get("t1")) {
      Service.client
        .patch(`/courses/${id}/activate`)
        .then((res) => {
          setCourse(res.data);
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Course has been activated successfully!",
            severity: "success",
          });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.mainSection}>
        <div style={{ marginTop: "20px" }}>
          <IconButton onClick={() => history.push("/admin/contentquality")}>
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
                        <Avatar style={{ marginRight: "15px" }} />
                        <div style={{ flexDirection: "column" }}>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            {review.member && review.member.first_name}{" "}
                            {review.member && review.member.last_name}
                          </Typography>
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
                style={{
                  width: "80%",
                  margin: "auto",
                  marginBottom: "20px",
                }}
                color="primary"
                component={Link}
                to={`/admin/contentquality/courses/view/${id}`}
              >
                View
              </Button>

              {course && course.is_available ? (
                <Button
                  variant="contained"
                  style={{
                    width: "80%",
                    margin: "auto",
                    marginBottom: "20px",
                    color: "red",
                  }}
                  onClick={() => handleDeactivation()}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="contained"
                  style={{
                    width: "80%",
                    margin: "auto",
                    marginBottom: "20px",
                    color: "green",
                  }}
                  onClick={() => handleActivation()}
                >
                  Activate
                </Button>
              )}

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
                      ? course.partner.partner.job_title.concat(", ")
                      : ""}
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
                  {course && course.partner.partner.bio}
                </Typography>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCourseDetails;
