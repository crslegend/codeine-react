import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  Grid,
  Avatar,
  CardContent,
  CardActionArea,
  Chip,
} from "@material-ui/core";
import green from "@material-ui/core/colors/green";
import Label from "./Label";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();

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
      <CardActionArea
        onClick={() =>
          history.push(`/industryprojects/${project && project.id}`)
        }
      >
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
                </div>

                {project && project.is_applied ? (
                  <Chip
                    label="Applied"
                    style={{ backgroundColor: green[600], color: "#FFF" }}
                  />
                ) : (
                  <Typography
                    style={{
                      color: "#921515",
                    }}
                    variant="h6"
                  >
                    apply by{" "}
                    {project && formatDate(project.application_deadline)}
                  </Typography>
                )}
              </div>
            </CardContent>
          </Grid>
        </Grid>
      </CardActionArea>
    </Card>
  );
};

export default ProjectCard;
