import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  Grid,
  Avatar,
  Divider,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  Card,
  CardContent,
} from "@material-ui/core";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import { DropzoneAreaBase } from "material-ui-dropzone";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import Toast from "../../components/Toast.js";
import validator from "validator";
import Badge from "@material-ui/core/Badge";
import EditIcon from "../../assets/editIcon.svg";
import PageTitle from "../../components/PageTitle";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    "@global": {
      ".MuiDropzoneArea-text.MuiTypography-h5": {
        textTransform: "none",
        fontSize: "16px",
      },
    },
  },
  avatar: {
    fontSize: "80px",
    width: "200px",
    height: "200px",
  },
}));

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 30,
    height: 30,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const PartnerProfilePage = (props) => {
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
    profile_photo: "",
    partner: {
      job_title: "",
      bio: "",
      consultation_rate: "",
      organization: {
        id: "",
        organization_name: "",
        organization_photo: "",
      },
    },
  });

  const [profilePhoto, setProfilePhoto] = useState();
  const [uploadOpen, setUploadOpen] = useState(false);

  useEffect(() => {
    getProfileDetails();
  }, []);

  const getProfileDetails = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const partnerid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/partners/${partnerid}`)
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
    formData.append("job_title", profileDetails.partner.job_title);
    formData.append("bio", profileDetails.partner.bio);

    // submit form-data as per usual
    Service.client
      .put(`/auth/partners/${profileDetails.id}`, formData)
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

  const handleOrganizationSubmit = (e) => {
    e.preventDefault();
    const formdataOrg = new FormData();

    if (profileDetails.partner.organization) {
      formdataOrg.append("id", profileDetails.partner.organization.id);
      formdataOrg.append(
        "organization_name",
        profileDetails.partner.organization.organization_name
      );
    } else {
    }

    if (profileDetails.partner.organization) {
      Service.client
        .put(
          `/auth/organizations/${profileDetails.partner.organization.id}`,
          formdataOrg
        )
        .then((res) => {
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Profile Updated!",
            severity: "success",
          });
          console.log(res.data);
          setProfileDetails({
            ...profileDetails,
            partner: {
              ...profileDetails.partner,
              organization: res.data,
            },
          });
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
      setLoading(false);
    } else {
    }
  };

  const handleUploadProfileImage = (e) => {
    // instantiate form-data
    e.preventDefault();

    if (!profilePhoto) {
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
      .put(`/auth/partners/${profileDetails.id}`, formData)
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Profile photo updated successfully!",
          severity: "success",
        });
        setProfile(res.data);
        setProfileDetails(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [organizationPhoto, setOrganizationPhoto] = useState();
  const [uploadOrgOpen, setUploadOrgOpen] = useState(false);

  const handleUploadOrganizationImage = (e) => {
    // instantiate form-data
    e.preventDefault();

    if (!organizationPhoto) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please upload an image!",
        severity: "error",
      });
      return;
    }
    setUploadOrgOpen(false);
    const formData = new FormData();

    // appending data to form-data
    Object.keys(profileDetails).forEach((key) =>
      formData.append(key, profileDetails[key])
    );

    if (organizationPhoto.length > 0) {
      formData.append("organization_photo", organizationPhoto[0].file);
    }

    // submit form-data as per usual
    Service.client
      .put(
        `/auth/organizations/${profileDetails.partner.organization.id}`,
        formData
      )
      .then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Organization photo updated successfully!",
          severity: "success",
        });
        setProfileDetails({
          ...profileDetails,
          partner: {
            ...profileDetails.partner,
            organization: res.data,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <PageTitle title="My Profile" />
      <Grid container>
        <Grid item xs={6}>
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <Card className={classes.root}>
              <CardContent>
                <div>
                  <TextField
                    margin="normal"
                    id="id"
                    label="Profile ID"
                    name="id"
                    autoComplete="id"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
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
                    InputProps={{
                      readOnly: true,
                    }}
                    value={formatDate(profileDetails.date_joined)}
                  />
                </div>

                <div>
                  <TextField
                    margin="normal"
                    id="job_title"
                    label="Job Title"
                    name="job_title"
                    autoComplete="job_title"
                    required
                    fullWidth
                    value={profileDetails.partner.job_title}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        partner: {
                          ...profileDetails.partner,
                          job_title: event.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <TextField
                    margin="normal"
                    id="bio"
                    label="Bio"
                    name="bio"
                    autoComplete="bio"
                    required
                    fullWidth
                    multiline
                    rows={3}
                    value={profileDetails.partner.bio}
                    // error={emailError}
                    onChange={(event) =>
                      setProfileDetails({
                        ...profileDetails,
                        partner: {
                          ...profileDetails.partner,
                          bio: event.target.value,
                        },
                      })
                    }
                  />
                </div>

                <Button
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  style={{ marginTop: "10px" }}
                  type="submit"
                >
                  {loading ? (
                    <CircularProgress size="1.5rem" style={{ color: "#FFF" }} />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Grid>

        <Grid item xs={6} style={{ paddingLeft: "25px" }}>
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
                  src={
                    !profilePhoto
                      ? profileDetails.profile_photo
                      : profilePhoto[0].data
                  }
                  className={classes.avatar}
                />
              </Badge>
            )}
          </a>
        </Grid>
        <Grid item xs={12} style={{ marginBottom: "20px" }}></Grid>
        <Grid item xs={6}>
          {profileDetails.partner.organization && (
            <Card className={classes.root}>
              <CardContent>
                <div>
                  <form
                    onSubmit={handleOrganizationSubmit}
                    noValidate
                    autoComplete="off"
                  >
                    <div>
                      <TextField
                        margin="normal"
                        id="organisation_id"
                        label="Organisation ID"
                        name="id"
                        autoComplete="organisation_id"
                        required
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                        value={profileDetails.partner.organization.id}
                      />
                    </div>
                    <div>
                      <TextField
                        margin="normal"
                        id="organisation_name"
                        label="Organisation Name"
                        name="organisation_name"
                        autoComplete="Organisation Name"
                        required
                        fullWidth
                        value={
                          profileDetails.partner.organization.organization_name
                        }
                        onChange={(event) =>
                          setProfileDetails({
                            ...profileDetails,
                            partner: {
                              ...profileDetails.partner,
                              organization: {
                                ...profileDetails.partner.organization,
                                organization_name: event.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>

                    <Button
                      disabled={loading}
                      variant="contained"
                      color="primary"
                      style={{ marginTop: "10px" }}
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
                </div>
              </CardContent>
            </Card>
          )}
        </Grid>
        <Grid item xs={6} style={{ paddingLeft: "25px" }}>
          {profileDetails.partner.organization && (
            <div>
              <a
                href="#organisation_photo"
                onClick={(e) => setUploadOrgOpen(true)}
                style={{ textDecoration: "none" }}
              >
                {!profileDetails.partner.organization.organization_photo ? (
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
                      {profileDetails.partner.organization.organization_name.charAt(
                        0
                      )}
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
                      src={
                        !organizationPhoto
                          ? profileDetails.partner.organization
                              .organization_photo
                          : organizationPhoto[0].data
                      }
                      className={classes.avatar}
                    />
                  </Badge>
                )}
              </a>
            </div>
          )}
        </Grid>
      </Grid>

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

      {/* upload organisation photo dialog here */}
      <Dialog onClose={() => setUploadOrgOpen(false)} open={uploadOrgOpen}>
        <DialogTitle>
          <Typography style={{ textTransform: "capitalize", fontSize: "19px" }}>
            Upload Organisation Photo
          </Typography>
          <IconButton
            style={{ right: "12px", top: "8px", position: "absolute" }}
            onClick={() => {
              setOrganizationPhoto();
              setUploadOrgOpen(false);
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
            fileObjects={organizationPhoto}
            useChipsForPreview={true}
            maxFileSize={5000000}
            onAdd={(newPhoto) => {
              setOrganizationPhoto(newPhoto);
            }}
            onDelete={(deletePhotoObj) => {
              setOrganizationPhoto();
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
              setUploadOrgOpen(false);
            }}
          >
            Cancel
          </Button>

          <Button
            className={classes.button}
            color="primary"
            onClick={(e) => {
              handleUploadOrganizationImage(e);
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PartnerProfilePage;
