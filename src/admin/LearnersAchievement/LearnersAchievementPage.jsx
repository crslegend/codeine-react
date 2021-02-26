import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

const AdminLearnersAchievementPage = () => {
  const classes = useStyles();

  const [openAchievementDialog, setOpenAchievementDialog] = useState(false);

  const handleOpenAchievementDialog = (e) => {
    setOpenAchievementDialog(true);
  };

  const handleCloseAchievementDialog = () => {
    setOpenAchievementDialog(false);
  };

  const submitNewAchievement = () => {
    console.log("submitNewAchievement");
  };

  return (
    <div>
      <Grid container style={{ marginBottom: "20px" }}>
        <Grid item xs={10}>
          <Typography variant="h5">Learners Achievement</Typography>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={handleOpenAchievementDialog}>
            + New Achievement
          </Button>
        </Grid>
      </Grid>

      <Grid container>
        <Grid item xs={8}>
          <Typography variant="h6">Technical Badges</Typography>
          <Typography variant="h6">Achievement Badges</Typography>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <Typography variant="h6">
              Total number of technical badges{" "}
            </Typography>
            <br />
            <Typography variant="h6">xxx</Typography>
            <Typography variant="h6">
              Total number of achievement badges{" "}
            </Typography>
            <br />
            <Typography variant="h6">xxx</Typography>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={openAchievementDialog}
        onClose={handleCloseAchievementDialog}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">
          Create New Achievement Badges
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseAchievementDialog}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Grid container>
              <Grid item xs={3}>
                Grid 3
              </Grid>
              <Grid item xs={7}>
                Grid 7
              </Grid>
            </Grid>
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => submitNewAchievement()} color="secondary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminLearnersAchievementPage;
