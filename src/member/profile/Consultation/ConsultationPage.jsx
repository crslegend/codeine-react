import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  Button,
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import Toast from "../../../components/Toast.js";
import jwt_decode from "jwt-decode";
import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  cancelButton: {
    textTransform: "capitalize",
  },
}));

const Consultation = () => {
  const classes = useStyles();

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

  const [allConsultations, setAllConsultations] = useState([]);
  const [application, setApplication] = useState([]);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const getApplicationData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      console.log(userid);
      Service.client
        .get("/consultations/member/applications")
        .then((res) => {
          setAllConsultations(res.data);
        })
        .catch((error) => {
          setAllConsultations(null);
        });
    }
  };

  useEffect(() => {
    getApplicationData();
  }, [setAllConsultations]);

  console.log(allConsultations);

  const deleteConsultation = (row) => {
    console.log(row);
    setApplication(row);
    setOpenCancelDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleCancel = (applicationId) => {
    setOpenCancelDialog(false);
    cancelConsultation(applicationId);
  };

  const cancelConsultation = (applicationId) => {
    Service.client
      .patch(`/consultations/application/${applicationId}/cancel`)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "You have been removed from this consultation",
          severity: "success",
        });
        getApplicationData();
      });

    console.log("Application is deleted");
  };

  const formatStatus = (status) => {
    if (status === "Confirmed") {
      return "green";
    } else if (status === "Rejected") {
      return "red";
    } else {
      return "orange";
    }
  };

  const consultationColumns = [
    { field: "title", headerName: "Title", width: 300 },
    {
      field: "meeting_link",
      headerName: "Meeting Link",
      width: 400,
      renderCell: (params) => {
        //console.log(params.row.meeting_link);
        return (
          <a
            href={params.row.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {params.row.meeting_link}
          </a>
        );
      },
    },
    { field: "start_time", headerName: "Start Time", width: 220 },
    {
      field: "end_time",
      headerName: "End Time",
      type: "date",
      width: 220,
    },
    {
      field: "partner",
      headerName: "Created By",
      width: 200,
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
      width: 150,
    },
    {
      width: 150,
      field: "is_cancelled",
      headerName: "Remove",
      renderCell: (params) => (
        <Button
          color="primary"
          className={classes.cancelButton}
          disabled={params.row.status !== "Confirmed"}
          onClick={() => {
            deleteConsultation(params.row);
          }}
        >
          Cancel
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

  const consultationRows = allConsultations;

  for (var h = 0; h < allConsultations.length; h++) {
    consultationRows[h].start_time = formatDate(
      allConsultations[h].consultation_slot.start_time
    );
    consultationRows[h].end_time = formatDate(
      allConsultations[h].consultation_slot.end_time
    );

    consultationRows[h].title = allConsultations[h].consultation_slot.title;
    consultationRows[h].meeting_link =
      allConsultations[h].consultation_slot.meeting_link;

    if (allConsultations[h].is_rejected === true) {
      consultationRows[h].status = "Rejected";
    } else if (allConsultations[h].is_cancelled === true) {
      consultationRows[h].status = "Cancelled";
    } else {
      consultationRows[h].status = "Confirmed";
    }

    consultationRows[h].partner =
      allConsultations[h].consultation_slot.partner_name;
  }

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Box className={classes.heading}>
        <Typography variant="h4" style={{ marginLeft: "56px", color: "#fff" }}>
          My Consultations
        </Typography>
      </Box>
      <div style={{ height: "700px", width: "100%" }}>
        <DataGrid
          rows={consultationRows}
          columns={consultationColumns.map((column) => ({
            ...column,
          }))}
          pageSize={10}
          disableSelectionOnClick
          /*{onRowClick={(e) => handleClickOpenMember(e)}}*/
        />
        <Dialog
          open={openCancelDialog}
          onClose={handleCloseDialog}
          maxWidth="xs"
          fullWidth={true}
        >
          <DialogTitle>
            <Typography style={{ textAlign: "center", fontSize: "24px" }}>
              Remove your application?
            </Typography>
          </DialogTitle>
          <DialogContent style={{ textAlign: "center", fontSize: "18px" }}>
            Press confirm to proceed. Note that your action cannot be undone.
            Refunds will be made to you within 3-5 working days.
          </DialogContent>
          <DialogActions style={{ paddingBottom: "20px", marginRight: "5px" }}>
            <Button
              variant="outlined"
              onClick={(e) => setOpenCancelDialog(false)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              variant="outlined"
              style={{ color: "#437FC7" }}
              onClick={(e) => handleCancel(application.id)}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Fragment>
  );
};

export default Consultation;
