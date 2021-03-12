import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
} from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    backgroundColor: "transparent",
    marginTop: "50px",
    width: "350px",
  },
  heading: {
    fontFamily: "Roboto Mono",
    fontSize: "64px",
    color: "#CECECE",
    marginLeft: "1px",
    lineHeight: "60px",
  },
}));

const ArticleCard = () => {
  const classes = styles();

  return (
    <Card elevation={0} className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Grid container>
            <Grid item xs={12} lg={3}>
              <Typography className={classes.heading}>01</Typography>
            </Grid>
            <Grid item xs={12} lg={9}>
              <Typography
                variant="h6"
                style={{
                  fontFamily: "Roboto Mono",
                }}
              >
                Author
              </Typography>
              <Typography
                variant="h5"
                style={{
                  fontFamily: "Roboto Mono",
                  fontWeight: "600",
                }}
              >
                Title of article
              </Typography>
              <Typography
                variant="body2"
                style={{
                  fontFamily: "Roboto Mono",
                  color: "#9B9B9B",
                }}
              >
                28 Jan 2021 | category
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
