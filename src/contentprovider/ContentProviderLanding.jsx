import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { Button, ListItem, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  oot: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
}));

const ContentProviderLanding = () => {
  const classes = useStyles();

  const contentProviderNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button>Test</Button>
        </Link>
        <Link to="/member" style={{ textDecoration: "none" }}>
          {/* <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Members
          </Typography> */}
          <Button style={{ textTransform: "none" }}>Members</Button>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/industry" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Industry Partners
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          component={Link}
          to="/"
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Join Codeine
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Navbar navbarItems={contentProviderNavbar} />
    </div>
  );
};

export default ContentProviderLanding;
