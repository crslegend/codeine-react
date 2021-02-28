import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Typography,
  AppBar,
  Tabs,
  Tab,
  Box,
  Grid,
  Avatar,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from "material-ui-search-bar";
import Service from "../../AxiosService";

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

const AdminContentQualityPage = () => {
  const classes = styles();
  const history = useHistory();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // Member data
  const [allCourseList, setAllCourseList] = useState([]);

  const coruseColumns = [
    {
      field: "thumbnail",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
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
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
                elavation: "0px",
              }}
              placeholder="Search courses"
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
