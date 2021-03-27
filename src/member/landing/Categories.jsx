import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardMedia, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import courses from "../../assets/courses_asset.png";
import codeReviews from "../../assets/code_review_asset.png";
import articles from "../../assets/articles_asset.png";
import projects from "../../assets/industry_project_asset.png";

const styles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    maxWidth: "100",
  },
  cardroot: {
    borderRadius: 0,
    maxHeight: "330px",
    display: "flex",
    alignItems: "center",
    width: "25%",
  },
  cardmedia: {
    width: "100%",
    height: "100%",
  },
  cardcontent: {
    color: "#FFFFFF",
    fontFamily: "Roboto Mono",
    marginTop: "35%",
    marginLeft: "5%",
  },
}));

const Categories = () => {
  const classes = styles();

  return (
    <Fragment>
      <div className={classes.container}>
        <Card className={classes.cardroot}>
          <CardMedia
            className={classes.cardmedia}
            image={courses}
            title="Courses"
          >
            <Typography variant="h2" className={classes.cardcontent}>
              courses
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/courses"
              style={{
                borderColor: "#FFFFFF",
                textTransform: "none",
                margin: "3% 0 15% 5%",
                padding: "8px 10px",
              }}
            >
              <Typography
                variant="h4"
                style={{ color: "#fff", fontFamily: "Roboto Mono" }}
              >
                view more
              </Typography>
            </Button>
          </CardMedia>
        </Card>
        <Card className={classes.cardroot}>
          <CardMedia
            className={classes.cardmedia}
            image={codeReviews}
            title="Code Reviews"
          >
            <Typography variant="h2" className={classes.cardcontent}>
              code reviews
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/codereview"
              style={{
                borderColor: "#fff",
                textTransform: "none",
                margin: "3% 0 15% 5%",
                padding: "8px 10px",
              }}
            >
              <Typography
                variant="h4"
                style={{ color: "#fff", fontFamily: "Roboto Mono" }}
              >
                view more
              </Typography>
            </Button>
          </CardMedia>
        </Card>
        <Card className={classes.cardroot}>
          <CardMedia
            className={classes.cardmedia}
            image={articles}
            title="Articles"
          >
            <Typography variant="h2" className={classes.cardcontent}>
              articles
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              to="/viewarticles"
              style={{
                borderColor: "#fff",
                textTransform: "none",
                margin: "3% 0 15% 5%",
                padding: "8px 10px",
              }}
            >
              <Typography
                variant="h4"
                style={{ color: "#fff", fontFamily: "Roboto Mono" }}
              >
                view more
              </Typography>
            </Button>
          </CardMedia>
        </Card>
        <Card className={classes.cardroot}>
          <CardMedia
            className={classes.cardmedia}
            image={projects}
            title="Industry Projects"
          >
            <Typography variant="h2" className={classes.cardcontent}>
              industry projects
            </Typography>
            <Button
              variant="outlined"
              component={Link}
              //to="/"
              style={{
                borderColor: "#fff",
                textTransform: "none",
                margin: "3% 0 15% 5%",
                padding: "8px 10px",
              }}
            >
              <Typography
                variant="h4"
                style={{ color: "#fff", fontFamily: "Roboto Mono" }}
              >
                view more
              </Typography>
            </Button>
          </CardMedia>
        </Card>
      </div>
    </Fragment>
  );
};

export default Categories;
