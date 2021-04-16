import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Box,
  Divider,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
// import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import SkillSetChart from "./SkillSetChart";
import ApplicantDemographics from "./ApplicantDemographics";
import { Info } from "@material-ui/icons";
import TooltipMui from "@material-ui/core/Tooltip";
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
  paper: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3, 5),
  },
  numbers: {
    color: theme.palette.primary.main,
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
  viewerSkills,
  applicantSkills,
  applicantDemographics,
  setSbOpen,
  setSnackbar,
  getIndustryProject,
  industry_project_id,
}) => {
  const classes = useStyles();
  // console.log(applicantDemographics);

  const [value, setValue] = useState(0);
  const tabPanelsArr = [0, 1];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [selectedApplicant, setSelectedApplicant] = useState();
  const [openAcceptDialog, setOpenAcceptDialog] = useState(false);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openChooseDialog, setOpenChooseDialog] = useState(false);

  const handleClickOpenApplication = (e) => {
    setSelectedApplicant(e.row);
    if (!e.row.is_accepted && !e.row.is_rejected) {
      if (e.field === "is_accepted") {
        setOpenChooseDialog(true);
      }
      // if (e.field === "is_rejected") {
      //   setOpenRejectDialog(true);
      // }
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
        setOpenChooseDialog(false);
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
        setOpenChooseDialog(false);
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
                        {/* <SearchBar
                          placeholder="Search applications..."
                          // value={searchValue}
                          // onChange={(newValue) => setSearchValue(newValue)}
                          // onRequestSearch={handleRequestSearch}
                          // onCancelSearch={handleCancelSearch}
                          // classes={{
                          //   input: classes.input,
                          // }}
                        /> */}
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
                          This action cannot be undone. Are you sure you want to
                          reject this applicant?
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
                        open={openChooseDialog}
                        onClose={() => setOpenChooseDialog(false)}
                        aria-labelledby="form-dialog-title"
                        classes={{ paper: classes.dialogPaper }}
                      >
                        <DialogTitle id="form-dialog-title">
                          Applicant Status
                        </DialogTitle>
                        <DialogContent>
                          Would you like to accept or reject the applicant?
                        </DialogContent>
                        <DialogActions style={{ marginTop: 40 }}>
                          <Button
                            onClick={() => setOpenRejectDialog(true)}
                            color="primary"
                            variant="outlined"
                            className={classes.deleteButton}
                          >
                            Reject
                          </Button>
                          <Button
                            onClick={() => setOpenAcceptDialog(true)}
                            color="primary"
                            variant="contained"
                          >
                            Accept
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
                          This action cannot be undone. Are you sure you want to
                          accept this applicant?
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
                } else if (value === 1) {
                  return (
                    <div style={{ marginTop: "20px" }}>
                      <Paper className={classes.paper}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ display: "flex" }}>
                              <Typography variant="h6">Total Views</Typography>
                              <TooltipMui
                                title={
                                  <Typography variant="body2">
                                    Total number of unique views for this
                                    project
                                  </Typography>
                                }
                              >
                                <IconButton disableRipple size="small">
                                  <Info fontSize="small" color="primary" />
                                </IconButton>
                              </TooltipMui>
                            </div>
                            <Typography
                              variant="h1"
                              className={classes.numbers}
                            >
                              {viewerSkills && viewerSkills.unique_member_views}
                            </Typography>
                          </div>
                        </div>

                        <Typography variant="h6" style={{ fontWeight: 600 }}>
                          Average Skills
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            marginTop: "20px",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              marginRight: "5px",
                              display: "flex",
                              flexDirection: "column",
                              width: "50%",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ textAlign: "center" }}
                            >
                              Project Viewers
                            </Typography>
                            <SkillSetChart
                              data={viewerSkills.average_skill_set}
                              type="skill"
                            />
                          </div>
                          <div
                            style={{
                              marginLeft: "5px",
                              display: "flex",
                              flexDirection: "column",
                              width: "50%",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ textAlign: "center" }}
                            >
                              Project Applicants
                            </Typography>
                            <SkillSetChart
                              data={applicantSkills.average_skill_set}
                              type="skill"
                            />
                          </div>
                        </div>

                        <Typography
                          variant="h6"
                          style={{ fontWeight: 600, paddingTop: "20px" }}
                        >
                          Average Language Proficiencies
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            marginTop: "20px",
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              marginRight: "5px",
                              display: "flex",
                              flexDirection: "column",
                              width: "50%",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ textAlign: "center" }}
                            >
                              Project Viewers
                            </Typography>
                            <SkillSetChart
                              data={viewerSkills.average_skill_set}
                              type="language"
                            />
                          </div>
                          <div
                            style={{
                              marginLeft: "5px",
                              display: "flex",
                              flexDirection: "column",
                              width: "50%",
                            }}
                          >
                            <Typography
                              variant="body1"
                              style={{ textAlign: "center" }}
                            >
                              Project Applicants
                            </Typography>
                            <SkillSetChart
                              data={applicantSkills.average_skill_set}
                              type="language"
                            />
                          </div>
                        </div>

                        <Typography
                          variant="h6"
                          style={{ fontWeight: 600, paddingTop: "20px" }}
                        >
                          Applicant Demographics
                        </Typography>
                        <ApplicantDemographics
                          memberDemographics={applicantDemographics}
                        />
                      </Paper>
                    </div>
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
