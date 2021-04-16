import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Paper,
  Typography,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import {
  Announcement,
  ArrowBack,
  Assignment,
  AttachFile,
  ExpandMore,
  FileCopyOutlined,
  Movie,
} from "@material-ui/icons";
import LinkMui from "@material-ui/core/Link";
import Service from "../../AxiosService";
import ReactPlayer from "react-player";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import TakeQuiz from "./components/TakeQuiz";

import hljs from "highlight.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";

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
    // padding: theme.spacing(2),
    overflow: "auto",
    height: "100%",
  },
  loader: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  codeBody: {
    display: "flex",
    border: "2px solid #C74343",
    background: "rgba(164, 201, 245, 0.1)",
    borderRadius: "5px",
    marginTop: "15px",
    boxShadow: "2px 3px 0px #C74343",
  },
}));

const EnrollCourseWithIDE = ({
  setOpenIDE,
  chosenCourseMaterial,
  setChosenCourseMaterial,
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
  setSbOpen,
  setSnackbar,
  snackbar,
  displayCodeSnippetForVideo,
  codeSnippet,
}) => {
  const classes = styles();
  const ref = React.createRef();

  const [portNum, setPortNum] = useState();
  const [loadingIDE, setLoadingIDE] = useState(true);

  const startIDE = () => {
    // console.log(course);
    if (course && course.github_repo) {
      Service.client
        .get(`ide`, {
          params: {
            git_url: course.github_repo,
            course_name: course.title,
          },
        })
        .then((res) => {
          //   console.log(res);
          setPortNum(res.data.port);
          // setLoadingIDE(false);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`ide`, {
          params: {
            course_name: course.title,
          },
        })
        .then((res) => {
          // console.log(res);
          setPortNum(res.data.port);
          // setLoadingIDE(false);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    startIDE();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hideLoader = () => {
    console.log("FINISH");
    setLoadingIDE(false);
  };

  return (
    <div className={classes.courseSection}>
      <div style={{ height: "100vh" }}>
        <Splitter direction={SplitDirection.Horizontal} initialSizes={[55, 65]}>
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
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <ReactPlayer
                        ref={ref}
                        url={
                          chosenCourseMaterial &&
                          chosenCourseMaterial.video.video_url
                        }
                        width="100%"
                        height="500px"
                        onDuration={handleDuration}
                        onProgress={(state) => {
                          if (
                            chosenCourseMaterial.video.video_code_snippets
                              .length > 0
                          ) {
                            displayCodeSnippetForVideo(state);
                          }
                          handleVideoProgress(state, chosenCourseMaterial.id);
                        }}
                        controls
                      />
                      {codeSnippet && (
                        <div className={classes.codeBody}>
                          <div style={{ width: "95%", padding: "24px" }}>
                            <pre style={{ margin: 0 }}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: hljs.highlightAuto(codeSnippet).value,
                                }}
                              />
                            </pre>
                          </div>
                          <div
                            style={{
                              width: "5%",
                              paddingRight: "8px",
                              paddingTop: "8px",
                            }}
                          >
                            <CopyToClipboard
                              text={codeSnippet}
                              onCopy={() => {
                                setSbOpen(true);
                                setSnackbar({
                                  ...snackbar,
                                  message: "Code Snippet copied!",
                                  severity: "info",
                                });
                                return true;
                              }}
                            >
                              <IconButton size="small">
                                <FileCopyOutlined />
                              </IconButton>
                            </CopyToClipboard>
                          </div>
                        </div>
                      )}
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
          <div className={classes.rightCol}>
            {loadingIDE ? (
              <div className={classes.loader}>
                <CircularProgress />
                <Typography variant="h6" style={{ paddingTop: "10px" }}>
                  Fetching your IDE...
                </Typography>
              </div>
            ) : null}

            <iframe
              width="100%"
              height="100%"
              src={`http://localhost:${portNum}`}
              title="ide"
              loading="lazy"
              onLoad={() => hideLoader()}
            />
          </div>
        </Splitter>
      </div>
    </div>
  );
};

export default EnrollCourseWithIDE;
