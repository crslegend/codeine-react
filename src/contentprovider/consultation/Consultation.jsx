import React, { useCallback, useState, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Divider, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import jwt_decode from "jwt-decode";

import Calendar from "./Calendar";
import AddConsultation from "./AddConsultation";
import ConsultationApplication from "./ConsultationApplication";
import Service from "../../AxiosService";
import ConsultationDetailsModal from "./ConsultationDetailsModal";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    marginLeft: "20px",
    marginBottom: "50px",
  },
  divider: {
    backgroundColor: "#164D8F",
    margin: "50px 0px",
    width: "100%",
    height: "2px",
  },
}));

const toLocalTime = (date) => new Date(date);

const mapAppointmentData = (item) => ({
  id: item.id,
  title: item.title,
  startDate: toLocalTime(item.start_time),
  endDate: toLocalTime(item.end_time),
  meeting_link: item.meeting_link,
  applications: item.confirmed_applications,
  max_members: item.max_members,
  price_per_pax: item.price_per_pax,
});

const initialState = {
  consultations: [],
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setConsultations":
      return {
        ...state,
        consultations: action.payload.map(mapAppointmentData),
      };
    default:
      return state;
  }
};

const Consultation = () => {
  const classes = useStyles();

  const [selectedConsultation, setSelectedConsultation] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "success",
  });

  const [state, dispatch] = useReducer(reducer, initialState);
  const { consultations, loading } = state;

  const setConsultations = useCallback(
    (nextConsultations) =>
      dispatch({
        type: "setConsultations",
        payload: nextConsultations,
      }),
    [dispatch]
  );

  const setLoading = useCallback(
    (nextLoading) =>
      dispatch({
        type: "setLoading",
        payload: nextLoading,
      }),
    [dispatch]
  );

  const handleGetAllConsultations = (setConsultations, setLoading) => {
    setLoading(true);
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userId = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get("/consultations", {
          params: { partner_id: userId, is_cancelled: "False" },
        })
        .then((res) => {
          // console.log(res);
          setTimeout(() => {
            setConsultations(res.data);
            setLoading(false);
          }, 600);
        })
        .catch((error) => {
          setConsultations(null);
        });
    }
  };

  const handleSnackbarClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          marginBottom: "30px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h1">Upcoming schedule at a glance</Typography>
        <AddConsultation
          handleGetAllConsultations={() => handleGetAllConsultations(setConsultations, setLoading)}
          setSnackbar={setSnackbar}
          setSnackbarOpen={setSnackbarOpen}
        />
      </div>
      <Calendar
        consultations={consultations}
        loading={loading}
        setConsultations={setConsultations}
        setLoading={setLoading}
        handleGetAllConsultations={handleGetAllConsultations}
        setSelectedConsultation={setSelectedConsultation}
      />
      <Divider className={classes.divider} />
      <ConsultationApplication
        handleGetAllConsultations={() => handleGetAllConsultations(setConsultations, setLoading)}
      />
      {selectedConsultation && (
        <ConsultationDetailsModal
          handleGetAllConsultations={() => handleGetAllConsultations(setConsultations, setLoading)}
          selectedConsultation={selectedConsultation}
          setSelectedConsultation={setSelectedConsultation}
          setSnackbar={setSnackbar}
          setSnackbarOpen={setSnackbarOpen}
        />
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} elevation={6} severity={snackbar.severity}>
          <Typography variant="body1">{snackbar.message}</Typography>
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Consultation;
