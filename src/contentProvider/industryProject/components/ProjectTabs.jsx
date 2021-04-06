import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import SkillSetChart from "./SkillSetChart";

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
}) => {
  const classes = useStyles();
  console.log(viewerSkills);

  const [value, setValue] = useState(0);
  const tabPanelsArr = [0, 1];
  const handleChange = (event, newValue) => {
    setValue(newValue);
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
                          // onRowClick={(e) => handleClickOpenApplication(e)}
                        />
                      </Paper>
                    </Fragment>
                  );
                } else if (value === 1) {
                  return (
                    <div style={{ marginTop: "20px" }}>
                      <Paper className={classes.paper}>
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
                            <Typography variant="body1">
                              Project Viewers
                            </Typography>
                            <SkillSetChart />
                          </div>
                          <div
                            style={{
                              marginLeft: "5px",
                              display: "flex",
                              flexDirection: "column",
                              width: "50%",
                            }}
                          >
                            <Typography variant="body1">
                              Project Applicants
                            </Typography>
                            <SkillSetChart />
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
                            <Typography variant="body1">
                              Project Viewers
                            </Typography>
                            <SkillSetChart />
                          </div>
                          <div
                            style={{
                              marginLeft: "5px",
                              display: "flex",
                              flexDirection: "column",
                              width: "50%",
                            }}
                          >
                            <Typography variant="body1">
                              Project Applicants
                            </Typography>
                            <SkillSetChart />
                          </div>
                        </div>

                        <Typography
                          variant="h6"
                          style={{ fontWeight: 600, paddingTop: "20px" }}
                        >
                          Applicant Demographics
                        </Typography>
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
