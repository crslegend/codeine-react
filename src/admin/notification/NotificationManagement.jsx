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

const AdminNotificationPage = () => {
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
    notification_type: "",
    userList: "",
    photo: "",
  });

  const createNotification = (e) => {
    var userList;

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
    if (notificationDetails.notification_type === "") {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please select a valid notification type!",
        severity: "error",
      });
      return;
    }
    if (
      selectedMemberList.rowIds.length === 0 &&
      selectedPartnerList.rowIds.length === 0
    ) {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Please select at least one user to send notification!",
        severity: "error",
      });
      return;
    } else {
      userList = selectedMemberList.rowIds.concat(selectedPartnerList.rowIds);
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
    formData.append("notification_type", notificationDetails.notification_type);
    formData.append("receiver_ids", JSON.stringify(userList));
    console.log(userList);

    if (notificationPhoto && notificationPhoto.length > 0) {
      formData.append("photo", notificationPhoto[0].file);
    }

    Service.client
      .post("/notifications", formData)
      .then(() => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "New Notification created",
          severity: "success",
        });
      })
      .catch();
  };

  useEffect(() => {
    getMemberData();
    getPartnerData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Member
  const [allMembersList, setAllMemberList] = useState([]);

  const memberColumns = [
    {
      field: "profile_photo",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    { field: "first_name", headerName: "First name", width: 130 },
    { field: "last_name", headerName: "Last name", width: 130 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 160,
    },
    {
      field: "membership_tier",
      hidden: true,
    },
  ];

  let memberRows = allMembersList;

  const [searchValueMember, setSearchValueMember] = useState("");

  const getMemberData = () => {
    let queryParams = {
      search: searchValueMember,
    };
    let active = "active";
    let deactived = "deactivated";
    if (searchValueMember !== "") {
      if (active.includes(searchValueMember.toLowerCase())) {
        queryParams = {
          is_active: true,
        };
      } else if (deactived.includes(searchValueMember.toLowerCase())) {
        queryParams = {
          is_active: false,
        };
      } else {
        queryParams = {
          search: searchValueMember,
        };
      }
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/members`, { params: { ...queryParams } })
        .then((res) => {
          // console.log(res.data);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              id: res.data[i].id,
              first_name: res.data[i].first_name,
              last_name: res.data[i].last_name,
              email: res.data[i].email,
              is_active: res.data[i].is_active,
              date_joined: res.data[i].date_joined,
              profile_photo: res.data[i].profile_photo,
              membership_tier: res.data[i].member.membership_tier,
            };
            arr.push(obj);
          }

          setAllMemberList(arr);
          memberRows = allMembersList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const [selectedMemberList, setSelectedMemberList] = useState({
    rowIds: [],
  });

  // Partner
  const [allPartnerList, setAllPartnerList] = useState([]);

  const partnerColumns = [
    {
      field: "profile_photo",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    {
      field: "first_name",
      headerName: "First name",
      width: 130,
      valueFormatter: (params) => formatNull(params.value),
    },
    {
      field: "last_name",
      headerName: "Last name",
      width: 130,
      valueFormatter: (params) => formatNull(params.value),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 160,
    },
    {
      field: "partner",
      headerName: "Organisation",
      valueFormatter: (params) => formatNull(params.value.organization),
      width: 160,
    },
  ];

  let partnerRows = allPartnerList;

  const [searchValuePartner, setSearchValuePartner] = useState("");

  const getPartnerData = () => {
    let queryParams = {
      search: searchValuePartner,
    };
    let active = "active";
    let deactived = "deactivated";
    if (searchValuePartner !== "") {
      if (active.includes(searchValuePartner.toLowerCase())) {
        queryParams = {
          is_active: true,
        };
      } else if (deactived.includes(searchValuePartner.toLowerCase())) {
        queryParams = {
          is_active: false,
        };
      } else {
        queryParams = {
          search: searchValuePartner,
        };
      }
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/partners`, { params: { ...queryParams } })
        .then((res) => {
          setAllPartnerList(res.data);
          partnerRows = allPartnerList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const [selectedPartnerList, setSelectedPartnerList] = useState({
    rowIds: [],
  });

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
          <Grid item xs={8} className={classes.padding}>
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
            <div style={{ marginTop: "20px" }}>
              <InputLabel>Notification Type</InputLabel>
              <Select
                className={classes.formControl}
                value={notificationDetails.notification_type}
                onChange={(event) =>
                  setNotificationDetails({
                    ...notificationDetails,
                    notification_type: event.target.value,
                  })
                }
              >
                <MenuItem value={"ANNOUNCEMENT"}>Announcement</MenuItem>
                <MenuItem value={"REMINDER"}>Reminder</MenuItem>
              </Select>
            </div>
            <Accordion style={{ marginTop: "30px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions1-content"
                id="additional-actions1-header"
              >
                <Typography>Select Members</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ height: "500px" }}>
                <DataGrid
                  className={classes.dataGrid}
                  rows={memberRows}
                  columns={memberColumns.map((column) => ({
                    ...column,
                    //disableClickEventBubbling: true,
                  }))}
                  pageSize={10}
                  checkboxSelection
                  onSelectionChange={(newSelection) => {
                    setSelectedMemberList(newSelection);
                  }}
                  //disableSelectionOnClick
                  //onRowClick={(e) => handleClickOpenMember(e)}
                />
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-label="Expand"
                aria-controls="additional-actions2-content"
                id="additional-actions2-header"
              >
                <Typography>Select Partners</Typography>
              </AccordionSummary>
              <AccordionDetails style={{ height: "500px" }}>
                <DataGrid
                  className={classes.dataGrid}
                  rows={partnerRows}
                  columns={partnerColumns.map((column) => ({
                    ...column,
                    //disableClickEventBubbling: true,
                  }))}
                  pageSize={10}
                  checkboxSelection
                  onSelectionChange={(newSelection) => {
                    setSelectedPartnerList(newSelection);
                  }}
                />
              </AccordionDetails>
            </Accordion>
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

export default AdminNotificationPage;
