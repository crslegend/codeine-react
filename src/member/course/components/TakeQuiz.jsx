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
      {(() => {
        if (pageNum === -1) {
          return (
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
                onClick={() => setPageNum(0)}
                style={{ width: 150, alignSelf: "center" }}
              >
                Start Quiz
              </Button>
            </Paper>
          );
        }
      })()}
    </Fragment>
  );
};

export default TakeQuiz;
