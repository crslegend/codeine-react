import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Card,
  CardContent,
  Divider,
  CardActionArea,
} from "@material-ui/core";
import Label from "./Label";

const styles = makeStyles((theme) => ({
  root: {
    width: "300px",
    marginTop: "30px",
    padding: "10px 10px",
    marginRight: "20px",
    borderRadius: 0,
    border: "1px solid",
  },
  snippets: {
    fontFamily: "Roboto Mono",
    textAlign: "center",
    lineHeight: "30px",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 3,
    overflow: "hidden",
  },
}));

const CodeReviewCard = (props) => {
  const classes = styles();
  const { codeReview } = props;

  return (
    <Card elevation={0} className={classes.root}>
      <CardActionArea style={{ height: "100%" }}>
        <CardContent
          style={{
            height: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Typography variant="body1" className={classes.snippets}>
              {codeReview && codeReview.code}
            </Typography>
            <Divider
              style={{
                height: "1.5px",
                margin: "20px 0",
              }}
            />

            <Typography
              variant="h5"
              style={{
                fontFamily: "Roboto Mono",
                fontWeight: "600",
              }}
            >
              {codeReview && codeReview.title}
            </Typography>

            <Typography
              variant="h6"
              style={{
                fontFamily: "Roboto Mono",
              }}
            >
              {codeReview.user &&
                codeReview.user.first_name + " " + codeReview.user.last_name}
            </Typography>
          </div>
          <div style={{ display: "flex", margin: "10px 0" }}>
            {codeReview &&
              codeReview.categories.map((category) => (
                <Label label={category} />
              ))}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CodeReviewCard;
