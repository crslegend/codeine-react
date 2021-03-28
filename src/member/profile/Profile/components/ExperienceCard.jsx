import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";

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
}));

const ExperienceCard = (props) => {
  const classes = styles();
  const { experience } = props;

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
                fontWeight: 600,
                display: "inline-block",
              }}
              variant="body1"
            >
              {experience && experience.title}
            </Typography>
            <Typography
              style={{
                display: "inline-block",
              }}
              variant="body1"
            >
              , {experience && experience.organisation}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
