import React, { Fragment, useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  IconButton,
} from "@material-ui/core";
import Service from "../../AxiosService";
import Cookies from "js-cookie";
import {
  Announcement,
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import ReactPlayer from "react-player";
import Toast from "../../components/Toast.js";
import jwt_decode from "jwt-decode";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import TakeQuiz from "./components/TakeQuiz";

const styles = makeStyles((theme) => ({
  courseSection: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  leftCol: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    height: "100%",
  },
  linkMui: {
    cursor: "pointer",
  },
  rightCol: {
    padding: theme.spacing(2),
    overflow: "auto",
  },
}));

const EnrollCourseWithIDE = ({
  setOpenIDE,
  chosenCourseMaterial,
  setChosenCourseMaterial,
  ref,
  id,
  handleDuration,
  handleVideoProgress,
  pageNum,
  setPageNum,
  resultObj,
  setResultObj,
  handleCreateQuizResult,
  progressArr,
  setProgressArr,
  progress,
  setProgress,
  expanded,
  handleChange,
  course,
  handleChosenCourseMaterial,
  handleCheckMaterial,
}) => {
  const classes = styles();

  return (
    <div className={classes.courseSection}>
      <div style={{ height: "100vh" }}>
        <Splitter direction={SplitDirection.Horizontal} initialSizes={[40, 60]}>
          <div className={classes.leftCol}>
            <div>
              <IconButton onClick={() => setOpenIDE(false)}>
                <ArrowBack />
              </IconButton>
            </div>
            <div style={{ marginTop: "20px" }}>
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
                } else if (chosenCourseMaterial.material_type === "FILE") {
                  return (
                    <div>
                      <Paper
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          padding: "20px",
                        }}
                      >
                        <Typography
                          variant="h6"
                          style={{ fontWeight: 600, paddingBottom: "10px" }}
                        >
                          {chosenCourseMaterial.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          style={{ paddingBottom: "30px" }}
                        >
                          {chosenCourseMaterial.description}
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                          }}
                        >
                          {chosenCourseMaterial.course_file.zip_file &&
                            chosenCourseMaterial.course_file.zip_file && (
                              <Button
                                variant="outlined"
                                color="primary"
                                style={{
                                  textTransform: "capitalize",
                                  height: 25,
                                }}
                                href={chosenCourseMaterial.course_file.zip_file}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download File
                              </Button>
                            )}
                          {chosenCourseMaterial.course_file.google_drive_url &&
                            chosenCourseMaterial.course_file
                              .google_drive_url && (
                              <Button
                                variant="outlined"
                                color="primary"
                                style={{
                                  textTransform: "capitalize",
                                  height: 25,
                                  marginLeft: "10px",
                                }}
                                href={
                                  chosenCourseMaterial.course_file
                                    .google_drive_url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                File URL
                              </Button>
                            )}
                        </div>
                      </Paper>
                    </div>
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
                          chosenCourseMaterial.title &&
                          chosenCourseMaterial.title
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
            </div>
            <div style={{ marginTop: "20px" }}>
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
                                    </div>
                                    <div
                                      style={{
                                        marginTop: "10px",
                                        marginBottom: "10px",
                                      }}
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
                    <Assignment
                      fontSize="small"
                      style={{ marginRight: "5px" }}
                    />
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
          <div className={classes.rightCol}>IDE</div>
        </Splitter>
      </div>
    </div>
  );
};

export default EnrollCourseWithIDE;
