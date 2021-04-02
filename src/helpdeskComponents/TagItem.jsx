import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
}));

const TagItem = ({ enquiry, formatDate, user }) => {
  const classes = useStyles();

  return (
    <div style={{ marginBottom: "15px" }}>
      {(() => {
        if (enquiry) {
          if (enquiry.ticket_type[0] === "ARTICLE") {
            return (
              <Link
                className={classes.link}
                href={`/admin/contentquality/article/${enquiry.article.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {enquiry.article.title}
              </Link>
            );
          } else if (enquiry.ticket_type[0] === "COURSE") {
            return (
              <Link
                className={classes.link}
                href={`/admin/contentquality/courses/${enquiry.course.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {enquiry.course.title}
              </Link>
            );
          } else if (enquiry.ticket_type[0] === "PAYMENT") {
            return (
              <Typography variant="body1">
                <span style={{ fontWeight: 600 }}>Transaction ID: </span>{" "}
                {enquiry.transaction.id}
                <br />
                <span style={{ fontWeight: 600 }}>Payment Amount: </span> $
                {enquiry.transaction.payment_amount}
                <br />
                <span style={{ fontWeight: 600 }}>Payment Status: </span>
                {enquiry.transaction.payment_status}
                <br />
                <span style={{ fontWeight: 600 }}>Paid By: </span>
                {enquiry.transaction.payment_type}
                <br />
                <span style={{ fontWeight: 600 }}>Paid On: </span>
                {formatDate(enquiry.transaction.timestamp)}
              </Typography>
            );
          } else if (enquiry.ticket_type[0] === "CONSULTATION") {
            return (
              <Typography variant="body1">
                <span style={{ fontWeight: 600 }}>Consultation ID: </span>{" "}
                {enquiry.consultation_slot.id}
                <br />
                <span style={{ fontWeight: 600 }}>Consultation: </span>
                {enquiry.consultation_slot.title}
                <br />
                <span style={{ fontWeight: 600 }}>Start Time: </span>
                {formatDate(enquiry.consultation_slot.start_time)}
                <br />
                <span style={{ fontWeight: 600 }}>End Time: </span>
                {formatDate(enquiry.consultation_slot.end_time)}
                <br />
                <span style={{ fontWeight: 600 }}>Partner: </span>
                {enquiry.consultation_slot.partner.first_name +
                  " " +
                  enquiry.consultation_slot.partner.last_name}
              </Typography>
            );
          } else if (
            (enquiry.ticket_type[0] === "ACCOUNT" ||
              enquiry.ticket_type[0] === "GENERAL" ||
              enquiry.ticket_type[0] === "TECHNICAL") &&
            user === "admin"
          ) {
            return (
              <Typography variant="body1">
                <span style={{ fontWeight: 600 }}>Account ID: </span>{" "}
                {enquiry.base_user.id}
                <br />
              </Typography>
            );
          }
        }
        return null;
      })()}
    </div>
  );
};

export default TagItem;
