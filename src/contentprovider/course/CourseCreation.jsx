import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import CourseDetailsDrawer from "./components/CourseDetailsDrawer";

import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";
import CourseKanbanBoard from "./components/CourseKanbanBoard";

const useStyles = makeStyles((theme) => ({}));

const CourseCreation = () => {
  const classes = useStyles();

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

  const [courseId, setCourseId] = useState();

  // console.log(courseDetails);

  const handleSaveCourseDetails = () => {
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

    let data = {
      ...courseDetails,
      coding_languages: [],
      languages: [],
      categories: [],
      price: 20,
      thumbnail: coursePicAvatar[0].file,
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
    console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append(
      "learning_objectives",
      JSON.stringify(data.learning_objectives)
    );
    formData.append("requirements", JSON.stringify(data.requirements));
    formData.append("introduction_video_url", data.requirements);
    formData.append("thumbnail", data.thumbnail);
    formData.append("coding_languages", JSON.stringify(data.coding_languages));
    formData.append("languages", JSON.stringify(data.languages));
    formData.append("categories", JSON.stringify(data.categories));
    formData.append("price", data.price);
    formData.append("exp_points", data.exp_points);

    if (courseId) {
      Service.client
        .put(`/courses/${courseId}`, formData)
        .then((res) => {
          console.log(res);
          setDrawerOpen(false);
          setDrawerPageNum(1);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .post(`/courses`, formData)
        .then((res) => {
          console.log(res);
          setDrawerOpen(false);
          setDrawerPageNum(1);
          localStorage.setItem("courseId", res.data.id);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("courseId");
    setCourseId(id);
    if (id) {
      Service.client
        .get(`/courses/${id}`)
        .then((res) => {
          console.log(res);
          setCourseDetails({
            title: res.data.title,
            description: res.data.description,
            learning_objectives: res.data.description,
            requirements: res.data.requirements,
            introduction_video_url: res.data.introduction_video_url,
            exp_points: res.data.exp_points,
          });
          const obj = {
            data: res.data.thumbnail,
          };
          setCoursePicAvatar([obj]);

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
        })
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div style={{ marginBottom: "20px" }}>
        <Button startIcon={<Edit />} onClick={() => setDrawerOpen(true)}>
          Edit Course Details
        </Button>
      </div>
      <CourseKanbanBoard />
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
      />
    </Fragment>
  );
};

export default CourseCreation;
