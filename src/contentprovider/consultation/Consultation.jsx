import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Calendar from "./Calendar";
import AddConsultation from "./AddConsultation";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    marginLeft: "20px",
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
    </div>
  );
};

export default Consultation;
