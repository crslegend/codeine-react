import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Divider } from "@material-ui/core";

import Calendar from "./Calendar";
import AddConsultation from "./AddConsultation";
import ConsultationApplication from "./ConsultationApplication";

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

const Consultation = () => {
  const classes = useStyles();

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
        <AddConsultation />
      </div>
      <Calendar />
      <Divider className={classes.divider} />
      <ConsultationApplication />
    </div>
  );
};

export default Consultation;
