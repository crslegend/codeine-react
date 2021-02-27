import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
// import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";
import { useHistory, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Chip,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import CommentsSection from "../../member/course/components/CommentsSection";

const styles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    alignItems: "center",
  },
  courseDetails: {
    border: "2px solid lightgrey",
    borderRadius: "6px",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    display: "flex",
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  linkMui: {
    cursor: "pointer",
  },
}));

const ReplyToComments = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  // const [sbOpen, setSbOpen] = useState(false);
  // const [snackbar, setSnackbar] = useState({
  //   message: "",
  //   severity: "error",
  //   anchorOrigin: {
  //     vertical: "bottom",
  //     horizontal: "center",
  //   },
  //   autoHideDuration: 3000,
  // });

  // const [pageNum, setPageNum] = useState(1);
  const [course, setCourse] = useState();
  // const [comments, setComments] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const [chosenCourseMaterialId, setChosenCourseMaterialId] = useState();
  const [chosenMaterialName, setChosenMaterialName] = useState();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getCourse = () => {
    Service.client
      .get(`/private-courses/${id}`)
      .then((res) => {
        // console.log(res);
        setCourse(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(course);

  const handleChooseCourseMaterial = (mId) => {
    setChosenCourseMaterialId(mId);
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

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <IconButton
          onClick={() => history.push(`/partner/home/content/view/${id}`)}
          style={{ marginRight: "30px" }}
        >
          <ArrowBack />
        </IconButton>
        <PageTitle title="View Comments for Course" />
      </div>
      <div className={classes.courseDetails}>
        <Avatar src={course && course.thumbnail} className={classes.avatar} />
        <div
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" style={{ fontWeight: 600 }}>
            {course && course.title}
          </Typography>
          <Typography variant="body2" style={{ paddingBottom: "10px" }}>
            {course && course.description}
          </Typography>
          <Typography variant="body2" style={{ paddingBottom: "15px" }}>
            Experience Points: {course && course.exp_points}
          </Typography>
          <Typography variant="body2">
            Course Status:{" "}
            {(() => {
              if (course) {
                if (course.is_deleted) {
                  return deletedChip;
                } else if (course.is_published) {
                  return publishedChip;
                } else if (!course.is_published) {
                  return unPublishedChip;
                }
              } else {
                return null;
              }
            })()}
          </Typography>
        </div>
      </div>
      <Typography
        variant="h5"
        style={{
          fontWeight: 600,
          paddingTop: "10px",
          paddingBottom: "15px",
          textAlign: "center",
        }}
      >
        Course Materials
      </Typography>
      {course &&
        course.chapters.length > 0 &&
        course.chapters.map((chapter, index) => {
          return (
            <Accordion
              expanded={expanded === `${index}`}
              onChange={handleChange(`${index}`)}
              key={index}
              style={{
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto",
              }}
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
                <Typography variant="body2" style={{ paddingBottom: "15px" }}>
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
                          <LinkMui
                            className={classes.linkMui}
                            onClick={() => {
                              handleChooseCourseMaterial(material.id);
                              setChosenMaterialName(material.title);
                            }}
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
                          <Movie
                            fontSize="small"
                            style={{ marginRight: "10px" }}
                          />
                          <LinkMui
                            className={classes.linkMui}
                            onClick={() => {
                              handleChooseCourseMaterial(material.id);
                              setChosenMaterialName(material.title);
                            }}
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
                          <Assignment
                            fontSize="small"
                            style={{ marginRight: "10px" }}
                          />
                          <LinkMui
                            className={classes.linkMui}
                            onClick={() => {
                              handleChooseCourseMaterial(material.id);
                              setChosenMaterialName(material.title);
                            }}
                          >
                            {material.title}
                          </LinkMui>
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

      {!chosenCourseMaterialId && (
        <Typography
          variant="h6"
          style={{ textAlign: "center", paddingTop: "20px" }}
        >
          Please choose a course material above to view the comments
        </Typography>
      )}

      {chosenMaterialName && chosenMaterialName && (
        <Typography
          variant="h6"
          style={{ fontWeight: 600, textAlign: "center", paddingTop: "20px" }}
        >
          Chosen Course Material:{" "}
          <span style={{ fontWeight: 500 }}>{chosenMaterialName}</span>
        </Typography>
      )}

      {chosenCourseMaterialId && chosenMaterialName && (
        <div
          style={{
            marginTop: "20px",
            width: "75%",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "30px",
          }}
        >
          <CommentsSection
            materialId={chosenCourseMaterialId && chosenCourseMaterialId}
          />
        </div>
      )}
    </Fragment>
  );
};

export default ReplyToComments;
