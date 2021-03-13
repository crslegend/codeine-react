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
    height: "20vh",
    width: "22vw",
    marginTop: "3vh",
    marginRight: "20px",
    borderRadius: 0,
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
  console.log(codeReview);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography variant="h6" className={classes.snippets}>
            {codeReview && codeReview.code}
          </Typography>
          <Divider
            style={{
              height: "1.5px",
              margin: "10px 0",
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
            {codeReview &&
              codeReview.member.first_name + " " + codeReview.member.last_name}
          </Typography>
          <div style={{ display: "flex", margin: "10px 0" }}>
            {/*codeReview &&
              codeReview.categories.map((category) => (
                <Label label={category} />
              ))*/}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CodeReviewCard;
