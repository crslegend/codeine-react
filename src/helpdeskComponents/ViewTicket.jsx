import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Button,
  Chip,
  Divider,
  Link,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { AttachFile, LiveHelp } from "@material-ui/icons";
import AdminLogo from "../assets/codeineLogos/C.svg";
import { DropzoneAreaBase } from "material-ui-dropzone";
import TicketCategory from "./TicketCategory";

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
  replyAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: "20px",
  },
  resize: {
    fontSize: 13,
  },
  dropzone: {
    marginTop: "10px",
    minHeight: "140px",
    "@global": {
      ".MuiDropzoneArea-text.MuiTypography-h5": {
        textTransform: "none",
        fontSize: "16px",
      },
    },
  },
  link: {
    color: theme.palette.primary.main,
  },
  adminActionButton: {
    textTransform: "capitalize",
    color: "#C74343",
    border: "1px solid #C74343",
  },
}));

const ViewTicket = ({
  enquiry,
  user,
  reply,
  setReply,
  file,
  setFile,
  userAvatar,
  replyToTicket,
}) => {
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

  const replyDiv = () => {
    return (
      <div>
        <Divider style={{ marginBottom: "15px" }} />
        <div style={{ display: "flex", width: "100%" }}>
          {user ? (
            user === "admin" ? (
              <Avatar src={AdminLogo} className={classes.replyAvatar} />
            ) : (
              <Avatar
                className={classes.replyAvatar}
                src={userAvatar && userAvatar}
              />
            )
          ) : null}
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            <label htmlFor="reply">
              <Typography variant="body2" style={{ fontWeight: 600 }}>
                Your Response
              </Typography>
            </label>
            <TextField
              id="reply"
              variant="outlined"
              fullWidth
              margin="dense"
              placeholder="Enter your response here"
              multiline
              rows={4}
              inputProps={{
                style: { resize: "vertical" },
              }}
              InputProps={{
                classes: {
                  input: classes.resize,
                },
              }}
              style={{ backgroundColor: "#fff" }}
              value={reply ? reply : ""}
              onChange={(e) => setReply(e.target.value)}
              autoFocus
            />
            <DropzoneAreaBase
              dropzoneClass={classes.dropzone}
              dropzoneText="&nbsp;Drag and drop an attachment or click here&nbsp;"
              filesLimit={1}
              fileObjects={file}
              useChipsForPreview={true}
              maxFileSize={5000000}
              onAdd={(newFile) => {
                setFile(newFile);
              }}
              onDelete={(deleteFileObj) => {
                setFile();
              }}
              previewGridProps={{
                item: {
                  xs: "auto",
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              style={{
                width: 90,
                marginLeft: "auto",
                marginTop: "10px",
                textTransform: "capitalize",
              }}
              disabled={!reply || reply === ""}
              onClick={() => replyToTicket()}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TicketCategory
          enquiry={enquiry}
          renderIssueStatusChip={renderIssueStatusChip}
          formatDateToReturnWithoutTime={formatDateToReturnWithoutTime}
        />
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
          {enquiry && enquiry.photo && (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <AttachFile fontSize="small" />
              <Link
                className={classes.link}
                href={enquiry.photo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Attachment
              </Link>
            </div>
          )}
        </div>
        <div className={classes.conversation}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <Typography variant="body2" style={{ opacity: 0.8 }}>
              ACTIVITY
            </Typography>
            {user === "admin" && enquiry ? (
              enquiry.ticket_status === "OPEN" ? (
                <Button
                  variant="outlined"
                  className={classes.adminActionButton}
                >
                  Mark As Resolve
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  className={classes.adminActionButton}
                >
                  Reopen Ticket
                </Button>
              )
            ) : null}
          </div>

          {(() => {
            if (user && enquiry) {
              if (user === "admin") {
                if (enquiry.ticket_messages.length < 1) {
                  return replyDiv();
                }
              } else {
                if (enquiry.ticket_messages.length < 1) {
                  return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LiveHelp
                        fontSize="large"
                        style={{ marginRight: "10px" }}
                      />
                      <Typography variant="body2">
                        Our support officers are reviewing your enquiry and will
                        get back you to very soon.
                      </Typography>
                    </div>
                  );
                } else {
                  return replyDiv();
                }
              }
            }
          })()}
        </div>
      </Paper>
    </div>
  );
};

export default ViewTicket;
