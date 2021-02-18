import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  },
  avatar: {
    fontSize: "100px",
    width: "200px",
    height: "200px",
  },
}));

const AdminProfilePage = (props) => {
  const classes = useStyles();

  const { profile, setProfile } = props;

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
  });

  const [profilePhoto, setProfilePhoto] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    setProfileDetails(profile);
    console.log(profile);
  }, []);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // instantiate form-data
    const formData = new FormData();

    // appending data to form-data
    Object.keys(profileDetails).forEach((key) =>
      formData.append(key, profileDetails[key])
    );

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
        setProfileDetails(res.data);
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  function handleUploadProfileImage() {
    // instantiate form-data
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
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <form onSubmit={handleSubmit} noValidate autoComplete="off">
        <Paper elevation={0} className={classes.paper}>
          <Grid container>
            <Grid item xs={6}>
              <div>
                <TextField
                  margin="normal"
                  id="id"
                  label="ID"
                  name="id"
                  autoComplete="id"
                  fullWidth
                  disabled
                  value={profileDetails.id}
                />
              </div>
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
                  disabled
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
            </Grid>
            <Grid item xs={6}>
              Profile Pic <br />
              <br />
              <a href="#profile_photo" onClick={(e) => setUploadOpen(true)}>
                {profilePhoto ? (
                  <Avatar
                    src={
                      profilePhoto.length <= 0
                        ? profileDetails && profileDetails.profile_photo
                        : profilePhoto[0].data
                    }
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {profileDetails.email.charAt(0)}
                  </Avatar>
                )}
              </a>
            </Grid>
          </Grid>
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
              setProfilePhoto([]);
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
            maxFileSize={5000000}
            onAdd={(newPhoto) => {
              // console.log("onAdd", newPhoto);
              setProfilePhoto([].concat(newPhoto));
            }}
            onDelete={(deletePhotoObj) => {
              // console.log("onDelete", deletePhotoObj);
              setProfilePhoto([]);
            }}
            showPreviewsInDropzone={true}
          />
        </DialogContent>

        <DialogActions>
          <Button
            className={classes.button}
            onClick={() => {
              setProfilePhoto([]);
              setUploadOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            className={classes.button}
            color="primary"
            onClick={() => {
              setUploadOpen(false);
              handleUploadProfileImage();
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
