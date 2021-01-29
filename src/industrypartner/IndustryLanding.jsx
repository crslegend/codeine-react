import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  Button,
  ListItem,
  Typography,
  TextField,
  Grid,
  Box,
  AppBar,
  List,
  Toolbar,
} from "@material-ui/core";
import headerbarimg from "../assets/industryimage.png";
import codeinelogowhite from "../assets/industrycodeinewhitelogo.svg";
import codeinelogodefault from "../assets/industrycodeinedefaultlogo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  headerBarBackground: {
    height: "620px",
    backgroundColor: "#397B9C",
    backgroundImage: `url(${headerbarimg})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "690px",
  },
  headerBarText: {
    color: "white",
    paddingRight: theme.spacing(5),
    fontSize: "48px",
  },
  appBar: {
    backgroundColor: "#397B9C",
    position: "relative",
    zIndex: "unset",
  },
  toolbar: {
    minHeight: "65px",
    flex: "1",
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    flexWrap: "nowrap",
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
  },
  codeineLogo: {
    textDecoration: "none",
    color: "#fff",
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
        <Link to="/member" style={{ textDecoration: "none" }}>
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
          component={Link}
          to="/"
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Log In
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const IndustryPage = () => (
    <Fragment>
      <Grid container className={classes.headerBarBackground}>
        <Grid xs={12}>
          <Grid container justify="flex-end">
            <Grid xs={6}>
              <Typography className={classes.headerBarText} align="center">
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
                variant="h3"
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
        <Grid container justify="center">
          <Grid xs={4}>
            <form className={classes.root} noValidate autoComplete="off">
              <div>
                <TextField
                  margin="normal"
                  id="firstname"
                  label="First Name"
                  name="FirstName"
                  autoComplete="FirstName"
                  autoFocus
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
                  autoFocus
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
                  autoFocus
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
                  autoFocus
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
                  autoFocus
                  required
                  fullWidth
                />
              </div>

              <Button
                style={{
                  backgroundColor: "#437FC7",
                  textTransform: "capitalize",
                  justify: "center",
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
      <AppBar className={classes.appBar} elevation={0}>
        <Toolbar className={classes.toolbar}>
          <Link to="/" className={classes.codeineLogo}>
            <img
              src={codeinelogowhite}
              alt="codeine"
              style={{ height: "40px" }}
            />
          </Link>
          <List className={classes.list}>{industryNavbar}</List>
        </Toolbar>
      </AppBar>
      <IndustryPage />
    </div>
  );
};

export default IndustryLanding;
