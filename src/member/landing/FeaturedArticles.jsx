import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";

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
    lineHeight: "50px",
    display: "inline-block",
  },
  cardroot: {
    backgroundColor: "transparent",
    marginTop: "3vh",
  },
  cardheading: {
    fontSize: "64px",
    color: "#CECECE",
    marginLeft: "1px",
    lineHeight: "60px",
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

const FeaturedArticles = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            FEATURED ARTICLES
          </Typography>
          <div
            style={{
              lineHeight: "48px",
              float: "right",
            }}
          >
            <Link to="/" className={classes.link}>
              VIEW ALL ARTICLES
            </Link>
          </div>
          <Grid
            container
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={3}>
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
            <Grid item xs={3}>
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
            <Grid item xs={3}>
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
