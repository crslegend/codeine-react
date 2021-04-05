import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Grid,
  CardMedia,
  CardContent,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
} from "@material-ui/core";
import Label from "../../landing/components/Label";
import Service from "../../../AxiosService";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "10px 10px",
    marginTop: "30px",
    border: "1px solid",
    borderRadius: 0,
  },
  cardmedia: {
    objectFit: "contain",
  },
  deleteButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  avatar: {
    fontSize: "80px",
    width: "150px",
    height: "150px",
  },
}));

const ApplicationCard = (props) => {
  const classes = styles();
  const { application, getAllApplications } = props;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

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
          <Grid item xs={1.5}>
            {application && (
              //   <CardMedia
              //     className={classes.cardmedia}
              //     image={
              //       application.industry_project.partner.partner.organization
              //         .organization_photo
              //     }
              //     title="Organisation Photo"
              //   ></CardMedia>
              <Avatar
                alt="Pic"
                src={
                  application.industry_project.partner.partner.organization
                    .organization_photo
                }
                classes={{
                  img: classes.cardmedia,
                }}
                className={classes.avatar}
              />
            )}
          </Grid>
          <Grid item xs={9}>
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
                {/* <Button
                  onClick={() => setOpenDeleteDialog(true)}
                  className={classes.deleteButton}
                  variant="contained"
                >
                  Delete
                </Button> */}
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
                  marginTop: "5px",
                }}
              >
                {/* <div style={{ display: "flex" }}>
                {application &&
                  application.industry_project.categories.map((category) => (
                    <Label label={category} />
                  ))}
                {console.log(application)}
              </div> */}

                {/* <Typography
                style={{
                  color: "#921515",
                }}
                variant="h6"
              >
                apply by{" "} 
                {application && formatDate(application.industry_project.application_deadline)}
              </Typography> */}
              </div>
              <Typography variant="h6">
                Application submitted{" "}
                {application && formatDate(application.date_created)}
              </Typography>
              <Typography variant="h6">
                Application status{" "}
                {application && application.is_accepted === true
                  ? "accepted"
                  : "pending"}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item>
            <CardContent>
              <div
                style={{
                //   display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  onClick={() => setOpenDeleteDialog(true)}
                  className={classes.deleteButton}
                  variant="contained"
                >
                  Delete
                </Button>
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
