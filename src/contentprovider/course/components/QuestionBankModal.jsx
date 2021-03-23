import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography, ButtonBase, FormControlLabel, Radio, Checkbox, TextField, Button } from "@material-ui/core";

import Service from "../../../AxiosService";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  mainContainer: {
    display: "flex",
    width: "80vw",
    height: "80vh",
    margin: "16px 0 8px",
  },
  leftContainer: {
    width: "35%",
    padding: theme.spacing(1),
    overflow: "hidden",
    overflowY: "scroll",
  },
  rightContainer: {
    width: "65%",
    padding: theme.spacing(1),
    overflow: "hidden",
    overflowY: "scroll",
  },
  questionBankCardRoot: {
    margin: "8px 0",
    width: "100%",
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    backgroundColor: "#fcfcfc",
  },
  selectedCard: {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  cardButton: {
    textTransform: "none",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    display: "flex",
    width: "100%",
  },
  cardBody: {
    color: theme.palette.grey[500],
    fontSize: "12px",
  },
  questionDetailsRoot: {
    margin: theme.spacing(2),
  },
  questionDetailsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  textField: {
    width: "70%",
  },
  updateButton: {
    width: "30%",
    marginLeft: theme.spacing(2),
    textTransform: "none",
  },
  addQuestionButton: {
    width: "30%",
    marginLeft: theme.spacing(2),
    textTransform: "none",
    textDecoration: "underline",
  },
  question: {
    border: "2px solid lightgrey",
    borderRadius: "6px",
    marginBottom: "10px",
    padding: theme.spacing(2),
    backgroundColor: "#fff",
  },
  formControlLabel: {
    fontSize: "12px",
  },
}));

const MCQ = ({ question, index, classes }) => {
  return (
    <Fragment>
      <Typography variant="body2">
        {`Q${index + 1}. `}
        <div dangerouslySetInnerHTML={{ __html: `${question.title}` }} />
      </Typography>
      <Typography variant="body2" style={{ opacity: 0.7 }}>
        Marks for this question: {question.mcq.marks}
      </Typography>
      {question.mcq.options &&
        question.mcq.options.length > 0 &&
        question.mcq.options.map((option) => {
          return (
            <FormControlLabel
              classes={{
                label: classes.formControlLabel,
              }}
              value={option}
              control={
                <Radio
                  size="small"
                  checked={question.mcq.correct_answer && question.mcq.correct_answer === option}
                  disabled
                />
              }
              label={option}
            />
          );
        })}
    </Fragment>
  );
};

const MRQ = ({ question, index, classes }) => {
  return (
    <Fragment>
      <Typography variant="body2">
        {`Q${index + 1}. `}
        <div dangerouslySetInnerHTML={{ __html: `${question.title}` }} />
      </Typography>
      <Typography variant="body2" style={{ opacity: 0.7 }}>
        Marks for this question: {question.mrq.marks}
      </Typography>
      {question.mrq.options &&
        question.mrq.options.length > 0 &&
        question.mrq.options.map((option) => {
          return (
            <FormControlLabel
              classes={{
                label: classes.formControlLabel,
              }}
              value={option}
              control={
                <Checkbox
                  size="small"
                  checked={question.mrq.correct_answer && question.mrq.correct_answer.includes(option)}
                  disabled
                />
              }
              label={option}
            />
          );
        })}
    </Fragment>
  );
};

const ShortAnswer = ({ question, index, classes }) => {
  return (
    <Fragment>
      <Typography variant="body2">
        {`Q${index + 1}. `}
        <div dangerouslySetInnerHTML={{ __html: `${question.title}` }} />
      </Typography>
      <Typography variant="body2" style={{ opacity: 0.7 }}>
        Marks for this question: {question.shortanswer.marks}
      </Typography>
      <Typography style={{ margin: "8px 0", fontSize: "12px", color: "rgba(0, 0, 0, 0.38)" }}>
        Keywords: {question && question.shortanswer.keywords.join(", ")}
      </Typography>
    </Fragment>
  );
};

const QuestionBankCard = ({ questionBank, selectedQuestionBank, setSelectedQuestionBank }) => {
  const classes = useStyles();
  console.log(questionBank);
  return (
    <Card
      className={`${classes.questionBankCardRoot} ${
        selectedQuestionBank.label === questionBank.label && classes.selectedCard
      }`}
    >
      <ButtonBase
        disableRipple
        classes={{ root: classes.cardButton }}
        onClick={() => setSelectedQuestionBank(questionBank)}
      >
        <div>
          <Typography variant="body2" className={classes.cardHeader}>
            {questionBank.label}
          </Typography>
        </div>
        <div>
          <Typography className={classes.cardBody}>
            {questionBank.questions && `${questionBank.questions.length} questions`}
          </Typography>
        </div>
      </ButtonBase>
    </Card>
  );
};

const QuestionBankDetails = ({ selectedQuestionBank, setSelectedQuestionBank }) => {
  const classes = useStyles();

  return (
    <div className={classes.questionDetailsRoot}>
      <div className={classes.questionDetailsHeader}>
        <TextField
          className={classes.textField}
          label="Question Bank Name"
          autoFocus
          value={selectedQuestionBank.label}
          inputProps={{
            style: {
              fontSize: "14px",
            },
          }}
          onChange={(event) =>
            setSelectedQuestionBank({
              ...selectedQuestionBank,
              label: event.target.value,
            })
          }
        />
        <Button size="small" classes={{ root: classes.updateButton }} variant="contained" color="primary">
          Update
        </Button>
      </div>
      <div className={classes.questionDetailsHeader} style={{ marginTop: 32 }}>
        <Typography variant="body2" style={{ fontWeight: 700 }}>
          Questions:
        </Typography>
        <Button size="small" classes={{ root: classes.addQuestionButton }} startIcon={<Add />} color="primary">
          Add Question
        </Button>
      </div>
      {selectedQuestionBank &&
        selectedQuestionBank.questions &&
        selectedQuestionBank.questions.map((question, index) => {
          return (
            <div key={index} className={classes.question}>
              {(() => {
                if (question.mcq) {
                  return <MCQ question={question} index={index} classes={classes} />;
                } else if (question.mrq) {
                  return <MRQ question={question} index={index} classes={classes} />;
                } else if (question.shortanswer) {
                  return <ShortAnswer question={question} index={index} classes={classes} />;
                } else {
                  return null;
                }
              })()}
            </div>
          );
        })}
    </div>
  );
};

const QuestionBankModal = ({ courseId }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [selectedQuestionBank, setSelectedQuestionBank] = useState();

  useEffect(() => {
    Service.client
      .get(`/courses/${courseId}/question-banks`)
      .then((res) => {
        setSelectedQuestionBank(res.data[0]);
        setQuestionBanks(res.data);
      })
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  }, [courseId]);

  return (
    <div className={classes.root}>
      {!loading ? (
        <Fragment>
          <Typography variant="h6">Question Bank</Typography>
          <div className={classes.mainContainer}>
            <div className={classes.leftContainer}>
              <Typography variant="body2" style={{ margin: "16px 0", fontWeight: 700 }}>
                Question Banks
              </Typography>
              {questionBanks &&
                questionBanks.map((qb) => (
                  <QuestionBankCard
                    questionBank={qb}
                    selectedQuestionBank={selectedQuestionBank}
                    setSelectedQuestionBank={setSelectedQuestionBank}
                  />
                ))}
            </div>
            <div className={classes.rightContainer}>
              <Typography variant="body2" style={{ margin: 16, fontWeight: 700 }}>
                Question Bank Details
              </Typography>
              <QuestionBankDetails
                selectedQuestionBank={selectedQuestionBank}
                setSelectedQuestionBank={setSelectedQuestionBank}
              />
            </div>
          </div>
        </Fragment>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default QuestionBankModal;
