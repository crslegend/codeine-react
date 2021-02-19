import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import MCQ from "./MCQ";

const styles = makeStyles((theme) => ({
  button: {
    width: 100,
  },
}));

const TakeQuiz = ({ quiz }) => {
  const classes = styles();
  console.log(quiz);

  const [pageNum, setPageNum] = useState(-1);

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
              onClick={() => setPageNum(pageNum + 1)}
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
                    question={question}
                    index={index}
                    pageNum={pageNum}
                    setPageNum={setPageNum}
                    quizLength={quiz && quiz.questions.length}
                  />
                );
              }
            } else {
              return null;
            }
          })
        : null}
    </Fragment>
  );
};

export default TakeQuiz;
