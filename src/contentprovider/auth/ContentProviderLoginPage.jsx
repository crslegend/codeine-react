import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Service from "../../AxiosService";
import logo from "../../assets/CodeineLogos/Partner.svg";
import Toast from "../../components/Toast.js";

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

const ContentProviderLoginPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
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
    setLoginDetails({
      ...loginDetails,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setLoginDetails({
      ...loginDetails,
      password: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // call admin login ednpoint
    Service.client
      .post("/api/token/", loginDetails)
      .then((res) => {
        // console.log(res);

        if (res.data.user.partner) {
          Service.storeCredentials(res.data);
          history.push("/partner/home/dashboard");
        } else if (res.data.user.member) {
          Service.storeCredentials(res.data);
          history.push("/courses");

          // setLoading(false);
          // setSbOpen(true);
          // setSnackbar({
          //   ...snackbar,
          //   message:
          //     "The email address entered is not a registered partner. Please register first!",
          //   severity: "error",
          // });
          // return;
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response);

        if (err.response.status === 403) {
          setSbOpen(true);
          if (err.response.data.is_suspended) {
            setSnackbar({
              ...snackbar,
              message:
                "Your account has been deactivated, please contact Codeine for help to activate your account.",
              severity: "error",
            });
          } else {
            setSnackbar({
              ...snackbar,
              message:
                "Your account is still being reviewed by us, please try again later.",
              severity: "error",
            });
          }
        } else {
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Incorrect email address or password. Please try again!",
            severity: "error",
          });
        }
      });
  };

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} className={classes.paper}>
          <Link to="/partner" className={classes.codeineLogo}>
            <img src={logo} alt="logo" width="110%" />
          </Link>
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Email"
            value={loginDetails && loginDetails.email}
            onChange={handleEmailChange}
            type="email"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Password"
            value={loginDetails && loginDetails.password}
            onChange={handlePasswordChange}
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
              "Login"
            )}
          </Button>

          <Typography variant="body1">
            Do not have an account? Click{" "}
            <span>
              <Link
                to="/partner/register"
                style={{ textDecoration: "none", color: "#437FC7" }}
              >
                here
              </Link>
            </span>{" "}
            to register!
          </Typography>
          <Typography variant="body1">
            <span>
              <Link to="/resetPassword/partner" style={{ color: "#437FC7" }}>
                Forget Password?
              </Link>
            </span>
          </Typography>
        </Paper>
      </form>
    </div>
  );
};

export default ContentProviderLoginPage;
