import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent, Divider, CardActionArea } from "@material-ui/core";
import hljs from "highlight.js";

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
  codePreview: {
    height: "160px",
    padding: theme.spacing(1),
    opacity: 0.7,
    overflow: "hidden",
  },
  codeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 0),
    display: "flex",
    overflow: "hidden",
    fontSize: "16px",
  },
}));

const CodeReviewCard = (props) => {
  const classes = styles();
  const { codeReview } = props;

  return (
    <Card elevation={0} className={classes.root}>
      <CardActionArea style={{ height: "100%" }} href={`/codereview/${codeReview && codeReview.id}`}>
        <CardContent
          style={{
            height: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div className={classes.codePreview}>
              {codeReview &&
                codeReview.code
                  .split("\n")
                  .slice(0, 6)
                  .map((line, i) => (
                    <div key={i} className={classes.codeBody}>
                      <pre style={{ margin: 0 }}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: hljs.highlightAuto(line, [codeReview.coding_languages[0]]).value,
                          }}
                        />
                      </pre>
                    </div>
                  ))}
            </div>
            <Divider
              style={{
                height: "1.5px",
                margin: "20px 2px",
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
              {codeReview.user && codeReview.user.first_name + " " + codeReview.user.last_name}
            </Typography>
          </div>
          <div style={{ display: "flex", margin: "10px 0" }}>
            {codeReview && codeReview.categories.map((category) => <Label label={category} />)}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CodeReviewCard;
