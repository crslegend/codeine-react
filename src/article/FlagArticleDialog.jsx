import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { DropzoneAreaBase } from "material-ui-dropzone";
import Service from "../AxiosService";

const useStyles = makeStyles((theme) => ({
  redButton: {
    backgroundColor: theme.palette.red.main,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: "white",
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
}));

const FlagArticleDialog = (props) => {
  const classes = useStyles();

  const {
    id,
    dialogFlagOpen,
    handleFlagClickClose,
    setSbOpen,
    setSnackbar,
  } = props;

  const [file, setFile] = useState();

  const [description, setDescription] = useState("");

  const submitFlagArticle = (articleId) => {
    if (description === "" || !description) {
      setSbOpen(true);
      setSnackbar({
        message: "Please give details for your enquiry!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("ticket_type", "ARTICLE");
    formData.append("description", description);
    formData.append("article_id", id);

    if (file) {
      formData.append("photo", file[0].file);
    }

    Service.client
      .post(`/helpdesk/tickets`, formData)
      .then((res) => {
        // console.log(res);
        setDescription();
        setFile();
        handleFlagClickClose();
        setSbOpen(true);
        setSnackbar({
          message:
            "Article has been flag and raised to us, we will review the article shortly. Thank you.",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog
      open={dialogFlagOpen}
      onClose={handleFlagClickClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Flag Article"}</DialogTitle>
      <DialogContent>
        <div>
          <label htmlFor="details">
            <Typography variant="h6" style={{ paddingTop: "20px" }}>
              Details of your enquiry
            </Typography>
          </label>
          <TextField
            id="description"
            name="description"
            variant="outlined"
            fullWidth
            margin="dense"
            placeholder="Tell us in detail of your enquiry"
            multiline
            rows={4}
            inputProps={{ style: { resize: "vertical" } }}
            InputProps={{
              classes: {
                input: classes.resize,
              },
            }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Typography variant="h6" style={{ paddingTop: "20px" }}>
            Supporting Attachment (if any)
          </Typography>
          <DropzoneAreaBase
            dropzoneClass={classes.dropzone}
            dropzoneText="&nbsp;Drag and drop an attachment or click here&nbsp;"
            filesLimit={1}
            fileObjects={file}
            useChipsForPreview={true}
            maxFileSize={5000000}
            onAdd={(newFile) => {
              setFile(newFile);
            }}
            onDelete={(deleteFileObj) => {
              setFile();
            }}
            previewGridProps={{
              item: {
                xs: "auto",
              },
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            handleFlagClickClose();
            setDescription();
            setFile();
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => submitFlagArticle()}
          className={classes.redButton}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FlagArticleDialog;
