import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";

const styles = makeStyles((theme) => ({}));

const MCQ = ({ question, index, pageNum, setPageNum, quizLength }) => {
  const classes = styles();
  console.log(question);

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
        <div style={{ display: "flex", flexDirection: "column" }}>
          {question &&
            question.mcq.options.length > 0 &&
            question.mcq.options.map((option) => {
              return (
                <FormControlLabel
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
              Wrong answer. The correct answer is {question.mcq.correct_answer}
            </Typography>
          ))}
        <div style={{ marginTop: "15px" }}>
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
            marginTop: "15px",
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setPageNum(index + 1);
            }}
          >
            Next
          </Button>
        </div>
      </Paper>
    </Fragment>
  );
};

export default MCQ;
