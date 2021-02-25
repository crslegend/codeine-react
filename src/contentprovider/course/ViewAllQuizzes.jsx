import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Radio,
  Typography,
} from "@material-ui/core";
import { ArrowBack, Assignment } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    alignItems: "center",
  },
  materialSection: {
    marginTop: "10px",
  },
  assessmentSection: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  quiz: {
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    border: "2px solid lightgrey",
    borderRadius: "6px",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
  },
  emptySection: {
    width: "85%",
    marginLeft: "auto",
    marginRight: "auto",
    border: "2px solid lightgrey",
    borderRadius: "10px",
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(3),
  },
  question: {
    border: "2px solid lightgrey",
    borderRadius: "6px",
    marginBottom: "10px",
    padding: theme.spacing(2),
  },
}));

const ViewAllQuizzes = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [materialQuiz, setMaterialQuiz] = useState([]);
  const [assessment, setAssessment] = useState();

  const getAllQuizzes = () => {
    Service.client
      .get(`/quiz`, { params: { course_id: id } })
      .then((res) => {
        console.log(res);

        let arr = [];
        let obj;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].course) {
            obj = res.data[i];
          } else {
            arr.push(res.data[i]);
          }
        }

        setAssessment(obj);
        setMaterialQuiz(arr);
      })
      .catch((err) => console.log(err));
  };

  console.log(assessment);
  console.log(materialQuiz);

  useEffect(() => {
    getAllQuizzes();
  }, []);

  const MCQ = (question, index) => {
    return (
      <Fragment>
        <Typography variant="h6">
          {`Q${index + 1}. ${question.title}`}
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          Marks for this question: {question.mcq.marks}
        </Typography>
        {question.mcq.options &&
          question.mcq.options.length > 0 &&
          question.mcq.options.map((option) => {
            return (
              <FormControlLabel
                value={option}
                control={
                  <Radio
                    checked={
                      question.mcq.correct_answer &&
                      question.mcq.correct_answer === option
                    }
                    disabled
                  />
                }
                label={option}
              />
            );
          })}
      </Fragment>
    );
  };

  const MRQ = (question, index) => {
    return (
      <Fragment>
        <Typography variant="h6">
          {`Q${index + 1}. ${question.title}`}
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          Marks for this question: {question.mrq.marks}
        </Typography>
        {question.mrq.options &&
          question.mrq.options.length > 0 &&
          question.mrq.options.map((option) => {
            return (
              <FormControlLabel
                value={option}
                control={
                  <Checkbox
                    checked={
                      question.mrq.correct_answer &&
                      question.mrq.correct_answer.includes(option)
                    }
                    disabled
                  />
                }
                label={option}
              />
            );
          })}
      </Fragment>
    );
  };

  const ShortAnswer = (question, index) => {
    return (
      <Fragment>
        <Typography variant="h6">
          {`Q${index + 1}. ${question.title}`}
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          Marks for this question: {question.shortanswer.marks}
        </Typography>
        <Typography>
          Keywords: {question && question.shortanswer.keywords.join(", ")}
        </Typography>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <IconButton
          onClick={() => history.push(`/partner/home/content/view/${id}`)}
          style={{ marginRight: "30px" }}
        >
          <ArrowBack />
        </IconButton>
        <PageTitle title="View All Quizzes" />
      </div>
      <div className={classes.materialSection}>
        <Typography
          variant="h5"
          style={{ textAlign: "center", paddingBottom: "20px" }}
        >
          Course Material Quizzes
        </Typography>
        {materialQuiz && materialQuiz.length > 0 ? (
          materialQuiz.map((quiz, index) => {
            return (
              <div key={index} className={classes.quiz}>
                <div style={{ paddingBottom: "10px" }}>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    {`Quiz ${index + 1}`}
                  </Typography>
                  <Typography variant="h6" style={{ fontWeight: 600 }}>
                    Instructions:{" "}
                  </Typography>
                  <Typography variant="h6">{quiz.instructions}</Typography>
                </div>
                <div style={{ display: "flex", paddingBottom: "10px" }}>
                  <Typography variant="h6">
                    <span style={{ fontWeight: 600 }}>Passing Marks:</span>{" "}
                    {quiz.passing_marks}
                  </Typography>
                </div>
                {quiz.questions &&
                  quiz.questions.length > 0 &&
                  quiz.questions.map((question, index1) => {
                    return (
                      <div key={index1} className={classes.question}>
                        {(() => {
                          if (question.mcq) {
                            return MCQ(question, index1);
                          } else if (question.mrq) {
                            return MRQ(question, index1);
                          } else if (question.shortanswer) {
                            return ShortAnswer(question, index1);
                          } else {
                            return null;
                          }
                        })()}
                      </div>
                    );
                  })}
              </div>
            );
          })
        ) : (
          <div className={classes.emptySection}>
            <Assignment fontSize="large" />
            <Typography variant="h6">No Quizzes For This Course</Typography>
          </div>
        )}
      </div>
      <div className={classes.assessmentSection}>
        <Typography
          variant="h5"
          style={{ textAlign: "center", paddingBottom: "20px" }}
        >
          Final Assessment
        </Typography>
        {assessment && assessment && (
          <div className={classes.quiz}>
            <div style={{ paddingBottom: "10px" }}>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                Final Assessment
              </Typography>
              <Typography variant="h6" style={{ fontWeight: 600 }}>
                Instructions:{" "}
              </Typography>
              <Typography variant="h6">{assessment.instructions}</Typography>
            </div>

            <div style={{ display: "flex", paddingBottom: "10px" }}>
              <Typography variant="h6">
                <span style={{ fontWeight: 600 }}>Passing Marks:</span>{" "}
                {assessment.passing_marks}
              </Typography>
            </div>
            {assessment.questions &&
              assessment.questions.length > 0 &&
              assessment.questions.map((question, index1) => {
                return (
                  <div key={index1} className={classes.question}>
                    {(() => {
                      if (question.mcq) {
                        return MCQ(question, index1);
                      } else if (question.mrq) {
                        return MRQ(question, index1);
                      } else if (question.shortanswer) {
                        return ShortAnswer(question, index1);
                      } else {
                        return null;
                      }
                    })()}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ViewAllQuizzes;
