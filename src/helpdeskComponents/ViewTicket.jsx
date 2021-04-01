import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Chip, Divider, Paper, Typography } from "@material-ui/core";
import {
  Computer,
  ContactSupport,
  CreditCard,
  Description,
  LiveHelp,
  NoteAdd,
  Person,
  Work,
} from "@material-ui/icons";
import { Timeline } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "30px",
  },
  paper: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
    paddingBottom: 0,
    width: "70%",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: "30px",
  },
  conversation: {
    marginLeft: "-32px",
    marginRight: "-32px",
    backgroundColor: "#dfe9f5",
    height: "100%",
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
  },
}));

const ViewTicket = ({ enquiry }) => {
  const classes = useStyles();

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      const newDateTime = new Date(date).toLocaleTimeString("en-SG");
      // console.log(newDate);
      return newDate + " " + newDateTime;
    }
    return "";
  };

  const formatDateToReturnWithoutTime = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // const newDateTime = new Date(date).toLocaleTimeString("en-SG");
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const renderIssueStatusChip = (status) => {
    if (status === "OPEN") {
      return (
        <Chip
          label="Open"
          style={{
            backgroundColor: "#1A8917",
            color: "#fff",
            fontWeight: 600,
            marginRight: "10px",
          }}
        />
      );
    } else if (status === "PENDING") {
      return (
        <Chip
          label="Pending"
          style={{
            backgroundColor: "#f0ae24",
            color: "#000",
            fontWeight: 600,
            marginRight: "10px",
          }}
        />
      );
    } else if (status === "RESOLVED") {
      return (
        <Chip
          label="Closed"
          style={{
            fontWeight: 600,
            marginRight: "10px",
          }}
        />
      );
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {(() => {
          if (enquiry) {
            if (enquiry.ticket_type[0] === "ARTICLE") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <Description />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You enquired on an article.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "COURSE") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <NoteAdd />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You have issue with one of the enrolled courses.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "PAYMENT") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <CreditCard />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You have issue with your billing/payment.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "TECHNICAL") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <Computer />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You experienced some technical issues on Codeine.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "GENERAL") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <ContactSupport />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You submitted a general enquiry.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "ACCOUNT") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <Person />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You submitted an enquiry relating to your account.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "CONSULTATION") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <Timeline />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You have issue with one of the consultations that you had
                      previously.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "INDUSTRY_PROJECT") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <Work />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You have issue with one of the industry projects that you
                      applied for.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            } else if (enquiry.ticket_type[0] === "CODE_REVIEWS") {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar className={classes.avatar}>
                    <Work />
                  </Avatar>
                  <div>
                    <Typography variant="body1" style={{ fontWeight: 600 }}>
                      You asked about one of your code reviews.
                    </Typography>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {renderIssueStatusChip(enquiry.ticket_status)}
                      <Typography variant="body2" style={{ opacity: 0.7 }}>
                        {formatDateToReturnWithoutTime(enquiry.timestamp)}
                      </Typography>
                    </div>
                  </div>
                </div>
              );
            }
          }
          return null;
        })()}
        <Divider style={{ margin: "15px 0px" }} />
        <div style={{ marginBottom: "20px" }}>
          <Typography
            variant="body2"
            style={{ fontWeight: 600, paddingBottom: "7px" }}
          >
            Description
          </Typography>
          <Typography variant="body2">
            {enquiry && enquiry.description}
          </Typography>
        </div>
        <div className={classes.conversation}>
          <Typography
            variant="body2"
            style={{ opacity: 0.7, paddingBottom: "20px" }}
          >
            ACTIVITY
          </Typography>
          {enquiry && enquiry.ticket_messages.length < 1 ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <LiveHelp fontSize="large" style={{ marginRight: "10px" }} />
              <Typography variant="body2">
                Our support officers are reviewing your enquiry and will get
                back you to very soon.
              </Typography>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </Paper>
    </div>
  );
};

export default ViewTicket;
