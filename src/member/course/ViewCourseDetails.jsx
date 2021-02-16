import React, { Fragment, useState, useEffect } from "react";
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
import logo from "../../assets/CodeineLogos/Member.svg";
import PageTitle from "../../components/PageTitle";

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

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  listItem: {
    width: "100%",
    padding: 10,
    borderLeft: "5px solid #fff",
    "&:hover": {
      backgroundColor: "#F4F4F4",
      borderLeft: "5px solid #F4F4F4",
    },
  },
  listIcon: {
    marginLeft: "15px",
    marginRight: "20px",
  },
  activeLink: {
    width: "100%",
    padding: 10,
    color: theme.palette.primary.main,
    backgroundColor: "#F4F4F4",
    borderLeft: "5px solid",
    "&:hover": {
      borderLeft: "5px solid #437FC7",
    },
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    fontSize: "60px",
  },
  mainSection: {
    paddingTop: "65px",
    minHeight: "calc(100vh - 10px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
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

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/partner" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Partners for Personal
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/industry" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Partners for Enterprise
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          component={Link}
          to="/member/register"
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/home" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            View Dashboard
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            setLoggedIn(false);
            history.push("/");
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" />
      </Link>
    </Fragment>
  );

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
        logo={navLogo}
        bgColor="#fff"
        navbarItems={loggedIn && loggedIn ? loggedInNavbar : memberNavbar}
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
            <div style={{ maxWidth: 400, margin: "auto" }}>
              <img
                src={course && course.thumbnail}
                alt={course && course.title}
                style={{ width: "100%", borderRadius: "5px" }}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewCourseDetails;
