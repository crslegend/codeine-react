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
  Snackbar,
  Typography,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
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
  const currentDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  )
    .toISOString()
    .substr(0, 16);

  const [startTime, setStartTime] = useState(currentDate);
  const [endTime, setEndTime] = useState(currentDate);
  const [meetingLink, setMeetingLink] = useState("");
  const [maxMembers, setMaxMembers] = useState(1);
  const [pricePerPax, setPricePerPax] = useState(1);
  const [title, setTitle] = useState("Open");
  const [slot, setSlot] = useState({
    start_time: startTime,
    end_time: endTime,
    meeting_link: meetingLink,
    title: title,
    max_members: maxMembers,
    price_per_pax: pricePerPax,
    is_all_day: false,
    r_rule: null,
  });
  const [open, setOpen] = useState(false);

  const [meetingLinkAlertOpen, setMeetingLinkAlertOpen] = useState(false);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);

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

  const handleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMeetingLinkAlertOpen(false);
  };

  const handleSuccessAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlertOpen(false);
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

  const handleMaxMemberChange = (e) => {
    setMaxMembers(e);

    setSlot({
      ...slot,
      max_members: e,
    });
  };

  const handlePriceChange = (e) => {
    setPricePerPax(e);

    setSlot({
      ...slot,
      price_per_pax: e,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    setOpen(false);
    console.log(slot);
    if (slot.meeting_link === "" || slot.meeting_link === undefined) {
      setMeetingLinkAlertOpen(true);
    } else {
      Service.client
        .post("/consultations", slot)
        .then((res) => {
          setSuccessAlertOpen(true);
          fetchUpdate();
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
            required
            margin="dense"
            id="name"
            label="Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            fullWidth
          />
          <TextField
            required
            margin="dense"
            id="name"
            label="Conference link"
            value={meetingLink}
            onChange={(e) => handleLinkChange(e.target.value)}
            type="url"
            fullWidth
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <TextField
              required
              margin="dense"
              id="name"
              label="Max no. of members"
              value={maxMembers}
              onChange={(e) => handleMaxMemberChange(e.target.value)}
              type="number"
            />
            <TextField
              required
              margin="dense"
              id="name"
              label="Price per pax (per hour)"
              value={pricePerPax}
              onChange={(e) => handlePriceChange(e.target.value)}
              type="number"
            />{" "}
          </div>
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

      <Snackbar
        open={successAlertOpen}
        autoHideDuration={4000}
        onClose={handleSuccessAlertClose}
      >
        <Alert
          onClose={handleSuccessAlertClose}
          elevation={6}
          severity="success"
        >
          <Typography variant="body1">
            Consultation slot has been added
          </Typography>
        </Alert>
      </Snackbar>

      <Snackbar
        open={meetingLinkAlertOpen}
        autoHideDuration={4000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} elevation={6} severity="error">
          <Typography variant="body1">Please enter a meeting link!</Typography>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddConsultation;
