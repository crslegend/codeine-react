import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import { useParams, useHistory } from "react-router-dom";
import components from "./components/NavbarComponents";
import { Grid, IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Toast from "../../components/Toast.js";
import Cookies from "js-cookie";
import Service from "../../AxiosService";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  mainSection: {
    paddingTop: "65px",
    marginTop: "40px",
    minHeight: "calc(100vh - 10px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(10),
  },
}));

const BookConsult = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();
  console.log(id);

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Navbar
        logo={components.navLogo}
        bgColor="#fff"
        navbarItems={components.loggedInNavbar(() => {
          Service.removeCredentials();
          setLoggedIn(false);
          history.push("/");
        })}
      />
      <Grid container className={classes.mainSection}>
        <Grid item xs={1}>
          <IconButton
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={() => history.goBack()}
          >
            <ArrowBack />
          </IconButton>
        </Grid>
        <Grid item xs={10}>
          HELLO
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  );
};

export default BookConsult;
