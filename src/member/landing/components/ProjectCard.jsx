import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Grid,
  Avatar,
  CardContent,
  CardActionArea,
} from "@material-ui/core";
import Label from "./Label";
import { Link } from "react-router-dom";

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
  orgavatar: {
    objectFit: "contain",
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
      return newDate;
    }
    return "";
  };

  return (
    <Card elevation={0} className={classes.root}>
      <Link
        style={{ height: "100%" }}
        to={`/industryprojects/${project && project.id}`}
        component={CardActionArea}
      >
        <CardActionArea>
          <Grid container>
            <Grid item xs={1}>
              <Avatar
                className={classes.cardmedia}
                src={project.partner.partner.organization.organization_photo}
                title="Organisation Photo"
                classes={{
                  img: classes.orgavatar,
                }}
              />
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
                    {project && project.title}
                  </Typography>
                  <Typography variant="h6">
                    {project &&
                      formatDate(project.start_date) +
                        " to " +
                        formatDate(project.end_date)}
                  </Typography>
                </div>
                <Typography variant="h6">
                  {project &&
                    project.partner.partner.organization.organization_name}
                </Typography>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    {project &&
                      project.categories.map((category) => (
                        <Label label={category} />
                      ))}
                    {console.log(project)}
                  </div>

                  <Typography
                    style={{
                      color: "#921515",
                    }}
                    variant="h6"
                  >
                    apply by{" "}
                    {project && formatDate(project.application_deadline)}
                  </Typography>
                </div>
              </CardContent>
            </Grid>
          </Grid>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default ProjectCard;
