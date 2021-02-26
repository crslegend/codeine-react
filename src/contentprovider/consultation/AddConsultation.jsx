import React, { useState, Fragment } from "react";
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
import { KeyboardDateTimePicker } from "@material-ui/pickers";
import { Add } from "@material-ui/icons";

import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  opendialog: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    height: 35,
  },
}));

const AddConsultation = ({ handleGetAllConsultations }) => {
  const classes = useStyles();
  const date = new Date();
  const currentDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().substr(0, 16);

  const [slot, setSlot] = useState({
    start_time: currentDate,
    end_time: currentDate,
    meeting_link: "",
    title: "",
    max_members: 1,
    price_per_pax: 1,
    is_all_day: false,
    r_rule: null,
  });
  const [open, setOpen] = useState(false);

  const [titleAlertOpen, setTitleAlertOpen] = useState(false);
  const [meetingLinkAlertOpen, setMeetingLinkAlertOpen] = useState(false);
  const [dateAlertOpen, setDateAlertOpen] = useState(false);
  const [successAlertOpen, setSuccessAlertOpen] = useState(false);

  // const fetchUpdate = () => {
  //   if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
  //     const userid = jwt_decode(Service.getJWT()).user_id;
  //     Service.client
  //       .get("/consultations", { params: { search: userid } })
  //       .then((res) => {
  //         console.log(res.data);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   }
  // };

  // useEffect(() => {
  //   fetchUpdate();
  // }, []);

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleLinkAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMeetingLinkAlertOpen(false);
  };

  const handleDateAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setDateAlertOpen(false);
  };

  const handleTitleAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setTitleAlertOpen(false);
  };

  const handleSuccessAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlertOpen(false);
  };

  const handleStartTimeChange = (e) => {
    setSlot({
      ...slot,
      start_time: e,
    });
  };

  const handleEndTimeChange = (e) => {
    setSlot({
      ...slot,
      end_time: e,
    });
  };

  const handleTitleChange = (e) => {
    setSlot({
      ...slot,
      title: e,
    });
  };

  const handleLinkChange = (e) => {
    setSlot({
      ...slot,
      meeting_link: e,
    });
  };

  const handleMaxMemberChange = (e) => {
    setSlot({
      ...slot,
      max_members: e,
    });
  };

  const handlePriceChange = (e) => {
    setSlot({
      ...slot,
      price_per_pax: e,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log(slot);
    if (slot.meeting_link === "" || slot.meeting_link === undefined) {
      setMeetingLinkAlertOpen(true);
    } else if (slot.start_time <= currentDate || slot.start_time >= slot.end_time) {
      setDateAlertOpen(true);
    } else if (slot.title === "" || slot.title === undefined) {
      setTitleAlertOpen(true);
    } else {
      setOpen(false);
      Service.client
        .post("/consultations", slot)
        .then((res) => {
          setSuccessAlertOpen(true);
          handleGetAllConsultations();
          // window.location.reload();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Fragment>
      <Button
        startIcon={<Add />}
        className={classes.opendialog}
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
      >
        Create a consultation slot
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create a new consultation slot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the start and end time of your preference, with a conference link attached.
          </DialogContentText>
          <KeyboardDateTimePicker
            variant="inline"
            label="Start Time"
            value={slot.start_time}
            onChange={handleStartTimeChange}
            className={classes.textField}
          />
          <KeyboardDateTimePicker
            variant="inline"
            label="End Time"
            value={slot.end_time}
            onChange={handleEndTimeChange}
            style={{ float: "right" }}
            className={classes.textField}
          />
          <TextField
            required
            margin="dense"
            id="name"
            label="Title"
            value={slot.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            fullWidth
          />
          <TextField
            required
            margin="dense"
            id="name"
            label="Conference link"
            value={slot.meeting_link}
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
              margin="dense"
              id="name"
              label="Max no. of signups"
              value={slot.max_members}
              onChange={(e) => handleMaxMemberChange(e.target.value)}
              type="number"
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <TextField
              margin="dense"
              id="name"
              label="Price (per pax)"
              value={slot.price_per_pax}
              onChange={(e) => handlePriceChange(e.target.value)}
              type="number"
              InputProps={{
                inputProps: { min: 0 },
              }}
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

      <Snackbar open={successAlertOpen} autoHideDuration={4000} onClose={handleSuccessAlertClose}>
        <Alert onClose={handleSuccessAlertClose} elevation={6} severity="success">
          <Typography variant="body1">Consultation slot has been added</Typography>
        </Alert>
      </Snackbar>
      <Snackbar open={titleAlertOpen} autoHideDuration={4000} onClose={handleTitleAlertClose}>
        <Alert onClose={handleTitleAlertClose} elevation={6} severity="error">
          <Typography variant="body1">Please enter a consultation title!</Typography>
        </Alert>
      </Snackbar>
      <Snackbar open={dateAlertOpen} autoHideDuration={4000} onClose={handleDateAlertClose}>
        <Alert onClose={handleDateAlertClose} elevation={6} severity="error">
          <Typography variant="body1">Please enter a valid consultation date and time!</Typography>
        </Alert>
      </Snackbar>
      <Snackbar open={meetingLinkAlertOpen} autoHideDuration={4000} onClose={handleLinkAlertClose}>
        <Alert onClose={handleLinkAlertClose} elevation={6} severity="error">
          <Typography variant="body1">Please enter a meeting link!</Typography>
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default AddConsultation;
