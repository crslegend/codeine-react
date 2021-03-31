import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    margin: "auto",
  },
  paper: {
    padding: theme.spacing(4),
    width: "100%",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    width: "100%",
  },
}));

const CreateNewTicket = ({ user, issueType, setIssueType }) => {
  const classes = useStyles();

  const memberMenuItems = (
    <Select
      label="Enquiry Type"
      value={issueType ? issueType : ""}
      onChange={(e) => {
        setIssueType(e.target.value);
      }}
      style={{ backgroundColor: "#fff" }}
    >
      <MenuItem value="">
        <em>Select option</em>
      </MenuItem>
      <MenuItem value="ACCOUNT">Account Settings</MenuItem>
      <MenuItem value="GENERAL">General Enquiry</MenuItem>
      <MenuItem value="TECHNICAL">Technical Issues</MenuItem>
      <MenuItem value="PAYMENT">Billing/Payment Issues</MenuItem>
      <MenuItem value="COURSE">Course</MenuItem>
      <MenuItem value="ARTICLE">Article</MenuItem>
      <MenuItem value="INDUSTRY_PROJECT">Industry Project</MenuItem>
      <MenuItem value="CONSULTATION">Consultations</MenuItem>
    </Select>
  );

  const partnerMenuItems = (
    <Select
      label="Enquiry Type"
      value={issueType ? issueType : ""}
      onChange={(e) => {
        setIssueType(e.target.value);
      }}
      style={{ backgroundColor: "#fff" }}
    >
      <MenuItem value="">
        <em>Select option</em>
      </MenuItem>
      <MenuItem value="ACCOUNT">Account Settings</MenuItem>
      <MenuItem value="GENERAL">General Enquiry</MenuItem>
      <MenuItem value="TECHNICAL">Technical Issues</MenuItem>
      <MenuItem value="PAYMENT">Billing/Payment Issues</MenuItem>
      <MenuItem value="COURSE">Course</MenuItem>
      <MenuItem value="ARTICLE">Article</MenuItem>
      <MenuItem value="CONSULTATION">Consultations</MenuItem>
    </Select>
  );

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Paper className={classes.paper}>
          <Typography variant="h6">What is your enquiry about?</Typography>
          <FormControl
            margin="dense"
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel>Enquiry Type</InputLabel>
            {(() => {
              if (user === "member" || user === "partner-org") {
                return memberMenuItems;
              } else if (user === "partner") {
                return partnerMenuItems;
              }
              return null;
            })()}
          </FormControl>
        </Paper>
      </div>
    </div>
  );
};

export default CreateNewTicket;
