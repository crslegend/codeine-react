import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Tooltip } from "@material-ui/core";

const styles = makeStyles((theme) => ({
  root: {
    width: "35px",
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
    } else if (label === "PY") {
      return "#3675A9";
    } else if (label === "CPP") {
      return "#004482";
    } else if (label === "RUBY") {
      return "#CC0000";
    } else if (label === "JAVA") {
      return "#E57001";
    } else if (label === "JS") {
      return "#F3BF04";
    } else if (label === "CS") {
      return "#6A1577";
    } else if (label === "CSS") {
      return "#264DE4";
    } else if (label === "HTML") {
      return "#E44D26";
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
    } else if (label === "PY") {
      return "Python";
    } else if (label === "CPP") {
      return "C++";
    } else if (label === "JAVA") {
      return "Java";
    } else if (label === "JS") {
      return "Javascript";
    } else if (label === "RUBY") {
      return "Ruby";
    } else if (label === "CS") {
      return "C#";
    } else if (label === "CSS") {
      return "CSS";
    } else if (label === "HTML") {
      return "HTML";
    }
  };

  return (
    <Tooltip title={getTitle()}>
      <label>
        <Typography
          variant="subtitle1"
          className={classes.root}
          style={{
            backgroundColor: getColor(),
          }}
        >
          {label}
        </Typography>
      </label>
    </Tooltip>
  );
};

export default Label;
