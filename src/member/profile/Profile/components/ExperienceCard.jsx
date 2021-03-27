import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Grid,
  CardMedia,
  CardContent,
} from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    padding: "10px 10px",
    marginTop: "30px",
    border: "1px solid",
    borderRadius: 0,
  },
  cardmedia: {
    height: "100%",
    width: "7vw",
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
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  return (
    <Card elevation={0} className={classes.root}>
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Typography
                  style={{
                    fontWeight: 600,
                  }}
                  variant="h5"
                >
                  {experience && experience.title},
                </Typography>
                <Typography
                  style={{
                    fontWeight: 600,
                  }}
                  variant="h5"
                >
                  {experience && experience.organisation}
                </Typography>
              </div>

              <Typography variant="h6">
                {experience &&
                  formatDate(experience.start_date) +
                    " to " +
                    formatDate(experience.end_date)}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography> {experience && experience.description}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
