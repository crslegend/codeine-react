import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Button, ListItem, Typography } from "@material-ui/core";
import FirstSection from "./components/FirstSection";
import SecondSection from "./components/SecondSection";
import ThirdSection from "./components/ThirdSection";
import FourthSection from "./components/FourthSection";
import Footer from "./components/Footer";
import logo from "../../assets/CodeineLogos/Partner.svg";

const useStyles = makeStyles((theme) => ({
  root: {
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
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Members
          </Typography>
        </Link>
      </ListItem>
      {/* <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/industry" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Partners for Enterprise
          </Typography>
        </Link>
      </ListItem> */}
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/partner/login" style={{ textDecoration: "none" }}>
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
          to="/partner/register"
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

  const navLogo = (
    <Fragment>
      <Link
        to="/partner"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="140%" alt="codeine partner navbar logo" />
      </Link>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Navbar
        logo={navLogo}
        bgColor="#fff"
        navbarItems={contentProviderNavbar}
      />
      <FirstSection />
      <SecondSection />
      <ThirdSection />
      <div style={{ backgroundColor: "#fff", height: 50 }} />
      <FourthSection />
      <Footer />
    </div>
  );
};

export default ContentProviderLanding;
