import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Grid,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
}));

const AdminProfilePage = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} className={classes.paper}>
          <Grid container>
            <Grid container style={{ marginTop: "10vh" }}>
              <Grid xs={6}>
                <form className={classes.form} noValidate autoComplete="off">
                  <div>
                    <TextField
                      margin="normal"
                      id="firstname"
                      label="First Name"
                      name="FirstName"
                      autoComplete="FirstName"
                      required
                      fullWidth
                      // value={loginDetails.email}
                      // error={emailError}
                    />
                  </div>
                  <div>
                    <TextField
                      margin="normal"
                      id="lastname"
                      label="Last Name"
                      name="lastname"
                      autoComplete="lastname"
                      required
                      fullWidth
                    />
                  </div>
                  <div>
                    <TextField
                      margin="normal"
                      id="email"
                      label="Email"
                      name="email"
                      autoComplete="email"
                      required
                      fullWidth
                    />
                  </div>

                  <div>
                    <TextField
                      margin="normal"
                      id="companyname"
                      label="Company Name"
                      name="companyname"
                      autoComplete="companyname"
                      required
                      fullWidth
                    />
                  </div>

                  <div>
                    <TextField
                      margin="normal"
                      id="contactnumber"
                      label="Contact Number"
                      name="contactnumber"
                      autoComplete="contactnumber"
                      required
                      fullWidth
                    />
                  </div>

                  <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type="submit"
                  >
                    {loading ? (
                      <CircularProgress
                        size="1.5rem"
                        style={{ color: "#FFF" }}
                      />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </div>
  );
};

export default AdminProfilePage;
