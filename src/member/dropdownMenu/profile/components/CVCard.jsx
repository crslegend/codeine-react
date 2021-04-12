import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { MoreVert, Edit, Delete } from "@material-ui/icons";
import {
  Typography,
  Card,
  CardContent,
  Popover,
  Divider,
} from "@material-ui/core";
import Service from "../../../../AxiosService";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "30px",
    border: "1px solid #C4C4C4",
    borderRadius: 0,
  },
  title: {
    margin: "-20px -20px 5px",
    padding: "20px 20px",
  },
  typography: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: "80px",
    cursor: "pointer",
    color: "#474747",
  },
  menu: {
    display: "flex",
    paddingLeft: "20px",
    "&:hover": {
      color: "#000000",
      backgroundColor: "#ECECEC",
    },
  },
}));

const ExperienceCard = (props) => {
  const classes = styles();
  const {
    experience,
    setCVDetail,
    setCVDialogState,
    setEditingCV,
    setDeleteDialogState,
    setSbOpen,
    setSnackbar,
    snackbar,
    getProfileDetails,
  } = props;

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

  const handleClick = (event, courseId) => {
    setPopover({
      popoverId: courseId,
      anchorEl: event.currentTarget,
    });
  };

  const handleClose = () => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
  };

  return (
    <Card elevation={0} className={classes.root}>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div className={classes.title}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              style={{
                fontWeight: 600,
              }}
              variant="body1"
            >
              {experience && experience.title}
            </Typography>
            <MoreVert onClick={(e) => handleClick(e, experience.id)} />
            <Popover
              open={popover.popoverId === experience.id}
              onClose={handleClose}
              anchorEl={popover.anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <div className={classes.menu}>
                <Edit
                  style={{
                    fontSize: "20px",
                    margin: "auto 0px",
                    marginRight: "8px",
                  }}
                />
                <Typography
                  variant="body2"
                  className={classes.typography}
                  onClick={() => {
                    setCVDetail(experience);
                    setCVDialogState(true);
                    setEditingCV(true);
                    handleClose();
                  }}
                >
                  Edit
                </Typography>
              </div>

              <Divider />
              <div className={classes.menu}>
                <Delete
                  style={{
                    fontSize: "20px",
                    margin: "auto 0px",
                    marginRight: "8px",
                  }}
                />
                <Typography
                  variant="body2"
                  className={classes.typography}
                  onClick={() => {
                    setCVDetail(experience);
                    setDeleteDialogState(true);
                    handleClose();
                  }}
                >
                  Delete
                </Typography>
              </div>
            </Popover>
          </div>

          <Typography variant="body2">
            {experience && experience.organisation}
          </Typography>

          <Typography variant="body2" style={{ color: "#9B9B9B" }}>
            {experience &&
              formatDate(experience.start_date) +
                " to " +
                formatDate(experience.end_date)}
          </Typography>
        </div>
        <div>
          <Typography variant="body2">
            {experience && experience.description}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
