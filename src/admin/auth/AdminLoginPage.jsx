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

const LoginPage = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
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
                to="/admin/register"
                style={{ textDecoration: "none", color: "#437FC7" }}
              >
                here
              </Link>
            </span>{" "}
            to register.
          </Typography>
        </Paper>
      </form>
    </div>
  );
};

export default LoginPage;
