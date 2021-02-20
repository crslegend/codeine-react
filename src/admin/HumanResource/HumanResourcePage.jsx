import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Avatar } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import SearchBar from "material-ui-search-bar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../../AxiosService";
import Grid from "@material-ui/core/Grid";
import Toast from "../../components/Toast.js";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 580,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
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
  avatar: {
    fontSize: "50px",
    width: "100px",
    height: "100px",
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

const AdminHumanResourcePage = () => {
  const classes = styles();

  //Toast message
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

  // Tabs variable
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  useEffect(() => {
    getMemberData();
    getPartnerData();
    getAdminData();
  }, []);

  // Member data
  const [allMembersList, setAllMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
  });

  const memberColumns = [
    { field: "id", headerName: "ID", width: 300 },
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
        <strong>
          {params.value ? (
            <Typography style={{ color: "green" }}>
              {formatStatus(params.value)}
            </Typography>
          ) : (
            <Typography style={{ color: "red" }}>
              {formatStatus(params.value)}
            </Typography>
          )}
        </strong>
      ),
      width: 160,
    },
  ];

  let memberRows = allMembersList;

  const getMemberData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/members`)
        .then((res) => {
          setAllMemberList(res.data);
          memberRows = allMembersList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handleMemberStatus = (e, status, memberid) => {
    e.preventDefault();
    if (status) {
      Service.client.delete(`/auth/members/${memberid}`).then(() => {
        Service.client.get(`auth/members/${memberid}`).then((res1) => {
          setSelectedMember(res1.data);
          getMemberData();
        });
      });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Member is deactivated",
        severity: "success",
      });

      console.log("member is deactivated");
    } else {
      Service.client.post(`/auth/members/${memberid}/activate`).then((res) => {
        setSelectedMember(res.data);
        getMemberData();
      });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Member is activated",
        severity: "success",
      });
    }
  };

  const [searchValue, setSearchValue] = useState("");
  const [openMemberDialog, setOpenMemberDialog] = useState(false);

  const handleClickOpenMember = (e) => {
    setSelectedMember(e.row);
    setOpenMemberDialog(true);
  };

  const handleCloseMember = () => {
    setOpenMemberDialog(false);
  };

  // Partner
  const [allPartnerList, setAllPartnerList] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
    partner: {
      job_title: "",
      bio: "",
      organization: {
        organization_name: "",
        organization_photo: "",
      },
    },
  });

  const partnerColumns = [
    { field: "id", headerName: "ID", width: 300 },
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
        <strong>
          {params.value ? (
            <Typography style={{ color: "green" }}>
              {formatStatus(params.value)}
            </Typography>
          ) : (
            <Typography style={{ color: "red" }}>
              {formatStatus(params.value)}
            </Typography>
          )}
        </strong>
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

  const getPartnerData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/partners`)
        .then((res) => {
          setAllPartnerList(res.data);
          partnerRows = allPartnerList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handlePartnerStatus = (e, status, partnerid) => {
    if (status) {
      Service.client.delete(`/auth/partners/${partnerid}`).then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Partner is deactivated",
          severity: "success",
        });
        setSelectedPartner(res.data);
        getPartnerData();
      });

      console.log("Partner is deactivated");
    } else {
      Service.client
        .post(`/auth/partners/${partnerid}/activate`)
        .then((res) => {
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Partner is activated",
            severity: "success",
          });
          setSelectedPartner(res.data);
          getPartnerData();
        });

      console.log("Partner is activated");
    }
  };

  const [searchValuePartner, setSearchValuePartner] = useState("");
  const [openPartnerDialog, setOpenPartnerDialog] = useState(false);

  const handleClickOpenPartner = (e) => {
    setSelectedPartner(e.row);
    setOpenPartnerDialog(true);
  };

  const handleClosePartner = () => {
    setOpenPartnerDialog(false);
  };

  // Admin
  const [allAdminList, setAllAdminList] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
  });

  const adminColumns = [
    { field: "id", headerName: "ID", width: 300 },
    {
      field: "first_name",
      headerName: "First name",
      valueFormatter: (params) => formatNull(params.value),
      width: 130,
    },
    {
      field: "last_name",
      headerName: "Last name",
      valueFormatter: (params) => formatNull(params.value),
      width: 130,
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
        <strong>
          {params.value ? (
            <Typography style={{ color: "green" }}>
              {formatStatus(params.value)}
            </Typography>
          ) : (
            <Typography style={{ color: "red" }}>
              {formatStatus(params.value)}
            </Typography>
          )}
        </strong>
      ),
      width: 160,
    },
  ];

  const adminRows = allAdminList;

  for (var j = 0; j < allAdminList.length; j++) {
    adminRows[j].date_joined = formatDate(allAdminList[j].date_joined);
    adminRows[j].first_name = allAdminList[j].first_name
      ? allAdminList[j].first_name
      : "-";
    adminRows[j].last_name = allAdminList[j].last_name
      ? allAdminList[j].last_name
      : "-";
  }

  const getAdminData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/admins`)
        .then((res) => {
          setAllAdminList(res.data);
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handleAdminStatus = (e, status, adminid) => {
    if (status) {
      Service.client.delete(`/auth/admins/${adminid}`).then((res) => {
        setSelectedAdmin(res.data);
        getAdminData();
      });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Admin is deactivated",
        severity: "success",
      });
      console.log("Admin is deactivated");
    } else {
      Service.client.post(`/auth/admins/${adminid}/activate`).then((res) => {
        setSelectedAdmin(res.data);
        getAdminData();
      });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Admin is activated",
        severity: "success",
      });
      console.log("Admin is activated");
    }
  };

  const [searchValueAdmin, setSearchValueAdmin] = useState("");
  const [openAdminDialog, setOpenAdminDialog] = useState(false);

  const handleClickOpenAdmin = (e) => {
    setSelectedAdmin(e.row);
    setOpenAdminDialog(true);
  };

  const handleCloseAdmin = () => {
    setOpenAdminDialog(false);
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
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
          <Tab label="Members" {...a11yProps(0)} />
          <Tab label="Partners" {...a11yProps(1)} />
          <Tab label="Admin" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {/* Members Tab */}
      <TabPanel value={value} index={0}>
        <Grid container>
          <Grid item xs={12}>
            <SearchBar
              style={{
                width: "50%",
                marginBottom: "20px",
                elavation: "0px",
              }}
              placeholder="Search members..."
              value={searchValue}
              onChange={(newValue) => setSearchValue(newValue)}
              //onRequestSearch={getSearchResults}
              onCancelSearch={() => setSearchValue("")}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 250px)", width: "100%" }}
          >
            <DataGrid
              rows={memberRows}
              columns={memberColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              //checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpenMember(e)}
            />
          </Grid>
        </Grid>

        <Dialog
          open={openMemberDialog}
          onClose={handleCloseMember}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Member Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCloseMember}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                <Typography>
                  ID <br />
                  First Name <br />
                  Last Name <br />
                  Email <br />
                  Status <br />
                  Date Joined <br />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {selectedMember.id} <br />
                  {selectedMember.first_name} <br />
                  {selectedMember.last_name} <br />
                  {selectedMember.email} <br />
                </Typography>
                {selectedMember.is_active ? (
                  <Typography style={{ color: "green" }}>Active</Typography>
                ) : (
                  <Typography style={{ color: "red" }}>Deactived</Typography>
                )}{" "}
                <Typography>
                  {formatDate(selectedMember.date_joined)} <br />
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {selectedMember.profile_photo ? (
                  <Avatar
                    src={selectedMember.profile_photo}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedMember.email.charAt(0)}
                  </Avatar>
                )}
              </Grid>
            </Grid>
            <br /> <br />
            <Typography variant="h6">Achievements</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) =>
                handleMemberStatus(
                  e,
                  selectedMember.is_active,
                  selectedMember.id
                )
              }
            >
              {selectedMember.is_active ? (
                <div style={{ color: "red" }}>Deactivate</div>
              ) : (
                <div style={{ color: "green" }}>Activate</div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Partners Tab */}
      <TabPanel value={value} index={1}>
        <Grid container>
          <Grid item xs={10}>
            <SearchBar
              style={{
                width: "60%",
                marginBottom: "20px",
              }}
              placeholder="Search partners..."
              value={searchValuePartner}
              onChange={(newValue) => setSearchValuePartner(newValue)}
              //onRequestSearch={getSearchResults}
              onCancelSearch={() => setSearchValuePartner("")}
            />
          </Grid>
          <Grid item xs={2}>
            <Button>Email Selected Partners</Button>
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 250px)", width: "100%" }}
          >
            <DataGrid
              rows={partnerRows}
              columns={partnerColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpenPartner(e)}
            />
          </Grid>
        </Grid>

        <Dialog
          open={openPartnerDialog}
          onClose={handleClosePartner}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Partner Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClosePartner}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                <Typography>
                  ID <br />
                  First Name <br />
                  Last Name <br />
                  Email <br />
                  Status <br />
                  Date Joined <br />
                </Typography>

                <br />

                {selectedPartner.partner.organization ? (
                  <Typography>
                    Job Title <br />
                    Bio <br />
                    Organisation <br />
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {selectedPartner.id} <br />
                  {selectedPartner.first_name
                    ? selectedPartner.first_name
                    : "-"}{" "}
                  <br />
                  {selectedPartner.last_name
                    ? selectedPartner.last_name
                    : "-"}{" "}
                  <br />
                  {selectedPartner.email} <br />
                </Typography>
                {selectedPartner.is_active ? (
                  <Typography style={{ color: "green" }}>Active</Typography>
                ) : (
                  <Typography style={{ color: "red" }}>Deactived</Typography>
                )}{" "}
                <Typography>
                  {formatDate(selectedPartner.date_joined)} <br />
                </Typography>
                <br />
                {selectedPartner.partner.organization ? (
                  <Typography>
                    {selectedPartner.partner.job_title}
                    <br />
                    {selectedPartner.partner.bio} <br />
                    {selectedPartner.partner.organization.organization_name}
                    <br />
                  </Typography>
                ) : (
                  ""
                )}
              </Grid>
              <Grid item xs={4}>
                {selectedPartner.profile_photo ? (
                  <Avatar
                    src={selectedPartner.profile_photo}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedPartner.email.charAt(0)}
                  </Avatar>
                )}

                <br />
                <br />
                <br />

                {selectedPartner.partner.organization ? (
                  <Fragment>
                    <img
                      src={
                        selectedPartner.partner.organization.organization_photo
                      }
                      alt=""
                      width="200px"
                    ></img>
                  </Fragment>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) =>
                handlePartnerStatus(
                  e,
                  selectedPartner.is_active,
                  selectedPartner.id
                )
              }
            >
              {selectedPartner.is_active ? (
                <div style={{ color: "red" }}>Deactivate</div>
              ) : (
                <div style={{ color: "green" }}>Activate</div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Admin Tab */}
      <TabPanel value={value} index={2}>
        <Grid container>
          <Grid item xs={12}>
            <SearchBar
              style={{
                width: "50%",
                marginBottom: "20px",
              }}
              placeholder="Search admin..."
              value={searchValueAdmin}
              onChange={(newValue) => setSearchValueAdmin(newValue)}
              //onRequestSearch={getSearchResults}
              onCancelSearch={() => setSearchValueAdmin("")}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 250px)", width: "100%" }}
          >
            <DataGrid
              rows={adminRows}
              columns={adminColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              //checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpenAdmin(e)}
            />
          </Grid>
        </Grid>
        <Dialog
          open={openAdminDialog}
          onClose={handleCloseAdmin}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Admin Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCloseAdmin}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                <Typography>
                  ID <br />
                  First Name <br />
                  Last Name <br />
                  Email <br />
                  Status <br />
                  Date Joined <br />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {selectedAdmin.id} <br />
                  {selectedAdmin.first_name} <br />
                  {selectedAdmin.last_name} <br />
                  {selectedAdmin.email} <br />
                </Typography>
                {selectedAdmin.is_active ? (
                  <Typography style={{ color: "green" }}>Active</Typography>
                ) : (
                  <Typography style={{ color: "red" }}>Deactived</Typography>
                )}{" "}
                <Typography>
                  {formatDate(selectedAdmin.date_joined)} <br />
                </Typography>
                <br />
              </Grid>
              <Grid item xs={4}>
                {selectedAdmin.profile_photo ? (
                  <Avatar
                    src={selectedAdmin.profile_photo}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedAdmin.email.charAt(0)}
                  </Avatar>
                )}
              </Grid>
            </Grid>
            <br />
          </DialogContent>
          {/* <DialogActions>
            <Button
              onClick={(e) =>
                handleAdminStatus(e, selectedAdmin.is_active, selectedAdmin.id)
              }
              color="secondary"
            >
              {selectedAdmin.is_active === true ? "Deactivate" : "Activate"}
            </Button>
          </DialogActions> */}
        </Dialog>
      </TabPanel>
    </Fragment>
  );
};

export default AdminHumanResourcePage;
