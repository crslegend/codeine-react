import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Select,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import Service from "../../../AxiosService";
import { Info } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    minWidth: "70%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px",
    justifyContent: "center",
    // alignItems: "center",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    width: "200px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "5px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
}));

const StudentAnalysis = ({
  inactiveMembers,
  setInactiveMembers,
  falseStarters,
  setFalseStarters,
  numDaysForStudents,
  setNumDaysForStudents,
  courseId,
}) => {
  const classes = useStyles();

  const handleChangeNumberOfDays = async (e) => {
    setNumDaysForStudents(e.target.value);

    if (e.target.value !== "") {
      // get inactive members (with days)
      Service.client
        .get(`/analytics/inactive-members`, {
          params: { course_id: courseId, days: e.target.value },
        })
        .then((res) => {
          // console.log(res);
          setInactiveMembers(res.data);
        })
        .catch((err) => console.log(err));

      // get false starters (with days)
      Service.client
        .get(`/analytics/course-members-stats`, {
          params: { course_id: courseId, days: e.target.value },
        })
        .then((res) => {
          // console.log(res);
          setFalseStarters(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      // get inactive members (default without days)
      Service.client
        .get(`/analytics/inactive-members`, {
          params: { course_id: courseId },
        })
        .then((res) => {
          // console.log(res);
          setInactiveMembers(res.data);
        })
        .catch((err) => console.log(err));

      // get false starters (default without days)
      Service.client
        .get(`/analytics/course-members-stats`, {
          params: { course_id: courseId },
        })
        .then((res) => {
          // console.log(res);
          setFalseStarters(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className={classes.root}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" style={{ paddingRight: "15px" }}>
          View By
        </Typography>
        <FormControl margin="dense" className={classes.formControl}>
          <InputLabel>Date Range</InputLabel>
          <Select
            label="Date Range"
            variant="outlined"
            value={numDaysForStudents ? numDaysForStudents : ""}
            onChange={(e) => {
              handleChangeNumberOfDays(e);
            }}
          >
            <MenuItem value="">
              <em>Select a date range</em>
            </MenuItem>
            <MenuItem value="7">Past Week</MenuItem>
            <MenuItem value="14">Past 2 Weeks</MenuItem>
            <MenuItem value="30">Past Month</MenuItem>
            <MenuItem value="90">Past 3 Months</MenuItem>
            <MenuItem value="240">Past 6 Months</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 600,
            paddingBottom: "20px",
            textAlign: "center",
          }}
        >
          Students' Engagement Level for The Course
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Active Rate</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    % of members enrolled in the course who have been active
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {falseStarters &&
                falseStarters.active_members_percentage * 100 + "%"}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography variant="h6">False Starters Rate</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    % of members enrolled in the course who have not started on
                    any course material
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {falseStarters &&
                falseStarters.false_starter_percentage * 100 + "%"}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Inactive Members</Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    Number of enrolled members who have not continued the course
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {inactiveMembers && inactiveMembers.length === 0
                ? 0
                : inactiveMembers.length}
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default StudentAnalysis;