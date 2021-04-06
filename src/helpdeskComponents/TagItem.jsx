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

  const handleRedirectForArticle = (id) => {
    if (user === "admin") {
      return `/admin/contentquality/article/${id}`;
    } else if (user === "member") {
      return `/article/member/${id}`;
    } else if (user === "partner") {
      return `/article/parnter/${id}`;
    }
  };

  const handleRedirectForCourse = (id) => {
    if (user === "admin") {
      return `/admin/contentquality/courses/${id}`;
    } else if (user === "member") {
      return `/courses/${id}`;
    } else if (user === "partner") {
      return `/partner/home/content/view/${id}`;
    }
  };

  const handleRedirectForProject = (id) => {
    if (user === "admin") {
      // return `/admin/contentquality/courses/${id}`;
    } else if (user === "member") {
      return `/industryprojects/${id}`;
    } else if (user === "partner") {
      return `/partner/home/industryproject/view/${id}`;
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      {(() => {
        if (enquiry) {
          if (enquiry.ticket_type === "ARTICLE") {
            return (
              <Link
                className={classes.link}
                href={handleRedirectForArticle(
                  enquiry.article && enquiry.article.id
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {enquiry.article && enquiry.article.title}
              </Link>
            );
          } else if (enquiry.ticket_type === "COURSE") {
            return (
              <Link
                className={classes.link}
                href={handleRedirectForCourse(enquiry.course.id)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {enquiry.course.title}
              </Link>
            );
          } else if (enquiry.ticket_type === "PAYMENT") {
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
          } else if (enquiry.ticket_type === "CONSULTATION") {
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
            (enquiry.ticket_type === "ACCOUNT" ||
              enquiry.ticket_type === "GENERAL" ||
              enquiry.ticket_type === "TECHNICAL") &&
            user === "admin"
          ) {
            return (
              <Typography variant="body1">
                <span style={{ fontWeight: 600 }}>Account ID: </span>{" "}
                {enquiry.base_user.id}
                <br />
              </Typography>
            );
          } else if (enquiry.ticket_type === "INDUSTRY_PROJECT") {
            return (
              <Link
                className={classes.link}
                href={handleRedirectForProject(
                  enquiry.industry_project && enquiry.industry_project.id
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                {enquiry.industry_project && enquiry.industry_project.title}
              </Link>
            );
          }
        }
        return null;
      })()}
    </div>
  );
};

export default TagItem;
