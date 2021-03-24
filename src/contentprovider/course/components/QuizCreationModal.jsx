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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  FormControlLabel,
  Switch,
  Button,
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
  resizeFont: {
    fontSize: "14px",
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "7px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  toggleRoot: {
    margin: "16px 0",
  },
  toggleLabel: {
    fontSize: "14px",
    margin: "0 8px",
  },
  button: {
    textTransform: "none",
  },
}));

const getQuestionMarks = (question) => {
  if (question.mcq) {
    return question.mcq.marks;
  }
  if (question.mrq) {
    return question.mrq.marks;
  }
  return question.shortanswer.marks;
};

const QuestionGroupCard = ({ questionGroup, classes }) => {
  // console.log(questionGroup);

  const getTotalMarks = () => {
    return questionGroup.count * getQuestionMarks(questionGroup.question_bank.questions[0]);
  };
  return (
    <Card className={classes.cardRoot}>
      <Typography style={{ fontSize: "14px" }}>Question Bank: {questionGroup.question_bank.label}</Typography>
      <Typography style={{ color: "#676767", fontSize: "12px" }}>
        Pick {questionGroup.count} out of {questionGroup.question_bank.questions.length} questions
      </Typography>
      <Typography style={{ color: "#1e1e1e", fontSize: "12px", margin: "8px 0" }}>
        Total marks: {getTotalMarks()}
      </Typography>
    </Card>
  );
};

const QuizCreationModel = ({ courseId, quiz, setQuiz, questionGroups, setQuestionGroups }) => {
  const classes = useStyles();
  // console.log(quiz);

  // question group/bank state
  const [questionBanks, setQuestionBanks] = useState();
  const [selectedQuestionGroup, setSelectedQuestionGroup] = useState({
    count: 0,
    question_bank: "",
    randomSubset: false,
  });
  // const [selectedQuestionBank, setSelectedQuestionBank] = useState("");
  // const [randomSubset, setRandomSubset] = useState(false);
  // const [subsetSize, setSubsetSize] = useState();
  const [questionBankModalOpen, setQuestionBankModalOpen] = useState(false);
  // console.log(selectedQuestionBank);

  // fetch course question groups
  useEffect(() => {
    Service.client.get(`/courses/${courseId}/question-banks`).then((res) => {
      setQuestionBanks(
        res.data.map((bank) => ({
          ...bank,
        }))
      );
    });
    // setQuestionGroups([1, 2]);
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
          setSelectedQuestionGroup({
            count: 0,
            question_bank: "",
            randomSubset: false,
          });
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
        <DialogContent>
          <FormControl fullWidth margin="dense" className={classes.formControl}>
            <InputLabel style={{ fontSize: "14px" }}>Question Bank</InputLabel>
            <Select
              label="Question Bank"
              variant="outlined"
              value={selectedQuestionGroup.question_bank}
              onChange={(e) => {
                setSelectedQuestionGroup({
                  ...selectedQuestionGroup,
                  question_bank: e.target.value,
                  count: e.target.value !== "" ? e.target.value.questions.length : 0,
                });
              }}
            >
              <MenuItem classes={{ root: classes.resizeFont }} value="">
                <em>Select a question bank</em>
              </MenuItem>
              {questionBanks &&
                questionBanks.map((bank) => (
                  <MenuItem classes={{ root: classes.resizeFont }} value={bank}>
                    {bank.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {selectedQuestionGroup.question_bank !== "" && (
            <Fragment>
              <div style={{ margin: "8px 0" }}>
                <Typography variant="body2" style={{ color: "#676767" }}>
                  Number of Questions: {selectedQuestionGroup.question_bank.questions.length}
                </Typography>
                <Typography variant="body2" style={{ color: "#676767" }}>
                  Marks per Question: {getQuestionMarks(selectedQuestionGroup.question_bank.questions[0])}
                </Typography>
              </div>
              <FormControlLabel
                classes={{
                  root: classes.toggleRoot,
                  label: classes.toggleLabel,
                }}
                control={
                  <Switch
                    size="small"
                    checked={selectedQuestionGroup.randomSubset}
                    onChange={() =>
                      setSelectedQuestionGroup({
                        ...selectedQuestionGroup,
                        randomSubset: !selectedQuestionGroup.randomSubset,
                      })
                    }
                  />
                }
                label="Select a random subset"
              />
              {selectedQuestionGroup.randomSubset && (
                <Fragment>
                  <label htmlFor="count">
                    <Typography variant="body2">Number of questions</Typography>
                  </label>
                  <TextField
                    id="count"
                    placeholder="Number of Questions"
                    type="number"
                    autoComplete="off"
                    variant="outlined"
                    inputProps={{
                      min: 0,
                      max: selectedQuestionGroup.question_bank.questions.length,
                      style: { fontSize: "14px" },
                    }}
                    margin="dense"
                    fullWidth
                    value={selectedQuestionGroup.count && selectedQuestionGroup.count}
                    onChange={(e) => {
                      setSelectedQuestionGroup({
                        ...selectedQuestionGroup,
                        count: e.target.value,
                      });
                    }}
                  />
                </Fragment>
              )}
            </Fragment>
          )}
        </DialogContent>
        <DialogActions>
          <Button className={classes.button} color="primary">
            Add Questions
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default QuizCreationModel;
