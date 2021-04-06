import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import Service from "../../../AxiosService";

const useStyles = makeStyles((theme) => ({
  tab: {
    textTransform: "capitalize",
    fontSize: 18,
    fontWeight: 600,
    color: "#000000",
  },
  tabPanel: {
    minHeight: "200px",
    marginBottom: "20px",
  },
  deleteButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
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

const ProjectTabs = ({
  applicantsRows,
  applicationsColumns,
  setSbOpen,
  setSnackbar,
  getIndustryProject,
  industry_project_id,
}) => {
  const classes = useStyles();

  const [value, setValue] = useState(0);
  const tabPanelsArr = [0, 1];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedApplicant, setSelectedApplicant] = useState();
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);

  const handleClickOpenApplication = (e) => {
    setSelectedApplicant(e.row);
    if (e.field === "is_accepted") {
      setOpenAcceptDialog(true);
    }
    if (e.field === "is_rejected") {
      setOpenRejectDialog(true);
    }
  };

  const handleAcceptSubmit = (application_id) => {
    Service.client
      .patch(
        `/industry-projects/${industry_project_id}/applications/${application_id}`,
        {
          is_accepted: true,
        }
      )
      .then((res) => {
        setOpenAcceptDialog(false);
        getIndustryProject();
        setSbOpen(true);
        setSnackbar({
          message: "Applicant has been accepted!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleRejectSubmit = (application_id) => {
    Service.client
      .patch(
        `/industry-projects/${industry_project_id}/applications/${application_id}`,
        {
          is_rejected: true,
        }
      )
      .then((res) => {
        setOpenRejectDialog(false);
        getIndustryProject();
        setSbOpen(true);
        setSnackbar({
          message: "Applicant has been rejected!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Tabs
        value={value}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        onChange={handleChange}
        classes={{
          root: classes.tabs,
        }}
      >
        <Tab className={classes.tab} label="Applicants" />
        <Tab className={classes.tab} label="Project Analytics" />
      </Tabs>
      <Divider
        style={{
          height: "1px",
          backgroundColor: "#000000",
          width: "100%",
        }}
      />
      {tabPanelsArr &&
        tabPanelsArr.map((tabPanel, index) => {
          return (
            <TabPanel
              key={index}
              value={value}
              index={tabPanel}
              className={classes.tabPanel}
            >
              {(() => {
                if (value === 0) {
                  return (
                    <Fragment>
                      <div style={{ marginTop: "10px" }}>
                        <SearchBar
                          placeholder="Search applications..."
                          // value={searchValue}
                          // onChange={(newValue) => setSearchValue(newValue)}
                          // onRequestSearch={handleRequestSearch}
                          // onCancelSearch={handleCancelSearch}
                          // classes={{
                          //   input: classes.input,
                          // }}
                        />
                      </div>
                      <Paper
                        style={{
                          height: "650px",
                          width: "100%",
                          marginTop: "20px",
                        }}
                      >
                        <DataGrid
                          className={classes.dataGrid}
                          rows={applicantsRows}
                          columns={applicationsColumns.map((column) => ({
                            ...column,
                          }))}
                          pageSize={10}
                          disableSelectionOnClick
                          onCellClick={(e) => handleClickOpenApplication(e)}
                        />
                      </Paper>
                      <Dialog
                        open={openRejectDialog}
                        onClose={() => setOpenRejectDialog(false)}
                        aria-labelledby="form-dialog-title"
                        classes={{ paper: classes.dialogPaper }}
                      >
                        <DialogTitle id="form-dialog-title">
                          Reject Applicant?
                        </DialogTitle>
                        <DialogContent>
                          By rejecting this applicant, you will not be able to
                          accept this applicant in the future.
                          <br />
                          <span>Are you sure?</span>
                        </DialogContent>
                        <DialogActions style={{ marginTop: 40 }}>
                          <Button
                            onClick={() => setOpenRejectDialog(false)}
                            color="primary"
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() =>
                              handleRejectSubmit(selectedApplicant.id)
                            }
                            color="primary"
                            variant="outlined"
                            className={classes.deleteButton}
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Dialog
                        open={openAcceptDialog}
                        onClose={() => setOpenAcceptDialog(false)}
                        aria-labelledby="form-dialog-title"
                        classes={{ paper: classes.dialogPaper }}
                      >
                        <DialogTitle id="form-dialog-title">
                          Accept Applicant?
                        </DialogTitle>
                        <DialogContent>
                          By accepting this applicant, you will not be able to
                          reject this applicant in the future.
                          <br />
                          <span>Are you sure?</span>
                        </DialogContent>
                        <DialogActions style={{ marginTop: 40 }}>
                          <Button
                            onClick={() => setOpenAcceptDialog(false)}
                            color="primary"
                            variant="outlined"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() =>
                              handleAcceptSubmit(selectedApplicant.id)
                            }
                            color="primary"
                            variant="contained"
                          >
                            Confirm
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Fragment>
                  );
                }
              })()}
            </TabPanel>
          );
        })}
    </div>
  );
};

export default ProjectTabs;
