import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Grid,
  CardMedia,
  CardContent,
  CardActionArea,
} from "@material-ui/core";
import Label from "../../landing/components/Label";
import { Link, useHistory } from "react-router-dom";

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

const ApplicationCard = (props) => {
  const classes = styles();
  const { application } = props;

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
      <Grid container>
        <Grid item xs={1}>
          {application && (
            <CardMedia
              className={classes.cardmedia}
              image={
                application.industry_project.partner.partner.organization
                  .organization_photo
              }
              title="Organisation Photo"
            ></CardMedia>
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
              {/* <Typography variant="h6">
                {application &&
                  formatDate(application.start_date) +
                    " to " +
                    formatDate(application.end_date)}
              </Typography> */}
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
      </Grid>
    </Card>
  );
};

export default ApplicationCard;
