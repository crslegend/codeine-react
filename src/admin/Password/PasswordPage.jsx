import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Paper, Grid } from "@material-ui/core";
import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "calc(100vh - 115px)",
  },
  margin: {
    margin: theme.spacing(1),
    width: "100%",
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
}));

const AdminPasswordPage = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);

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

  const handleClickShowOldPassword = () => {
    setPasswordDetails({
      ...passwordDetails,
      showOldPassword: !passwordDetails.showOldPassword,
    });
  };

  const handleClickShowNewPassword = () => {
    setPasswordDetails({
      ...passwordDetails,
      showNewPassword: !passwordDetails.showNewPassword,
    });
  };

  const handleClickShowRepeatPassword = () => {
    setPasswordDetails({
      ...passwordDetails,
      showRepeatPassword: !passwordDetails.showRepeatPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (prop) => (event) => {
    setPasswordDetails({ ...passwordDetails, [prop]: event.target.value });
  };

  const [adminId, setAdminId] = useState();

  const [passwordDetails, setPasswordDetails] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
    showOldPassword: false,
    showNewPassword: false,
    showRepeatPassword: false,
  });

  useEffect(() => {
    getProfileDetails();
  }, []);

  const getProfileDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const adminid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/admins/${adminid}`)
        .then((res) => {
          setAdminId(res.data.id);
        })
        .catch((err) => {
          setAdminId();
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    //setLoading(true);

    if (
      passwordDetails.new_password === "" ||
      passwordDetails.repeat_password === "" ||
      passwordDetails.old_password === ""
    ) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "All fields must be filled in.",
        severity: "error",
      });
      return;
    }

    if (passwordDetails.new_password !== passwordDetails.repeat_password) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "New password must match Repeat password",
        severity: "error",
      });
      return;
    }

    Service.client
      .patch(`/auth/admins/${adminId}`, passwordDetails)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Password updated successfully!",
          severity: "success",
        });
        e.target.reset();
      })
      .catch((err) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Current password is incorrect",
          severity: "error",
        });
      });
      passwordDetails.new_password = "";
      passwordDetails.repeat_password = "";
      passwordDetails.old_password = "";
      passwordDetails.showOldPassword = false;
      passwordDetails.showNewPassword = false;
      passwordDetails.showRepeatPassword = false;
  };

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <form onSubmit={handleSubmit} noValidate>
        <Paper elevation={0} className={classes.paper} autoComplete="off">
          <Grid container>
            <Grid item xs={6}>
              <FormControl className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-password">
                  Current Password
                </InputLabel>
                <Input
                  id="old_password"
                  type={passwordDetails.showOldPassword ? "text" : "password"}
                  value={passwordDetails.old_password}
                  onChange={handleChange("old_password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowOldPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {passwordDetails.showOldPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-password">
                  New Password
                </InputLabel>
                <Input
                  id="new_password"
                  type={passwordDetails.showNewPassword ? "text" : "password"}
                  value={passwordDetails.new_password}
                  onChange={handleChange("new_password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowNewPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {passwordDetails.showNewPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl className={classes.margin}>
                <InputLabel htmlFor="standard-adornment-password">
                  Repeat Password
                </InputLabel>
                <Input
                  id="repeat_password"
                  type={
                    passwordDetails.showRepeatPassword ? "text" : "password"
                  }
                  value={passwordDetails.repeat_password}
                  onChange={handleChange("repeat_password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowRepeatPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {passwordDetails.showRepeatPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

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
                  "Save Changes"
                )}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </div>
  );
};

export default AdminPasswordPage;
