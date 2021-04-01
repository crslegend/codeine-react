import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Typography } from "@material-ui/core";
import {
  Computer,
  ContactSupport,
  CreditCard,
  Description,
  NoteAdd,
  Person,
  Work,
} from "@material-ui/icons";
import { Timeline } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: "30px",
  },
}));

const TicketCategory = ({
  enquiry,
  renderIssueStatusChip,
  formatDateToReturnWithoutTime,
}) => {
  const classes = useStyles();

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
              You have issue with one of the industry projects that you applied
              for.
            </Typography>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
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
};

export default TicketCategory;
