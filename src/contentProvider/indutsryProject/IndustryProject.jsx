import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import { Add, MoreVert, NoteAdd } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const IndustryProject = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <PageTitle title="My Industry Project" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          component={Link}
        >
          Create New Industry Project
        </Button>
      </div>
    </Fragment>
  );
};
export default IndustryProject;
