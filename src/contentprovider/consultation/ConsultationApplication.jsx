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

const deleteConsultation = () => {};

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
    },
    member: {
      email: "",
      profile_photo: "",
    },
  });
  const [openApplicationDialog, setOpenApplicationDialog] = useState(false);

  useEffect(() => {
    getApplicationData();
  }, [setApplications]);

  const handleClickOpenApplication = (e) => {
    setSelectedApplication(e.row);
    setOpenApplicationDialog(true);
  };

  const handleCloseApplication = () => {
    setOpenApplicationDialog(false);
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

  const handleRejectStatus = (e, status, partnerid) => {
    Service.client.delete(`/auth/partners/${partnerid}`).then((res) => {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Member is removed from consultation",
        severity: "success",
      });
      Service.client
        .get(`/auth/partners/${partnerid}`)
        .then((res) => {
          setSelectedApplication(res.data);
        })
        .catch((err) => {});
      getApplicationData();
    });

    console.log("Application is deleted");
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
      field: "current_pax",
      headerName: "No. of signups",
      width: 150,
    },
    {
      width: 120,
      field: "is_rejected",
      headerName: "Action",
      renderCell: () => (
        <Button
          style={{ color: "#437FC7", textTransform: "capitalize" }}
          onClick={() => {
            deleteConsultation();
          }}
        >
          Reject
        </Button>
      ),
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
    applicationsRows[h].current_pax = applications[h].member.length; //update API
    console.log(applicationsRows[h].current_pax);
    applicationsRows[h].member_name =
      applications[h].member.first_name +
      " " +
      applications[h].member.last_name;
    applicationsRows[h].member.email = applications[h].member.email;
    console.log(applicationsRows[h].member.email);
  }

  return (
    <div style={{ minHeight: "70vh" }}>
      <Typography
        variant="h4"
        style={{ marginBottom: "20px", color: "#437FC7" }}
      >
        Consultation Applications
      </Typography>
      <div style={{ height: "650px", width: "100%" }}>
        <DataGrid
          rows={applicationsRows}
          columns={applicationsColumns.map((column) => ({
            ...column,
            //disableClickEventBubbling: true,
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
                <br />
              </Typography>
            </Grid>
          </Grid>
          <br />
          <DialogActions>
            <Button
              className={classes.rejectButton}
              onClick={(e) =>
                handleRejectStatus(
                  e,
                  selectedApplication.is_rejected,
                  selectedApplication.id
                )
              }
            >
              Reject
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationApplication;
