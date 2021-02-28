import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { Link } from "react-router-dom";

import background from "../../assets/background.jpg";

const styles = makeStyles((theme) => ({
  root: {
    paddingTop: "60px",
    maxWidth: "100vw",
    paddingLeft: "30px",
    paddingBottom: "10px",
    [theme.breakpoints.down("xs")]: {
      paddingTop: "160px",
      paddingLeft: "0px",
    },
  },
  heading: {
    color: "#437FC7",
    lineHeight: "50px",
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

const FeaturedCourses = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            FEATURED COURSES
          </Typography>

          <div
            style={{
              lineHeight: "45px",
              float: "right",
            }}
          >
            <Link to="/courses" className={classes.link}>
              VIEW ALL COURSES
            </Link>
          </div>
          <Grid
            container
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
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
                    variant="h5"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of course
                  </Typography>
                  <Typography variant="h6">Content Provider</Typography>
                  <Grid
                    container
                    style={{
                      marginTop: "1vh",
                    }}
                  >
                    <Grid item xs={12} lg={8}>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Rating
                          name="read-only"
                          value={parseFloat("3.5")}
                          precision={0.1}
                          readOnly
                        />
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: "600",
                            marginTop: "2px",
                            color: "#F8B83C",
                            marginLeft: "1vw",
                          }}
                        >
                          3.5
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography
                        variant="body2"
                        style={{
                          marginTop: "2px",
                          color: "#9B9B9B",
                          float: "right",
                        }}
                      >
                        125 enrolled
                      </Typography>
                    </Grid>
                  </Grid>
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
                    variant="h5"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of course
                  </Typography>
                  <Typography variant="h6">Content Provider</Typography>
                  <Grid
                    container
                    style={{
                      marginTop: "1vh",
                    }}
                  >
                    <Grid item xs={12} lg={8}>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Rating
                          name="read-only"
                          value={parseFloat("4.5")}
                          precision={0.1}
                          readOnly
                        />
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: "600",
                            marginTop: "2px",
                            color: "#F8B83C",
                            marginLeft: "1vw",
                          }}
                        >
                          4.5
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography
                        variant="body2"
                        style={{
                          marginTop: "2px",
                          color: "#9B9B9B",
                          float: "right",
                        }}
                      >
                        125 enrolled
                      </Typography>
                    </Grid>
                  </Grid>
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
                <CardContent height="150" width="150">
                  <Typography
                    variant="h5"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of course
                  </Typography>
                  <Typography variant="h6">Content Provider</Typography>
                  <Grid
                    container
                    style={{
                      marginTop: "1vh",
                    }}
                  >
                    <Grid item xs={12} lg={8}>
                      <div
                        style={{
                          display: "flex",
                        }}
                      >
                        <Rating
                          name="read-only"
                          value={parseFloat("3.5")}
                          precision={0.1}
                          readOnly
                        />
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: "600",
                            marginTop: "2px",
                            color: "#F8B83C",
                            marginLeft: "1vw",
                          }}
                        >
                          3.5
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4}>
                      <Typography
                        variant="body2"
                        style={{
                          marginTop: "2px",
                          color: "#9B9B9B",
                          float: "right",
                        }}
                      >
                        125 enrolled
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

export default FeaturedCourses;
