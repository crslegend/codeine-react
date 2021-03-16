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
import Label from "./Label";

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

const ProjectCard = (props) => {
  const classes = styles();
  const { project } = props;

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
      <CardActionArea>
        <Grid container>
          <Grid item xs={1}>
            <CardMedia
              className={classes.cardmedia}
              image={project.partner.partner.organization.organization_photo}
              title="Organisation Photo"
            ></CardMedia>
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
                    fontFamily: "Roboto Mono",
                    fontWeight: 600,
                  }}
                  variant="h5"
                >
                  {project && project.title}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                  }}
                  variant="h6"
                >
                  {project &&
                    formatDate(project.start_date) +
                      " to " +
                      formatDate(project.end_date)}
                </Typography>
              </div>
              <Typography
                style={{
                  fontFamily: "Roboto Mono",
                }}
                variant="h6"
              >
                {project &&
                  project.partner.partner.organization.organization_name}
              </Typography>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/*project &&
                  project.categories.map((category) => (
                    <Label label={category} />
                  ))*/}

                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    color: "#921515",
                  }}
                  variant="h6"
                >
                  apply by {project && formatDate(project.application_deadline)}
                </Typography>
              </div>
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;
