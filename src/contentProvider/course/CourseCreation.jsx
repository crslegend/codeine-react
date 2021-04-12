import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Edit, PlaylistAddCheck } from "@material-ui/icons";
import CourseDetailsDrawer from "./components/CourseDetailsDrawer";
import PageTitle from "../../components/PageTitle";

import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";
import CourseKanbanBoard from "./components/CourseKanbanBoard";
import { useHistory, useParams } from "react-router-dom";
// import QuizKanbanBoard from "./components/QuizKanbanBoard";
import QuestionBankModal from "./components/QuestionBankModal";
import validator from "validator";
import AssessmentCreation from "./components/AssessmentCreation";
import { Alert } from "@material-ui/lab";

// import jwt_decode from "jwt-decode";
// import Cookies from "js-cookie";
// import axios from "axios";
// import { loadStripe } from "@stripe/stripe-js";
// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const useStyles = makeStyles((theme) => ({
  topSection: {
    display: "flex",
    margin: theme.spacing(1),
    // justifyContent: "space-between",
    // alignItems: "center",
  },
  dialogButtons: {
    width: 100,
  },
  kanban: {
    width: "100%",
    overflow: "auto",
    marginBottom: "20px",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    // padding: theme.spacing(3),
    marginBottom: "20px",
    width: "100%",
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
  },
  container: {
    width: "100%",
    margin: "auto",
    marginBottom: "30px",
    border: "1px solid lightgrey",
    borderRadius: "2px",
    backgroundColor: "#fff",
    padding: theme.spacing(2),
  },
  coursePicPlaceholder: {
    backgroundColor: "#4a4a4a",
    height: "160px",
    width: "100%",
    padding: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  coursePicWithoutPlaceholder: {
    height: "100%",
    width: "100%",
  },

  alert: {
    maxWidth: "370px",
    marginBottom: "10px",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const CourseCreation = () => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [pageNum, setPageNum] = useState(1);

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

  const [chapterDialog, setChapterDialog] = useState(false);
  const [numOfChapters, setNumOfChapters] = useState(0);
  const [chapterDetails, setChapterDetails] = useState({
    title: "",
    overview: "",
  });
  const [allChapters, setAllChapters] = useState({
    columns: {},
    tasks: {},
    columnOrder: [],
    subtasks: {},
  });

  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerPageNum, setDrawerPageNum] = useState(1);

  const [coursePicAvatar, setCoursePicAvatar] = useState();

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    learning_objectives: [],
    requirements: [],
    introduction_video_url: "",
    exp_points: 0,
  });

  const [languages, setLanguages] = useState({
    ENG: false,
    MAN: false,
    FRE: false,
  });

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const [codeLanguage, setCodeLanguage] = useState({
    PY: false,
    JAVA: false,
    JS: false,
    CPP: false,
    CS: false,
    HTML: false,
    CSS: false,
    RUBY: false,
  });

  const [isPublished, setIsPublished] = useState();

  const [courseId, setCourseId] = useState();

  const [finalQuiz, setFinalQuiz] = useState({
    instructions: "",
    passing_marks: 0,
  });
  const [finalQuizQuestionGroups, setFinalQuizQuestionGroups] = useState([]);
  // console.log(courseDetails);

  const [courseDetailsCard, setCourseDetailsCard] = useState({
    title: "",
    description: "",
  });

  const [paymentDialog, setPaymentDialog] = useState(false);
  // const [paymentAmount, setPaymentAmount] = useState();

  const [questionBankModalOpen, setQuestionBankModalOpen] = useState(false);

  const handleSaveCourseDetails = () => {
    // console.log(coursePicAvatar);
    if (!coursePicAvatar) {
      setSbOpen(true);
      setSnackbar({
        message: "Please give a picture for your course!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (
      courseDetails.title === "" ||
      courseDetails.description === "" ||
      courseDetails.learning_objectives.length === 0 ||
      courseDetails.requirements.length === 0
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter required fields!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    // check if intro video URL is a valid URL
    if (
      !validator.isURL(courseDetails.introduction_video_url, {
        protocols: ["http", "https"],
        require_protocol: true,
        allow_underscores: true,
      })
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter a valid URL for the introduction video!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    // check if github repo is a valid URL
    if (courseDetails.github_repo && courseDetails.github_repo !== "") {
      if (
        !validator.isURL(courseDetails.github_repo, {
          protocols: ["http", "https"],
          require_protocol: true,
          allow_underscores: true,
        })
      ) {
        setSbOpen(true);
        setSnackbar({
          message: "Please enter a valid URL for the github repository!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }
    }

    let neverChooseOne = true;
    for (const property in languages) {
      if (languages[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 course language",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    neverChooseOne = true;
    for (const property in categories) {
      if (categories[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 category",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    neverChooseOne = true;
    for (const property in codeLanguage) {
      if (codeLanguage[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message:
          "Please select at least 1 coding language/framework for your course",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    const requirementsArr = courseDetails.requirements.split(",");
    const learnObjectivesArr = courseDetails.learning_objectives.split(",");

    let data = {
      ...courseDetails,
      coding_languages: [],
      languages: [],
      categories: [],
      thumbnail: coursePicAvatar[0].file,
      requirements: requirementsArr,
      learning_objectives: learnObjectivesArr,
    };

    for (const property in languages) {
      if (languages[property]) {
        data.languages.push(property);
      }
    }

    for (const property in categories) {
      if (categories[property]) {
        data.categories.push(property);
      }
    }

    for (const property in codeLanguage) {
      if (codeLanguage[property]) {
        data.coding_languages.push(property);
      }
    }
    // console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append(
      "learning_objectives",
      JSON.stringify(data.learning_objectives)
    );
    formData.append("requirements", JSON.stringify(data.requirements));
    formData.append("introduction_video_url", data.introduction_video_url);

    if (!courseId && data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    formData.append("coding_languages", JSON.stringify(data.coding_languages));
    formData.append("languages", JSON.stringify(data.languages));
    formData.append("categories", JSON.stringify(data.categories));
    formData.append("price", data.price);
    formData.append("exp_points", data.exp_points);
    formData.append("pro", data.pro);
    formData.append("duration", data.duration);

    if (!data.github_repo || data.github_repo !== "") {
      formData.append("github_repo", data.github_repo);
    }

    if (courseId) {
      Service.client
        .put(`/courses/${courseId}`, formData)
        .then((res) => {
          // console.log(res);
          setDrawerOpen(false);
          setDrawerPageNum(1);
          setCoursePicAvatar();
          getCourse();
          setSbOpen(true);
          setSnackbar({
            message: "Course details saved!",
            severity: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/courses`, formData)
        .then((res) => {
          // console.log(res);
          setDrawerOpen(false);
          setDrawerPageNum(1);
          localStorage.setItem("courseId", res.data.id);
          localStorage.removeItem("courseType");
          setCoursePicAvatar();
          getCourse();
          setSbOpen(true);
          setSnackbar({
            message: "Course details saved!",
            severity: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const getCourse = () => {
    let chosenId = "";
    if (id) {
      setCourseId(id);
      chosenId = id;
    } else {
      const idFromLocal = localStorage.getItem("courseId");
      setCourseId(idFromLocal);
      chosenId = idFromLocal;
    }

    if (chosenId) {
      Service.client
        .get(`/private-courses/${chosenId}`)
        .then((res) => {
          console.log(res.data);
          setCourseDetails({
            title: res.data.title,
            description: res.data.description,
            learning_objectives: res.data.learning_objectives.join(),
            requirements: res.data.requirements.join(),
            introduction_video_url: res.data.introduction_video_url,
            exp_points: res.data.exp_points,
            pro: res.data.pro,
            github_repo:
              res.data.github_repo !== "undefined" || !res.data.github_repo
                ? res.data.github_repo
                : "",
            duration: res.data.duration,
          });
          setCourseDetailsCard({
            title: res.data.title,
            description: res.data.description,
          });
          const obj = {
            data: res.data.thumbnail,
          };
          setCoursePicAvatar([obj]);
          setIsPublished(res.data.is_published.toString());

          setNumOfChapters(res.data.chapters.length);
          // setAllChapters(res.data.chapters);

          // setting the right data for the kanban board
          let columnOrder = [];
          res.data.chapters.forEach((chapter) => columnOrder.push(chapter.id));

          let columns = {};
          let tasksObj = {};
          let subtasksObj = {};
          res.data.chapters.forEach((chapter) => {
            columns = {
              ...columns,
              [chapter.id]: chapter,
            };
            let taskIdsArr = [];
            let subtaskIdsArr = [];

            // console.log(chapter);
            chapter.course_materials.forEach((courseMaterial) => {
              subtaskIdsArr = [];
              taskIdsArr.push(courseMaterial.id);
              tasksObj = {
                ...tasksObj,
                [courseMaterial.id]: courseMaterial,
              };

              // courseMaterial.quiz &&
              //   courseMaterial.quiz.questions.forEach((question) => {
              //     subtaskIdsArr.push(question.id);
              //     subtasksObj = {
              //       ...subtasksObj,
              //       [question.id]: question,
              //     };
              //   });

              tasksObj = {
                ...tasksObj,
                [courseMaterial.id]: {
                  ...tasksObj[courseMaterial.id],
                  subtaskIds: subtaskIdsArr,
                },
              };
            });

            // console.log(tasksObj);

            columns = {
              ...columns,
              [chapter.id]: {
                ...columns[chapter.id],
                taskIds: taskIdsArr,
              },
            };
          });
          // console.log(columns);
          setAllChapters({
            ...allChapters,
            columnOrder: columnOrder,
            columns: columns,
            tasks: tasksObj,
            subtasks: subtasksObj,
          });

          let newLanguages = { ...languages };
          for (let i = 0; i < res.data.languages.length; i++) {
            newLanguages = {
              ...newLanguages,
              [res.data.languages[i]]: true,
            };
          }
          setLanguages(newLanguages);

          let newCategories = { ...categories };
          for (let i = 0; i < res.data.categories.length; i++) {
            newCategories = {
              ...newCategories,
              [res.data.categories[i]]: true,
            };
          }
          setCategories(newCategories);

          let newCodeLanguages = { ...codeLanguage };
          for (let i = 0; i < res.data.coding_languages.length; i++) {
            newCodeLanguages = {
              ...newCodeLanguages,
              [res.data.coding_languages[i]]: true,
            };
          }
          setCodeLanguage(newCodeLanguages);

          // setting final assessment details
          if (res.data.assessment) {
            setFinalQuiz({
              quiz_id: res.data.assessment.id,
              instructions: res.data.assessment.instructions,
              passing_marks: res.data.assessment.passing_marks,
              is_randomized: res.data.assessment.is_randomized,
            });
            // console.log(data);
            // setFinalQuizQuestions(res.data.assessment.questions);
            setFinalQuizQuestionGroups(res.data.assessment.question_groups);
          } else {
            Service.client
              .post(`/courses/${chosenId}/assessments`, {
                instructions: "",
                passing_marks: 0,
                is_randomized: false,
              })
              .then((res) => {
                console.log(res.data);
                setFinalQuiz({
                  ...res.data,
                  quiz_id: res.data.id,
                });
                setFinalQuizQuestionGroups(res.data.question_groups);
              });
          }
        })
        .catch((err) => console.log(err));
    } else {
      const courseType = localStorage.getItem("courseType");
      // console.log(courseType);
      setCourseDetails({
        ...courseDetails,
        pro: courseType === "pro" ? true : false,
      });
    }
  };

  const handleSaveChapter = (e) => {
    e.preventDefault();
    const data = {
      ...chapterDetails,
      order: numOfChapters,
    };

    Service.client
      .post(`/courses/${courseId}/chapters`, data)
      .then((res) => {
        // console.log(res);
        setChapterDialog(false);
        getCourse();
        setSbOpen(true);
        setSnackbar({
          message: "Chapter created!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        setChapterDetails({
          title: "",
          overview: "",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSaveFinalQuizDetails = () => {
    if (finalQuiz.marks === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Please fill up the required field",
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
      .put(`/courses/${courseId}/assessments/${finalQuiz.quiz_id}`, finalQuiz)
      .then((res) => {
        // console.log(res);
        getCourse();
      })
      .catch((err) => console.log(err));
  };

  const setToNextPage = () => {
    // handleSaveCourseDetails();

    if (!courseId) {
      setSbOpen(true);
      setSnackbar({
        message: "Please fill in course details first",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (allChapters.columnOrder.length === 0) {
      setSbOpen(true);
      setSnackbar({
        message: "Your course should have at least a chapter",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    for (const column in allChapters.columns) {
      if (allChapters.columns[column].course_materials.length === 0) {
        setSbOpen(true);
        setSnackbar({
          message: "You have chapters without materials",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      // for (const material in allChapters.columns[column].course_materials) {
      //   if (
      //     allChapters.columns[column].course_materials[material].material_type === "QUIZ" &&
      //     allChapters.columns[column].course_materials[material].quiz.questions.length === 0
      //   ) {
      //     setSbOpen(true);
      //     setSnackbar({
      //       message: "Every quiz should have at least 1 question",
      //       severity: "error",
      //       anchorOrigin: {
      //         vertical: "bottom",
      //         horizontal: "center",
      //       },
      //       autoHideDuration: 3000,
      //     });
      //     return;
      //   }

      //   if (
      //     allChapters.columns[column].course_materials[material].material_type === "QUIZ" &&
      //     allChapters.columns[column].course_materials[material].quiz.questions.length > 0
      //   ) {
      //     let passingMarks = allChapters.columns[column].course_materials[material].quiz.passing_marks;
      //     let totalMarks = 0;
      //     for (let j = 0; j < allChapters.columns[column].course_materials[material].quiz.questions.length; j++) {
      //       if (allChapters.columns[column].course_materials[material].quiz.questions[j].mrq) {
      //         totalMarks += allChapters.columns[column].course_materials[material].quiz.questions[j].mrq.marks;
      //       }

      //       if (allChapters.columns[column].course_materials[material].quiz.questions[j].mcq) {
      //         totalMarks += allChapters.columns[column].course_materials[material].quiz.questions[j].mcq.marks;
      //       }

      //       if (allChapters.columns[column].course_materials[material].quiz.questions[j].shortanswer) {
      //         totalMarks += allChapters.columns[column].course_materials[material].quiz.questions[j].shortanswer.marks;
      //       }
      //     }

      //     if (passingMarks > totalMarks) {
      //       setSbOpen(true);
      //       setSnackbar({
      //         message: "Quiz passing mark should be lower than or equal to the total marks of quiz",
      //         severity: "error",
      //         anchorOrigin: {
      //           vertical: "bottom",
      //           horizontal: "center",
      //         },
      //         autoHideDuration: 3000,
      //       });
      //       return;
      //     }
      //   }
      // }

      if (pageNum === 2 && finalQuizQuestionGroups.length === 0) {
        setSbOpen(true);
        setSnackbar({
          message: "Your assessments should have at least a question",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }

      // if (pageNum === 2) {
      //   let totalMarks = 0;
      //   for (const obj in finalQuizQuestions.tasks) {
      //     if (finalQuizQuestions.tasks[obj].mcq) {
      //       totalMarks += finalQuizQuestions.tasks[obj].mcq.marks;
      //     }
      //     if (finalQuizQuestions.tasks[obj].mrq) {
      //       totalMarks += finalQuizQuestions.tasks[obj].mrq.marks;
      //     }
      //     if (finalQuizQuestions.tasks[obj].shortanswer) {
      //       totalMarks += finalQuizQuestions.tasks[obj].shortanswer.marks;
      //     }
      //   }

      //   if (finalQuiz.passing_marks > totalMarks) {
      //     setSbOpen(true);
      //     setSnackbar({
      //       message: "Quiz passing mark should be lower than or equal to the total marks of quiz",
      //       severity: "error",
      //       anchorOrigin: {
      //         vertical: "bottom",
      //         horizontal: "center",
      //       },
      //       autoHideDuration: 3000,
      //     });
      //     return;
      //   }
      // }
    }

    if (pageNum === 2) {
      handleSaveFinalQuizDetails();
    }

    setPageNum(pageNum + 1);
  };

  const handleLastPageSave = () => {
    if (isPublished === "true") {
      Service.client
        .patch(`/courses/${courseId}/publish`)
        .then((res) => {
          localStorage.removeItem("courseId");
          history.push(`/partner/home/content`);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .patch(`/courses/${courseId}/unpublish`)
        .then((res) => {
          localStorage.removeItem("courseId");
          history.push(`/partner/home/content`);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      {(() => {
        if (pageNum) {
          if (pageNum === 1) {
            return (
              <Fragment>
                <div className={classes.topSection}>
                  <div style={{ width: "100%" }}>
                    <div className={classes.alert}>
                      <Alert severity="info">
                        This course is for{" "}
                        <span style={{ fontWeight: 600, fontSize: "16px" }}>
                          {courseDetails && courseDetails.pro ? "PRO " : "ALL "}
                        </span>
                        members.
                      </Alert>
                    </div>
                    <Paper className={classes.paper}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: "25%" }}>
                          {coursePicAvatar ? (
                            <div
                              className={classes.coursePicWithoutPlaceholder}
                            >
                              <img
                                alt="course thumbnail"
                                src={coursePicAvatar[0].data}
                                width="100%"
                                height="100%"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            <div className={classes.coursePicPlaceholder}>
                              <Typography
                                variant="h5"
                                style={{ textAlign: "center", color: "#fff" }}
                              >
                                No Course Thumbnail
                              </Typography>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            flexDirection: "column",
                            padding: "24px",
                            width: "75%",
                          }}
                        >
                          <Typography
                            variant="h5"
                            style={{
                              marginRight: "10px",
                              fontWeight: 600,
                              paddingBottom: "5px",
                            }}
                          >
                            {` ${courseDetailsCard && courseDetailsCard.title}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{ marginRight: "10px" }}
                          >
                            {` ${
                              courseDetailsCard && courseDetailsCard.description
                            }`}
                          </Typography>
                        </div>
                        <div>
                          <IconButton onClick={() => setDrawerOpen(true)}>
                            <Edit />
                          </IconButton>
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ margin: "8px" }}>
                    <PageTitle title="Chapters" />
                  </div>
                  <div>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={<Add />}
                      onClick={() => setChapterDialog(true)}
                      style={{ margin: "8px" }}
                    >
                      Add New Chapter
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<PlaylistAddCheck />}
                      onClick={() => setQuestionBankModalOpen(true)}
                      style={{ margin: "8px" }}
                    >
                      Question Bank
                    </Button>
                  </div>
                </div>
                <div className={classes.kanban}>
                  <CourseKanbanBoard
                    courseId={courseId}
                    state={allChapters}
                    setState={setAllChapters}
                    getCourse={getCourse}
                    setQuestionBankModalOpen={setQuestionBankModalOpen}
                  />
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setToNextPage();
                  }}
                  style={{ float: "right", marginBottom: "20px" }}
                >
                  Next
                </Button>
              </Fragment>
            );
          } else if (pageNum === 2) {
            return (
              <Fragment>
                <div className={classes.topSection}>
                  <div style={{ maxWidth: "100%" }}>
                    <div className={classes.alert}>
                      <Alert severity="info">
                        This course is for{" "}
                        {courseDetails && courseDetails.pro ? "Pro" : "all"}{" "}
                        members.
                      </Alert>
                    </div>
                    <Paper className={classes.paper}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ width: "25%" }}>
                          {coursePicAvatar ? (
                            <div
                              className={classes.coursePicWithoutPlaceholder}
                            >
                              <img
                                alt="course thumbnail"
                                src={coursePicAvatar[0].data}
                                width="100%"
                                height="100%"
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                          ) : (
                            <div className={classes.coursePicPlaceholder}>
                              <Typography
                                variant="h5"
                                style={{ textAlign: "center", color: "#fff" }}
                              >
                                No Course Thumbnail
                              </Typography>
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            flexDirection: "column",
                            padding: "24px",
                            width: "75%",
                          }}
                        >
                          <Typography
                            variant="h5"
                            style={{
                              marginRight: "10px",
                              fontWeight: 600,
                              paddingBottom: "5px",
                            }}
                          >
                            {` ${courseDetailsCard && courseDetailsCard.title}`}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{ marginRight: "10px" }}
                          >
                            {` ${
                              courseDetailsCard && courseDetailsCard.description
                            }`}
                          </Typography>
                        </div>
                        <div>
                          <IconButton onClick={() => setDrawerOpen(true)}>
                            <Edit />
                          </IconButton>
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div style={{ margin: "8px" }}>
                      <PageTitle title="Final Quiz" />
                    </div>
                    <div>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlaylistAddCheck />}
                        onClick={() => setQuestionBankModalOpen(true)}
                        style={{ margin: "8px" }}
                      >
                        Question Bank
                      </Button>
                    </div>
                  </div>
                </div>
                {/* <QuizKanbanBoard
                  finalQuiz={finalQuiz}
                  getCourse={getCourse}
                  finalQuizQuestions={finalQuizQuestions}
                  setFinalQuizQuestions={setFinalQuizQuestions}
                /> */}
                <div className={classes.container}>
                  <AssessmentCreation
                    courseId={courseId}
                    quiz={finalQuiz}
                    setQuiz={setFinalQuiz}
                    questionGroups={finalQuizQuestionGroups}
                    setQuestionGroups={setFinalQuizQuestionGroups}
                    getCourse={getCourse}
                    setQuestionBankModalOpen={setQuestionBankModalOpen}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "8px 0 32px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPageNum(1)}
                    style={{ float: "right" }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setToNextPage()}
                    style={{ float: "right" }}
                  >
                    Next
                  </Button>
                </div>
              </Fragment>
            );
          } else if (pageNum === 3) {
            return (
              <Fragment>
                <PageTitle title="Visibility of Course" />
                <label>
                  <Typography style={{ marginBottom: "10px" }}>
                    Select option below to publish course or not
                  </Typography>
                </label>

                <RadioGroup
                  value={isPublished}
                  onChange={(e) => setIsPublished(e.target.value)}
                  style={{ marginBottom: "30px" }}
                >
                  <FormControlLabel
                    value="false"
                    control={<Radio color="primary" />}
                    label="Save but do not publish on Codeine yet"
                  />
                  <FormControlLabel
                    value="true"
                    control={<Radio color="primary" />}
                    label="Save and publish on Codeine"
                  />
                </RadioGroup>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setPageNum(2)}
                    style={{ float: "right" }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleLastPageSave()}
                    style={{ float: "right" }}
                  >
                    Save
                  </Button>
                </div>
              </Fragment>
            );
          }
        }
      })()}

      <CourseDetailsDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        coursePicAvatar={coursePicAvatar}
        setCoursePicAvatar={setCoursePicAvatar}
        courseDetails={courseDetails}
        setCourseDetails={setCourseDetails}
        languages={languages}
        setLanguages={setLanguages}
        categories={categories}
        setCategories={setCategories}
        handleSaveCourseDetails={handleSaveCourseDetails}
        drawerPageNum={drawerPageNum}
        setDrawerPageNum={setDrawerPageNum}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        courseId={courseId}
        setSbOpen={setSbOpen}
        setSnackbar={setSnackbar}
      />
      <Dialog
        open={chapterDialog}
        onClose={() => {
          setChapterDialog(false);
        }}
        PaperProps={{
          style: {
            minWidth: "600px",
          },
        }}
      >
        <form onSubmit={handleSaveChapter}>
          <DialogTitle>Create a New Chapter</DialogTitle>
          <DialogContent>
            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="title">
                <Typography variant="body2">Chapter Title</Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Enter Chapter Title"
                value={chapterDetails && chapterDetails.title}
                onChange={(e) => {
                  setChapterDetails({
                    ...chapterDetails,
                    title: e.target.value,
                  });
                }}
                required
              />
            </div>

            <div>
              <label htmlFor="title">
                <Typography variant="body2">Chapter Overview</Typography>
              </label>
              <TextField
                id="title"
                variant="outlined"
                fullWidth
                margin="dense"
                multiline
                rows={8}
                placeholder="Enter Chapter Overview"
                value={chapterDetails && chapterDetails.overview}
                onChange={(e) => {
                  setChapterDetails({
                    ...chapterDetails,
                    overview: e.target.value,
                  });
                }}
                required
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={classes.dialogButtons}
              onClick={() => {
                setChapterDialog(false);
                setChapterDetails({
                  title: "",
                  overview: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.dialogButtons}
              type="submit"
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        PaperProps={{
          style: {
            width: "500px",
          },
        }}
      >
        <DialogTitle>Contribute to Codeine's Cause!</DialogTitle>
        <DialogContent>
          Kindly make a contribution this month if you wish to publish new
          courses.
        </DialogContent>
        <DialogActions>
          <Button
            className={classes.dialogButtons}
            onClick={() => {
              setPaymentDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => history.push(`/partner/home/contributions`)}
          >
            Go To Contributions
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={questionBankModalOpen}
        onClose={() => setQuestionBankModalOpen(false)}
        PaperProps={{
          style: {
            minWidth: "600px",
            maxWidth: "none",
          },
        }}
      >
        <QuestionBankModal
          courseId={courseId}
          closeDialog={() => setQuestionBankModalOpen(false)}
        />
      </Dialog>
    </Fragment>
  );
};

export default CourseCreation;
