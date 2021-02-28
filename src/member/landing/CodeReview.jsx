import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";

import CodeReviewLabel from "./components/CodeReviewLabel";
import CodeReviewSnippet from "./components/CodeReviewSnippet";

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
    width: "80%",
    borderRadius: 0,
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
  },
  link: {
    textDecoration: "none",
    fontWeight: 600,
    color: "#437FC7",
    align: "right",
    fontSize: "24px",
  },
}));

const CodeReview = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h1" className={classes.heading}>
            FEATURED
          </Typography>
          <Typography
            variant="h1"
            style={{ display: "inline-block" }}
            className={classes.heading}
          >
            CODE REVIEWS
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
              CODE REVIEWS
            </Link>
          </div>
          <Grid container>
            <Grid item xs={4}>
              <CodeReviewSnippet
                code="char[] helloArray = { 'h', 'e', 'l', 'l', 'o', '.' };
              String helloString = new String(helloArray);
              System.out.println(helloString);"
              />
              <Card className={classes.cardroot}>
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of code review
                  </Typography>
                  <Typography variant="h5">Author</Typography>
                  <Grid
                    container
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#8B95DD" label="Bugs" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#DDD58B" label="Design" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#DD8B8B" label="Runtime" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#A0DD8B" label="Syntax" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <CodeReviewSnippet
                code="char[] helloArray = { 'h', 'e', 'l', 'l', 'o', '.' };
              String helloString = new String(helloArray);
              System.out.println(helloString);"
              />
              <Card className={classes.cardroot}>
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of code review
                  </Typography>
                  <Typography variant="h5">Author</Typography>
                  <Grid
                    container
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#8B95DD" label="Bugs" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#DDD58B" label="Design" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#DD8B8B" label="Runtime" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#A0DD8B" label="Syntax" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <CodeReviewSnippet
                code="char[] helloArray = { 'h', 'e', 'l', 'l', 'o', '.' };
              String helloString = new String(helloArray);
              System.out.println(helloString);"
              />
              <Card className={classes.cardroot}>
                <CardContent>
                  <Typography
                    variant="h4"
                    style={{
                      fontWeight: "600",
                    }}
                  >
                    Title of code review
                  </Typography>
                  <Typography variant="h5">Author</Typography>
                  <Grid
                    container
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#8B95DD" label="Bugs" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#DDD58B" label="Design" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#DD8B8B" label="Runtime" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <CodeReviewLabel color="#A0DD8B" label="Syntax" />
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

export default CodeReview;
