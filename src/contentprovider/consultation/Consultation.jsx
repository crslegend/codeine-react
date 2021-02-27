import React, { useCallback, useState, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Divider } from "@material-ui/core";
import jwt_decode from "jwt-decode";

import Calendar from "./Calendar";
import AddConsultation from "./AddConsultation";
import ConsultationApplication from "./ConsultationApplication";
import Service from "../../AxiosService";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

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

const handleMemberList = (list) => {
  const newList = [];
  let i = 1;
  console.log(list);
  list.forEach((listItem) => {
    console.log(list.length);
    if (list.length === i) {
      newList.push(listItem.member.first_name + " " + listItem.member.last_name);
    } else {
      newList.push(listItem.member.first_name + " " + listItem.member.last_name + ", ");
    }
    i++;
  });
  return newList;
};

const mapAppointmentData = (item) => ({
  id: item.id,
  title: item.title,
  startDate: toLocalTime(item.start_time),
  endDate: toLocalTime(item.end_time),
  meeting_link: item.meeting_link,
  member: handleMemberList(item.confirmed_applications),
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
  console.log(selectedConsultation);

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
          console.log(res);
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

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          marginBottom: "30px",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h1">Upcoming schedule at a glance</Typography>
        <AddConsultation handleGetAllConsultations={() => handleGetAllConsultations(setConsultations, setLoading)} />
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
      <ConsultationApplication />
      {selectedConsultation && (
        <AppointmentDetailsModal
          handleGetAllConsultations={() => handleGetAllConsultations(setConsultations, setLoading)}
          selectedConsultation={selectedConsultation}
          setSelectedConsultation={setSelectedConsultation}
        />
      )}
    </div>
  );
};

export default Consultation;
