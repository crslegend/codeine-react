import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { Typography, Grid, Tabs, Tab, Box, Divider } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "60px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "10px",
  },
  heading: {
    lineHeight: "50px",
    paddingBottom: "10px",
    fontWeight: 550,
    fontFamily: "Roboto Mono",
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

const TopPicks = () => {
  const classes = styles();

  // Tabs variable
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            our top picks for you
          </Typography>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="simple tabs example"
            classes={{
              root: classes.tabs,
            }}
          >
            <Tab
              style={{
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="courses"
              {...a11yProps(0)}
            />
            <Tab
              style={{
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="code reviews"
              {...a11yProps(1)}
            />
            <Tab
              style={{
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="articles"
              {...a11yProps(2)}
            />
            <Tab
              style={{
                textTransform: "none",
                fontWeight: 700,
                color: "#000000",
                fontFamily: "Roboto Mono",
              }}
              label="industry projects"
              {...a11yProps(3)}
            />
          </Tabs>
          <Divider
            style={{
              height: "1px",
              backgroundColor: "#000000",
              width: "100%",
            }}
          />
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default TopPicks;
