import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

import logo from "../../assets/codeineLogos/MemberWhite.svg";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
    backgroundColor: "#437FC7",
    display: "flex",
    flexDirection: "row",
    paddingTop: "50px",
    paddingBottom: "50px",
    marginTop: "30px",
    paddingLeft: theme.spacing(15),
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "20px",
    fontSize: "16px",
    flexGrow: 1,
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    fontSize: "16px",
    paddingTop: "20px",
    flexGrow: 1,
  },
  footerLink: {
    color: "#FFFFFF",
    textDecoration: "none",
    marginBottom: "10px",
  },
  logo: {
    backgroundColor: "#437FC7",
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    paddingBottom: "30px",
    display: "flex-end",
  },
  copyright: {
    color: "#FFFFFF",
    float: "right",
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.leftCol}>
          <Link to="/" className={classes.footerLink}>
            Learn On Codeine
          </Link>
          <Link to="/partner" className={classes.footerLink}>
            Teach on Codeine
          </Link>
          {/* <Link to="/" className={classes.footerLink}>
            Partners for Enterprise
          </Link> */}
        </div>
        <div className={classes.rightCol}>
          <Link to="/viewarticles" className={classes.footerLink}>
            Articles
          </Link>
          <Link to="/" className={classes.footerLink}>
            Help & Support
          </Link>
        </div>
      </div>
      <div className={classes.logo}>
        <Link
          to="/"
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            width: 100,
          }}
        >
          <img src={logo} width="100px" alt="codeine-logo" />
        </Link>
        <Typography variant="body1" className={classes.copyright}>
          &copy; Codeine 2021
        </Typography>
      </div>
    </Fragment>
  );
};

export default Footer;
