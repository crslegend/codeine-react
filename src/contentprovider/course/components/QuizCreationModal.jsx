import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  Divider,
  Card,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";

import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "65vw",
    margin: `${theme.spacing(1)}px 0`,
    display: "flex",
    height: "65vh",
  },
  leftContainer: {
    width: "40%",
    marginRight: theme.spacing(2),
  },
  rightContainer: {
    width: "60%",
    marginLeft: theme.spacing(2),
  },
  cardRoot: {
    margin: `${theme.spacing(1)}px 0`,
    padding: theme.spacing(1),
    backgroundColor: "#fcfcfc",
  },
}));

const QuestionGroupCard = ({ questionGroup, classes }) => {
  return (
    <Card className={classes.cardRoot}>
      <Typography style={{ fontSize: "14px" }}>Question Bank: </Typography>
      <Typography style={{ color: "#676767", fontSize: "12px" }}>Pick 4 out of 5 questions</Typography>
      <Typography style={{ color: "#1e1e1e", fontSize: "12px", margin: "8px 0" }}>Total marks: 4</Typography>
    </Card>
  );
};

const QuizCreationModel = ({ courseId, quiz, setQuiz, questionGroups, setQuestionGroups }) => {
  const classes = useStyles();
  console.log(quiz);

  // question group/bank state
  const [questionBanks, setQuestionBanks] = useState();
  const [questionBankModalOpen, setQuestionBankModalOpen] = useState(false);

  // fetch course question groups
  useEffect(() => {
    Service.client.get(`/courses/${courseId}/question-banks`).then((res) => {
      setQuestionBanks(res.data);
    });
    setQuestionGroups([1, 2]);
  }, [courseId]);

  return (
    <Fragment>
      <div className={classes.root}>
        <div className={classes.leftContainer}>
          <label htmlFor="title">
            <Typography variant="body2">Quiz Title (Required)</Typography>
          </label>
          <TextField
            id="title"
            variant="outlined"
            fullWidth
            autoFocus
            margin="dense"
            value={quiz && quiz.title}
            onChange={(e) => {
              setQuiz({
                ...quiz,
                title: e.target.value,
              });
            }}
            required
            placeholder="Enter Title"
            style={{ marginBottom: "15px" }}
            inputProps={{ style: { fontSize: "14px" } }}
          />
          <label htmlFor="description">
            <Typography variant="body2">Quiz Description (Required)</Typography>
          </label>
          <TextField
            id="description"
            variant="outlined"
            fullWidth
            margin="dense"
            value={quiz && quiz.description}
            onChange={(e) => {
              setQuiz({
                ...quiz,
                description: e.target.value,
              });
            }}
            multiline
            rows={4}
            required
            placeholder="Enter a description or some instructions"
            style={{ marginBottom: "15px" }}
            inputProps={{ style: { fontSize: "14px" } }}
          />
          <label htmlFor="marks">
            <Typography variant="body2">Marks to Pass (Required)</Typography>
          </label>
          <TextField
            id="marks"
            variant="outlined"
            fullWidth
            margin="dense"
            value={quiz && quiz.passing_marks}
            onChange={(e) => {
              setQuiz({
                ...quiz,
                passing_marks: e.target.value,
              });
            }}
            InputProps={{
              inputProps: { min: 0, style: { fontSize: "14px" } },
            }}
            required
            style={{ marginBottom: "15px" }}
            type="number"
          />
        </div>
        <Divider orientation="vertical" flexItem />
        <div className={classes.rightContainer}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" style={{ alignItems: "baseline" }}>
              Questions
            </Typography>
            <IconButton style={{ marginLeft: 8 }} size="small" onClick={() => setQuestionBankModalOpen(true)}>
              <Add fontSize="small" />
            </IconButton>
          </div>
          {questionGroups && questionGroups.length > 0 ? (
            questionGroups.map((questionGroup, i) => (
              <QuestionGroupCard key={i} questionGroup={questionGroup} classes={classes} />
            ))
          ) : (
            <div
              style={{ display: "flex", width: "100%", height: "90%", alignItems: "center", justifyContent: "center" }}
            >
              <Typography variant="body2" style={{ margin: 8, color: "#676767" }}>
                No questions added
              </Typography>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={questionBankModalOpen}
        onClose={() => {
          setQuestionBankModalOpen(false);
        }}
        PaperProps={{
          style: {
            width: "600px",
          },
        }}
      >
        <DialogTitle>
          <Typography variant="h6">Add Question Bank</Typography>
        </DialogTitle>
        <DialogContent></DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default QuizCreationModel;
