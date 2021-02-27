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
  Switch,
  FormControlLabel,
  FormGroup,
  Checkbox,
  FormHelperText,
  InputAdornment,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { KeyboardDatePicker, TimePicker } from "@material-ui/pickers";
import { formatISO, addMinutes, addDays } from "date-fns";

import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  opendialog: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    height: 35,
  },
  dateTimeField: {
    margin: `${theme.spacing(2)}px 0`,
  },
  timeContainer: {
    margin: `${theme.spacing(2)}px 0 ${theme.spacing(1)}px`,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    maxWidth: "50%",
    textAlign: "center",
  },
  timeField: {
    width: "40%",
  },
  inputLabelRoot: {
    width: "100%",
    display: "inline-block",
  },
  margin: {
    margin: theme.spacing(1),
  },
  dialogPaper: {
    width: "60%",
  },
}));

const appendTimeToDate = (date, time) => {
  return new Date(formatISO(date, { representation: "date" }) + "T" + formatISO(time, { representation: "time" }));
};

const AddConsultation = ({ handleGetAllConsultations, setSnackbar, setSnackbarOpen }) => {
  const classes = useStyles();

  const currentDate = addDays(new Date(), 1);

  const [slot, setSlot] = useState({
    date: currentDate,
    start_time: currentDate,
    end_time: addMinutes(currentDate, 30),
    meeting_link: "",
    title: "",
    max_members: 1,
    price_per_pax: "0.00",
  });
  const [open, setOpen] = useState(false);

  const [recurring, setRecurring] = useState(false);
  const [recurringDays, setRecurringDays] = useState({
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  });
  const [timeError, setTimeError] = useState(false);

  const handleRecurringDays = (event) => {
    setRecurringDays({ ...recurringDays, [event.target.name]: event.target.checked });
  };

  const [bankDialog, setBankDialog] = useState(false);

  // react router dom history hooks
  const history = useHistory();

  const handleDialogOpen = () => {
    setOpen(true);
  };

  const handleBankAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setBankDialog(false);
  };

  const handleDateChange = (e) => {
    setSlot({
      ...slot,
      date: e,
    });
  };

  const handleStartTimeChange = (e) => {
    setSlot({
      ...slot,
      start_time: e,
    });
  };

  const handleEndTimeChange = (e) => {
    if (e <= slot.start_time) {
      setTimeError(true);
    } else {
      setTimeError(false);
    }
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
    if (slot.title === "" || slot.title === undefined) {
      setSnackbar({
        message: "Please enter a consultation title!",
        severity: "error",
      });
      setSnackbarOpen(true);
      return;
    }
    if (slot.meeting_link === "" || slot.meeting_link === undefined) {
      setSnackbar({
        message: "Please enter a meeting link!",
        severity: "error",
      });
      setSnackbarOpen(true);
      return;
    }
    if (slot.price_per_pax < 0) {
      setSnackbar({
        message: "Price cannot be negative",
        severity: "error",
      });
      setSnackbarOpen(true);
      return;
    }

    if (timeError) {
      return;
    }

    const formattedSlot = {
      ...slot,
      start_time: appendTimeToDate(slot.date, slot.start_time),
      end_time: appendTimeToDate(slot.date, slot.end_time),
    };

    if (
      formattedSlot.start_time <= new Date(currentDate.toDateString()) ||
      formattedSlot.start_time >= formattedSlot.end_time
    ) {
      setSnackbar({
        message: "Please enter a valid consultation date and time!",
        severity: "error",
      });
      setSnackbarOpen(true);
      return;
    }

    setOpen(false);
    if (slot.price_per_pax > 0) {
      Service.client
        .get(`/auth/bank-details`)
        .then((res) => {
          Service.client
            .post("/consultations", formattedSlot)
            .then((res) => {
              setSnackbar({
                message: "New consultation slot created",
                severity: "success",
              });
              setSnackbarOpen(true);

              setSlot({
                date: currentDate,
                start_time: currentDate,
                end_time: addMinutes(currentDate, 30),
                meeting_link: "",
                title: "",
                max_members: 1,
                price_per_pax: 0,
              });
              handleGetAllConsultations();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          setBankDialog(true);
        });
    } else {
      Service.client
        .post("/consultations", formattedSlot)
        .then((res) => {
          setSnackbar({
            message: "New consultation slot created",
            severity: "success",
          });
          setSnackbarOpen(true);
          setSlot({
            date: currentDate,
            start_time: currentDate,
            end_time: addMinutes(currentDate, 30),
            meeting_link: "",
            title: "",
            max_members: 1,
            price_per_pax: 0,
          });
          handleGetAllConsultations();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <Fragment>
      <Button
        className={classes.opendialog}
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleDialogOpen}
      >
        New Consultation Slot
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="form-dialog-title">Create a new consultation slot</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the start and end time of your preference, with a conference link attached.
          </DialogContentText>
          <div style={{ width: "100%" }}>
            <FormControlLabel
              style={{ margin: 0 }}
              control={<Switch color="primary" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />}
              label="Recurring"
              labelPlacement="start"
            />
          </div>
          {recurring ? (
            <Fragment>
              <FormGroup row>
                <FormControlLabel
                  control={<Checkbox checked={recurringDays.mon} onChange={handleRecurringDays} name="mon" />}
                  label="Mon"
                />
                <FormControlLabel
                  control={<Checkbox checked={recurringDays.tue} onChange={handleRecurringDays} name="tue" />}
                  label="Tue"
                />
                <FormControlLabel
                  control={<Checkbox checked={recurringDays.wed} onChange={handleRecurringDays} name="wed" />}
                  label="Wed"
                />
                <FormControlLabel
                  control={<Checkbox checked={recurringDays.thu} onChange={handleRecurringDays} name="thu" />}
                  label="Thu"
                />
                <FormControlLabel
                  control={<Checkbox checked={recurringDays.fri} onChange={handleRecurringDays} name="fri" />}
                  label="Fri"
                />
                <FormControlLabel
                  control={<Checkbox checked={recurringDays.sat} onChange={handleRecurringDays} name="sat" />}
                  label="Sat"
                />
                <FormControlLabel
                  control={<Checkbox checked={recurringDays.sun} onChange={handleRecurringDays} name="sun" />}
                  label="Sun"
                />
              </FormGroup>
              <KeyboardDatePicker
                minDate={currentDate}
                className={classes.dateTimeField}
                variant="inline"
                label="End Date"
                value={slot.date}
                onChange={(date) => handleDateChange(date)}
                format="dd/MM/yyyy"
              />
            </Fragment>
          ) : (
            <KeyboardDatePicker
              className={classes.dateTimeField}
              minDate={currentDate}
              variant="inline"
              label="Date"
              value={slot.date}
              onChange={(date) => handleDateChange(date)}
              format="dd/MM/yyyy"
            />
          )}
          <div className={classes.timeContainer}>
            <TimePicker
              variant="inline"
              label="Start Time"
              minutesStep={5}
              value={slot.start_time}
              onChange={handleStartTimeChange}
              className={classes.timeField}
            />
            to
            <TimePicker
              variant="inline"
              label="End Time"
              minutesStep={5}
              value={slot.end_time}
              onChange={handleEndTimeChange}
              className={classes.timeField}
            />
          </div>
          {timeError ? (
            <FormHelperText error>End time must be after start time</FormHelperText>
          ) : (
            <FormHelperText>
              Duration: {(slot.end_time.getTime() - slot.start_time.getTime()) / 60000}mins
            </FormHelperText>
          )}
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
              id="price_pax"
              label="Price (per pax)"
              value={slot.price_per_pax}
              onChange={(e) => handlePriceChange(e.target.value)}
              type="number"
              InputProps={{
                inputProps: { min: 0 },
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bankDialog} onClose={handleBankAlertClose}>
        <DialogTitle>You have not set up your bank account</DialogTitle>
        <DialogContent>
          A bank account is needed to collect your consultation earnings.
          <br />
          Press "Proceed" to add your bank account.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBankAlertClose} color="primary">
            Cancel
          </Button>
          <Button onClick={(e) => history.push(`/partner/home/earnings`)} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default AddConsultation;
