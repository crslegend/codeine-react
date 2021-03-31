import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, Button, Paper, Typography } from "@material-ui/core";
import {
  Computer,
  ContactSupport,
  CreditCard,
  Description,
  NoteAdd,
  Person,
} from "@material-ui/icons";
import { Timeline } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    margin: "auto",
  },
  paper: {
    padding: theme.spacing(3),
    width: "100%",
    marginBottom: "10px",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "#e6e6e6",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: "30px",
  },
}));

const SubmittedTickets = ({ enquiries }) => {
  const classes = useStyles();
  console.log(enquiries);

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

  const handleRedirect = (id) => {};

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        {enquiries && enquiries.length > 0 ? (
          enquiries.map((enquiry, index) => {
            return (
              <Paper
                key={index}
                className={classes.paper}
                onClick={() => handleRedirect(enquiry.id)}
              >
                {(() => {
                  if (enquiry.ticket_type[0] === "ARTICLE") {
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar className={classes.avatar}>
                          <Description />
                        </Avatar>
                        <div>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You enquired on an article.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You had an issue with one of the enrolled courses.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You had an issue with your billing/payment.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You experienced some technical issues on Codeine.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You submitted a general enquiry.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You submitted an enquiry relating to your account.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You have an issue with one of the consultations that
                            you had previously.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
                        </div>
                      </div>
                    );
                  } else if (enquiry.ticket_type[0] === "INDUSTRY_PROJECT") {
                    return (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Avatar className={classes.avatar}>
                          <Person />
                        </Avatar>
                        <div>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You have an issue with one of the industry projects
                            that you applied for.
                          </Typography>
                          <Typography variant="body2" style={{ opacity: 0.7 }}>
                            {formatDateToReturnWithoutTime(enquiry.timestamp)}
                          </Typography>
                        </div>
                      </div>
                    );
                  }
                })()}
              </Paper>
            );
          })
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default SubmittedTickets;
