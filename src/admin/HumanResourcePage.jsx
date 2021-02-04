import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";

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
          <Typography>{children}</Typography>
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

const columns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "firstName", headerName: "Name", width: 130 },
  { field: "lastName", headerName: "Company", width: 130 },
  {
    field: "age",
    headerName: "Date Applied",
    type: "number",
    width: 150,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
  },
];

const rows = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35, status: "Active" },
  {
    id: 2,
    lastName: "Lannister",
    firstName: "Cersei",
    age: 42,
    status: "Active",
  },
  {
    id: 3,
    lastName: "Lannister",
    firstName: "Jaime",
    age: 45,
    status: "Active",
  },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16, status: "Active" },
  {
    id: 5,
    lastName: "Targaryen",
    firstName: "Daenerys",
    age: null,
    status: "Active",
  },
  {
    id: 6,
    lastName: "Melisandre",
    firstName: null,
    age: 150,
    status: "Active",
  },
  {
    id: 7,
    lastName: "Clifford",
    firstName: "Ferrara",
    age: 44,
    status: "Active",
  },
  {
    id: 8,
    lastName: "Frances",
    firstName: "Rossini",
    age: 36,
    status: "Active",
  },
  {
    id: 9,
    lastName: "Roxie",
    firstName: "Harvey",
    age: 65,
    status: "Deactived",
  },
];

const useStyles = makeStyles((theme) => ({}));

const AdminHumanResourcePage = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Content Provider" {...a11yProps(0)} />
          <Tab label="Industry Partners" {...a11yProps(1)} />
          <Tab label="Members" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div style={{ height: "600px", width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns.map((column) => ({
              ...column,
              disableClickEventBubbling: true,
            }))}
            pageSize={10}
            checkboxSelection
          />
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  );
};

export default AdminHumanResourcePage;
