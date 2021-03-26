import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Tooltip } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    width: "30px",
    height: "23px",
    marginRight: "10px",
    fontFamily: "Roboto Mono",
    fontWeight: 600,
    textAlign: "center",
    borderRadius: "5px",
  },
}));

const Label = (props) => {
  const classes = styles();
  const { label } = props;

  const getColor = () => {
    if (label === "DB") {
      return "#8B95DD";
    } else if (label === "BE") {
      return "#A0DD8B";
    } else if (label === "FE") {
      return "#DD8B8B";
    } else if (label === "SEC") {
      return "#DDB28B";
    } else if (label === "UI") {
      return "#DDD58B";
    } else if (label === "ML") {
      return "#8BD8DD";
    }
  };

  const getTitle = () => {
    if (label === "DB") {
      return "Database Administration";
    } else if (label === "BE") {
      return "Backend";
    } else if (label === "FE") {
      return "Frontend";
    } else if (label === "SEC") {
      return "Security";
    } else if (label === "UI") {
      return "UI/UX";
    } else if (label === "ML") {
      return "Machine Learning";
    }
  };

  return (
    <Tooltip title={getTitle()}>
      <Typography
        variant="subtitle1"
        className={classes.root}
        style={{
          backgroundColor: getColor(),
        }}
      >
        {label}
      </Typography>
    </Tooltip>
  );
};

export default Label;
