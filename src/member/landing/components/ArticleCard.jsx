import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
} from "@material-ui/core";
import Label from "./Label";

const styles = makeStyles((theme) => ({
  root: {
    marginTop: "50px",
    border: "1px solid",
    borderRadius: 0,
    width: "100%",
  },
  heading: {
    fontFamily: "Roboto Mono",
    fontSize: "64px",
    color: "#CECECE",
    marginLeft: "25px",
    lineHeight: "75px",
  },
}));

const ArticleCard = (props) => {
  const classes = styles();
  const { article, index } = props;
  console.log(article);

  let numbering = index + 1;
  if (numbering < 10) {
    numbering = "0" + numbering;
  }

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  return (
    <Card elevation={0} className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Grid container>
            <Grid item xs={1}>
              <Typography className={classes.heading}>{numbering}</Typography>
            </Grid>
            <Grid item xs={11}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  style={{
                    fontFamily: "Roboto Mono",
                  }}
                >
                  {article &&
                    article.member.first_name + " " + article.member.last_name}
                </Typography>
                <Typography
                  variant="body1"
                  style={{
                    fontFamily: "Roboto Mono",
                  }}
                >
                  last updated on {article && formatDate(article.date_edited)}
                </Typography>
              </div>
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Roboto Mono",
                  fontWeight: "600",
                }}
              >
                {article && article.title}
              </Typography>
              <div style={{ display: "flex", margin: "10px 0" }}>
                {article &&
                  article.categories.map((category) => (
                    <Label label={category} />
                  ))}
              </div>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
