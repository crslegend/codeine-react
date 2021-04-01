import React, { Fragment, useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
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
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import MemberNavBar from "../../MemberNavBar";
import { DropzoneAreaBase } from "material-ui-dropzone";
import CloseIcon from "@material-ui/icons/Close";
import Toast from "../../../components/Toast.js";
import validator from "validator";
import EditIcon from "../../../assets/EditIcon.svg";
import Cookies from "js-cookie";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import PageTitle from "../../../components/PageTitle";
import { KeyboardDatePicker } from "@material-ui/pickers";
import CVCard from "./components/CVCard";

const useStyles = makeStyles((theme) => ({
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
    padding: theme.spacing(3),
    width: "100%",
  },
  avatar: {
    fontSize: "80px",
    width: "150px",
    height: "150px",
  },
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    marginTop: "20px",
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
    textTransform: "capitalize",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
}));

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
  const [countryList] = useState([
    { name: "America" },
    { name: "China" },
    { name: "Singapore" },
  ]);

  const [CVDetail, setCVDetail] = useState({
    title: "",
    description: "",
    organisation: "",
    start_date: new Date("2000-01-01"),
    end_date: new Date("2000-01-01"),
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
            .then((res1) => {
              setCVList(res1.data);
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
        message: "Please enter a Description!",
        severity: "error",
      });
      return true;
    }
    if (!CVDetail.organisation) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter an Organisation!",
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
            message: "Job experience created successfully!",
            severity: "success",
          });
          setCVDetail({
            title: "",
            description: "",
            organisation: "",
            start_date: new Date("2000-01-01"),
            end_date: new Date("2000-01-01"),
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
            message: "Job experience updated successfully!",
            severity: "success",
          });
          setCVDetail({
            title: "",
            description: "",
            organisation: "",
            start_date: new Date("2000-01-01"),
            end_date: new Date("2000-01-01"),
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
          message: "Job experience deleted successfully!",
          severity: "success",
        });
        setCVDetail({
          title: "",
          description: "",
          organisation: "",
          start_date: new Date("2000-01-01"),
          end_date: new Date("2000-01-01"),
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
        <div style={{ width: "80%", margin: "auto" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <PageTitle title="Profile Details" />
            <Button
              variant="contained"
              color="primary"
              style={{
                marginLeft: "auto",
                height: 35,
                textTransform: "capitalize",
              }}
              onClick={() => {
                history.push("/member/profile/changepassword");
              }}
            >
              Change Password
            </Button>
          </div>

          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <div
              style={{
                display: "flex",
                width: "78%",
                marginLeft: "auto",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Tier:{" "}
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
                    style={{ marginLeft: "30px", height: 30 }}
                    onClick={() => history.push(`/member/payment`)}
                  >
                    Extend Pro-Tier Membership
                  </Button>
                )}
            </div>
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <div style={{ width: "20%", marginLeft: "30px" }}>
                <br />
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
              <div style={{ width: "70%" }}>
                <div>
                  <TextField
                    margin="normal"
                    id="first_name"
                    label="First Name"
                    name="first_name"
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
                <div>
                  <TextField
                    margin="normal"
                    id="last_name"
                    label="Last Name"
                    name="last_name"
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

                <div>
                  <TextField
                    margin="normal"
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
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

                <div>
                  <TextField
                    margin="normal"
                    id="age"
                    label="Age"
                    name="age"
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
                  <FormControl className={classes.formControl}>
                    <InputLabel style={{ top: -4 }}>Country</InputLabel>
                    <Select
                      label="Sort By"
                      value={sortMethod}
                      onChange={(event) => {
                        onSortChange(event);
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>

                      {countryList.map((country) => (
                        <MenuItem key={country.name} value={country.name}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ marginTop: "20px" }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
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

                <div>
                  <TextField
                    margin="normal"
                    id="date_joined"
                    label="Date Joined"
                    name="date_joined"
                    autoComplete="date_joined"
                    required
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    value={formatDate(profileDetails.date_joined)}
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
                    <CircularProgress size="1.5rem" style={{ color: "#FFF" }} />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
              <div style={{ width: "10%" }} />
            </div>
          </form>
        </div>
      </div>

      <div style={{ width: "80%", margin: "auto", marginTop: "20px" }}>
        <div style={{ display: "flex" }}>
          <Typography
            variant="h3"
            style={{ fontWeight: "700", marginBottom: "20px" }}
          >
            Job Experiences
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{
              marginLeft: "auto",
              height: 35,
              textTransform: "capitalize",
            }}
            onClick={() => {
              setCVDetail({
                title: "",
                description: "",
                organisation: "",
                start_date: new Date("2000-01-01"),
                end_date: new Date("2000-01-01"),
              });
              setCVDialogState(true);
              setEditingCV(false);
            }}
          >
            + Add Job Experience
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
      </div>

      <Dialog
        open={deleteDialogState}
        onClose={() => setDeleteDialogState(false)}
      >
        <DialogTitle id="alert-dialog-title">Delete Job experience</DialogTitle>
        <DialogContent>
          Are you sure you want to delete your job experience? You will no
          longer be able to retrieve your job experience any longer.
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
          {editingCV ? "Edit CV" : "New Job Experience"}
        </DialogTitle>
        <DialogContent>
          <div>
            <div>
              <TextField
                margin="normal"
                id="title"
                label="Job Title"
                name="title"
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
            <div>
              <TextField
                margin="normal"
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
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
            <div>
              <TextField
                margin="normal"
                id="organisation"
                label="Organisation"
                name="organisation"
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
            <div style={{ display: "flex" }}>
              <KeyboardDatePicker
                format="MM/dd/yyyy"
                margin="normal"
                id="start_date"
                name="start_date"
                label="Start Date"
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
              <KeyboardDatePicker
                format="MM/dd/yyyy"
                margin="normal"
                id="end_date"
                name="end_date"
                label="End Date"
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
        </DialogContent>
        <DialogActions>
          {editingCV ? (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                updateCV(e);
              }}
            >
              Save Changes
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
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
            <CloseIcon />
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
