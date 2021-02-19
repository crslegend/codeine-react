import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  opendialog: {
    textTransform: "none",
    marginTop: "40px",
    padding: "15px 10px",
  },
}));

const AddConsultation = () => {
  const classes = useStyles();
  const date = new Date();
  const currentDate = date.toISOString().substr(0, 16);

  const [startTime, setStartTime] = useState(currentDate);
  const [endTime, setEndTime] = useState(currentDate);
  const [meetingLink, setMeetingLink] = useState("");
  const [title, setTitle] = useState("Open");
  const [slot, setSlot] = useState({
    start_time: startTime,
    end_time: endTime,
    meeting_link: meetingLink,
    title: title,
  });
  const [open, setOpen] = useState(false);
  const [submittedNewSlot, setSubmittedNewSlot] = useState(false);

  const fetchUpdate = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get("/consultations", { params: { search: userid } })
        .then((res) => {
          console.log(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    fetchUpdate();
  }, []);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e);

    setSlot({
      ...slot,
      start_time: e,
    });
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e);

    setSlot({
      ...slot,
      end_time: e,
    });
  };

  const handleTitleChange = (e) => {
    setTitle(e);

    setSlot({
      ...slot,
      title: e,
    });
  };

  const handleLinkChange = (e) => {
    setMeetingLink(e);

    setSlot({
      ...slot,
      meeting_link: e,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    console.log(slot);
    Service.client
      .post("/consultations", slot)
      .then((res) => {
        setSubmittedNewSlot(true);
        fetchUpdate();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Button
        className={classes.opendialog}
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
      >
        Create a consultation slot
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Create a new consultation slot
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the start and end time of your preference, with a conference
            link attached.
          </DialogContentText>
          <TextField
            id="datetime-local"
            label="Start Time"
            type="datetime-local"
            defaultValue={currentDate}
            value={startTime}
            onChange={(e) => handleStartTimeChange(e.target.value)}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="datetime-local"
            label="End Time"
            type="datetime-local"
            defaultValue={currentDate}
            value={endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            style={{ float: "right" }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="name"
            label="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            fullWidth
          />
          <TextField
            margin="dense"
            id="name"
            label="Conference link"
            value={meetingLink}
            onChange={(e) => handleLinkChange(e.target.value)}
            type="url"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={submittedNewSlot}>
        <DialogTitle>New consultation added!</DialogTitle>
        <DialogContent>New consultation added!</DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmittedNewSlot(false)}>Okay</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddConsultation;
