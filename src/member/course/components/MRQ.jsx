import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
} from "@material-ui/core";

const styles = makeStyles((theme) => ({}));

const MRQ = ({
  question,
  index,
  setPageNum,
  resultObj,
  setResultObj,
  quizLength,
}) => {
  const classes = styles();
  console.log(question);

  const [chosenOption, setChosenOption] = useState([]);
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [correct, setCorrect] = useState(false);

  const handleOptionChange = (e, option) => {
    if (e.target.checked) {
      let newArr = [...chosenOption];
      newArr.push(option);
      setChosenOption(newArr);
    } else {
      const arr = chosenOption.filter((existing) => existing !== option);
      setChosenOption(arr);
    }

    setDisplayAnswer(false);
  };

  const handleCheckAnswer = () => {
    setDisplayAnswer(true);
    if (chosenOption.length === question.mrq.correct_answer.length) {
      for (let i = 0; i < chosenOption.length; i++) {
        if (!question.mrq.correct_answer.includes(chosenOption[i])) {
          setCorrect(false);
          return;
        }
      }
      setCorrect(true);
    } else {
      setCorrect(false);
    }
  };

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
            question.mrq.options.length > 0 &&
            question.mrq.options.map((option, index) => {
              return (
                <FormControlLabel
                  key={index}
                  label={option}
                  control={
                    <Checkbox
                      checked={chosenOption && chosenOption.includes(option)}
                      onChange={(e) => handleOptionChange(e, option)}
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
              Wrong answer. The correct answers are{" "}
              {question.mrq.correct_answer.length > 0 &&
                question.mrq.correct_answer.map((answer, index) => {
                  if (index + 1 === question.mrq.correct_answer.length) {
                    return `${answer}.`;
                  }
                  return `${answer}, `;
                })}
            </Typography>
          ))}
        <div style={{ marginTop: "10px" }}>
          <Button
            variant="contained"
            disabled={!chosenOption}
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

export default MRQ;
