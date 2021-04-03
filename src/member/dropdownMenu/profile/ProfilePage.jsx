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
} from "@material-ui/core";
import { Mood, Lock, Work, Add, Close } from "@material-ui/icons";
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
import CVCard from "./components/CVCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "transparent",
    display: "flex",
    height: 224,
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
    padding: "auto 0",
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
    backgroundColor: "#FFFFFF",
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
    padding: "0px 3px",
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
        <Box p={0} ml={2} style={{ width: "100%" }}>
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
    gender: "",
    email: "",
    date_joined: "",
    profile_photo: "",
  });

  const [profilePhoto, setProfilePhoto] = useState();
  const [uploadOpen, setUploadOpen] = useState(false);

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

  useEffect(() => {
    checkIfLoggedIn();
    getProfileDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProfileDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${userid}`)
        .then((res) => {
          console.log(res.data);
          setProfileDetails(res.data);
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
        message: "Please enter a valid email!",
        severity: "error",
      });
      return;
    }
    if (!profileDetails.first_name) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a first name!",
        severity: "error",
      });
      return;
    }
    if (!profileDetails.last_name) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a last name!",
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
          message: "Profile Updated!",
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
        message: "Please upload an image!",
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
        message: "Please enter a Job Title!",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.description) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a Job Description!",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.organisation) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the Organisation Name!",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.start_date) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the Start Date!",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.end_date) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter the End Date!",
        severity: "error",
      });
      return true;
    }
    if (CVDetail.end_date < CVDetail.start_date) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "End date cannot be earlier than start date!",
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
          style={{ fontWeight: "bold", marginBottom: "20px" }}
        >
          Settings for{" "}
          <Link
            to={`/member/profile/${profileDetails.id}`}
            className={classes.profileLink}
          >
            {profileDetails && profileDetails.first_name}{" "}
            {profileDetails && profileDetails.last_name}
          </Link>
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
            style={{ width: "22%" }}
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
              classes={{
                selected: classes.selected,
                wrapper: classes.wrapper,
              }}
              label={
                <div>
                  <Work style={{ verticalAlign: "middle" }} /> Experience
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
                padding: " 0px 20px",
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
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              <Card
                elevation={0}
                style={{
                  backgroundColor: " #FFFFFF",
                  border: "1px solid #ECECEC",
                  width: "100%",
                  height: "100%",
                  padding: "10px 20px",
                  marginBottom: "15px",
                }}
              >
                <Typography
                  component={"span"}
                  variant="h5"
                  style={{ margin: "10px 0px 30px" }}
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
                  <label htmlFor="location">
                    <Typography variant="body2">Location</Typography>
                  </label>
                  <TextField
                    margin="dense"
                    variant="filled"
                    id="location"
                    name="location"
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
                    value={profileDetails.location}
                    // error={emailError}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        location: event.target.value,
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
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                style={{
                  marginLeft: "auto",
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

            {CVList && CVList.length > 0 ? (
              <Card
                elevation={0}
                style={{
                  backgroundColor: " #FFFFFF",
                  border: "1px solid #ECECEC",
                  width: "100%",
                  padding: "20px 20px",
                }}
              >
                <Typography
                  variant="h5"
                  style={{ fontWeight: "700", marginBottom: "20px" }}
                >
                  Job Experiences
                </Typography>
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
            Item Two
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
