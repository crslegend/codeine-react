import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import More from "@material-ui/icons/MoreVert";
import { Typography, Card, CardContent, Popover } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "130px",
    marginBottom: "30px",
    border: "1px solid #C4C4C4",
    borderRadius: 0,
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    margin: "-20px -20px 5px",
    padding: "8px 20px",
  },
  typography: {
    padding: theme.spacing(2),
    cursor: "pointer",
    "&:hover": {
      color: "#000000",
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
  } = props;

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

  const handleDeleteCV = () => {};

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
          <div>
            <Typography
              style={{
                fontWeight: 700,
              }}
              variant="body1"
            >
              {experience && experience.organisation}
            </Typography>
            <Typography variant="body1">
              {experience && experience.title}
            </Typography>
          </div>
          <Typography variant="body1">
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
          <More onClick={(e) => handleClick(e, experience.id)} />
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
            <Typography
              variant="body2"
              className={classes.typography}
              onClick={() => {
                setCVDetail(experience);
                setCVDialogState(true);
                setEditingCV(true);
              }}
            >
              Edit this reponse
            </Typography>
            <Typography
              variant="body2"
              className={classes.typography}
              onClick={() => {
                setDeleteDialogState(true);
              }}
            >
              Delete
            </Typography>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
