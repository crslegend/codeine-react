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
import Service from "../../AxiosService";
import logo from "../../assets/codeineLogos/Member.svg";

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
  fieldRoot: {
    backgroundColor: "#FFFFFF",
    width: 250,
  },
  fieldInput: {
    padding: "12px",
    fontSize: "14px",
  },
  focused: {
    boxShadow: "2px 2px 0px #222",
  },
  notchedOutline: {
    borderColor: "#222 !important",
    borderWidth: "1px !important",
  },
}));

const MemberRegisterPage = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [awaitActivate, setAwaitActivate] = useState(false);

  const [registerDetails, setRegisterDetails] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
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
      first_name: e.target.value,
    });
  };

  const handleLastNameChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      last_name: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    Service.client
      .post("/auth/members", registerDetails, {
        timeout: 20000,
      })
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setAwaitActivate(true);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  if (awaitActivate) {
    return (
      <div>
        <Paper elevation={3} className={classes.paper}>
          <Link to="/" className={classes.codeineLogo}>
            <img src={logo} alt="logo" width="90%" />
          </Link>
          <Typography
            variant="h5"
            style={{ paddingTop: "20px", fontWeight: 600, textAlign: "center" }}
          >
            Thank you for registering with Codeine!
          </Typography>
          <Typography
            variant="body1"
            style={{ paddingTop: "10px", textAlign: "center" }}
          >
            Please check your email to activate your account.
          </Typography>
        </Paper>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} className={classes.paper}>
          <Link to="/" className={classes.codeineLogo}>
            <img src={logo} alt="logo" width="90%" />
          </Link>
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="First Name"
            InputProps={{
              classes: {
                root: classes.fieldRoot,
                focused: classes.focused,
                input: classes.fieldInput,
                notchedOutline: classes.notchedOutline,
              },
            }}
            value={registerDetails && registerDetails.first_name}
            onChange={handleFirstNameChange}
            type="text"
            required
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Last Name"
            InputProps={{
              classes: {
                root: classes.fieldRoot,
                focused: classes.focused,
                input: classes.fieldInput,
                notchedOutline: classes.notchedOutline,
              },
            }}
            value={registerDetails && registerDetails.last_name}
            onChange={handleLastNameChange}
            type="text"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Email"
            InputProps={{
              classes: {
                root: classes.fieldRoot,
                focused: classes.focused,
                input: classes.fieldInput,
                notchedOutline: classes.notchedOutline,
              },
            }}
            value={registerDetails && registerDetails.email}
            onChange={handleEmailChange}
            type="email"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Password"
            InputProps={{
              classes: {
                root: classes.fieldRoot,
                focused: classes.focused,
                input: classes.fieldInput,
                notchedOutline: classes.notchedOutline,
              },
            }}
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
                to="/member/login"
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

export default MemberRegisterPage;
