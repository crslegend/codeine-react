import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {
  Avatar,
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@material-ui/core";
import Toast from "../../components/Toast.js";
import { DropzoneAreaBase } from "material-ui-dropzone";
import { DataGrid } from "@material-ui/data-grid";
import PageTitle from "../../components/PageTitle";
import Service from "../../AxiosService";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import EditIcon from "../../assets/EditIcon.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  tabs: {
    backgroundColor: "#00000000",
    fontWeight: "800",
  },
  appbar: {
    backgroundColor: "#00000000",
    boxShadow: "none",
    marginBottom: "20px",
  },
  tabPanel: {
    padding: "0px",
  },
  dataGrid: {
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
  formControl: {
    minWidth: "220px",
  },
  padding: {
    paddingRight: theme.spacing(3),
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography component={"span"}>{children}</Typography>
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
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const PartnerNotificationPage = () => {
  const classes = useStyles();

  // Tabs variable
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const formatStatus = (status) => {
    if (status) {
      return "Active";
    } else {
      return "Deactivated";
    }
  };

  const formatNull = (input) => {
    if (input) {
      if (input.organization_name) {
        return input.organization_name;
      }
      return input;
    } else {
      return "-";
    }
  };

  const [notificationDetails, setNotificationDetails] = useState({
    title: "",
    description: "",
    userList: "",
    photo: "",
    courseId: "",
  });

  const [coursesCreated, setCoursesCreated] = useState();

  const createNotification = (e) => {
    e.preventDefault();

    if (notificationDetails.title === "") {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a valid title!",
        severity: "error",
      });
      return;
    }
    if (notificationDetails.description === "") {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please enter a valid description!",
        severity: "error",
      });
      return;
    }
    if (notificationDetails.courseId === "") {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please select a course!",
        severity: "error",
      });
      return;
    }
    if (notificationPhoto && notificationPhoto.length === 0) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please upload an image!",
        severity: "error",
      });
      return;
    }

    // instantiate form-data
    const formData = new FormData();

    formData.append("title", notificationDetails.title);
    formData.append("description", notificationDetails.description);
    formData.append("notification_type", "ANNOUCEMENT");
    formData.append("course_id", notificationDetails.courseId);

    if (notificationPhoto && notificationPhoto.length > 0) {
      formData.append("photo", notificationPhoto[0].file);
    }

    Service.client
      .get("/enrolled-members", {
        params: { courseId: notificationDetails.courseId },
      })
      .then((res) => {
        let memberIdList = [];
        for (let i = 0; i < res.data.length; i++) {
          memberIdList[i] = res.data[i].member.id;
        }
        formData.append("receiver_ids", JSON.stringify(memberIdList));
        console.log("memberIdList");
        console.log(memberIdList);
        Service.client
          .post("/notifications", formData)
          .then(() => {
            setSbOpen(true);
            setSnackbar({
              ...snackbar,
              message: "New Notification created",
              severity: "success",
            });
            setNotificationDetails({
              title: "",
              description: "",
              userList: "",
              photo: "",
              courseId: "",
            });
          })
          .catch();
      })
      .catch();
  };

  const getCourseCreated = () => {
    Service.client
      .get("/private-courses")
      .then((res) => {
        setCoursesCreated(res.data.results);
      })
      .catch();
  };

  useEffect(() => {
    getCourseCreated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [notificationPhoto, setNotificationPhoto] = useState([]);

  const getNotificationSent = () => {
    Service.client.get("/notifications");
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />

      <PageTitle title="Notification Management" />

      <AppBar
        position="static"
        classes={{
          root: classes.appbar,
        }}
      >
        <Tabs
          value={value}
          indicatorColor="secondary"
          textColor="secondary"
          onChange={handleChange}
          aria-label="simple tabs example"
          classes={{
            root: classes.tabs,
          }}
        >
          <Tab label="Create notification" {...a11yProps(0)} />
          <Tab label="Notifications sent" {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0}>
        <Grid container>
          <Grid item xs={8}>
            <div>
              <TextField
                margin="normal"
                id="title"
                label="Title"
                name="title"
                required
                fullWidth
                value={notificationDetails.title}
                // error={firstNameError}
                onChange={(event) =>
                  setNotificationDetails({
                    ...notificationDetails,
                    title: event.target.value,
                  })
                }
              />
              <TextField
                margin="normal"
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                required
                fullWidth
                value={notificationDetails.description}
                // error={firstNameError}
                onChange={(event) =>
                  setNotificationDetails({
                    ...notificationDetails,
                    description: event.target.value,
                  })
                }
              />

              <div>
                <Select
                  displayEmpty
                  value={notificationDetails.courseId}
                  onChange={(e) => {
                    setNotificationDetails({
                      ...notificationDetails,
                      courseId: e.target.value,
                    });
                  }}
                  style={{ backgroundColor: "#fff" }}
                  className={classes.formControl}
                >
                  <MenuItem value="" classes={{ root: classes.resize }}>
                    <em>Select Course</em>
                  </MenuItem>
                  {coursesCreated &&
                    coursesCreated.length > 0 &&
                    coursesCreated.map((course, index) => {
                      return (
                        <MenuItem
                          key={index}
                          value={course.id}
                          classes={{ root: classes.resize }}
                        >
                          {course.title}
                        </MenuItem>
                      );
                    })}
                </Select>
              </div>

              <Button
                color="secondary"
                variant="contained"
                style={{ textTransform: "capitalize", marginTop: "10px" }}
                onClick={(e) => {
                  createNotification(e);
                }}
              >
                Send notification
              </Button>
            </div>
          </Grid>
          <Grid item xs={4}>
            <DropzoneAreaBase
              dropzoneClass={classes.dropzone}
              dropzoneText="&nbsp;Drag and drop an image or click here&nbsp;"
              acceptedFiles={["image/*"]}
              filesLimit={1}
              fileObjects={notificationPhoto}
              //useChipsForPreview={true}
              maxFileSize={5000000}
              onAdd={(newPhoto) => {
                setNotificationPhoto(newPhoto);
              }}
              onDelete={(deletePhotoObj) => {
                setNotificationPhoto();
              }}
              previewGridProps={{
                item: {
                  xs: "auto",
                },
              }}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}></TabPanel>
    </div>
  );
};

export default PartnerNotificationPage;
