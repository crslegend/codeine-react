import React, { Fragment, useState, useEffect } from "react";
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
  Grid,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from "material-ui-search-bar";
import CloseIcon from "@material-ui/icons/Close";
import Service from "../../AxiosService";
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
        <Box p={3}>
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

const AdminContentQualityPage = () => {
  const classes = styles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
    getCourseData();
    //getArticleData();
  }, []);

  // Member data
  const [allCourseList, setAllCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState({
    id: "",
    title: "",
    is_activated: "",
    date_published: "",
    is_publish: "",
  });

  const coruseColumns = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "title", headerName: "Title", width: 130 },
    {
      field: "is_published",
      headerName: "Published Status",
      width: 200,
    },
    {
      field: "date_published",
      headerName: "Date Uploaded",
      valueFormatter: (params) => formatDate(params.value),
      width: 200,
    },
    {
      field: "is_activated",
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

  let courseRows = allCourseList;

  const getCourseData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/courses`)
        .then((res) => {
          setAllCourseList(res.data.results);
          courseRows = allCourseList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handleMemberStatus = (e, status, courseid) => {
    e.preventDefault();
    if (status) {
      Service.client.patch(`/courses/${courseid}/deactivate`).then(() => {
        Service.client.get(`/courses/${courseid}`).then((res1) => {
          setSelectedCourse(res1.data);
          getCourseData();
        });
      });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Course is deactivated",
        severity: "success",
      });

      console.log("course is deactivated");
    } else {
      Service.client.patch(`/course/${courseid}/activate`).then((res) => {
        setSelectedCourse(res.data);
        getCourseData();
      });
      setSbOpen(true);
      setSnackbar({
        ...snackbar,
        message: "Course is activated",
        severity: "success",
      });
    }
  };

  const [searchValue, setSearchValue] = useState("");
  const [openCourseDialog, setOpenCourseDialog] = useState(false);

  const handleClickOpenCourse = (e) => {
    setSelectedCourse(e.row);
    setOpenCourseDialog(true);
  };

  const handleCloseCourse = () => {
    setOpenCourseDialog(false);
  };

  return (
    <div className={classes.root}>
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
          classes={{
            root: classes.tabs,
          }}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Courses" {...a11yProps(0)} />
          <Tab label="Articles" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container>
          <Grid item xs={12}>
            <SearchBar
              style={{
                width: "50%",
                marginBottom: "20px",
                elavation: "0px",
              }}
              placeholder="Search courses..."
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
              rows={courseRows}
              columns={coruseColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              //checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpenCourse(e)}
            />
          </Grid>
        </Grid>

        <Dialog
          open={openCourseDialog}
          onClose={handleCloseCourse}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Member Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleCloseCourse}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                <Typography>
                  ID <br />
                  Title <br />
                  Is Published <br />
                  Date Uploaded <br />
                  Status <br />
                  Date Published <br />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {selectedCourse.id} <br />
                  {selectedCourse.title} <br />
                  {selectedCourse.date_published} <br />
                  {selectedCourse.is_publish} <br />=
                </Typography>
                {selectedCourse.is_activated ? (
                  <Typography style={{ color: "green" }}>Active</Typography>
                ) : (
                  <Typography style={{ color: "red" }}>Deactived</Typography>
                )}{" "}
                <Typography>
                  {formatDate(selectedCourse.date_joined)} <br />
                </Typography>
              </Grid>
              <Grid item xs={4}>
                {selectedCourse.thumbnail ? (
                  <Avatar
                    src={selectedCourse.thumbnail}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedCourse.title.charAt(0)}
                  </Avatar>
                )}
              </Grid>
            </Grid>
            <br /> <br />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(e) =>
                handleMemberStatus(
                  e,
                  selectedCourse.is_activated,
                  selectedCourse.id
                )
              }
            >
              {selectedCourse.is_activated ? (
                <div style={{ color: "red" }}>Deactivate</div>
              ) : (
                <div style={{ color: "green" }}>Activate</div>
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Article
      </TabPanel>
    </div>
  );
};

export default AdminContentQualityPage;
