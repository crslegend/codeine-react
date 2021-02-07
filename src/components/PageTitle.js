import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    height: "80px",
  },
  title: {
    fontWeight: "bold",
  },
}));

const PageTitle = ({ title, style }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={{ ...style }}>
      <Typography variant="h1" className={classes.title}>
        {title}
      </Typography>
    </div>
  );
};

export default PageTitle;
