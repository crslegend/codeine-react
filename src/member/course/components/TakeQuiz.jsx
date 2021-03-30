import React, { Fragment } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, Typography } from "@material-ui/core";
import MCQ from "./Mcq";
import MRQ from "./Mrq";
import ShortAnswer from "./ShortAnswer";
// import Service from "../../../AxiosService";

// const styles = makeStyles((theme) => ({
//   button: {
//     width: 100,
//   },
// }));

const TakeQuiz = ({
  quiz,
  quizTitle,
  quizType,
  pageNum,
  setPageNum,
  resultObj,
  setResultObj,
  handleCreateQuizResult,
  materialId,
  progressArr,
  setProgressArr,
  courseId,
  progress,
  setProgress,
}) => {
  // const classes = styles();
  console.log(resultObj);

  // const [pageNum, setPageNum] = useState(-1);
  // const [resultObj, setResultObj] = useState();

  // const handleCreateQuizResult = () => {
  //   Service.client
  //     .post(`/quiz/${quiz.id}/results`)
  //     .then((res) => {
  //       console.log(res);
  //       setResultObj(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const handleRetryQuiz = () => {
    handleCreateQuizResult(quiz && quiz.id);
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
            <Typography
              variant="h4"
              style={{ fontWeight: 600, paddingBottom: "20px" }}
            >
              {quizTitle && quizTitle ? quizTitle : "Final Quiz"}
            </Typography>
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
                setPageNum(pageNum + 1);
              }}
              style={{ width: 150, alignSelf: "center" }}
            >
              Start Quiz
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
                    quizType={quizType}
                    materialId={materialId}
                    progressArr={progressArr}
                    setProgressArr={setProgressArr}
                    courseId={courseId}
                    progress={progress}
                    setProgress={setProgress}
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
                    quizType={quizType}
                    materialId={materialId}
                    progressArr={progressArr}
                    setProgressArr={setProgressArr}
                    courseId={courseId}
                    progress={progress}
                    setProgress={setProgress}
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
                    quizType={quizType}
                    materialId={materialId}
                    progressArr={progressArr}
                    setProgressArr={setProgressArr}
                    courseId={courseId}
                    progress={progress}
                    setProgress={setProgress}
                  />
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          })
        : null}
      {pageNum && pageNum > quiz.questions.length - 1 ? (
        <Paper style={{ padding: "50px", textAlign: "center" }}>
          <Typography
            variant="h5"
            style={{ fontWeight: 600, paddingBottom: "10px" }}
          >
            End of Quiz
          </Typography>
          {quizType && quizType === "QUIZ" ? (
            <Fragment>
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
            </Fragment>
          ) : (
            <Fragment>
              {resultObj && resultObj.passed && (
                <div>
                  <Typography variant="h6" style={{ paddingBottom: "5px" }}>
                    Result: <span style={{ color: "green" }}>Passed</span>
                  </Typography>
                  <Typography variant="body1" style={{ paddingBottom: "25px" }}>
                    Congratulations! You have cleared this course!
                  </Typography>
                </div>
              )}

              {resultObj && !resultObj.passed && (
                <div>
                  <Typography variant="h6" style={{ paddingBottom: "5px" }}>
                    Result: <span style={{ color: "red" }}>Failed</span>
                  </Typography>
                  <Typography variant="body1" style={{ paddingBottom: "25px" }}>
                    You did not pass the final quiz. Try Again!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRetryQuiz()}
                  >
                    Re-try Quiz
                  </Button>
                </div>
              )}
            </Fragment>
          )}
        </Paper>
      ) : null}
    </Fragment>
  );
};

export default TakeQuiz;
