import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Box,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from "material-ui-search-bar";
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
  border: {
    border: "1px solid",
    borderRadius: "5px",
    borderColor: "#437FC7",
    marginTop: "15px",
    padding: "10px",
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
  const [searchValueMember, setSearchValueMember] = useState("");

  const getMemberData = () => {
    let queryParams;
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
    let queryParams;
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

  const handlePartnerStatus = (e, status, partnerid) => {
    if (status) {
      Service.client.delete(`/auth/partners/${partnerid}`).then((res) => {
        setSbOpen(true);
        setSnackbar({
          ...snackbar,
          message: "Partner is deactivated",
          severity: "success",
        });
        Service.client
          .get(`/auth/partners/${partnerid}`)
          .then((res) => {
            setSelectedPartner(res.data);
          })
          .catch((err) => {});
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
    {
      field: "profile_photo",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
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
    let queryParams;
    let active = "active";
    let deactived = "deactivated";
    if (searchValueAdmin !== "") {
      if (active.includes(searchValueAdmin.toLowerCase())) {
        queryParams = {
          is_active: true,
        };
      } else if (deactived.includes(searchValueAdmin.toLowerCase())) {
        queryParams = {
          is_active: false,
        };
      } else {
        queryParams = {
          search: searchValueAdmin,
        };
      }
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/admins`, { params: { ...queryParams } })
        .then((res) => {
          setAllAdminList(res.data);
        })
        .catch((err) => {
          //setProfile(null);
        });
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
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
                elavation: "0px",
              }}
              placeholder="Search members"
              value={searchValueMember}
              onChange={(newValue) => setSearchValueMember(newValue)}
              onRequestSearch={getMemberData}
              onCancelSearch={() => setSearchValueMember("")}
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
              <Grid item xs={10}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography style={{ fontSize: "20px" }}>
                    <strong>
                      {selectedMember.first_name} {selectedMember.last_name}{" "}
                    </strong>
                  </Typography>
                  {selectedMember.is_active ? (
                    <Typography style={{ color: "green" }}>
                      {"\u00A0"}(Active){" "}
                    </Typography>
                  ) : (
                    <Typography style={{ color: "red" }}>
                      {"\u00A0"}(Deactived)
                    </Typography>
                  )}
                </div>
                <Typography style={{ color: "black" }}>
                  {selectedMember.email} <br />
                </Typography>
                <Typography
                  style={{ fontSize: "14px", marginTop: "0px", color: "black" }}
                >
                  Joined on {formatDate(selectedMember.date_joined)}
                </Typography>
                <Typography style={{ fontSize: "12px", marginTop: "5px" }}>
                  ID: {selectedMember.id}
                </Typography>
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
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
              }}
              placeholder="Search partners"
              value={searchValuePartner}
              onChange={(newValue) => setSearchValuePartner(newValue)}
              onRequestSearch={getPartnerData}
              onCancelSearch={() => setSearchValuePartner("")}
            />
          </Grid>
          <Grid item xs={3}>
            <Button variant="contained" color="primary">
              Email Selected Partners
            </Button>
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
            <div>
              <Grid container>
                <Grid item xs={2}>
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
                </Grid>
                <Grid item xs={10}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography style={{ fontSize: "20px" }}>
                      <strong>
                        {selectedPartner.first_name} {selectedPartner.last_name}{" "}
                      </strong>
                    </Typography>
                    {selectedPartner.is_active ? (
                      <Typography style={{ color: "green" }}>
                        {"\u00A0"}(Active){" "}
                      </Typography>
                    ) : (
                      <Typography style={{ color: "red" }}>
                        {"\u00A0"}(Deactived)
                      </Typography>
                    )}
                  </div>
                  <Typography style={{ color: "black" }}>
                    {selectedPartner.email} <br />
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "14px",
                      marginTop: "0px",
                      color: "black",
                    }}
                  >
                    Joined on {formatDate(selectedPartner.date_joined)}
                  </Typography>
                  <Typography style={{ fontSize: "12px", marginTop: "5px" }}>
                    ID: {selectedPartner.id}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container className={classes.border}>
                <Grid item xs={12} style={{ marginBottom: "10px" }}>
                  <Typography style={{ fontSize: "16spx" }}>
                    <strong>Organisation Details</strong>
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  {selectedPartner.partner.organization && (
                    <Fragment>
                      {selectedPartner.partner.organization
                        .organization_photo ? (
                        <Avatar
                          src={
                            selectedPartner.partner.organization
                              .organization_photo
                          }
                          alt=""
                          className={classes.avatar}
                        />
                      ) : (
                        <Avatar className={classes.avatar}>
                          {selectedPartner.partner.organization.organization_name.charAt(
                            0
                          )}
                        </Avatar>
                      )}
                    </Fragment>
                  )}
                </Grid>
                <Grid item xs={10}>
                  {selectedPartner.partner.organization && (
                    <div>
                      <Typography>
                        <strong>{selectedPartner.partner.job_title}</strong>
                        {"\u00A0"}@{" "}
                        <strong>
                          {
                            selectedPartner.partner.organization
                              .organization_name
                          }
                        </strong>
                      </Typography>
                      <Typography style={{ color: "#437FC7" }}>
                        <strong>Bio</strong>
                      </Typography>
                      {selectedPartner.partner.bio}
                    </div>
                  )}
                </Grid>
              </Grid>
            </div>
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
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
              }}
              placeholder="Search admin"
              value={searchValueAdmin}
              onChange={(newValue) => setSearchValueAdmin(newValue)}
              onRequestSearch={getAdminData}
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
              <Grid item xs={10}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <Typography style={{ fontSize: "20px" }}>
                    <strong>
                      {selectedAdmin.first_name} {selectedAdmin.last_name}{" "}
                    </strong>
                  </Typography>
                  {selectedAdmin.is_active ? (
                    <Typography style={{ color: "green" }}>
                      {"\u00A0"}(Active){" "}
                    </Typography>
                  ) : (
                    <Typography style={{ color: "red" }}>
                      {"\u00A0"}(Deactived)
                    </Typography>
                  )}
                </div>
                <Typography style={{ color: "black" }}>
                  {selectedAdmin.email} <br />
                </Typography>
                <Typography
                  style={{ fontSize: "14px", marginTop: "0px", color: "black" }}
                >
                  Joined on {formatDate(selectedAdmin.date_joined)}
                </Typography>
                <Typography style={{ fontSize: "12px", marginTop: "5px" }}>
                  ID: {selectedAdmin.id}
                </Typography>
                <br />
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </TabPanel>
    </Fragment>
  );
};

export default AdminHumanResourcePage;
