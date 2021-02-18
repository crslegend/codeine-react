import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import SearchBar from "material-ui-search-bar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../../AxiosService";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import jwt_decode from "jwt-decode";
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
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Is Active",
      width: 160,
    },
  ];

  let memberRows = allMembersList;

  for (var h = 0; h < allMembersList.length; h++) {
    memberRows[h].date_joined = formatDate(allMembersList[h].date_joined);
  }

  const getMemberData = () => {
    memberRows = allMembersList;

    for (var h = 0; h < allMembersList.length; h++) {
      memberRows[h].date_joined = formatDate(allMembersList[h].date_joined);
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/members`)
        .then((res) => {
          setAllMemberList(res.data);
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handleMemberStatus = (e, status, memberid) => {
    e.preventDefault();
    if (status) {
      Service.client.delete(`/auth/members/${memberid}`).then((res) => {
        setAllMemberList(res.data);
        getMemberData();
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
        setAllMemberList(res.data);
        //getMemberData();
      });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Member is activated",
        severity: "success",
      });

      console.log("member is activated");
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
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Is Active",
      width: 160,
    },
    {
      field: "job_title",
      headerName: "Job Title",
      width: 160,
    },
    {
      field: "organization_name",
      headerName: "Organisation",
      width: 160,
    },
  ];

  const partnerRows = allPartnerList;

  for (var i = 0; i < allPartnerList.length; i++) {
    partnerRows[i].date_joined = formatDate(allPartnerList[i].date_joined);
    partnerRows[i].organization_name =
      allPartnerList[i].partner.organization &&
      allPartnerList[i].partner.organization.organization_name
        ? allPartnerList[i].partner.organization.organization_name
        : "-";
    partnerRows[i].job_title = allPartnerList[i].partner.job_title
      ? allPartnerList[i].partner.job_title
      : "-";
  }

  const getPartnerData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/partners`)
        .then((res) => {
          setAllPartnerList(res.data);
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handlePartnerStatus = (status, partnerid) => {
    if (status) {
      Service.client
        .get(`/auth/partners/${partnerid}/deactivate`)
        .then((res) => {
          setSbOpen(true);
          setSnackbar({
            ...snackbar,
            message: "Partner is deactivated",
            severity: "success",
          });
          console.log(res.data);
          setAllPartnerList(res.data);
        });
      getPartnerData();
      console.log("Partner is deactivated");
    } else {
      Service.client.get(`/auth/partners/${partnerid}/activate`).then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Partner is activated",
          severity: "success",
        });
        console.log(res.data);
        setAllPartnerList(res.data);
      });
      getPartnerData();
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
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Is Active",
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

  const handleAdminStatus = (status, adminid) => {
    if (status) {
      // Service.client.get(`/auth/partners/${adminid}/activate`).then((res) => {
      //   console.log(res.data);
      //   setAllAdminList(res.data);
      // });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Admin is deactivated",
        severity: "success",
      });
      getAdminData();
      console.log("Admin is deactivated");
    } else {
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Admin is activated",
        severity: "success",
      });
      getAdminData();
      console.log("Admin is activated");
    }
  };

  const [searchValueAdmin, setSearchValueAdmin] = useState("");
  const [openAdminDialog, setOpenAdminDialog] = useState(false);

  const handleClickOpenAdmin = (e) => {
    setSelectedPartner(e.row);
    setOpenPartnerDialog(true);
  };

  const handleCloseAdmin = () => {
    setOpenPartnerDialog(false);
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
        <div style={{ height: "700px", width: "100%" }}>
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

          <DataGrid
            rows={memberRows}
            columns={memberColumns.map((column) => ({
              ...column,
              //disableClickEventBubbling: true,
            }))}
            pageSize={10}
            checkboxSelection
            disableSelectionOnClick
            onRowClick={(e) => handleClickOpenMember(e)}
          />
        </div>

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
                ID <br />
                First Name <br />
                Last Name <br />
                Email <br />
                Status <br />
                Date Joined <br />
              </Grid>
              <Grid item xs={6}>
                {selectedMember.id} <br />
                {selectedMember.first_name} <br />
                {selectedMember.last_name} <br />
                {selectedMember.email} <br />
                {selectedMember.is_active === true ? "Active" : "Inactive"}{" "}
                <br />
                {formatDate(selectedMember.date_joined)} <br />
              </Grid>
              <Grid item xs={4}>
                <img src={selectedMember.profile_photo} alt=""></img>
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
              color="secondary"
            >
              {selectedMember.is_active ? "Deactivate" : "Activate"}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Partners Tab */}
      <TabPanel value={value} index={1}>
        <div style={{ height: "700px", width: "100%" }}>
          <SearchBar
            style={{
              width: "50%",
              marginBottom: "20px",
            }}
            placeholder="Search partners..."
            value={searchValuePartner}
            onChange={(newValue) => setSearchValuePartner(newValue)}
            //onRequestSearch={getSearchResults}
            onCancelSearch={() => setSearchValuePartner("")}
          />

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
        </div>
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
                ID <br />
                First Name <br />
                Last Name <br />
                Email <br />
                Status <br />
                Date Joined <br />
                {!selectedPartner ? (
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
                {selectedPartner.id} <br />
                {selectedPartner.first_name} <br />
                {selectedPartner.last_name} <br />
                {selectedPartner.email} <br />
                {selectedPartner.is_active === true
                  ? "Active"
                  : "Inactive"}{" "}
                <br />
                {formatDate(selectedPartner.date_joined)} <br />
                {!selectedPartner ? (
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
                <Typography variant="h6">Profile Pic</Typography>
                <img
                  src={selectedPartner.profile_photo}
                  alt=""
                  width="200px"
                ></img>

                {!selectedPartner ? (
                  <Fragment>
                    <Typography variant="h6">Company Logo</Typography>
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
              onClick={() => handlePartnerStatus(selectedPartner.is_active)}
              color="secondary"
            >
              {selectedPartner.is_active === true ? "Deactivate" : "Activate"}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Admin Tab */}
      <TabPanel value={value} index={2}>
        <div style={{ height: "700px", width: "100%" }}>
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

          <DataGrid
            rows={adminRows}
            columns={adminColumns.map((column) => ({
              ...column,
              //disableClickEventBubbling: true,
            }))}
            pageSize={10}
            checkboxSelection
            disableSelectionOnClick
            onRowClick={(e) => handleClickOpenAdmin(e)}
          />
        </div>
        <Dialog
          open={openPartnerDialog}
          onClose={handleCloseAdmin}
          aria-labelledby="form-dialog-title"
          maxWidth="sm"
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
                ID <br />
                First Name <br />
                Last Name <br />
                Email <br />
                Status <br />
                Date Joined <br />
              </Grid>
              <Grid item xs={6}>
                {selectedAdmin.id} <br />
                {selectedAdmin.first_name} <br />
                {selectedAdmin.last_name} <br />
                {selectedAdmin.email} <br />
                {selectedAdmin.is_active === true ? "Active" : "Inactive"}{" "}
                <br />
                {formatDate(selectedAdmin.date_joined)} <br />
                <br />
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h6">Profile Pic</Typography>
                <img src={selectedAdmin.profile_photo} alt=""></img>
              </Grid>
            </Grid>
            <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => handleAdminStatus(selectedAdmin.is_active)}
              color="secondary"
            >
              {selectedAdmin.is_active === true ? "Deactivate" : "Activate"}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Fragment>
  );
};

export default AdminHumanResourcePage;
