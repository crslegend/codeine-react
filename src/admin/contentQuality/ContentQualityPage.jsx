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
  dataGrid: {
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
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

  const [value, setValue] = useState(0);

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

  const formatActDel = (status) => {
    if (status) {
      return "Deleted";
    } else {
      return "-";
    }
  };

  const [searchCourseValue, setSearchCourseValue] = useState("");
  const [searchArticleValue, setSearchArticleValue] = useState("");

  useEffect(() => {
    getCourseData();
    getArticleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchCourseValue === "") {
      getCourseData();
    }
    if (searchArticleValue === "") {
      getArticleData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCourseValue, searchArticleValue]);

  // Course data
  const [allCourseList, setAllCourseList] = useState([]);

  const courseColumns = [
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
        <div>
          {!params.value ? (
            <div style={{ color: "red" }}>{formatPubStatus(params.value)}</div>
          ) : (
            <div style={{ color: "green" }}>
              {formatPubStatus(params.value)}
            </div>
          )}
        </div>
      ),
      width: 200,
    },
    {
      field: "is_available",
      headerName: "Activation Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>
              {formatActStatus(params.value)}
            </div>
          ) : (
            <div style={{ color: "red" }}>{formatActStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 200,
    },
    {
      field: "is_deleted",
      headerName: "Deleted Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "red" }}>{formatActDel(params.value)}</div>
          ) : (
            <div style={{ color: "green" }}>{formatActDel(params.value)}</div>
          )}
        </div>
      ),
      width: 170,
    },
  ];

  let courseRows = allCourseList;

  const getCourseData = () => {
    let queryParams;

    if (searchCourseValue !== "") {
      queryParams = {
        search: searchCourseValue,
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

  const [allArticleList, setAllArticleList] = useState([]);

  const articleColumns = [
    {
      field: "thumbnail",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    { field: "title", headerName: "Title", width: 200 },
    {
      field: "date_created",
      headerName: "Date Created",
      valueFormatter: (params) => formatDate(params.value),
      width: 170,
    },
    {
      field: "is_published",
      headerName: "Published Status",
      renderCell: (params) => (
        <div>
          {!params.value ? (
            <div style={{ color: "red" }}>{formatPubStatus(params.value)}</div>
          ) : (
            <div style={{ color: "green" }}>
              {formatPubStatus(params.value)}
            </div>
          )}
        </div>
      ),
      width: 200,
    },
    {
      field: "is_activated",
      headerName: "Activation Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>
              {formatActStatus(params.value)}
            </div>
          ) : (
            <div style={{ color: "red" }}>{formatActStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 200,
    },
  ];

  let articleRows = allArticleList;

  const getArticleData = () => {
    let queryParams;

    if (searchArticleValue !== "") {
      queryParams = {
        search: searchArticleValue,
      };
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/articles`, { params: { ...queryParams } })
        .then((res) => {
          setAllArticleList(res.data);
          articleRows = allArticleList;
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
              value={searchCourseValue}
              onChange={(newValue) => setSearchCourseValue(newValue)}
              onRequestSearch={getCourseData}
              onCancelSearch={() => setSearchCourseValue("")}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 300px)", width: "100%" }}
          >
            <DataGrid
              className={classes.dataGrid}
              rows={courseRows}
              columns={courseColumns.map((column) => ({
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
        <Grid container>
          <Grid item xs={9}>
            <SearchBar
              style={{
                width: "70%",
                marginBottom: "20px",
                elavation: "0px",
              }}
              placeholder="Search article"
              value={searchArticleValue}
              onChange={(newValue) => setSearchArticleValue(newValue)}
              onRequestSearch={getArticleData}
              onCancelSearch={() => setSearchArticleValue("")}
            />
          </Grid>

          <Grid
            item
            xs={12}
            style={{ height: "calc(100vh - 300px)", width: "100%" }}
          >
            <DataGrid
              className={classes.dataGrid}
              rows={articleRows}
              columns={articleColumns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              pageSize={10}
              //checkboxSelection
              disableSelectionOnClick
              onRowClick={(e) =>
                history.push(`/admin/contentquality/article/${e.row.id}`)
              }
            />
          </Grid>
        </Grid>
      </TabPanel>
    </div>
  );
};

export default AdminContentQualityPage;
