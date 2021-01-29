import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  codeineLogo: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    paddingRight: "20px",
    paddingBottom: "20px",
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
    paddingTop: "30px",
    paddingBottom: "30px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    width: 120,
  },
}));

const RegisterPage = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [registerDetails, setRegisterDetails] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleEmailChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      password: e.target.value,
    });
  };

  const handleFirstNameChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      firstName: e.target.value,
    });
  };

  const handleLastNameChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      lastName: e.target.value,
    });
  };

  return (
    <div>
      <form>
        <Paper elevation={3} className={classes.paper}>
          <Link to="/admin" className={classes.codeineLogo}>
            <Typography variant="h4">
              <strong>codeine</strong>
            </Typography>
          </Link>
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="First Name"
            value={registerDetails && registerDetails.firstName}
            onChange={handleFirstNameChange}
            type="text"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Last Name"
            value={registerDetails && registerDetails.lastName}
            onChange={handleLastNameChange}
            type="text"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Email"
            value={registerDetails && registerDetails.email}
            onChange={handleEmailChange}
            type="email"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Password"
            value={registerDetails && registerDetails.password}
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
              "Register"
            )}
          </Button>

          <Typography variant="body1">
            Already have an account? Click{" "}
            <span>
              <Link
                to="/admin/login"
                style={{ textDecoration: "none", color: "#437FC7" }}
              >
                here
              </Link>
            </span>{" "}
            to login.
          </Typography>
        </Paper>
      </form>
    </div>
  );
};

export default RegisterPage;
