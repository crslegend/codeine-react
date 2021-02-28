import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import background from "../../assets/background.jpg";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "50px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "20px",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "0px",
    },
  },
  heading: {
    color: "#437FC7",

    display: "inline-block",
  },
  cardroot: {
    marginTop: "3vh",
  },
  cardmedia: {
    height: 0,
    paddingTop: "56.25%",
  },
  link: {
    textDecoration: "none",
    fontWeight: 600,
    color: "#636363",
    align: "right",
    fontSize: "20px",
    "&:hover": {
      color: "#164D8F",
    },
  },
}));

const RecentProjects = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            RECENTLY LAUNCHED PROJECTS
          </Typography>
          <div
            style={{
              lineHeight: "35px",
              float: "right",
            }}
          >
            <Link to="/" className={classes.link}>
              VIEW ALL PROJECTS
            </Link>
          </div>
          <Grid
            container
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={3}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={background}
                  title="Course thumbnail"
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of project
                  </Typography>
                  <Typography variant="h5">Industry Partner</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={background}
                  title="Course thumbnail"
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of project
                  </Typography>
                  <Typography variant="h5">Industry Partner</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={background}
                  title="Course thumbnail"
                />
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of project
                  </Typography>
                  <Typography variant="h5">Industry Partner</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default RecentProjects;
