import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    paddingTop: "50px",
    paddingBottom: "50px",

    paddingLeft: theme.spacing(15),
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "20px",
    flexGrow: 1,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "20px",
    flexGrow: 1,
  },
  footerLink: {
    color: "#4B4B4B",
    textDecoration: "none",
    marginBottom: "10px",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.leftCol}>
        <Link to="/" className={classes.footerLink}>
          Members
        </Link>
        <Link to="/" className={classes.footerLink}>
          Conent Providers
        </Link>
        <Link to="/" className={classes.footerLink}>
          Industry Partners
        </Link>
      </div>
      <div className={classes.rightCol}>
        <Link to="/" className={classes.footerLink}>
          Articles
        </Link>
        <Link to="/" className={classes.footerLink}>
          Help & Support
        </Link>
      </div>
    </div>
  );
};

export default Footer;
