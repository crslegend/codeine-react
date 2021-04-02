import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Chip,
  Paper,
  Typography,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@material-ui/core";
import {
  Computer,
  ContactSupport,
  CreditCard,
  Description,
  NoteAdd,
  Person,
  Timeline,
  Work,
} from "@material-ui/icons";
import { useHistory } from "react-router";

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
  formControl: {
    width: "200px",
    marginBottom: "20px",
    marginLeft: "auto",
  },
}));

const SubmittedTickets = ({ user, enquiries, filterBy, setFilterBy }) => {
  const classes = useStyles();
  const history = useHistory();
  //   console.log(enquiries);

  const renderIssueStatusChip = (status) => {
    if (status === "OPEN") {
      return (
        <Chip
          label="OPEN"
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
          label="PENDING"
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
          label="CLOSED"
          style={{
            fontWeight: 600,
            marginRight: "10px",
          }}
        />
      );
    }
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

  const handleRedirect = (id) => {
    if (user) {
      if (user === "member") {
        return history.push(`/member/helpdesk/tickets/${id}`);
      } else {
        return history.push(`/partner/home/helpdesk/tickets/${id}`);
      }
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <FormControl
          margin="dense"
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Enquiry Status</InputLabel>
          <Select
            label="Enquiry Status"
            value={filterBy ? filterBy : ""}
            onChange={(e) => {
              setFilterBy(e.target.value);
            }}
            style={{ backgroundColor: "#fff" }}
          >
            <MenuItem value="">
              <em>Select a status</em>
            </MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="RESOLVED">Closed</MenuItem>
          </Select>
        </FormControl>
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
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "5px",
                            }}
                          >
                            {renderIssueStatusChip(enquiry.ticket_status)}
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            {user === "member" &&
                              "You have issue with one of your enrolled courses."}
                            {user === "partner" &&
                              "You have issue with one of your courses."}
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "5px",
                            }}
                          >
                            {renderIssueStatusChip(enquiry.ticket_status)}
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
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
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
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
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
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
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
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
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
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
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            You have issue with one of the industry projects
                            that you applied for.
                          </Typography>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginTop: "5px",
                            }}
                          >
                            {renderIssueStatusChip(enquiry.ticket_status)}
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
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
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
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
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7 }}
                            >
                              {formatDateToReturnWithoutTime(enquiry.timestamp)}
                            </Typography>
                          </div>
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
