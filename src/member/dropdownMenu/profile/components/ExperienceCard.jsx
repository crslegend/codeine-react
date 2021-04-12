import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";

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
}));

const ExperienceCard = (props) => {
  const classes = styles();
  const { experience } = props;

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
          <Typography
            style={{
              fontWeight: 600,
            }}
            variant="body1"
          >
            {experience && experience.title}
          </Typography>
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
