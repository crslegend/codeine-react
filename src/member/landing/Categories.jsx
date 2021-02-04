import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";

import backend from "../../assets/backend.png";
import frontend from "../../assets/frontend.png";
import uiux from "../../assets/uiux.png";
import database from "../../assets/database.png";
import security from "../../assets/security.png";

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
  },
  cardmedia: {
    height: 0,
    paddingTop: "56.25%",
  },
}));

const Categories = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h1" className={classes.heading}>
            CATEGORIES
          </Typography>
          <Grid
            container
            style={{
              justifyContent: "space-between",
            }}
          >
            <Grid item xs={5} lg={2}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={backend}
                  title="Backend"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    style={{
                      color: "#4B4B4B",
                    }}
                  >
                    Backend
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={5} lg={2}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={frontend}
                  title="frontend"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    style={{
                      color: "#4B4B4B",
                    }}
                  >
                    Frontend
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={5} lg={2}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={uiux}
                  title="UI UX"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    style={{
                      color: "#4B4B4B",
                    }}
                  >
                    UI/UX
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={5} lg={2}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={database}
                  title="database"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    style={{
                      color: "#4B4B4B",
                    }}
                  >
                    Database
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={5} lg={2}>
              <Card className={classes.cardroot}>
                <CardMedia
                  className={classes.cardmedia}
                  image={security}
                  title="security"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    style={{
                      color: "#4B4B4B",
                    }}
                  >
                    Security
                  </Typography>
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

export default Categories;
