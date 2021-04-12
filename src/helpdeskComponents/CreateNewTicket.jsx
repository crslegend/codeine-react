import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { DropzoneAreaBase } from "material-ui-dropzone";

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
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #484850",
      boxShadow: "2px 2px 0px #222",
      borderRadius: "5px 5px 0 0",
      backgroundColor: "transparent",
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px",
    },
  },
  resize: {
    fontSize: 14,
    padding: "12px",
  },
  fieldRoot: {
    backgroundColor: "#FFFFFF",
  },
  focused: {
    boxShadow: "2px 2px 0px #222",
    borderColor: "#222 !important",
    borderWidth: "1px !important",
  },
  fieldInput: {
    padding: "12px",
    fontSize: "14px",
  },
  notchedOutline: {
    borderColor: "#222 !important",
    borderWidth: "1px !important",
  },
  submit: {
    marginTop: "20px",
    float: "right",
    textTransform: "capitalize",
  },
  dropzone: {
    marginTop: "10px",
    minHeight: "150px",
    "@global": {
      ".MuiDropzoneArea-text.MuiTypography-h5": {
        textTransform: "none",
        fontSize: "16px",
      },
    },
  },
}));

const CreateNewTicket = ({
  user,
  issueType,
  setIssueType,
  courses,
  articles,
  consultations,
  industryProjects,
  selectedTagging,
  setSelectedTagging,
  description,
  setDescription,
  handleSubmit,
  file,
  setFile,
  transactionId,
  setTransactionId,
  codeReviews,
}) => {
  const classes = useStyles();

  const memberMenuItems = (
    <Select
      displayEmpty
      value={issueType ? issueType : ""}
      onChange={(e) => {
        setIssueType(e.target.value);
      }}
      style={{ backgroundColor: "#fff" }}
    >
      <MenuItem value="" classes={{ root: classes.resize }}>
        <em>Select option</em>
      </MenuItem>
      <MenuItem value="ACCOUNT" classes={{ root: classes.resize }}>
        Account Settings
      </MenuItem>
      <MenuItem value="GENERAL" classes={{ root: classes.resize }}>
        General Enquiry
      </MenuItem>
      <MenuItem value="TECHNICAL" classes={{ root: classes.resize }}>
        Technical Issues
      </MenuItem>
      <MenuItem value="PAYMENT" classes={{ root: classes.resize }}>
        Billing/Payment Issues
      </MenuItem>
      <MenuItem value="COURSE" classes={{ root: classes.resize }}>
        Course
      </MenuItem>
      <MenuItem value="ARTICLE" classes={{ root: classes.resize }}>
        Article
      </MenuItem>
      <MenuItem value="INDUSTRY_PROJECT" classes={{ root: classes.resize }}>
        Industry Project
      </MenuItem>
      <MenuItem value="CONSULTATION" classes={{ root: classes.resize }}>
        Consultations
      </MenuItem>
      <MenuItem value="CODE_REVIEWS" classes={{ root: classes.resize }}>
        Code Reviews
      </MenuItem>
    </Select>
  );

  const partnerMenuItems = (
    <Select
      displayEmpty
      value={issueType ? issueType : ""}
      onChange={(e) => {
        setIssueType(e.target.value);
      }}
      style={{ backgroundColor: "#fff" }}
    >
      <MenuItem value="" classes={{ root: classes.resize }}>
        <em>Select option</em>
      </MenuItem>
      <MenuItem value="ACCOUNT" classes={{ root: classes.resize }}>
        Account Settings
      </MenuItem>
      <MenuItem value="GENERAL" classes={{ root: classes.resize }}>
        General Enquiry
      </MenuItem>
      <MenuItem value="TECHNICAL" classes={{ root: classes.resize }}>
        Technical Issues
      </MenuItem>
      <MenuItem value="PAYMENT" classes={{ root: classes.resize }}>
        Billing/Payment Issues
      </MenuItem>
      <MenuItem value="COURSE" classes={{ root: classes.resize }}>
        Course
      </MenuItem>
      <MenuItem value="ARTICLE" classes={{ root: classes.resize }}>
        Article
      </MenuItem>
      <MenuItem value="CONSULTATION" classes={{ root: classes.resize }}>
        Consultations
      </MenuItem>
      <MenuItem value="CODE_REVIEWS" classes={{ root: classes.resize }}>
        Code Reviews
      </MenuItem>
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
            {(() => {
              if (user === "member" || user === "partner-org") {
                return memberMenuItems;
              } else if (user === "partner") {
                return partnerMenuItems;
              }
              return null;
            })()}
          </FormControl>
          {(() => {
            if (
              issueType === "ACCOUNT" ||
              issueType === "GENERAL" ||
              issueType === "TECHNICAL"
            ) {
              return null;
            } else if (issueType === "PAYMENT") {
              return (
                <div style={{ marginTop: "20px" }}>
                  <label htmlFor="transaction">
                    <Typography variant="h6">Transaction ID</Typography>
                  </label>
                  <TextField
                    id="transaction"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    placeholder="You can find the transaction ID in either My Payments or Earnings"
                    autoFocus
                    InputProps={{
                      classes: {
                        root: classes.fieldRoot,
                        focused: classes.focused,
                        input: classes.resize,
                        notchedOutline: classes.notchedOutline,
                      },
                    }}
                    value={transactionId ? transactionId : ""}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              );
            } else if (issueType === "COURSE") {
              return (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="h6">Course</Typography>
                  <FormControl
                    margin="dense"
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <Select
                      displayEmpty
                      value={selectedTagging ? selectedTagging : ""}
                      onChange={(e) => {
                        setSelectedTagging(e.target.value);
                      }}
                      style={{ backgroundColor: "#fff" }}
                    >
                      <MenuItem value="" classes={{ root: classes.resize }}>
                        <em>Select Course</em>
                      </MenuItem>
                      {courses &&
                        courses.length > 0 &&
                        courses.map((course, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={course.id}
                              classes={{ root: classes.resize }}
                            >
                              {course.title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
              );
            } else if (issueType === "ARTICLE") {
              return (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="h6">Article</Typography>
                  <FormControl
                    margin="dense"
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <Select
                      displayEmpty
                      value={selectedTagging ? selectedTagging : ""}
                      onChange={(e) => {
                        setSelectedTagging(e.target.value);
                      }}
                      style={{ backgroundColor: "#fff" }}
                    >
                      <MenuItem value="" classes={{ root: classes.resize }}>
                        <em>Select Article</em>
                      </MenuItem>
                      {articles &&
                        articles.length > 0 &&
                        articles.map((article, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={article.id}
                              classes={{ root: classes.resize }}
                            >
                              {article.title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
              );
            } else if (issueType === "CONSULTATION") {
              return (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="h6">Past Consultation</Typography>
                  <FormControl
                    margin="dense"
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <Select
                      displayEmpty
                      value={selectedTagging ? selectedTagging : ""}
                      onChange={(e) => {
                        setSelectedTagging(e.target.value);
                      }}
                      style={{ backgroundColor: "#fff" }}
                    >
                      <MenuItem value="" classes={{ root: classes.resize }}>
                        <em>Select Consultation</em>
                      </MenuItem>
                      {consultations &&
                        consultations.length > 0 &&
                        consultations.map((consultation, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={consultation.consultation_slot.id}
                              classes={{ root: classes.resize }}
                            >
                              {consultation.consultation_slot.title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
              );
            } else if (issueType === "INDUSTRY_PROJECT") {
              return (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="h6">Projects</Typography>
                  <FormControl
                    margin="dense"
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <Select
                      displayEmpty
                      value={selectedTagging ? selectedTagging : ""}
                      onChange={(e) => {
                        setSelectedTagging(e.target.value);
                      }}
                      style={{ backgroundColor: "#fff" }}
                    >
                      <MenuItem value="" classes={{ root: classes.resize }}>
                        <em>Select Project</em>
                      </MenuItem>
                      {industryProjects &&
                        industryProjects.length > 0 &&
                        industryProjects.map((project, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={
                                user &&
                                (user === "member"
                                  ? project.industry_project.id
                                  : project.id)
                              }
                              classes={{ root: classes.resize }}
                            >
                              {user &&
                                (user === "member"
                                  ? project.industry_project.title
                                  : project.title)}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
              );
            } else if (issueType === "CODE_REVIEWS") {
              return (
                <div style={{ marginTop: "20px" }}>
                  <Typography variant="h6">Your Posted Code Reviews</Typography>
                  <FormControl
                    margin="dense"
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <Select
                      displayEmpty
                      value={selectedTagging ? selectedTagging : ""}
                      onChange={(e) => {
                        setSelectedTagging(e.target.value);
                      }}
                      style={{ backgroundColor: "#fff" }}
                    >
                      <MenuItem value="" classes={{ root: classes.resize }}>
                        <em>Select a Code Review</em>
                      </MenuItem>
                      {codeReviews &&
                        codeReviews.length > 0 &&
                        codeReviews.map((code, index) => {
                          return (
                            <MenuItem
                              key={index}
                              value={code.id}
                              classes={{ root: classes.resize }}
                            >
                              {code.title}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                </div>
              );
            }
          })()}
          {issueType && issueType !== "" && (
            <Fragment>
              <label htmlFor="details">
                <Typography variant="h6" style={{ paddingTop: "20px" }}>
                  Details of your enquiry
                </Typography>
              </label>
              <TextField
                id="details"
                variant="outlined"
                fullWidth
                margin="dense"
                placeholder="Tell us in detail of your enquiry"
                multiline
                rows={4}
                inputProps={{ style: { resize: "vertical" } }}
                InputProps={{
                  classes: {
                    root: classes.fieldRoot,
                    focused: classes.focused,
                    input: classes.resize,
                    notchedOutline: classes.notchedOutline,
                  },
                }}
                value={description ? description : ""}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Typography variant="h6" style={{ paddingTop: "20px" }}>
                Supporting Attachment (if any)
              </Typography>
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
                className={classes.submit}
                onClick={() => handleSubmit()}
              >
                Submit
              </Button>
            </Fragment>
          )}
        </Paper>
      </div>
    </div>
  );
};

export default CreateNewTicket;
