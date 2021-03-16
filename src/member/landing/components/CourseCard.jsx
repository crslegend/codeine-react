import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardActionArea, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import Label from "./Label";

const styles = makeStyles((theme) => ({
  root: {
    width: "25vw",
    padding: "10px 10px",
    marginTop: "30px",
    marginRight: "50px",
    border: "1px solid",
    borderRadius: 0,
  },
  pro: {
    fontFamily: "Roboto Mono",
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
}));

const CourseCard = (props) => {
  const classes = styles();
  const { course } = props;

  return (
    <Card elevation={0} className={classes.root}>
      <Link style={{ height: "100%" }} to={`/courses/${course && course.id}`} component={CardActionArea}>
        <CardContent
          style={{ height: "inherit", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
        >
          <div>
            {course && course.pro === true ? (
              <div style={{ height: "25px" }}>
                <Typography variant="subtitle1" className={classes.pro}>
                  PRO
                </Typography>
              </div>
            ) : (
              <div style={{ marginTop: "25px" }}></div>
            )}

            <Typography
              style={{
                fontFamily: "Roboto Mono",
                fontWeight: 600,
              }}
              variant="h5"
            >
              {course && course.title}
            </Typography>
            <Typography
              variant="h6"
              style={{
                paddingBottom: "50px",
                fontFamily: "Roboto Mono",
                fontWeight: 600,
              }}
            >
              {course && course.partner.first_name + " " + course.partner.last_name}
            </Typography>
          </div>
          <div>
            <Typography variant="body1" style={{ fontFamily: "Roboto Mono", fontWeight: 600 }}>
              duration: 16h
            </Typography>
            <Typography variant="body1" style={{ fontFamily: "Roboto Mono", fontWeight: 600 }}>
              exp points: {course && course.exp_points}p
            </Typography>
            <div style={{ display: "flex", margin: "10px 0" }}>
              {course && course.categories.map((category) => <Label label={category} />)}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CourseCard;