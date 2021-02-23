import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  Button,
  IconButton,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import Toast from "../../components/Toast.js";

import jwt_decode from "jwt-decode";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  avatar: {
    fontSize: "95px",
    width: theme.spacing(20),
    height: theme.spacing(20),
    marginBottom: "15px",
    marginLeft: "45px",
  },
  rejectButton: {
    fontSize: "18px",
    color: "#437FC7",
    padding: "10px 20px",
  },
}));

const ConsultationApplication = () => {
  const classes = styles();

  //Toast message
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

  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState({
    id: "",
    title: "",
    start_time: "",
    end_time: "",
    meeting_link: "",
    price_per_pax: "",
    max_members: "",
    member_name: "",
    consultation_slot: {
      id: "",
      number_of_signups: "",
    },
    member: {
      email: "",
      profile_photo: "",
    },
  });
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  useEffect(() => {
    getApplicationData();
  }, [setApplications]);

  const handleClickOpenApplication = (e) => {
    setSelectedApplication(e.row);
    setOpenApplicationDialog(true);
  };

  const handleCloseReject = () => {
    setOpenRejectDialog(false);
  };

  const handleCloseApplication = () => {
    setOpenApplicationDialog(false);
  };

  const handleReject = (applicationId) => {
    setOpenRejectDialog(false);
    setOpenApplicationDialog(false);
    rejectConsultation(applicationId);
  };

  const getApplicationData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      console.log(userid);
      Service.client
        .get("/consultations/partner/applications")
        .then((res) => {
          setApplications(res.data);
        })
        .catch((error) => {
          setApplications(null);
        });
    }
  };

  console.log(applications);

  const rejectConsultation = (applicationId) => {
    Service.client
      .patch(`/consultations/application/${applicationId}/reject`)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Member is removed from consultation",
          severity: "success",
        });
        getApplicationData();
        window.location.reload();
      });

    console.log("Application is deleted");
  };

  const formatStatus = (status) => {
    if (status !== "Rejected") {
      return "green";
    } else {
      return "red";
    }
  };

  const applicationsColumns = [
    { field: "title", headerName: "Title", width: 250 },
    {
      field: "member_name",
      headerName: "Submitted By",
      width: 200,
    },
    {
      field: "meeting_link",
      headerName: "Meeting Link",
      width: 300,
    },
    {
      field: "start_time",
      headerName: "Start Time",
      width: 220,
    },
    {
      field: "end_time",
      headerName: "End Time",
      type: "date",
      width: 220,
    },
    {
      field: "max_pax",
      headerName: "No. of slots",
      width: 130,
    },
    {
      field: "number_of_signups",
      headerName: "No. of signups",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => (
        <strong>
          <Typography style={{ color: formatStatus(params.value) }}>
            {params.value}
          </Typography>
        </strong>
      ),
      width: 130,
    },
  ];

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const applicationsRows = applications;

  for (var h = 0; h < applications.length; h++) {
    applicationsRows[h].start_time = formatDate(
      applications[h].consultation_slot.start_time
    );
    applicationsRows[h].end_time = formatDate(
      applications[h].consultation_slot.end_time
    );
    applicationsRows[h].meeting_link =
      applications[h].consultation_slot.meeting_link;
    applicationsRows[h].title = applications[h].consultation_slot.title;
    applicationsRows[h].max_pax = applications[h].consultation_slot.max_members;
    applicationsRows[h].number_of_signups =
      applications[h].consultation_slot.number_of_signups; //update API

    applicationsRows[h].member_name =
      applications[h].member.first_name +
      " " +
      applications[h].member.last_name;
    if (applications[h].is_rejected === true) {
      applicationsRows[h].status = "Rejected";
    } else {
      applicationsRows[h].status = "Accepted";
    }
  }

  return (
    <div style={{ minHeight: "70vh" }}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Typography
        variant="h4"
        style={{ marginBottom: "5px", color: "#437FC7" }}
      >
        Consultation Applications
      </Typography>
      <Typography
        variant="body1"
        style={{ marginBottom: "40px", color: "#000000" }}
      >
        Click on the respective applications below to view application details.
      </Typography>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={applicationsRows}
          columns={applicationsColumns.map((column) => ({
            ...column,
          }))}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
          onRowClick={(e) => handleClickOpenApplication(e)}
        />
      </div>
      <Dialog
        open={openApplicationDialog}
        onClose={handleCloseApplication}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">
          <Typography
            variant="h4"
            style={{
              marginTop: "10px",
              marginLeft: "20px",
              marginBottom: "10px",
            }}
          >
            Application Detail
          </Typography>

          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseApplication}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={4}>
              {selectedApplication.member.profile_photo ? (
                <Avatar
                  src={selectedApplication.member.profile_photo}
                  alt=""
                  className={classes.avatar}
                />
              ) : (
                <Avatar className={classes.avatar}>
                  {selectedApplication &&
                    selectedApplication.member.email.charAt(0)}
                </Avatar>
              )}
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginRight: "60px" }}
              >
                {selectedApplication.member_name}
                <br />
                {selectedApplication.member.email}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6">
                Application ID <br />
                Consultation ID <br />
                Title <br />
                Meeting Link <br />
                Start Date <br />
                End Date <br />
                Price <br />
                Maximum available slots <br />
                Current slots taken <br />
              </Typography>

              <br />
            </Grid>
            <Grid item xs={5}>
              <Typography variant="h6">
                {selectedApplication.id} <br />
                {selectedApplication.consultation_slot.id} <br />
                {selectedApplication.title}
                <br />
                {selectedApplication.meeting_link}
                <br />
                {formatDate(selectedApplication.start_time)} <br />
                {formatDate(selectedApplication.end_time)} <br />$
                {selectedApplication.consultation_slot.price_per_pax}
                <br />
                {selectedApplication.max_pax}
                <br />
                {selectedApplication.consultation_slot.number_of_signups}
                <br />
              </Typography>
            </Grid>
          </Grid>
          <br />
          <DialogActions>
            {selectedApplication.is_rejected === false ? (
              <Button
                className={classes.rejectButton}
                onClick={(e) => setOpenRejectDialog(true)}
              >
                Reject
              </Button>
            ) : (
              ""
            )}
          </DialogActions>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openRejectDialog}
        onClose={handleCloseReject}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle>
          <Typography style={{ textAlign: "center", fontSize: "24px" }}>
            Are you sure?
          </Typography>
        </DialogTitle>
        <DialogContent style={{ textAlign: "center", fontSize: "18px" }}>
          Press confirm to proceed. Note that action cannot be undone.
        </DialogContent>
        <DialogActions style={{ paddingBottom: "20px", marginRight: "5px" }}>
          <Button
            variant="outlined"
            onClick={(e) => setOpenRejectDialog(false)}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            variant="outlined"
            style={{ color: "#437FC7" }}
            onClick={(e) => handleReject(selectedApplication.id)}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConsultationApplication;
