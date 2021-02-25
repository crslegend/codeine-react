import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControlLabel,
  Paper,
  Radio,
  Typography,
} from "@material-ui/core";

import Service from "../../../../AxiosService";

const styles = makeStyles((theme) => ({}));

const MCQ = ({
  question,
  index,
  setPageNum,
  resultObj,
  setResultObj,
  quizLength,
  quizType,
  materialId,
  progressArr,
  setProgressArr,
  courseId,
  progress,
  setProgress,
}) => {
  const classes = styles();
  console.log(question);
  // console.log(resultObj);

  const [chosenOption, setChosenOption] = useState();
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleOptionChange = (option) => {
    setDisplayAnswer(false);
    setChosenOption(option);
  };

  const handleCheckAnswer = () => {
    setDisplayAnswer(true);
    if (chosenOption === question.mcq.correct_answer) {
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  };

  const handleSaveResponse = () => {
    const data = {
      response: chosenOption,
      responses: null,
      question: question.id,
    };

    Service.client
      .put(`/quizResults/${resultObj.id}`, data)
      .then((res) => {
        console.log(res);
        setResultObj(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleFinishQuiz = () => {
    const data = {
      response: chosenOption,
      responses: null,
      question: question.id,
    };

    Service.client
      .put(`/quizResults/${resultObj.id}`, data)
      .then((res) => {
        console.log(res);

        Service.client
          .patch(`/quizResults/${resultObj.id}/submit`)
          .then((res) => {
            console.log(res);
            setResultObj(res.data);
            setPageNum(index + 1);

            if (
              res.data.passed &&
              !progressArr.includes(materialId) &&
              quizType === "QUIZ"
            ) {
              let arr = [...progressArr];
              arr.push(materialId);
              setProgressArr(arr);

              Service.client
                .patch(`/courses/${courseId}/enrollments`, arr)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => console.log(err));
            } else if (res.data.passed && quizType === "FINAL") {
              Service.client
                .get(`enrollments`, { params: { courseId: courseId } })
                .then((res) => {
                  console.log(res);
                  setProgress(res.data[0].progress);
                  if (!res.data[0].materials_done) {
                    setProgressArr([]);
                  } else {
                    setProgressArr(res.data[0].materials_done);
                  }
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  const loadPrevAnswer = (response) => {
    setChosenOption(response);
  };

  useEffect(() => {
    if (
      resultObj &&
      resultObj.quiz_answers[index] &&
      resultObj.quiz_answers[index].response !== null
    ) {
      loadPrevAnswer(resultObj.quiz_answers[index].response);
    }
  }, []);

  console.log(chosenOption);

  return (
    <Fragment>
      <Paper
        style={{
          padding: "30px",
        }}
      >
        <div style={{ display: "flex", marginBottom: "15px" }}>
          <Typography
            variant="h6"
            style={{ fontWeight: 600, paddingRight: "10px" }}
          >
            Q{`${index + 1}. `}
          </Typography>
          <Typography variant="h6">{question.title}</Typography>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "20px",
          }}
        >
          {question &&
            question.mcq.options.length > 0 &&
            question.mcq.options.map((option, index) => {
              return (
                <FormControlLabel
                  key={index}
                  value={option}
                  label={option}
                  control={
                    <Radio
                      checked={chosenOption === option}
                      onChange={() => handleOptionChange(option)}
                    />
                  }
                />
              );
            })}
        </div>
        {displayAnswer &&
          displayAnswer &&
          (correct ? (
            <Typography style={{ color: "green" }} variant="body2">
              Correct answer. Well Done!
            </Typography>
          ) : (
            <Typography style={{ color: "red" }} variant="body2">
              Wrong answer. The correct answer is {question.mcq.correct_answer}.
            </Typography>
          ))}
        {quizType && quizType === "QUIZ" ? (
          <div style={{ marginTop: "10px" }}>
            <Button
              variant="contained"
              disabled={!chosenOption}
              onClick={() => handleCheckAnswer()}
            >
              Check Answer
            </Button>
          </div>
        ) : null}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              // handleSaveResponse();
              setPageNum(index - 1);
            }}
          >
            Back
          </Button>
          {quizLength && quizLength === index + 1 ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setPageNum(index + 1);
              }}
            >
              Finish
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // handleSaveResponse();
                setPageNum(index + 1);
              }}
            >
              Next
            </Button>
          )}
        </div>
      </Paper>
    </Fragment>
  );
};

export default MCQ;
