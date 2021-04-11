import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Grid,
  Chip,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
} from "@material-ui/core";
import { green, red, grey } from "@material-ui/core/colors";
import Service from "../../../AxiosService";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "10px 10px",
    marginTop: "30px",
    border: "1px solid",
    borderRadius: 0,
  },
  deleteButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  cardmedia: {
    height: "100%",
    width: "7vw",
  },
  orgavatar: {
    objectFit: "contain",
  },
}));

const ApplicationCard = (props) => {
  const classes = styles();
  const { application, getAllApplications, setSnackbar, setSbOpen } = props;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  const handleDeleteSubmit = () => {
    Service.client
      .delete(
        `/industry-projects/${application.industry_project.id}/applications/${application.id}/delete`
      )
      .then((res) => {
        setOpenDeleteDialog(false);
        setSbOpen(true);
        setSnackbar({
          message: "Application successfully deleted!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .then((res) => {
        getAllApplications();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Card elevation={0} className={classes.root}>
        <Grid container>
          <Grid item xs={1}>
            {application && (
              <Avatar
                alt="Pic"
                src={
                  application.industry_project.partner.partner.organization
                    .organization_photo
                }
                classes={{
                  img: classes.orgavatar,
                }}
                className={classes.cardmedia}
              />
            )}
          </Grid>
          <Grid item xs={11}>
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  style={{
                    fontWeight: 600,
                  }}
                  variant="h5"
                >
                  {application && application.industry_project.title}
                </Typography>
                {application &&
                  !application.is_accepted &&
                  !application.is_rejected && (
                    <Button
                      onClick={() => setOpenDeleteDialog(true)}
                      className={classes.deleteButton}
                      variant="contained"
                    >
                      Delete
                    </Button>
                  )}
              </div>
              <Typography variant="h6">
                {application &&
                  application.industry_project.partner.partner.organization
                    .organization_name}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <Typography variant="body1">
                  Application submitted:{" "}
                  {application && formatDate(application.date_created)}
                </Typography>
                <Typography variant="body1">
                  {application && application.is_accepted ? (
                    <Chip
                      label="Accepted"
                      style={{ backgroundColor: green[600], color: "#FFF" }}
                    />
                  ) : application.is_rejected ? (
                    <Chip
                      label="Rejected"
                      style={{ backgroundColor: red[600], color: "#FFF" }}
                    />
                  ) : (
                    <Chip
                      label="Pending"
                      style={{ backgroundColor: grey[600], color: "#FFF" }}
                    />
                  )}
                </Typography>
              </div>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="form-dialog-title">
          Delete your Application?
        </DialogTitle>
        <DialogContent>
          Are you sure you want to delete this application?
        </DialogContent>
        <DialogActions style={{ marginTop: 40 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteSubmit()}
            className={classes.deleteButton}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ApplicationCard;
