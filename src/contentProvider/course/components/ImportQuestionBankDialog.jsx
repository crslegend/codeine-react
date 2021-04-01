import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@material-ui/core";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { Clear } from "@material-ui/icons";

import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  dialogRoot: {
    width: "400px",
  },
  dropzoneRoot: {
    padding: theme.spacing(3),
    maxHeight: "120px",
  },
  dropzoneText: {
    fontSize: "16px",
  },
  clearButton: {
    color: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    margin: theme.spacing(1, 0),
    textTransform: "none",
  },
}));

const ImportQuestionBankDialog = ({
  open,
  setOpen,
  courseId,
  snackbar,
  setSnackbar,
  setSbOpen,
  setSelectedQuestionBank,
  setQuestionBanks,
}) => {
  const classes = useStyles();

  const [file, setFile] = useState();

  const parseFile = (fileObjs) => {
    let jsonObj = JSON.parse(atob(fileObjs[0].data.split("base64,")[1]));
    setFile(jsonObj);
  };

  const handleUpload = () => {
    Service.client
      .put(`/courses/${courseId}/question-banks`, file)
      .then((res) => {
        setSelectedQuestionBank(res.data[res.data.length - 1]);
        setQuestionBanks(res.data);
        setOpen(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog
      classes={{ paper: classes.dialogRoot }}
      open={open}
      onClose={() => setOpen(false)}
      onExited={() => setFile()}
    >
      <DialogTitle>Import Question Bank</DialogTitle>
      <DialogContent>
        {!file ? (
          <DropzoneAreaBase
            acceptedFiles={["application/json"]}
            Icon=""
            filesLimit={1}
            dropzoneClass={classes.dropzoneRoot}
            dropzoneParagraphClass={classes.dropzoneText}
            dropzoneText="Click or drop the .json file here"
            onAdd={(fileObjs) => parseFile(fileObjs)}
            onDelete={(fileObjs) => setFile(null)}
            onAlert={(message, variant) => console.log(`${variant}: ${message}`)}
          />
        ) : (
          <div style={{ margin: "8px 0" }}>
            <Typography variant="body2">
              <b>Question Bank Name:</b> {file.label}
            </Typography>
            <Typography variant="body2">{file.questions.length} question(s)</Typography>
            <Button
              classes={{ root: classes.clearButton }}
              startIcon={<Clear />}
              variant="outlined"
              onClick={() => setFile()}
            >
              Clear
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleUpload()} color="primary" disabled={!file}>
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportQuestionBankDialog;
