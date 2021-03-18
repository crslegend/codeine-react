import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
// import Service from "../AxiosService";
import Partnerlogo from "../assets/CodeineLogos/Partner.svg";
import Memberlogo from "../assets/CodeineLogos/Member.svg";
import Adminlogo from "../assets/CodeineLogos/Admin.svg";
import Toast from "../components/Toast.js";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
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
    minWidth: "120px",
    marginBottom: "10px",
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
    width: 280,
  },
}));

const ResetPasswordPage = (props) => {
  const classes = useStyles();
  //const history = useHistory();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);

  const [emailDetails, setEmailDetails] = useState({
    email: "",
  });

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

  const handleEmailChange = (e) => {
    setEmailDetails({
      ...emailDetails,
      email: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("reset = " + emailDetails);

    // call reset password endpoint
    axios
      .post("http://localhost:8000/auth/reset-password", emailDetails, {
        timeout: 20000,
      })
      .then((res) => {
        setLoading(false);
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message:
            "Please check your email for instructions to reset your password",
          severity: "success",
        });
        //if member, go to member landing page
        // if (id === "member") {
        //   setTimeout(() => history.push("/"), 2000);
        //   //history.push("/");
        // } else if (id === "partner") {
        //   setTimeout(() => history.push("/partner"), 2000);
        //   history.push("/partner");
        // } else {
        //   setTimeout(() => history.push("/admin/login"), 2000);
        // }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);

        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "This email does not exist! " + err.message,
          severity: "error",
        });
      });
  };

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} className={classes.paper}>
          {id === "partner" && (
            <Link to="/partner" className={classes.codeineLogo}>
              <img src={Partnerlogo} alt="logo" width="110%" />
            </Link>
          )}
          {id === "member" && (
            <Link to="/" className={classes.codeineLogo}>
              <img src={Memberlogo} alt="logo" width="110%" />
            </Link>
          )}
          {id === "admin" && (
            <Link to="/admin" className={classes.codeineLogo}>
              <img src={Adminlogo} alt="logo" width="110%" />
            </Link>
          )}

          <Typography style={{ fontSize: "22px", fontWeight: "600" }}>
            Reset Password
          </Typography>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Enter the email address of your account
          </Typography>
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Your email"
            value={emailDetails && emailDetails.email}
            onChange={handleEmailChange}
            type="email"
            required
            autoFocus
          />
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            {loading ? (
              <CircularProgress size="1.5rem" style={{ color: "#FFF" }} />
            ) : (
              "Send Password Reset Link"
            )}
          </Button>
        </Paper>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
