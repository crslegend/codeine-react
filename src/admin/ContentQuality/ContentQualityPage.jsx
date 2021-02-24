import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
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
  const history = useHistory();

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
    if (!date) {
      return "-";
    }

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
      return "Yes";
    } else {
      return "No";
    }
  };

  const formatPubStatus = (status) => {
    if (status) {
      return "Published";
    } else {
      return "Unpublished";
    }
  };

  const formatActStatus = (status) => {
    if (status) {
      return "Activated";
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
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "published_date",
      headerName: "Date Uploaded",
      valueFormatter: (params) => formatDate(params.value),
      width: 170,
    },
    {
      field: "is_published",
      headerName: "Published Status",
      renderCell: (params) => (
        <strong>
          {params.value ? (
            <Typography style={{ color: "green" }}>
              {formatPubStatus(params.value)}
            </Typography>
          ) : (
            <Typography style={{ color: "red" }}>
              {formatPubStatus(params.value)}
            </Typography>
          )}
        </strong>
      ),
      width: 170,
    },
    {
      field: "is_available",
      headerName: "Activation Status",
      renderCell: (params) => (
        <strong>
          {params.value ? (
            <Typography style={{ color: "green" }}>
              {formatActStatus(params.value)}
            </Typography>
          ) : (
            <Typography style={{ color: "red" }}>
              {formatActStatus(params.value)}
            </Typography>
          )}
        </strong>
      ),
      width: 160,
    },
    {
      field: "is_deleted",
      headerName: "Deleted Status",
      valueFormatter: (params) => formatStatus(params.value),
      width: 170,
    },
  ];

  let courseRows = allCourseList;

  const getCourseData = () => {
    let queryParams;

    if (searchValue !== "") {
      queryParams = {
        search: searchValue,
      };
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/private-courses`, { params: { ...queryParams } })
        .then((res) => {
          setAllCourseList(res.data.results);
          courseRows = allCourseList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const handleCourseStatus = (e, status, courseid) => {
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
              onRequestSearch={getCourseData}
              onCancelSearch={() => setSearchValue("")}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 300px)", width: "100%" }}
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
              onRowClick={(e) =>
                history.push(`/admin/contentquality/courses/${e.row.id}`)
              }
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Article
      </TabPanel>
    </div>
  );
};

export default AdminContentQualityPage;
