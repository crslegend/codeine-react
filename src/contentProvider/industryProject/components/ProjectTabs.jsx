import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Divider, Paper, Tab, Tabs, Typography } from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";

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

const ProjectTabs = ({ applicantsRows, applicationsColumns }) => {
  const classes = useStyles();

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
                }
              })()}
            </TabPanel>
          );
        })}
    </div>
  );
};

export default ProjectTabs;
