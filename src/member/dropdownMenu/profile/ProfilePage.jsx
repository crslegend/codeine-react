import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Tabs,
  Tab,
  Box,
  InputAdornment,
  FilledInput,
  Grid,
} from "@material-ui/core";
import {
  Mood,
  Lock,
  Work,
  Add,
  Close,
  Visibility,
  VisibilityOff,
  LocationOn,
} from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useHistory, Link } from "react-router-dom";
import MemberNavBar from "../../MemberNavBar";
import { DropzoneAreaBase } from "material-ui-dropzone";
import Toast from "../../../components/Toast.js";
import validator from "validator";
import EditIcon from "../../../assets/EditIcon.svg";
import Cookies from "js-cookie";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import { DatePicker } from "@material-ui/pickers";
import parse from "autosuggest-highlight/parse";
import throttle from "lodash/throttle";
import CVCard from "./components/CVCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "transparent",
    display: "flex",
    height: 225,
  },
  indicator: {
    backgroundColor: "transparent",
  },
  selected: {
    backgroundColor: "#FFFFFF",
  },
  wrapper: {
    alignItems: "flex-start",
  },
  fieldRoot: {
    backgroundColor: "#ECECEC",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  fieldInput: {
    padding: "12px",
    fontSize: "14px",
  },
  descriptionInput: {
    padding: "0px 3px",
    fontSize: "14px",
    margin: "-10px 0px 5px",
  },
  focused: {
    border: "1px solid #222",
    boxShadow: "2px 3px 0px #222",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  dropzone: {
    "@global": {
      ".MuiDropzoneArea-text.MuiTypography-h5": {
        textTransform: "none",
        fontSize: "16px",
      },
    },
  },
  paper: {
    height: "100%",
    paddingTop: theme.spacing(3),
    width: "1200px",
    margin: "0 auto",
  },
  avatar: {
    fontSize: "80px",
    width: "120px",
    height: "120px",
  },
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    margin: "20px",
    width: "96%",
  },
  cvcontainer: {
    border: "solid black 1px",
    padding: theme.spacing(2),
  },
  proLabel: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    marginLeft: "2px",
    padding: "2px 4px",
    letterSpacing: "0.5px",
    borderRadius: "2px",
    width: "30px",
    fontSize: 10,
  },
  pro: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
    fontSize: 16,
  },
  free: {
    backgroundColor: "  #F7DF1E",
    color: "#000",
    marginLeft: "8px",
    padding: "0px 4px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
    fontSize: 16,
  },
  formControl: {
    width: "100%",
  },
  redButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  profileLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
  passwordMargin: {
    marginTop: "20px",
    width: "100%",
  },
  location: {
    color: theme.palette.text.secondary,
    marginRight: theme.spacing(2),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0} ml={2} style={{ width: "100%", paddingBottom: "100px" }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 30,
    height: 30,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const Profile = (props) => {
  const classes = useStyles();
  const history = useHistory();

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

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [dialogopen, setDialogOpen] = useState(false);
  const [sortMethod, setSortMethod] = useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    //getAllCourses(e.target.value);
  };

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const [loading, setLoading] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    id: "",
    first_name: "",
    last_name: "",
    age: "",
    location: "",
    profile_url: "",
    gender: "",
    email: "",
    date_joined: "",
    profile_photo: "",
  });

  const [profilePhoto, setProfilePhoto] = useState();
  const [uploadOpen, setUploadOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAE5z0wC66Dfis7ho1QVBfPyVIl6Ny3NVw&libraries=places",
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const [CVDetail, setCVDetail] = useState({
    title: "",
    description: "",
    organisation: "",
    start_date: new Date("2018-01-01"),
    end_date: new Date("2018-01-01"),
  });

  const [CVList, setCVList] = useState([]);
  const [CVDialogState, setCVDialogState] = useState(false);
  const [editingCV, setEditingCV] = useState(false);
  const [deleteDialogState, setDeleteDialogState] = useState(false);

  const [passwordDetails, setPasswordDetails] = useState({
    old_password: "",
    new_password: "",
    repeat_password: "",
    showOldPassword: false,
    showNewPassword: false,
    showRepeatPassword: false,
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

  const handleChangePassword = (prop) => (event) => {
    setPasswordDetails({ ...passwordDetails, [prop]: event.target.value });
  };

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 200),
    []
  );

  useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(selectedLocation ? [selectedLocation] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (selectedLocation) {
          newOptions = [selectedLocation];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [selectedLocation, inputValue, fetch]);

  useEffect(() => {
    checkIfLoggedIn();
    getProfileDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleKeyDown = (event, callback) => {
    if (event.key === "Enter" && event.shiftKey === false) {
      event.preventDefault();
    }
  };

  const getProfileDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${userid}`)
        .then((res) => {
          console.log(res.data);
          setProfileDetails(res.data);
          setSelectedLocation(res.data.location);
          Service.client
            .get(`/auth/cvs`)
            .then((res) => {
              setCVList(
                res.data.sort((a, b) =>
                  b.start_date.localeCompare(a.start_date)
                )
              );
            })
            .catch();
        })
        .catch((err) => {
          setProfileDetails();
        });
    }
  };

  const handlePasswordSubmit = (e) => {
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
        message: "All fields must be filled",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    if (passwordDetails.new_password !== passwordDetails.repeat_password) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "The new password and confirmation password do not match",
        severity: "error",
      });
      setLoading(false);
      return;
    }

    Service.client
      .patch(
        `/auth/members/${profileDetails.id}/change-password`,
        passwordDetails
      )
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

        getProfileDetails();
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

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validator.isEmail(profileDetails.email)) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a valid email",
        severity: "error",
      });
      return;
    }
    if (!profileDetails.first_name) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a first name",
        severity: "error",
      });
      return;
    }
    if (!profileDetails.last_name) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a last name",
        severity: "error",
      });
      return;
    }
    setLoading(true);

    // instantiate form-data
    const formData = new FormData();

    formData.append("id", profileDetails.id);
    formData.append("first_name", profileDetails.first_name);
    formData.append("last_name", profileDetails.last_name);
    formData.append("email", profileDetails.email);
    formData.append("data_joined", profileDetails.date_joined);
    formData.append("age", profileDetails.age);
    formData.append("gender", profileDetails.gender);
    formData.append("location", profileDetails.location);

    // submit form-data as per usual
    Service.client
      .put(`/auth/members/${profileDetails.id}`, formData)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Profile updated successfully!",
          severity: "success",
        });
        console.log(res.data);
        setProfileDetails(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const handleUploadProfileImage = (e) => {
    // instantiate form-data
    e.preventDefault();

    if (profilePhoto && profilePhoto.length === 0) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please upload an image",
        severity: "error",
      });
      return;
    }
    setUploadOpen(false);
    const formData = new FormData();

    // appending data to form-data
    Object.keys(profileDetails).forEach((key) =>
      formData.append(key, profileDetails[key])
    );

    if (profilePhoto.length > 0) {
      formData.append("profile_photo", profilePhoto[0].file);
    }

    // submit form-data as per usual
    Service.client
      .put(`/auth/members/${profileDetails.id}`, formData)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Profile photo updated successfully!",
          severity: "success",
        });
        Service.client
          .get(`/auth/members/${profileDetails.id}`)
          .then((res) => {
            setProfileDetails(res.data);
            if (profilePhoto) {
              setProfilePhoto([]);
            }
          })
          .catch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkCVDetails = () => {
    if (!CVDetail.title) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a Job Title",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.description) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a Job Description",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.organisation) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the Organisation Name",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.start_date) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the start date",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.end_date) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the end date",
        severity: "error",
      });
      return true;
    }
    if (CVDetail.end_date < CVDetail.start_date) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "End date cannot be earlier than start date",
        severity: "error",
      });
      return true;
    }
  };

  const submitCV = (e) => {
    e.preventDefault();

    if (!checkCVDetails()) {
      Service.client
        .post(`/auth/cvs`, {
          ...CVDetail,
          start_date:
            CVDetail.start_date.getFullYear() +
            "-" +
            (CVDetail.start_date.getMonth() + 1) +
            "-" +
            CVDetail.start_date.getDate(),
          end_date:
            CVDetail.end_date.getFullYear() +
            "-" +
            (CVDetail.end_date.getMonth() + 1) +
            "-" +
            CVDetail.end_date.getDate(),
        })
        .then((res) => {
          getProfileDetails();
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Job Experience successfully created!",
            severity: "success",
          });
          setCVDetail({
            title: "",
            description: "",
            organisation: "",
            start_date: new Date("2018-01-01"),
            end_date: new Date("2018-01-01"),
          });
          setCVDialogState(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const updateCV = (e) => {
    e.preventDefault();

    CVDetail.start_date = new Date(CVDetail.start_date);
    CVDetail.end_date = new Date(CVDetail.end_date);

    if (!checkCVDetails()) {
      Service.client
        .patch(`/auth/cvs/${CVDetail.id}`, {
          ...CVDetail,
          start_date:
            CVDetail.start_date.getFullYear() +
            "-" +
            (CVDetail.start_date.getMonth() + 1) +
            "-" +
            CVDetail.start_date.getDate(),
          end_date:
            CVDetail.end_date.getFullYear() +
            "-" +
            (CVDetail.end_date.getMonth() + 1) +
            "-" +
            CVDetail.end_date.getDate(),
        })
        .then(() => {
          getProfileDetails();
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Job Experience successfully updated!",
            severity: "success",
          });
          setCVDetail({
            title: "",
            description: "",
            organisation: "",
            start_date: new Date("2018-01-01"),
            end_date: new Date("2018-01-01"),
          });
          setCVDialogState(false);
        })
        .catch();
    }
  };

  const deleteCV = (CVid) => {
    Service.client
      .delete(`/auth/cvs/${CVid}`)
      .then(() => {
        getProfileDetails();
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Job Experience successfully deleted!",
          severity: "success",
        });
        setCVDetail({
          title: "",
          description: "",
          organisation: "",
          start_date: new Date("2018-01-01"),
          end_date: new Date("2018-01-01"),
        });
        setCVDialogState(false);
      })
      .catch();
  };

  return (
    <div className={classes.paper}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <Typography
          variant="h2"
          style={{ fontWeight: "bold", marginBottom: "25px", display: "flex" }}
        >
          Settings for&nbsp;
          {profileDetails.member &&
          profileDetails.member.membership_tier === "PRO" ? (
            <Link
              to={`/member/profile/${profileDetails.id}`}
              className={classes.profileLink}
            >
              {profileDetails && profileDetails.first_name}{" "}
              {profileDetails && profileDetails.last_name}
            </Link>
          ) : (
            <div>
            <Typography
              variant="h2"
              style={{
                fontWeight: "bold",
                marginBottom: "25px",
              }}
            >
              {profileDetails && profileDetails.first_name}{" "}
              {profileDetails && profileDetails.last_name}
            </Typography>
            </div>
            
          )}
        </Typography>

        <div className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            classes={{
              indicator: classes.indicator,
            }}
            style={{ width: "30%" }}
            aria-label="Vertical tabs"
          >
            <Tab
              style={{
                textTransform: "none",
              }}
              classes={{
                selected: classes.selected,
                wrapper: classes.wrapper,
              }}
              label={
                <div>
                  <Mood style={{ verticalAlign: "middle" }} /> Profile
                </div>
              }
              {...a11yProps(0)}
            />
            <Tab
              style={{
                textTransform: "none",
              }}
              disabled={
                profileDetails.member &&
                profileDetails.member.membership_tier !== "PRO"
              }
              classes={{
                selected: classes.selected,
                wrapper: classes.wrapper,
              }}
              label={
                <div>
                  <Work style={{ verticalAlign: "middle" }} /> Experience{" "}
                  <span className={classes.proLabel}>PRO</span>
                </div>
              }
              {...a11yProps(1)}
            />
            <Tab
              style={{
                textTransform: "none",
              }}
              classes={{
                selected: classes.selected,
                wrapper: classes.wrapper,
              }}
              label={
                <div>
                  <Lock style={{ verticalAlign: "middle" }} /> Account
                </div>
              }
              {...a11yProps(2)}
            />
          </Tabs>
          {/* Profile Tab*/}
          <TabPanel
            style={{
              width: "100%",
            }}
            value={value}
            index={0}
          >
            <Card
              elevation={0}
              style={{
                backgroundColor: " #FFFFFF",
                border: "1px solid #ECECEC",
                display: "flex",
                width: "100%",
                height: "100px",
                padding: " 0px 30px",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <Typography component={"span"} variant="h5">
                <b>Tier</b>:{" "}
                {profileDetails &&
                profileDetails.member &&
                profileDetails.member.membership_tier === "PRO" ? (
                  <span className={classes.pro}>PRO</span>
                ) : (
                  <span className={classes.free}>FREE</span>
                )}
              </Typography>

              {profileDetails &&
                profileDetails.member &&
                profileDetails.member.membership_tier === "PRO" && (
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ height: 30 }}
                    onClick={() => history.push(`/member/payment`)}
                  >
                    Extend Pro-Tier Membership
                  </Button>
                )}
            </Card>
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                handleKeyDown(e, handleSubmit);
              }}
              noValidate
              autoComplete="off"
            >
              <Card
                elevation={0}
                style={{
                  backgroundColor: " #FFFFFF",
                  border: "1px solid #ECECEC",
                  width: "100%",
                  padding: "20px 30px",
                  marginBottom: "30px",
                }}
              >
                <Typography
                  component={"span"}
                  variant="h5"
                  style={{ padding: "50px 0px" }}
                >
                  <b>User</b>
                </Typography>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <a
                    href="#profile_photo"
                    onClick={(e) => setUploadOpen(true)}
                    style={{ textDecoration: "none" }}
                  >
                    {!profileDetails.profile_photo ? (
                      <Badge
                        overlap="circle"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        className={classes.avatar}
                        badgeContent={
                          <SmallAvatar
                            alt=""
                            src={EditIcon}
                            style={{ backgroundColor: "#d1d1d1" }}
                          />
                        }
                      >
                        <Avatar className={classes.avatar}>
                          {profileDetails.first_name.charAt(0)}
                        </Avatar>
                      </Badge>
                    ) : (
                      <Badge
                        overlap="circle"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <SmallAvatar
                            alt=""
                            src={EditIcon}
                            style={{ backgroundColor: "#d1d1d1" }}
                          />
                        }
                      >
                        <Avatar
                          alt="Pic"
                          src={profileDetails.profile_photo}
                          className={classes.avatar}
                        />
                      </Badge>
                    )}
                  </a>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <label htmlFor="first_name">
                    <Typography variant="body2">First Name</Typography>
                  </label>
                  <TextField
                    margin="dense"
                    variant="filled"
                    id="first_name"
                    name="first_name"
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        root: classes.fieldRoot,
                        focused: classes.focused,
                        input: classes.fieldInput,
                      },
                    }}
                    required
                    fullWidth
                    value={profileDetails.first_name}
                    // error={firstNameError}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        first_name: event.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <label htmlFor="last_name">
                    <Typography variant="body2">Last Name</Typography>
                  </label>
                  <TextField
                    margin="dense"
                    variant="filled"
                    id="last_name"
                    name="last_name"
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        root: classes.fieldRoot,
                        focused: classes.focused,
                        input: classes.fieldInput,
                      },
                    }}
                    required
                    fullWidth
                    value={profileDetails.last_name}
                    // error={lastNameError}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        last_name: event.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ marginTop: "20px" }}>
                  <label htmlFor="email">
                    <Typography variant="body2">Email</Typography>
                  </label>
                  <TextField
                    margin="dense"
                    variant="filled"
                    id="email"
                    name="email"
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        root: classes.fieldRoot,
                        focused: classes.focused,
                        input: classes.fieldInput,
                      },
                    }}
                    required
                    fullWidth
                    value={profileDetails.email}
                    // error={emailError}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        email: event.target.value,
                      })
                    }
                  />
                </div>

                <div style={{ marginTop: "20px" }}>
                  <label htmlFor="age">
                    <Typography variant="body2">Age</Typography>
                  </label>
                  <TextField
                    margin="dense"
                    variant="filled"
                    id="age"
                    name="age"
                    type="number"
                    InputProps={{
                      inputProps: { min: 0 },
                      disableUnderline: true,
                      classes: {
                        root: classes.fieldRoot,
                        focused: classes.focused,
                        input: classes.fieldInput,
                      },
                    }}
                    required
                    fullWidth
                    value={profileDetails.age}
                    // error={lastNameError}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        age: event.target.value,
                      })
                    }
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <FormControl>
                    <label htmlFor="gender">
                      <Typography variant="body2">Gender</Typography>
                    </label>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      id="gender"
                      value={profileDetails.gender}
                      onChange={(event) =>
                        setProfileDetails({
                          ...profileDetails,
                          gender: event.target.value,
                        })
                      }
                    >
                      <div style={{ display: "flex" }}>
                        <FormControlLabel
                          value="F"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="M"
                          control={<Radio />}
                          label="Male"
                        />
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>
              </Card>

              <Card
                elevation={0}
                style={{
                  backgroundColor: " #FFFFFF",
                  border: "1px solid #ECECEC",
                  width: "100%",
                  padding: "20px 30px",
                  marginBottom: "30px",
                }}
              >
                <Typography
                  component={"span"}
                  variant="h5"
                  style={{ padding: "50px 0px" }}
                >
                  <b>Basic</b>
                </Typography>

                <Autocomplete
                  id="google-map-demo"
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.description
                  }
                  filterOptions={(x) => x}
                  options={options}
                  autoComplete
                  underlinestyle={{ display: "none" }}
                  includeInputInList
                  filterSelectedOptions
                  value={selectedLocation}
                  onChange={(event, newValue) => {
                    setOptions(newValue ? [newValue, ...options] : options);
                    if (newValue !== null) {
                      setSelectedLocation(newValue);
                      setProfileDetails({
                        ...profileDetails,
                        location: newValue.description,
                      });
                    } else {
                      setSelectedLocation("");
                      setProfileDetails({
                        ...profileDetails,
                        location: "",
                      });
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <div style={{ marginTop: "20px" }}>
                      <label htmlFor="location">
                        <Typography variant="body2">Location</Typography>
                      </label>
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          style: {
                            marginTop: "-10px",
                            marginBottom: "10px",
                          },
                        }}
                        InputProps={{
                          ...params.InputProps,
                          disableUnderline: true,
                          classes: {
                            root: classes.fieldRoot,
                            focused: classes.focused,
                            input: classes.fieldInput,
                          },
                        }}
                        margin="dense"
                        variant="filled"
                        fullWidth
                      />
                    </div>
                  )}
                  renderOption={(option) => {
                    const matches =
                      option.structured_formatting.main_text_matched_substrings;
                    const parts = parse(
                      option.structured_formatting.main_text,
                      matches.map((match) => [
                        match.offset,
                        match.offset + match.length,
                      ])
                    );

                    return (
                      <Grid container alignItems="center">
                        <Grid item>
                          <LocationOn className={classes.location} />
                        </Grid>
                        <Grid item xs>
                          {parts.map((part, index) => (
                            <span
                              key={index}
                              style={{ fontWeight: part.highlight ? 700 : 400 }}
                            >
                              {part.text}
                            </span>
                          ))}

                          <Typography variant="body2" color="textSecondary">
                            {option.structured_formatting.secondary_text}
                          </Typography>
                        </Grid>
                      </Grid>
                    );
                  }}
                />
                <div style={{ marginTop: "20px" }}>
                  <label htmlFor="url">
                    <Typography variant="body2">Profile URL</Typography>
                  </label>
                  <TextField
                    margin="dense"
                    variant="filled"
                    id="url"
                    name="url"
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        root: classes.fieldRoot,
                        focused: classes.focused,
                        input: classes.fieldInput,
                      },
                    }}
                    required
                    fullWidth
                    value={profileDetails.profile_url}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        profile_url: event.target.value,
                      })
                    }
                  />
                </div>
              </Card>

              <Card
                elevation={0}
                style={{
                  backgroundColor: " #FFFFFF",
                  border: "1px solid #ECECEC",
                  width: "100%",
                }}
              >
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
              </Card>
            </form>
          </TabPanel>

          {/* Experience Tab*/}
          <TabPanel
            style={{
              width: "100%",
            }}
            value={value}
            index={1}
          >
            {CVList && CVList.length === 0 ? (
              <Card
                elevation={0}
                style={{
                  backgroundColor: " #FFFFFF",
                  border: "1px solid #ECECEC",
                  display: "flex",
                  width: "100%",
                  height: "100px",
                  padding: " 0px 20px",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  style={{
                    height: 35,
                  }}
                  onClick={() => {
                    setCVDetail({
                      title: "",
                      description: "",
                      organisation: "",
                      start_date: new Date("2018-01-01"),
                      end_date: new Date("2018-01-01"),
                    });
                    setCVDialogState(true);
                    setEditingCV(false);
                  }}
                >
                  <Add style={{ marginRight: "5px" }} /> Add New Experience
                </Button>
              </Card>
            ) : (
              ""
            )}
            {CVList && CVList.length > 0 ? (
              <Card
                elevation={0}
                style={{
                  backgroundColor: " #FFFFFF",
                  border: "1px solid #ECECEC",
                  width: "100%",
                  padding: "20px 20px 0px",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "25px",
                  }}
                >
                  <Typography variant="h5" style={{ fontWeight: "700" }}>
                    Job Experiences
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      height: 35,
                    }}
                    onClick={() => {
                      setCVDetail({
                        title: "",
                        description: "",
                        organisation: "",
                        start_date: new Date("2018-01-01"),
                        end_date: new Date("2018-01-01"),
                      });
                      setCVDialogState(true);
                      setEditingCV(false);
                    }}
                  >
                    <Add style={{ marginRight: "5px" }} /> Add New Experience
                  </Button>
                </div>

                {CVList.map((cv, index) => {
                  return (
                    <CVCard
                      key={index}
                      experience={cv}
                      setCVDetail={setCVDetail}
                      setCVDialogState={setCVDialogState}
                      setEditingCV={setEditingCV}
                      setDeleteDialogState={setDeleteDialogState}
                      sbOpen={sbOpen}
                      setSbOpen={setSbOpen}
                      setSnackbar={setSnackbar}
                      getProfileDetails={getProfileDetails}
                    />
                  );
                })}
              </Card>
            ) : (
              ""
            )}
          </TabPanel>

          {/* Account Tab*/}
          <TabPanel
            style={{
              width: "100%",
            }}
            value={value}
            index={2}
          >
            <Card
              elevation={0}
              style={{
                backgroundColor: " #FFFFFF",
                border: "1px solid #ECECEC",
                width: "100%",
                padding: "20px 20px 0px",
                marginBottom: "15px",
              }}
            >
              <Typography
                variant="h5"
                style={{ fontWeight: "700", marginBottom: "5px" }}
              >
                Set New Password
              </Typography>

              <form onSubmit={handlePasswordSubmit} noValidate>
                <FormControl className={classes.passwordMargin}>
                  <label htmlFor="old_password">
                    <Typography variant="body2" style={{ marginBottom: "5px" }}>
                      Current Password
                    </Typography>
                  </label>

                  <FilledInput
                    id="old_password"
                    margin="dense"
                    disableUnderline={true}
                    type={passwordDetails.showOldPassword ? "text" : "password"}
                    value={passwordDetails.old_password}
                    onChange={handleChangePassword("old_password")}
                    required
                    classes={{
                      root: classes.fieldRoot,
                      focused: classes.focused,
                      input: classes.fieldInput,
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowOldPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {passwordDetails.showOldPassword ? (
                            <Visibility style={{ margin: "-4px" }} />
                          ) : (
                            <VisibilityOff style={{ margin: "-4px" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl className={classes.passwordMargin}>
                  <label htmlFor="new_password">
                    <Typography variant="body2" style={{ marginBottom: "5px" }}>
                      New Password
                    </Typography>
                  </label>

                  <FilledInput
                    id="new_password"
                    margin="dense"
                    disableUnderline={true}
                    type={passwordDetails.showNewPassword ? "text" : "password"}
                    value={passwordDetails.new_password}
                    onChange={handleChangePassword("new_password")}
                    classes={{
                      root: classes.fieldRoot,
                      focused: classes.focused,
                      input: classes.fieldInput,
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {passwordDetails.showNewPassword ? (
                            <Visibility style={{ margin: "-4px" }} />
                          ) : (
                            <VisibilityOff style={{ margin: "-4px" }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>

                <FormControl className={classes.passwordMargin}>
                  <label htmlFor="repeat_password">
                    <Typography variant="body2" style={{ marginBottom: "5px" }}>
                      Confirm New Password
                    </Typography>
                  </label>

                  <FilledInput
                    id="repeat_password"
                    type={
                      passwordDetails.showRepeatPassword ? "text" : "password"
                    }
                    margin="dense"
                    disableUnderline={true}
                    value={passwordDetails.repeat_password}
                    onChange={handleChangePassword("repeat_password")}
                    classes={{
                      root: classes.fieldRoot,
                      focused: classes.focused,
                      input: classes.fieldInput,
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowRepeatPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {passwordDetails.showRepeatPassword ? (
                            <Visibility style={{ margin: "-4px" }} />
                          ) : (
                            <VisibilityOff style={{ margin: "-4px" }} />
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
                  type="submit"
                  style={{ margin: "20px 0px" }}
                >
                  {loading ? (
                    <CircularProgress size="1.5rem" style={{ color: "#FFF" }} />
                  ) : (
                    "Set New Password"
                  )}
                </Button>
              </form>
            </Card>
          </TabPanel>
        </div>
      </div>

      <Dialog
        open={deleteDialogState}
        onClose={() => setDeleteDialogState(false)}
      >
        <DialogTitle id="alert-dialog-title">Delete Job Experience</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job experience?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogState(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              deleteCV(CVDetail.id);
              setDeleteDialogState(false);
            }}
            className={classes.redButton}
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={CVDialogState} onClose={() => setCVDialogState(false)}>
        <DialogTitle id="alert-dialog-title">
          {editingCV ? "Edit Job Experience" : "New Job Experience"}
        </DialogTitle>
        <DialogContent>
          <div>
            <div>
              <label htmlFor="title">
                <Typography variant="body2">Job Title</Typography>
              </label>
              <TextField
                margin="dense"
                variant="filled"
                id="title"
                name="title"
                autoComplete="off"
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.fieldRoot,
                    focused: classes.focused,
                    input: classes.fieldInput,
                  },
                }}
                required
                fullWidth
                value={CVDetail.title}
                // error={lastNameError}
                onChange={(event) =>
                  setCVDetail({
                    ...CVDetail,
                    title: event.target.value,
                  })
                }
              />
            </div>
            <div style={{ marginTop: "20px" }}>
              <label htmlFor="description">
                <Typography variant="body2">Job Description</Typography>
              </label>
              <TextField
                margin="dense"
                variant="filled"
                id="description"
                name="description"
                multiline
                rows={4}
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.fieldRoot,
                    focused: classes.focused,
                    input: classes.descriptionInput,
                  },
                }}
                required
                fullWidth
                value={CVDetail.description}
                // error={lastNameError}
                onChange={(event) =>
                  setCVDetail({
                    ...CVDetail,
                    description: event.target.value,
                  })
                }
              />
            </div>
            <div style={{ marginTop: "20px" }}>
              <label htmlFor="organisation">
                <Typography variant="body2">Organisation Name</Typography>
              </label>
              <TextField
                margin="dense"
                variant="filled"
                id="organisation"
                name="organisation"
                autoComplete="off"
                InputProps={{
                  disableUnderline: true,
                  classes: {
                    root: classes.fieldRoot,
                    focused: classes.focused,
                    input: classes.fieldInput,
                  },
                }}
                required
                fullWidth
                value={CVDetail.organisation}
                // error={lastNameError}
                onChange={(event) =>
                  setCVDetail({
                    ...CVDetail,
                    organisation: event.target.value,
                  })
                }
              />
            </div>

            <div style={{ display: "flex", marginTop: "20px" }}>
              <div>
                <label htmlFor="start_date">
                  <Typography variant="body2">Start Date</Typography>
                </label>
                <DatePicker
                  openTo="year"
                  views={["year", "month"]}
                  margin="normal"
                  id="start_date"
                  name="start_date"
                  value={CVDetail.start_date}
                  onChange={(event) =>
                    setCVDetail({
                      ...CVDetail,
                      start_date: event,
                    })
                  }
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  style={{ marginRight: "20px" }}
                />
              </div>

              <div>
                <label htmlFor="end_date">
                  <Typography variant="body2">End Date</Typography>
                </label>
                <DatePicker
                  openTo="year"
                  views={["year", "month"]}
                  margin="normal"
                  id="end_date"
                  name="end_date"
                  value={CVDetail.end_date}
                  onChange={(event) => {
                    setCVDetail({
                      ...CVDetail,
                      end_date: event,
                    });
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          {editingCV ? (
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "16px", marginBottom: "16px" }}
              onClick={(e) => {
                updateCV(e);
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              style={{ marginRight: "16px", marginBottom: "16px" }}
              onClick={(e) => {
                submitCV(e);
              }}
            >
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* upload photo dialog here */}
      <Dialog onClose={() => setUploadOpen(false)} open={uploadOpen}>
        <DialogTitle>
          <Typography style={{ textTransform: "capitalize", fontSize: "19px" }}>
            Upload Profile Photo
          </Typography>
          <IconButton
            style={{ right: "12px", top: "8px", position: "absolute" }}
            onClick={() => {
              setProfilePhoto();
              setUploadOpen(false);
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DropzoneAreaBase
            dropzoneClass={classes.dropzone}
            dropzoneText="&nbsp;Drag and drop an image or click here&nbsp;"
            acceptedFiles={["image/*"]}
            filesLimit={1}
            fileObjects={profilePhoto}
            useChipsForPreview={true}
            maxFileSize={5000000}
            onAdd={(newPhoto) => {
              setProfilePhoto(newPhoto);
            }}
            onDelete={(deletePhotoObj) => {
              setProfilePhoto();
            }}
            previewGridProps={{
              item: {
                xs: "auto",
              },
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button
            className={classes.button}
            onClick={() => {
              setProfilePhoto();
              setUploadOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            className={classes.button}
            color="primary"
            onClick={(e) => {
              handleUploadProfileImage(e);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Profile;
