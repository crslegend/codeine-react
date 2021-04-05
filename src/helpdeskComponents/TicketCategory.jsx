import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Typography } from "@material-ui/core";
import {
  Computer,
  ContactSupport,
  Person,
  Timeline,
  Work,
} from "@material-ui/icons";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper } from "@fortawesome/free-solid-svg-icons";

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
  formatDate,
  user,
}) => {
  const classes = useStyles();

  if (enquiry) {
    if (enquiry.ticket_type[0] === "ARTICLE") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar className={classes.avatar}>
            <FontAwesomeIcon
              icon={faNewspaper}
              className={classes.icon}
              style={{ height: "24px", width: "24px" }}
            />
          </Avatar>
          <div>
            <Typography variant="body1" style={{ fontWeight: 600 }}>
              {user === "admin" ? "User" : "You"} enquired on an article.
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
          </div>
        </div>
      );
    } else if (enquiry.ticket_type[0] === "COURSE") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar className={classes.avatar}>
            <InsertDriveFileIcon />
          </Avatar>
          <div>
            <Typography variant="body1" style={{ fontWeight: 600 }}>
              {user === "member" &&
                "You have issue with one of your enrolled courses."}
              {user === "partner" && "You have issue with one of your courses."}
              {user === "admin" && "User has issue with one of the courses."}
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
          </div>
        </div>
      );
    } else if (enquiry.ticket_type[0] === "PAYMENT") {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar className={classes.avatar}>
            <AccountBalanceWalletIcon />
          </Avatar>
          <div>
            <Typography variant="body1" style={{ fontWeight: 600 }}>
              {user === "admin" ? "User" : "You"} have issue with{" "}
              {user === "admin" ? "" : "your "}
              billing/payment.
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
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
              {user === "admin" ? "User" : "You"} experienced some technical
              issues on Codeine.
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
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
              {user === "admin" ? "User" : "You"} submitted a general enquiry.
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
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
              {user === "admin" ? "User" : "You"} submitted an enquiry relating
              to {user === "admin" ? "his/her" : "your"} account.
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
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
              {user === "admin" &&
                "User has issue with one of the past consultations."}
              {user === "partner" &&
                "You have issue with one of the past consultations that you have hold."}
              {user === "member" &&
                "You have issue with one of the past consultations that you have attended."}
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
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
              {user === "admin" ? "User" : "You"} have issue with one of the
              industry projects that {user === "admin" ? "user" : "you"} applied
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
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
              {user === "admin" ? "User" : "You"} asked about one of{" "}
              {user === "admin" ? "his/her" : "your"} code reviews.
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
                {formatDate(enquiry.timestamp)}
              </Typography>
            </div>
            {user === "admin" && (
              <Typography
                variant="body2"
                style={{ opacity: 0.7, paddingTop: "10px" }}
              >
                Submitted by:{" "}
                {enquiry.base_user.first_name +
                  ` ` +
                  enquiry.base_user.last_name}
                {enquiry.base_user.member ? " (Member)" : " (Partner)"}
              </Typography>
            )}
          </div>
        </div>
      );
    }
  }
  return null;
};

export default TicketCategory;
