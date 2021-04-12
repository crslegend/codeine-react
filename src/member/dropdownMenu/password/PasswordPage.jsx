import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  CircularProgress,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Input,
  InputLabel,
  FormControl,
  Link,
} from "@material-ui/core";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Cookies from "js-cookie";
import MemberNavBar from "../../MemberNavBar";
import PageTitle from "../../../components/PageTitle";

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: "65px",
    padding: theme.spacing(3),
    // backgroundColor: "#fff",
    // height: "100vh",
  },
  margin: {
    margin: theme.spacing(1),
    width: "100%",
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
}));

const Password = (props) => {
  const classes = useStyles();
  const { snackbar, setSbOpen, setSnackbar } = props;
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const [loading, setLoading] = useState(false);

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

  const [memberId, setMemberId] = useState();

  const [passwordDetails, setPasswordDetails] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
    showOldPassword: false,
    showNewPassword: false,
    showRepeatPassword: false,
  });

  useEffect(() => {
    checkIfLoggedIn();
    getProfileDetails();
  }, []);

  const getProfileDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${userid}`)
        .then((res) => {
          setMemberId(res.data.id);
        })
        .catch((err) => {
          setMemberId();
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

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
      setLoading(false);
      return;
    }

    if (passwordDetails.new_password !== passwordDetails.repeat_password) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "New password must match Repeat password",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    Service.client
      .patch(`/auth/members/${memberId}/change-password`, passwordDetails)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Password updated successfully!",
          severity: "success",
        });
        passwordDetails.old_password = "";
        passwordDetails.new_password = "";
        passwordDetails.repeat_password = "";
        passwordDetails.showOldPassword = false;
        passwordDetails.showNewPassword = false;
        passwordDetails.showRepeatPassword = false;
        setLoading(false);
        history.push("/member/home/dashboard");
      })
      .catch((err) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Current password is incorrect",
          severity: "error",
        });
        setLoading(false);
      });
  };

  return (
    <Fragment>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

      <div className={classes.content}>
        <div style={{ width: "80%", margin: "auto" }}>
          <form onSubmit={handleSubmit} noValidate>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              style={{ marginTop: "20px" }}
            >
              <Link
                color="inherit"
                onClick={() => {
                  history.push("/member/profile");
                }}
                style={{ cursor: "pointer" }}
              >
                Profile
              </Link>
              <Typography color="textPrimary">Change Password</Typography>
            </Breadcrumbs>
            <PageTitle title="Change Password" />

            <Grid
              container
              style={{ backgroundColor: "#fff", padding: "16px" }}
            >
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
                    required
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
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Password;
