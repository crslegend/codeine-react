import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";
import { Edit } from "@material-ui/icons";
import CourseDetailsDrawer from "./components/CourseDetailsDrawer";

import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({}));

const CourseCreation = () => {
  const classes = useStyles();

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

  // console.log(courseDetails);

  const handleSaveCourseDetails = () => {
    setDrawerOpen(false);
    setDrawerPageNum(1);

    let data = {
      ...courseDetails,
      coding_languages: [],
      languages: [],
      categories: [],
      price: 20,
      thumbnail: coursePicAvatar[0].data,
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

    Service.client
      .post(`/courses/`, formData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <div>
        <Button startIcon={<Edit />} onClick={() => setDrawerOpen(true)}>
          Edit Course Details
        </Button>
      </div>
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
      />
    </Fragment>
  );
};

export default CourseCreation;
