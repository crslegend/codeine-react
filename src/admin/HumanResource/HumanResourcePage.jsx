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
    backgroundColor: "white",
    elavation: "none",
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

const AdminHumanResourcePage = () => {
  const classes = styles();
  const [value, setValue] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    Service.client.get(`/auth/members`).then((res) => {
      console.log(res.data);
      setAllMemberList(res.data);
    });
  }, []);

  const [allMembersList, setAllMemberList] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 130 },
    { field: "first_name", headerName: "First name", width: 130 },
    { field: "last_name", headerName: "Last name", width: 130 },
    {
      field: "email",
      headerName: "Email",
      width: 90,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      width: 160,
    },
    {
      field: "is_active",
      headerName: "Is Active",
      width: 160,
    },
  ];

  const rows = allMembersList;

  const handleClickOpen = (e) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <AppBar position="static">
        <Tabs
          value={value}
          background="#fff"
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="simple tabs example"
          classes={{
            root: classes.tabs,
          }}
        >
          <Tab label="Partners" {...a11yProps(0)} />
          <Tab label="Members" {...a11yProps(1)} />
          <Tab label="Admin" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      {/* Partners Tab */}
      <TabPanel value={value} index={0}>
        <Paper className={classes.root}>
          <div style={{ height: "700px", width: "100%" }}>
            <SearchBar
              style={{
                width: "50%",
                marginBottom: "20px",
              }}
              placeholder="Search content provider..."
              value={searchValue}
              onChange={(newValue) => setSearchValue(newValue)}
              //onRequestSearch={getSearchResults}
              onCancelSearch={() => setSearchValue("")}
            />

            <DataGrid
              rows={rows}
              columns={columns.map((column) => ({
                ...column,
                //disableClickEventBubbling: true,
              }))}
              //dataSource={allMembersList}
              pageSize={10}
              //checkboxSelection
              onRowClick={handleClickOpen}
            />
          </div>
        </Paper>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Hello
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>

      {/* Members Tab */}
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>

      {/* Admin Tab */}
      <TabPanel value={value} index={2}>
        <div style={{ height: "600px", width: "100%" }}>
          <SearchBar
            style={{
              width: "50%",
              marginBottom: "20px",
            }}
            placeholder="Search admin..."
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            //onRequestSearch={getSearchResults}
            onCancelSearch={() => setSearchValue("")}
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Hello
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To subscribe to this website, please enter your email address
              here. We will send updates occasionally.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </TabPanel>
    </Fragment>
  );
};

export default AdminHumanResourcePage;
