import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// import Navbar from "../../components/Navbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import ReactPlayer from "react-player";

import Service from "../../AxiosService";
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
import { calculateDateInterval } from "../../utils.js";

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
    backgroundColor: "#FFF",
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
  profileLink: {
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  pro: {
    background:
      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
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
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  dialogButtons: {
    width: 100,
  },
}));

const ViewCourseDetailsPage = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [course, setCourse] = useState();
  const [courseReviews, setCourseReviews] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);

  const ref = React.createRef();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCourse = async () => {
    Service.client
      .get(`/private-courses/${id}`)
      .then((res) => {
        // console.log(res);
        setCourse(res.data);
      })
      .catch((err) => console.log(err));

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
    if (reviewMember.member.membership_tier === "PRO") {
      // console.log("hell");
      return `/member/profile/${reviewMember.id}`;
    }
  };

  const toRenderProfileLinkOrNot = (reviewMember) => {
    if (reviewMember.member.membership_tier === "PRO") {
      return true;
    }
    return false;
  };

  const handleDeleteCourse = (courseId) => {
    Service.client
      .delete(`/courses/${courseId}`)
      .then((res) => {
        console.log(res);
        setDeleteCourseDialog(false);
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const checkIfCourseIsReadyToPublish = () => {
    const assessment = course && course.assessment;
    const chapters = course && course.chapters;
    if (!assessment) {
      return false;
    } else {
      // check assessement first
      if (!assessment.questions || assessment.questions.length === 0) {
        return false;
      }

      // check chapters
      if (!chapters || chapters.length === 0) {
        return false;
      } else {
        // check course materials in each chapter
        for (let i = 0; i < chapters.length; i++) {
          if (
            !chapters[i].course_materials ||
            chapters[i].course_materials.length === 0
          ) {
            return false;
          } else {
            for (let j = 0; j < chapters[i].course_materials.length; j++) {
              if (chapters[i].course_materials[j].material_type === "QUIZ") {
                if (
                  !chapters[i].course_materials[j].quiz.questions ||
                  chapters[i].course_materials[j].quiz.questions.length === 0
                ) {
                  return false;
                }
              }
            }
          }
        }
      }
    }

    return true;
  };

  const publishedChip = (
    <Chip
      label="Published"
      size="small"
      style={{ color: "#fff", backgroundColor: "green" }}
    />
  );
  const unPublishedChip = <Chip label="Not Published" size="small" />;
  const deletedChip = (
    <Chip
      label="Deleted"
      size="small"
      style={{ color: "#fff", backgroundColor: "#C74343" }}
    />
  );

  const notReadyChip = (
    <Chip
      label="Incomplete Course"
      size="small"
      style={{ color: "#000", backgroundColor: "#fcdb03" }}
    />
  );

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
    <Fragment>
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <IconButton onClick={() => history.push("/partner/home/content")}>
            <ArrowBack />
          </IconButton>
        </div>
      </div>
      <div className={classes.courseSection}>
        <div style={{ width: "50%" }}>
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
          {course && course.published_date ? (
            <Typography variant="body1" style={{ paddingBottom: "10px" }}>
              Published on:{` ${formatDate(course.published_date)}`}
            </Typography>
          ) : checkIfCourseIsReadyToPublish() ? (
            <Typography
              variant="body1"
              style={{ color: "red", paddingBottom: "10px" }}
            >
              Not Published
            </Typography>
          ) : (
            <Typography
              variant="body1"
              style={{ color: "red", paddingBottom: "10px" }}
            >
              Incomplete Course
            </Typography>
          )}

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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                variant="h5"
                style={{ fontWeight: 600, paddingBottom: "10px" }}
              >
                Course Content
              </Typography>
            </div>

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
                <Typography>Course Overview</Typography>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/partner/home/content/view/quizzes/${id}`}
            >
              View All Quizzes
            </Button>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={`/partner/home/content/view/comments/${id}`}
            >
              Reply To Comments
            </Button>
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
                        <a
                          href={handleProfileLink(review.member)}
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
                        </a>
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
                            <a
                              href={handleProfileLink(review.member)}
                              className={classes.profileLink}
                            >
                              <Typography
                                variant="h6"
                                style={{ fontWeight: 600 }}
                              >
                                {review.member && review.member.first_name}{" "}
                                {review.member && review.member.last_name}
                              </Typography>
                            </a>
                            {review.member.member.membership_tier === "PRO" && (
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            {review.member && review.member.first_name}{" "}
                            {review.member && review.member.last_name}
                          </Typography>
                        )}
                        <div style={{ display: "flex", marginBottom: "10px" }}>
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
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {review && calculateDateInterval(review.timestamp)}
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
        <div style={{ width: "45%" }}>
          <div style={{ maxWidth: 400, margin: "auto", marginBottom: "20px" }}>
            <img
              src={course && course.thumbnail}
              alt={course && course.title}
              style={{ width: "100%", borderRadius: "5px" }}
            />
          </div>

          <Card className={classes.cardOnRight}>
            <div style={{ width: "80%", margin: "auto" }}>
              <Typography
                variant="body1"
                style={{ fontWeight: 600, marginBottom: "10px" }}
              >
                Course Status:{" "}
                <span>
                  {(() => {
                    if (course) {
                      if (course.is_deleted) {
                        return deletedChip;
                      } else if (course.is_published) {
                        return publishedChip;
                      } else if (!course.is_published) {
                        if (checkIfCourseIsReadyToPublish(course)) {
                          return unPublishedChip;
                        }
                        return notReadyChip;
                      }
                    }
                  })()}
                </span>
              </Typography>
              <Typography
                variant="body1"
                style={{ fontWeight: 600, marginBottom: "10px" }}
              >
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
                style={{
                  fontWeight: 600,
                  marginBottom: "10px",
                  marginTop: "20px",
                }}
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
            <Button
              variant="contained"
              color="primary"
              style={{ width: "90%", margin: "16px 8px 8px" }}
              component={Link}
              to={course && `/partner/home/content/${course.id}`}
            >
              Edit Course
            </Button>
            {course && !course.is_deleted && (
              <Button
                style={{ color: "red", width: "90%" }}
                onClick={() => setDeleteCourseDialog(true)}
              >
                Delete Course
              </Button>
            )}
          </Card>
        </div>
      </div>

      <Dialog
        open={deleteCourseDialog}
        onClose={() => {
          setDeleteCourseDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete Course?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setDeleteCourseDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              handleDeleteCourse(id);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ViewCourseDetailsPage;
