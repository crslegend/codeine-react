import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
  Grid,
  Avatar,
} from "@material-ui/core";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { DropzoneAreaBase } from "material-ui-dropzone";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Toast from "../../components/Toast.js";
import validator from "validator";
import Badge from "@material-ui/core/Badge";
import EditIcon from "../../assets/editIcon.svg";

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
    height: "calc(100vh - 115px)",
    padding: theme.spacing(3),
    width: "100%",
  },
  avatar: {
    fontSize: "80px",
    width: "150px",
    height: "150px",
  },
  button: {
    marginTop: "20px",
  },
}));

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 30,
    height: 30,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const AdminProfilePage = (props) => {
  const classes = useStyles();

  const { setProfile } = props;

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

  const [loading, setLoading] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    date_joined: "",
    profile_photo: "",
  });

  const [profilePhoto, setProfilePhoto] = useState();
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    getProfileDetails();
  }, []);

  const getProfileDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const adminid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/admins/${adminid}`)
        .then((res) => {
          setProfileDetails(res.data);
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
        setProfile(res.data);
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
            setProfile(res.data);
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

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Paper elevation={0} className={classes.paper}>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
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
                      {profileDetails.email.charAt(0)}
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
            <div style={{ width: "50%" }}>
              {/* <div>
                <TextField
                  margin="normal"
                  id="id"
                  label="ID"
                  name="id"
                  autoComplete="id"
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  value={profileDetails.id}
                />
              </div> */}
              <div>
                <TextField
                  margin="normal"
                  id="first_name"
                  label="First Name"
                  name="first_name"
                  autoComplete="first_name"
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
                  autoComplete="last_name"
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
          </div>
        </Paper>
      </form>

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

export default AdminProfilePage;
