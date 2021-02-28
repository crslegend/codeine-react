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
    paddingTop: "65px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "30px",
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "0px",
    },
  },
  heading: {
    color: "#437FC7",
    lineHeight: "50px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "32px",
    },
  },
  cardroot: {
    marginTop: "6vh",
    width: "80%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  cardmedia: {
    height: 0,
    paddingTop: "56.25%",
  },
  link: {
    textDecoration: "none",
    fontWeight: 600,
    color: "#437FC7",
    align: "right",
    fontSize: "24px",
  },
}));

const RecentProjects = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h1" className={classes.heading}>
            RECENTLY LAUNCHED
          </Typography>
          <Typography
            variant="h1"
            style={{ display: "inline-block" }}
            className={classes.heading}
          >
            PROJECTS
          </Typography>
          <div
            style={{
              display: "inline-block",
              float: "right",
              marginTop: "-25px",
            }}
          >
            <Link to="/" className={classes.link}>
              VIEW ALL
              <br />
              PROJECTS
            </Link>
          </div>
          <Grid container>
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
            <Grid item xs={4}>
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
