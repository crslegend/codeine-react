import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, Typography } from "@material-ui/core";
import MCQ from "./MCQ";
import MRQ from "./MRQ";
import ShortAnswer from "./ShortAnswer";
import Service from "../../../AxiosService";

const styles = makeStyles((theme) => ({
  button: {
    width: 100,
  },
}));

const TakeQuiz = ({ quiz }) => {
  const classes = styles();
  console.log(quiz);

  const [pageNum, setPageNum] = useState(-1);
  const [resultObj, setResultObj] = useState();

  const handleCreateQuizResult = () => {
    Service.client
      .post(`/quiz/${quiz.id}/results`)
      .then((res) => {
        console.log(res);
        setResultObj(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleRetryQuiz = () => {
    setResultObj();
    setPageNum(-1);
  };

  return (
    <Fragment>
      {pageNum && pageNum === -1 ? (
        <Fragment>
          <Paper
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "30px",
            }}
          >
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              Instructions
            </Typography>
            <Typography style={{ paddingBottom: "20px" }}>
              {quiz.instructions}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleCreateQuizResult();
                setPageNum(pageNum + 1);
              }}
              style={{ width: 150, alignSelf: "center" }}
            >
              Enter Quiz
            </Button>
          </Paper>
        </Fragment>
      ) : null}
      {quiz && quiz.questions.length > 0
        ? quiz.questions.map((question, index) => {
            if (pageNum === index) {
              if (question.mcq) {
                return (
                  <MCQ
                    key={index}
                    question={question}
                    index={index}
                    setPageNum={setPageNum}
                    resultObj={resultObj}
                    setResultObj={setResultObj}
                    quizLength={quiz && quiz.questions.length}
                  />
                );
              } else if (question.mrq) {
                return (
                  <MRQ
                    key={index}
                    question={question}
                    index={index}
                    setPageNum={setPageNum}
                    resultObj={resultObj}
                    setResultObj={setResultObj}
                    quizLength={quiz && quiz.questions.length}
                  />
                );
              } else if (question.shortanswer) {
                return (
                  <ShortAnswer
                    key={index}
                    question={question}
                    index={index}
                    setPageNum={setPageNum}
                    resultObj={resultObj}
                    setResultObj={setResultObj}
                    quizLength={quiz && quiz.questions.length}
                  />
                );
              }
            } else {
              return null;
            }
          })
        : null}
      {pageNum && pageNum > quiz.questions.length - 1 ? (
        <Paper style={{ padding: "50px", textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            style={{ fontWeight: 600, paddingBottom: "10px" }}
          >
            End of Quiz
          </Typography>
          <Typography variant="body1" style={{ paddingBottom: "25px" }}>
            {resultObj && resultObj.passed
              ? "Well Done! You passed the quiz!"
              : "You did not pass the quiz. Try Again!"}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRetryQuiz()}
          >
            Re-try Quiz
          </Button>
        </Paper>
      ) : null}
    </Fragment>
  );
};

export default TakeQuiz;