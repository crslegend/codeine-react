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
import { useHistory } from "react-router-dom";
import { KeyboardDatePicker, TimePicker } from "@material-ui/pickers";
import { formatISO, addMinutes } from "date-fns";

import Service from "../../AxiosService";
import SmallMemberCard from "../../components/SmallMemberCard";

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
    maxWidth: "800px",
    width: "100%",
  },
  secondaryDialogPaper: {
    width: "30%",
  },
  errorButton: {
    color: theme.palette.error.main,
    border: `1px solid ${theme.palette.error.main}`,
  },
}));

const appendTimeToDate = (date, time) => {
  return new Date(formatISO(date, { representation: "date" }) + "T" + formatISO(time, { representation: "time" }));
};

const ConsultationDetailsModal = ({
  handleGetAllConsultations,
  selectedConsultation,
  setSelectedConsultation,
  setSnackbar,
  setSnackbarOpen,
}) => {
  const classes = useStyles();

  const currentDate = new Date();

  const [slot, setSlot] = useState({
    ...selectedConsultation,
    date: selectedConsultation.startDate,
    start_time: selectedConsultation.startDate,
    end_time: selectedConsultation.endDate,
  });

  console.log(selectedConsultation);

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
  const [timeError, setTimeError] = useState({
    err: false,
    errorMessage: "",
  });

  const handleRecurringDays = (event) => {
    setRecurringDays({ ...recurringDays, [event.target.name]: event.target.checked });
  };
  const [bankDialog, setBankDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [updateDialog, setUpdateDialog] = useState(false);

  // react router dom history hooks
  const history = useHistory();

  const handleCancelDialogClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCancelDialog(false);
  };
  const handleUpdateDialogClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setUpdateDialog(false);
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
    if (e.getHours() <= 5) {
      setTimeError({
        err: true,
        errorMessage: "Consultations should not start before 06:00 AM",
      });
    } else if (slot.end_time.getHours() === 0) {
      setTimeError({
        err: true,
        errorMessage: "Consultations should end before midnight",
      });
    } else if (e >= slot.end_time) {
      setTimeError({
        err: true,
        errorMessage: "End time must be after start time",
      });
    } else {
      setTimeError({
        err: false,
        errorMessage: "",
      });
    }

    setSlot({
      ...slot,
      start_time: e,
    });
  };

  const handleEndTimeChange = (e) => {
    if (slot.start_time.getHours() <= 5) {
      setTimeError({
        err: true,
        errorMessage: "Consultations should not start before 06:00 AM",
      });
    } else if (e.getHours() === 0) {
      setTimeError({
        err: true,
        errorMessage: "Consultations should end before midnight",
      });
    } else if (e <= slot.start_time) {
      setTimeError({
        err: true,
        errorMessage: "End time must be after start time",
      });
    } else {
      setTimeError({
        err: false,
        errorMessage: "",
      });
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
    setSelectedConsultation();
  };

  const validateInput = () => {
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

    if (slot.max_members < 1) {
      setSnackbar({
        message: "You must accept at least 1 signup",
        severity: "error",
      });
      setSnackbarOpen(true);
      return;
    }

    if (slot.max_members < selectedConsultation.max_members) {
      setSnackbar({
        message: "You can only increase the number of signups",
        severity: "error",
      });
      setSnackbarOpen(true);
      return;
    }

    if (timeError.err) {
      return;
    }

    if (slot)
      if (slot.price_per_pax > 0) {
        Service.client
          .get(`/auth/bank-details`)
          .then((res) => {
            setUpdateDialog(true);
          })
          .catch((err) => {
            setBankDialog(true);
          });
      } else {
        setUpdateDialog(true);
      }
  };

  const handleSubmit = () => {
    const formattedSlot = {
      ...slot,
      start_time: appendTimeToDate(slot.date, slot.start_time),
      end_time: appendTimeToDate(slot.date, slot.end_time),
    };

    Service.client
      .put(`/consultations/${slot.id}`, formattedSlot)
      .then((res) => {
        setSnackbar({
          message: "Consultation slot updated",
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
        setSelectedConsultation();
        handleGetAllConsultations();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // handles deletion of consultation slot
  const handleDeleteConsultation = () => {
    console.log();
    Service.client
      .patch(`/consultations/${slot.id}/cancel`)
      .then((res) => {
        console.log(res);
        handleGetAllConsultations();
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => handleClose());
  };

  return (
    <Fragment>
      <Dialog
        open={true}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="form-dialog-title">Consultation Slot Details</DialogTitle>
        <div style={{ display: "flex" }}>
          <DialogContent style={{ width: "70%" }}>
            <DialogContentText>Edit here to update your consultation slot.</DialogContentText>
            <div style={{ width: "100%" }}>
              <FormControlLabel
                style={{ margin: 0 }}
                control={
                  <Switch color="primary" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
                }
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
                  disablePast
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
                disablePast
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
            {timeError.err ? (
              <FormHelperText error>{timeError.errorMessage}</FormHelperText>
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
              style={{ marginTop: 16 }}
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
                helperText="You can only increase the no. of signups"
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
          <DialogContent style={{ paddingTop: 20, width: "30%" }}>
            <DialogContentText>Applicants ({selectedConsultation.applications.length})</DialogContentText>
            <div style={{ overflow: "auto", maxHeight: "450px" }}>
              {selectedConsultation &&
                selectedConsultation.applications.map((application) => (
                  <SmallMemberCard key={application.member.email} member={application.member} />
                ))}
            </div>
          </DialogContent>
        </div>
        <DialogActions style={{ justifyContent: "space-between", marginTop: 40 }}>
          <Button onClick={() => setCancelDialog(true)} className={classes.errorButton} variant="outlined">
            Cancel Consult
          </Button>
          <div style={{ width: "30%", display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={handleClose} color="primary" variant="outlined" style={{ marginRight: 8 }}>
              Back
            </Button>
            <Button onClick={validateInput} color="primary" variant="contained">
              Update
            </Button>
          </div>
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

      <Dialog open={updateDialog} onClose={handleUpdateDialogClose} classes={{ paper: classes.secondaryDialogPaper }}>
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <b>Price changes will only apply to new applicants.</b>Your students will be notified of the updates.
          <br />
          <br />
          Press "Proceed" to confirm.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={cancelDialog} onClose={handleCancelDialogClose} classes={{ paper: classes.secondaryDialogPaper }}>
        <DialogTitle>Confirm Cancellation</DialogTitle>
        <DialogContent>
          This action is <b>non reversible</b>. Your students will be notified of the cancellation and will be refunded
          (if applicable).
          <br />
          <br />
          Press "Proceed" to confirm.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConsultation} color="primary">
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ConsultationDetailsModal;
