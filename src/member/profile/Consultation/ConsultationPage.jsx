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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import MemberNavBar from "../../MemberNavBar";
import Toast from "../../../components/Toast.js";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Service from "../../../AxiosService";
import PageTitle from "../../../components/PageTitle";

const useStyles = makeStyles((theme) => ({
  heading: {
    height: "80px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cancelButton: {
    textTransform: "capitalize",
  },
  formControl: {
    margin: "20px 0px",
    // marginRight: theme.spacing(9),
    width: "250px",
    maxHeight: 50,
  },
  inputLabel: {
    top: "-5",
    color: "#E3E3E3",
    "&.Mui-focused": {
      color: "#fff",
    },
  },
  dataGrid: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
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

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const [sortMethod, setSortMethod] = useState("");

  const [allConsultations, setAllConsultations] = useState([]);
  const [application, setApplication] = useState([]);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

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

  const currentDate = formatDate(new Date());

  const getApplicationData = (sort) => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      console.log(userid);

      let queryParams = "";

      if (sort !== undefined) {
        if (sort === "upcoming") {
          queryParams = {
            is_upcoming: "True",
          };
        }
        if (sort === "past") {
          queryParams = {
            is_past: "True",
          };
        }
      }

      Service.client
        .get("/consultations/member/applications", {
          params: { ...queryParams },
        })
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

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getApplicationData(e.target.value);
  };

  console.log(allConsultations);

  const deleteConsultation = (row) => {
    console.log(row);
    setApplication(row);
    setOpenCancelDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleCancel = (application) => {
    setOpenCancelDialog(false);
    cancelConsultation(application);
  };

  const cancelConsultation = (application) => {
    Service.client
      .patch(`/consultations/application/${application.id}/cancel`)
      .then((res) => {
        if (application.consultation_payments.length > 0) {
          Service.client
            .post(
              `/consultations/payment/${application.consultation_payments[0].id}/refund`
            )
            .then((res) => {
              // console.log(res);
              setSnackbar({
                ...snackbar,
                message: "You have been removed from consultation",
                severity: "success",
              });
              setSbOpen(true);

              getApplicationData();
            })
            .catch((err) => {
              console.log(err);
              setSnackbar({
                ...snackbar,
                message:
                  "Something went wrong, contact Help Center for support",
                severity: "error",
              });
              setSbOpen(true);
            });
        } else {
          setSnackbar({
            ...snackbar,
            message: "You have been removed from consultation",
            severity: "success",
          });
          setSbOpen(true);

          getApplicationData();
        }
      })
      .catch((err) => {
        console.log(err);
        setSnackbar({
          ...snackbar,
          message: "Something went wrong, contact Help Center for support",
          severity: "error",
        });
        setSbOpen(true);
      });

    // console.log("Application is deleted");
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
    { field: "title", headerName: "Title", width: 250 },
    {
      field: "meeting_link",
      headerName: "Meeting Link",
      width: 350,
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
      headerName: "Instructor",
      width: 200,
    },
    {
      field: "amount",
      headerName: "Amount",
      renderCell: (params) => <div variant="body2">${params.value}</div>,
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => (
        <div variant="body2" style={{ color: formatStatus(params.value) }}>
          {params.value}
        </div>
      ),
      width: 120,
    },
    {
      width: 160,
      field: "is_cancelled",
      headerName: "Cancel Booking",
      renderCell: (params) => (
        <Button
          color="primary"
          className={classes.cancelButton}
          disabled={
            params.row.status !== "Confirmed" ||
            params.row.end_time < currentDate
          }
          onClick={() => {
            deleteConsultation(params.row);
          }}
        >
          Cancel
        </Button>
      ),
    },
  ];

  const consultationRows = allConsultations;

  for (var h = 0; h < allConsultations.length; h++) {
    consultationRows[h].start_time = formatDate(
      allConsultations[h].consultation_slot.start_time
    );
    consultationRows[h].end_time = formatDate(
      allConsultations[h].consultation_slot.end_time
    );

    consultationRows[h].title = allConsultations[h].consultation_slot.title;
    consultationRows[h].amount =
      allConsultations[h].consultation_slot.price_per_pax;
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
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ paddingTop: "65px" }}>
        <div style={{ width: "80%", margin: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <PageTitle title="My Consultations" />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel style={{ top: -4, textUnderline: "none" }}>
                Filter by
              </InputLabel>
              <Select
                label="Filter by"
                value={sortMethod}
                onChange={(event) => {
                  onSortChange(event);
                }}
                style={{
                  height: 47,
                  backgroundColor: "#fff",
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="upcoming">Upcoming Consultations</MenuItem>
                <MenuItem value="past">Past Consultations</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ height: "500px", width: "100%" }}>
            <DataGrid
              className={classes.dataGrid}
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
                Press confirm to proceed. Note that your action cannot be
                undone. Refunds will be made to you within 3-5 working days.
              </DialogContent>
              <DialogActions
                style={{ paddingBottom: "20px", marginRight: "5px" }}
              >
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
                  onClick={(e) => handleCancel(application)}
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Consultation;
