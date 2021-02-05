import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import {
  Button,
  ListItem,
  Typography,
  TextField,
  Grid,
} from "@material-ui/core";

import Footer from "./Footer";
import headerbarimg from "../../assets/industryimage.png";
import logo from "../../assets/industrycodeinewhitelogo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  headerBarBackground: {
    marginTop: "65px",
    height: "580px",
    backgroundColor: "#397B9C",
    backgroundImage: `url(${headerbarimg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "690px",
    backgroundPosition: "200px 10px",
  },
  headerBarText: {
    color: "white",
    paddingRight: theme.spacing(5),
  },
  form: {
    minHeight: "55vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  list: {
    display: "flex",
    flexDirection: "row",
    color: "#fff",
  },
}));

const IndustryLanding = () => {
  const classes = useStyles();

  const industryNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Members
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/content-provider" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Content Providers
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="outlined"
          component={Link}
          to="/"
          style={{
            backgroundColor: "transparent",
            borderColor: "#fff",
            textTransform: "capitalize",
          }}
        >
          <Typography
            variant="h6"
            style={{
              fontSize: "15px",
              color: "#fff",
            }}
          >
            Log In
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} alt="codeine" height="35px" />
      </Link>
    </Fragment>
  );

  const IndustryPage = () => (
    <Fragment>
      <Grid container className={classes.headerBarBackground}>
        <Grid xs={12}>
          <Grid container justify="flex-end">
            <Grid xs={6}>
              <Typography
                variant="h1"
                className={classes.headerBarText}
                style={{ paddingTop: "90px" }}
              >
                <strong>
                  Find the perfect freelance services for your business.
                </strong>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Grid container justify="flex-end">
            <Grid xs={4}>
              <Typography
                variant="h2"
                className={classes.headerBarText}
                align="right"
              >
                Find the talent needed to get your business growing.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid xs={12}>
          <Grid container justify="flex-start">
            <Grid xs={4} alignItems="baseline"s>
              <Typography variant="h6" align="right" color="#fff">
                Emma, Software developer
              </Typography>
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
      <Grid container>
        <Grid container justify="center" style={{ marginTop: "10vh" }}>
          <Grid xs={4}>
            <form className={classes.form} noValidate autoComplete="off">
              <div>
                <TextField
                  margin="normal"
                  id="firstname"
                  label="First Name"
                  name="FirstName"
                  autoComplete="FirstName"
                  required
                  fullWidth
                  // value={loginDetails.email}
                  // error={emailError}
                />
              </div>
              <div>
                <TextField
                  margin="normal"
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  autoComplete="lastname"
                  required
                  fullWidth
                />
              </div>
              <div>
                <TextField
                  margin="normal"
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  required
                  fullWidth
                />
              </div>

              <div>
                <TextField
                  margin="normal"
                  id="companyname"
                  label="Company Name"
                  name="companyname"
                  autoComplete="companyname"
                  required
                  fullWidth
                />
              </div>

              <div>
                <TextField
                  margin="normal"
                  id="contactnumber"
                  label="Contact Number"
                  name="contactnumber"
                  autoComplete="contactnumber"
                  required
                  fullWidth
                />
              </div>

              <Button
                style={{
                  backgroundColor: "#437FC7",
                  textTransform: "capitalize",
                  justify: "center",
                  marginTop: "5vh",
                }}
              >
                <Typography variant="h6" style={{ color: "#fff" }}>
                  Get in Touch
                </Typography>
              </Button>
            </form>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Navbar logo={navLogo} navbarItems={industryNavbar} bgColor="#397B9C" />
      <IndustryPage />
      <Footer />
    </div>
  );
};

export default IndustryLanding;
