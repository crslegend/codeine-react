import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";

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
    fontSize: "42px",
    lineHeight: "50px",
    [theme.breakpoints.down("sm")]: {
      fontSize: "32px",
    },
  },
  cardroot: {
    backgroundColor: "transparent",
    marginTop: "6vh",
    width: "80%",
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  cardheading: {
    fontSize: "64px",
    color: "#CECECE",
    marginLeft: "1vw",
    lineHeight: "60px",
  },
}));

const FeaturedArticles = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography className={classes.heading}>FEATURED</Typography>
          <Typography className={classes.heading}>ARTICLES</Typography>
          <Grid container>
            <Grid item xs={4}>
              <Card elevation={0} className={classes.cardroot}>
                <CardContent>
                  <Grid container>
                    <Grid item xs={12} lg={4}>
                      <Typography className={classes.cardheading}>
                        01
                      </Typography>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <Typography variant="h5">Author</Typography>
                      <Typography
                        variant="h4"
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Title of article
                      </Typography>
                      <Typography
                        variant="h5"
                        style={{
                          color: "#9B9B9B",
                        }}
                      >
                        28 Jan 2021 | category
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card elevation={0} className={classes.cardroot}>
                <CardContent>
                  <Grid container>
                    <Grid item xs={12} lg={4}>
                      <Typography className={classes.cardheading}>
                        02
                      </Typography>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <Typography variant="h5">Author</Typography>
                      <Typography
                        variant="h4"
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Title of article
                      </Typography>
                      <Typography
                        variant="h5"
                        style={{
                          color: "#9B9B9B",
                        }}
                      >
                        28 Jan 2021 | category
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card elevation={0} className={classes.cardroot}>
                <CardContent>
                  <Grid container>
                    <Grid item xs={12} lg={4}>
                      <Typography className={classes.cardheading}>
                        03
                      </Typography>
                    </Grid>
                    <Grid item xs={12} lg={8}>
                      <Typography variant="h5">Author</Typography>
                      <Typography
                        variant="h4"
                        style={{
                          fontWeight: "600",
                        }}
                      >
                        Title of article
                      </Typography>
                      <Typography
                        variant="h5"
                        style={{
                          color: "#9B9B9B",
                        }}
                      >
                        28 Jan 2021 | category
                      </Typography>
                    </Grid>
                  </Grid>
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

export default FeaturedArticles;
