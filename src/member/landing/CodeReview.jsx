import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Card, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";

import Label from "./components/Label";
import CodeReviewSnippet from "./components/CodeReviewSnippet";

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
    borderRadius: 0,
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

const CodeReview = () => {
  const classes = styles();

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h2" className={classes.heading}>
            FEATURED CODE REVIEWS
          </Typography>

          <div
            style={{
              lineHeight: "42px",
              float: "right",
            }}
          >
            <Link to="/" className={classes.link}>
              VIEW ALL CODE REVIEWS
            </Link>
          </div>
          <Grid
            container
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid item xs={3}>
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
                      <Label label="Bugs" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label label="Design" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label label="Runtime" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label label="Syntax" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
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
                      <Label label="Bugs" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label label="Design" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label label="Runtime" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label label="Syntax" />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={3}>
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
                      <Label color="#8B95DD" label="Bugs" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label color="#DDD58B" label="Design" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label color="#DD8B8B" label="Runtime" />
                    </Grid>
                    <Grid item md={6} lg={4}>
                      <Label color="#A0DD8B" label="Syntax" />
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
