import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CLogo from "../../assets/codeineLogos/C.svg";
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
            color: "#b0b0b0",
            padding: "10px",
            paddingTop: "0px",
          }}
        >
          {number}
        </Typography>
        <div style={{ flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Avatar
              src={
                article.user.is_admin && !article.user.profile_photo
                  ? CLogo
                  : article.user.profile_photo
              }
              alt=""
              style={{
                height: "18px",
                width: "18px",
                marginRight: "5px",
                border:
                  article.user &&
                  article.user.member &&
                  article.user.member.membership_tier === "PRO"
                    ? "3px solid green"
                    : "",
              }}
            ></Avatar>
            {article.user.is_admin &&
            article.user.first_name === null &&
            article.user.last_name === null
              ? "Codeine Admin"
              : article.user.first_name + " " + article.user.last_name}
          </div>

          <Typography
            onClick={() => {
              if (setLoggedIn) {
                if (userType === "admin") {
                  history.push(`/article/admin/${article.id}`);
                } else if (userType === "member") {
                  history.push(`/article/member/${article.id}`);
                } else if (userType === "partner") {
                  history.push(`/article/partner/${article.id}`);
                } else if (userType === "guest") {
                  history.push(`/article/guest/${article.id}`);
                }
              } else {
                history.push(`/article/guest/${article.id}`);
              }
            }}
            style={{ fontWeight: 600, fontSize: "18px", cursor: "pointer" }}
          >
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
