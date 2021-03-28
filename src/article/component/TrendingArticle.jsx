import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CLogo from "../../assets/CodeineLogos/C.svg";
import { Typography, Avatar } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

const TrendingArticle = (props) => {
  const classes = styles();
  const { number, article, setLoggedIn, userType, history } = props;

  const formatDate = (date) => {
    const options = {
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
    <div className={classes.root}>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <Typography
          style={{
            fontWeight: 800,
            fontSize: "30px",
            color: "rgba(230, 230, 230, 1)",
            padding: "10px",
            paddingTop: "0px",
          }}
        >
          {number}
        </Typography>
        <div
          style={{ flexDirection: "column", cursor: "pointer" }}
          onClick={() => {
            if (setLoggedIn) {
              if (userType === "admin") {
                history.push(`/article/admin/${article.id}`);
              } else if (userType === "member") {
                history.push(`/article/member/${article.id}`);
              } else if (userType === "partner") {
                history.push(`/article/partner/${article.id}`);
              }
            } else {
              history.push(`/article/guest/${article.id}`);
            }
          }}
        >
          <div style={{ display: "flex" }}>
            <Avatar
              src={
                article.user.is_admin && !article.user.profile_photo
                  ? CLogo
                  : article.user.profile_photo
              }
              alt=""
              style={{ height: "18px", width: "18px", marginRight: "5px" }}
            ></Avatar>
            {article.user.is_admin &&
            article.user.first_name === null &&
            article.user.last_name === null
              ? "Codeine Admin"
              : article.user.first_name + " " + article.user.last_name}
          </div>

          <Typography style={{ fontWeight: 600, fontSize: "18px" }}>
            {article.title}
          </Typography>
          <Typography style={{ fontSize: "12px", color: "#757575" }}>
            {formatDate(article.date_created)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default TrendingArticle;
