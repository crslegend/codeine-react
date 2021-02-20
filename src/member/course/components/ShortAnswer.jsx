import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, TextField, Typography } from "@material-ui/core";

const styles = makeStyles((theme) => ({}));

const ShortAnswer = ({
  question,
  index,
  setPageNum,
  resultObj,
  setResultObj,
  quizLength,
}) => {
  const classes = styles();
  console.log(question);

  const [enteredAnswer, setEnteredAnswer] = useState("");
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleCheckAnswer = () => {
    setDisplayAnswer(true);

    const result = question.shortanswer.keywords.some((keyword) =>
      enteredAnswer.includes(keyword)
    );

    setCorrect(result);
  };

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
        <TextField
          variant="outlined"
          margin="dense"
          placeholder="Enter your answer here"
          multiline
          rows={2}
          fullWidth
          value={enteredAnswer}
          onChange={(e) => setEnteredAnswer(e.target.value)}
        />
        {displayAnswer &&
          displayAnswer &&
          (correct ? (
            <Typography style={{ color: "green" }} variant="body2">
              Correct answer. Well Done!
            </Typography>
          ) : (
            <Typography style={{ color: "red" }} variant="body2">
              Wrong answer. The correct keyword(s) includes{" "}
              {question.shortanswer.keywords.length > 0 &&
                question.shortanswer.keywords.map((answer, index) => {
                  if (index + 1 === question.shortanswer.keywords.length) {
                    return `${answer}.`;
                  }
                  return `${answer}, `;
                })}
            </Typography>
          ))}
        <div style={{ marginTop: "10px" }}>
          <Button
            variant="contained"
            disabled={!enteredAnswer || enteredAnswer === ""}
            onClick={() => handleCheckAnswer()}
          >
            Check Answer
          </Button>
        </div>
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

export default ShortAnswer;
