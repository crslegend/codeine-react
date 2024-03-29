import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import MemberLogo from "../assets/codeineLogos/Member.svg";
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
    width: 200,
  },
}));

const NewPasswordPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [passwordDetails, setPasswordDetails] = useState({
    reset_password: "",
    repeat_password: "",
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

  // useEffect(() => {
  //   if (new URLSearchParams(location.search).get("token") !== null) {

  //     console.log("refresh toekn = " + token);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const token = new URLSearchParams(location.search).get("token");
  // console.log(token);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      passwordDetails.reset_password === "" ||
      passwordDetails.repeat_password === ""
    ) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "All fields must be filled in.",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (passwordDetails.reset_password !== passwordDetails.repeat_password) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "New password must match Repeat password",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    axios
      .patch("http://localhost:8000/auth/reset-password", passwordDetails, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log(res);
        setLoading(false);
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message:
            "Your password has been resetted. Redirecting you to login page...",
          severity: "success",
        });

        setTimeout(() => {
          if (res.data.member) {
            //if member, go to member landing page
            history.push("/member/login");
          } else if (res.data.partner) {
            //if partner, go to partner landing page
            history.push("/partner/login");
          } else {
            //if admin, go to admin login page
            history.push("/admin/login");
          }
        }, 1000);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);

        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "This email does not exist. Please try again.",
          severity: "error",
        });
      });
  };

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} className={classes.paper}>
          <img src={MemberLogo} alt="logo" width="20%" />

          <Typography
            style={{ fontSize: "22px", fontWeight: "600", paddingTop: "20px" }}
          >
            Reset Password
          </Typography>
          <Typography
            style={{
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Enter the new password for your account
          </Typography>
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="New Password"
            value={passwordDetails.reset_password}
            onChange={(event) =>
              setPasswordDetails({
                ...passwordDetails,
                reset_password: event.target.value,
              })
            }
            type="password"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Repeat Password"
            value={passwordDetails.repeat_password}
            onChange={(event) =>
              setPasswordDetails({
                ...passwordDetails,
                repeat_password: event.target.value,
              })
            }
            type="password"
            required
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
              "Save new password"
            )}
          </Button>
        </Paper>
      </form>
    </div>
  );
};

export default NewPasswordPage;
