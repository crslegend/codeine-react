import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Button,
  Typography,
  Avatar,
  Badge,
  IconButton,
} from "@material-ui/core";
import MemberNavBar from "../../MemberNavBar";
import Cookies from "js-cookie";
import Service from "../../../AxiosService";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({}));

const PublicProfile = (props) => {
  const classes = useStyles();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  return (
    <Fragment>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </Fragment>
  );
};

export default PublicProfile;
