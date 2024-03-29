import React, { useEffect, useState, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  Typography,
  ButtonBase,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
  Button,
  Divider,
  IconButton,
} from "@material-ui/core";
import { Add, Close, Edit, Launch, RemoveCircle } from "@material-ui/icons";

import Service from "../../../AxiosService";
import Toast from "../../../components/Toast";
import QuestionDialog from "./QuestionDialog";
import { downloadJSON } from "../../../utils";
import ImportQuestionBankDialog from "./ImportQuestionBankDialog";

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
    display: "flex",
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
    width: "fit-content",
    marginLeft: theme.spacing(2),
    textTransform: "none",
    textDecoration: "underline",
    justifyContent: "flex-end",
  },
  exportButton: {
    width: "fit-content",
    marginLeft: theme.spacing(2),
    textTransform: "none",
    textDecoration: "underline",
    justifyContent: "flex-end",
    color: "#676767",
  },
  question: {
    border: "2px solid lightgrey",
    borderRadius: "6px",
    marginBottom: "10px",
    padding: theme.spacing(2),
    backgroundColor: "#fff",
    display: "flex",
  },
  formControlLabel: {
    fontSize: "12px",
  },
  deleteIcon: {
    color: theme.palette.red.main,
    "&:hover": {
      backgroundColor: "none",
    },
  },
}));

const MCQ = ({
  questionBank,
  question,
  index,
  classes,
  setQuestionType,
  setOptions,
  setCorrectAnswer,
  setQuestionNum,
  setQuestion,
  setEditQuestionDialog,
}) => {
  return (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography variant="body2">
          {`Q${index + 1}. `}
          <span dangerouslySetInnerHTML={{ __html: `${question.title}` }} />
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          Marks: {question.mcq.marks}
        </Typography>
        {question.mcq.options &&
          question.mcq.options.length > 0 &&
          question.mcq.options.map((option, i) => {
            return (
              <FormControlLabel
                key={`mcq-${i}`}
                classes={{
                  label: classes.formControlLabel,
                }}
                value={option}
                control={
                  <Radio
                    style={{ padding: "3px 8px" }}
                    size="small"
                    checked={question.mcq.correct_answer && question.mcq.correct_answer === option}
                    disabled
                  />
                }
                label={option}
              />
            );
          })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setQuestionType("mcq");
            setOptions(question.mcq.options);
            setCorrectAnswer(question.mcq.correct_answer);
            setQuestionNum(index + 1);
            setQuestion(question);
            setEditQuestionDialog(true);
          }}
        >
          <Edit />
        </IconButton>
      </div>
    </Fragment>
  );
};

const MRQ = ({
  questionBank,
  question,
  index,
  classes,
  setQuestionType,
  setOptions,
  setCorrectAnswer,
  setQuestionNum,
  setQuestion,
  setEditQuestionDialog,
}) => {
  return (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography variant="body2">
          {`Q${index + 1}. `}
          <span dangerouslySetInnerHTML={{ __html: `${question.title}` }} />
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          Marks: {question.mrq.marks}
        </Typography>
        {question.mrq.options &&
          question.mrq.options.length > 0 &&
          question.mrq.options.map((option, i) => {
            return (
              <FormControlLabel
                key={`mrq-${i}`}
                classes={{
                  label: classes.formControlLabel,
                }}
                value={option}
                control={
                  <Checkbox
                    style={{ padding: "3px 8px" }}
                    size="small"
                    checked={question.mrq.correct_answer && question.mrq.correct_answer.includes(option)}
                    disabled
                  />
                }
                label={option}
              />
            );
          })}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setQuestionType("mrq");
            setOptions(question.mrq.options);
            setCorrectAnswer(question.mrq.correct_answer);
            setQuestionNum(index + 1);
            setQuestion(question);
            setEditQuestionDialog(true);
          }}
        >
          <Edit />
        </IconButton>
      </div>
    </Fragment>
  );
};

const ShortAnswer = ({
  questionBank,
  question,
  index,
  classes,
  setQuestionType,
  setOptions,
  setCorrectAnswer,
  setQuestionNum,
  setQuestion,
  setEditQuestionDialog,
}) => {
  return (
    <Fragment>
      <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography variant="body2">
          {`Q${index + 1}. `}
          <span dangerouslySetInnerHTML={{ __html: `${question.title}` }} />
        </Typography>
        <Typography variant="body2" style={{ opacity: 0.7 }}>
          Marks: {question.shortanswer.marks}
        </Typography>
        <Typography style={{ margin: "8px 0", fontSize: "12px", color: "rgba(0, 0, 0, 0.38)" }}>
          Keywords: {question && question.shortanswer.keywords.join(", ")}
        </Typography>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setQuestionType("shortanswer");
            setCorrectAnswer(question.shortanswer.keywords.join(","));
            setQuestionNum(index + 1);
            setQuestion(question);
            setEditQuestionDialog(true);
          }}
        >
          <Edit />
        </IconButton>
      </div>
    </Fragment>
  );
};

const QuestionBankCard = ({ questionBank, selectedQuestionBank, setSelectedQuestionBank, deleteQuestionBank }) => {
  const classes = useStyles();
  // console.log(questionBank);
  return (
    <Card
      className={`${classes.questionBankCardRoot} ${
        selectedQuestionBank && selectedQuestionBank.id === questionBank.id && classes.selectedCard
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
      <IconButton
        disableRipple
        size="small"
        className={classes.deleteIcon}
        onClick={() => deleteQuestionBank(questionBank.id)}
      >
        <RemoveCircle />
      </IconButton>
    </Card>
  );
};

const QuestionBankDetails = ({
  selectedQuestionBank,
  setSelectedQuestionBank,
  updateQuestionBank,
  setQuestionType,
  setOptions,
  setCorrectAnswer,
  setQuestionNum,
  setQuestion,
  setQuizId,
  setEditQuestionDialog,
  setAddQuestionDialog,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.questionDetailsRoot}>
      <div className={classes.questionDetailsHeader}>
        <TextField
          variant="outlined"
          margin="dense"
          className={classes.textField}
          label="Question Bank Name"
          autoFocus
          value={selectedQuestionBank && selectedQuestionBank.label}
          inputProps={{
            style: {
              fontSize: "14px",
            },
          }}
          InputLabelProps={{
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
        <Button
          classes={{ root: classes.updateButton }}
          variant="contained"
          color="primary"
          onClick={() => updateQuestionBank()}
        >
          Update
        </Button>
      </div>
      <div className={classes.questionDetailsHeader} style={{ marginTop: 32, marginBottom: 5 }}>
        <Typography variant="body2" style={{ fontWeight: 700 }}>
          Questions:
        </Typography>
        <div>
          <Button
            size="small"
            classes={{ root: classes.exportButton }}
            startIcon={<Launch />}
            href={downloadJSON(selectedQuestionBank)}
            download={`question-bank-${selectedQuestionBank && selectedQuestionBank.id}.json`}
          >
            Export Question Bank
          </Button>
          <Button
            size="small"
            classes={{ root: classes.addQuestionButton }}
            startIcon={<Add />}
            color="primary"
            onClick={() => setAddQuestionDialog(true)}
          >
            Add Question
          </Button>
        </div>
      </div>
      {selectedQuestionBank &&
        selectedQuestionBank.questions &&
        selectedQuestionBank.questions.map((question, index) => {
          return (
            <div key={index} className={classes.question}>
              {(() => {
                if (question.mcq) {
                  return (
                    <MCQ
                      questionBank={selectedQuestionBank}
                      question={question}
                      index={index}
                      classes={classes}
                      setQuestionType={setQuestionType}
                      setOptions={setOptions}
                      setCorrectAnswer={setCorrectAnswer}
                      setQuestionNum={setQuestionNum}
                      setQuestion={setQuestion}
                      setQuizId={setQuizId}
                      setEditQuestionDialog={setEditQuestionDialog}
                    />
                  );
                } else if (question.mrq) {
                  return (
                    <MRQ
                      questionBank={selectedQuestionBank}
                      question={question}
                      index={index}
                      classes={classes}
                      setQuestionType={setQuestionType}
                      setOptions={setOptions}
                      setCorrectAnswer={setCorrectAnswer}
                      setQuestionNum={setQuestionNum}
                      setQuestion={setQuestion}
                      setQuizId={setQuizId}
                      setEditQuestionDialog={setEditQuestionDialog}
                    />
                  );
                } else if (question.shortanswer) {
                  return (
                    <ShortAnswer
                      questionBank={selectedQuestionBank}
                      question={question}
                      index={index}
                      classes={classes}
                      setQuestionType={setQuestionType}
                      setOptions={setOptions}
                      setCorrectAnswer={setCorrectAnswer}
                      setQuestionNum={setQuestionNum}
                      setQuestion={setQuestion}
                      setQuizId={setQuizId}
                      setEditQuestionDialog={setEditQuestionDialog}
                    />
                  );
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

const QuestionBankModal = ({ courseId, closeDialog }) => {
  const classes = useStyles();

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [loading, setLoading] = useState(true);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [selectedQuestionBank, setSelectedQuestionBank] = useState();
  const [newQuestionBank, setNewQuestionBank] = useState("");

  //question dialog
  const [addQuestionDialog, setAddQuestionDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editQuestionDialog, setEditQuestionDialog] = useState(false);
  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState();
  const [options, setOptions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState();

  //import dialog
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  const [questionNum, setQuestionNum] = useState();

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

  const getQuestionBanks = () => {
    Service.client
      .get(`/courses/${courseId}/question-banks`)
      .then((res) => {
        setSelectedQuestionBank(res.data[0]);
        setQuestionBanks(res.data);
      })
      .then(() => setLoading(false))
      .catch((err) => console.log(err));
  };

  const createQuestionBank = () => {
    Service.client
      .post(`/courses/${courseId}/question-banks`, { label: newQuestionBank })
      .then((res) => {
        setSelectedQuestionBank(res.data[res.data.length - 1]);
        setQuestionBanks(res.data);
      })
      .catch((err) => {
        if (err.response.status === 409) {
          setSnackbar({
            ...snackbar,
            message: "Question Bank already exists",
          });
        } else {
          setSnackbar({
            ...snackbar,
            message: `${err.response.status}: Something went wrong`,
          });
        }
        setSbOpen(true);
      });
  };

  const updateQuestionBank = () => {
    Service.client
      .put(`courses/${courseId}/question-banks/${selectedQuestionBank.id}`, {
        label: selectedQuestionBank.label,
      })
      .then((res) => {
        setSelectedQuestionBank(
          res.data.find((qn) => {
            return qn.id === selectedQuestionBank.id;
          })
        );
        setQuestionBanks(res.data);
      })
      .catch((err) => console.log(err));
  };

  const deleteQuestionBank = (questionBankId) => {
    Service.client
      .delete(`/courses/${courseId}/question-banks/${questionBankId}`)
      .then((res) => {
        setSelectedQuestionBank(res.data[0]);
        setQuestionBanks(res.data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.root}>
      {!loading ? (
        <Fragment>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography variant="h5">Question Bank</Typography>
            <IconButton onClick={closeDialog}>
              <Close />
            </IconButton>
          </div>
          <div className={classes.mainContainer}>
            <div className={classes.leftContainer}>
              <Typography variant="body2" style={{ margin: "16px 0", fontWeight: 700 }}>
                Question Banks
              </Typography>
              <div className={classes.questionDetailsHeader} style={{ alignItems: "baseline" }}>
                <TextField
                  margin="dense"
                  className={classes.textField}
                  label="New Question Bank"
                  autoFocus
                  value={newQuestionBank}
                  inputProps={{
                    style: {
                      fontSize: "14px",
                    },
                  }}
                  InputLabelProps={{
                    style: {
                      fontSize: "14px",
                    },
                  }}
                  onChange={(event) => setNewQuestionBank(event.target.value)}
                />
                <Button
                  classes={{ root: classes.updateButton }}
                  variant="outlined"
                  color="primary"
                  disabled={newQuestionBank === ""}
                  onClick={() => createQuestionBank()}
                >
                  Add
                </Button>
              </div>
              {questionBanks &&
                questionBanks.map((qb) => (
                  <QuestionBankCard
                    key={qb.id}
                    questionBank={qb}
                    selectedQuestionBank={selectedQuestionBank}
                    setSelectedQuestionBank={setSelectedQuestionBank}
                    deleteQuestionBank={deleteQuestionBank}
                  />
                ))}

              <Button
                variant="outlined"
                style={{ textTransform: "none", justifySelf: "flex-end" }}
                fullWidth
                color="primary"
                onClick={() => setImportDialogOpen(true)}
              >
                Import .JSON
              </Button>
            </div>
            <Divider orientation="vertical" flexItem />
            <div className={classes.rightContainer}>
              <Typography variant="body2" style={{ fontWeight: 700, margin: 16 }}>
                Question Bank Details
              </Typography>
              <QuestionBankDetails
                selectedQuestionBank={selectedQuestionBank}
                setSelectedQuestionBank={setSelectedQuestionBank}
                updateQuestionBank={updateQuestionBank}
                setQuestionType={setQuestionType}
                setOptions={setOptions}
                setCorrectAnswer={setCorrectAnswer}
                setQuestionNum={setQuestionNum}
                setQuestion={setQuestion}
                setEditQuestionDialog={setEditQuestionDialog}
                setAddQuestionDialog={setAddQuestionDialog}
              />
            </div>
          </div>
        </Fragment>
      ) : (
        "Loading..."
      )}

      <QuestionDialog
        editMode={editMode}
        setEditMode={setEditMode}
        addQuestionDialog={addQuestionDialog}
        setAddQuestionDialog={setAddQuestionDialog}
        editQuestionDialog={editQuestionDialog}
        setEditQuestionDialog={setEditQuestionDialog}
        selectedQuestionBank={selectedQuestionBank}
        question={question}
        setQuestion={setQuestion}
        questionType={questionType}
        setQuestionType={setQuestionType}
        options={options}
        setOptions={setOptions}
        correctAnswer={correctAnswer}
        setCorrectAnswer={setCorrectAnswer}
        getCourse={getQuestionBanks}
        sbOpen={sbOpen}
        setSbOpen={setSbOpen}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
        questionNum={questionNum}
      />

      <ImportQuestionBankDialog
        open={importDialogOpen}
        setOpen={setImportDialogOpen}
        courseId={courseId}
        setSbOpen={setSbOpen}
        snackbar={snackbar}
        setSnackbar={setSnackbar}
        setSelectedQuestionBank={setSelectedQuestionBank}
        setQuestionBanks={setQuestionBanks}
      />

      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
    </div>
  );
};

export default QuestionBankModal;
