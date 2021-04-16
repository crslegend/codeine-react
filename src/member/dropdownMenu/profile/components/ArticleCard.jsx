import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Card, CardContent } from "@material-ui/core";
import { Link } from "react-router-dom";
import Label from "./Label";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: "30px",
    border: "1px solid #C4C4C4",
    borderRadius: 0,
  },
  title: {
    margin: "-20px -20px 5px",
    padding: "20px 20px",
  },
  link: {
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const ArticleCard = (props) => {
  const classes = styles();
  const { article } = props;

  console.log(article);

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
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Typography
          variant="subtitle1"
          style={{ color: "#444444", marginBottom: "5px" }}
        >
          last updated on {article && formatDate(article.date_edited)}
        </Typography>
        <div className={classes.title}>
          <Link className={classes.link} to={`/article/member/${article.id}`}>
            <Typography
              style={{
                fontWeight: 600,
              }}
              variant="h6"
            >
              {article && article.title}
            </Typography>
          </Link>
          <div style={{ display: "flex", marginTop: "10px" }}>
            {article &&
              article.categories.map((category) => <Label label={category} />)}
            {article &&
              article.coding_languages.map((language) => (
                <Label label={language} />
              ))}
          </div>
        </div>

        <div>
          <Typography variant="body2" style={{ display: "flex" }}>
            no
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
