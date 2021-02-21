import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, Typography } from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import Service from "../AxiosService";
import logo from "../assets/CodeineLogos/Partner.svg";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  codeineLogo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10px",
    width: "25%",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    padding: "20px 30px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    width: 120,
  },
}));

const PaymentSuccess = () => {
  const classes = styles();
  const { id } = useParams();

  useEffect(() => {}, []);

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.codeineLogo}>
          <img src={logo} alt="logo" width="90%" />
        </div>
        <Typography
          variant="h5"
          style={{ paddingTop: "20px", fontWeight: 600, textAlign: "center" }}
        >
          We have received your payment!
        </Typography>
        <Typography
          variant="body1"
          style={{ paddingTop: "10px", textAlign: "center" }}
        >
          Click on the button below to continue.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "25px" }}
        >
          Bring Me Back
        </Button>
      </Paper>
    </div>
  );
};

export default PaymentSuccess;
