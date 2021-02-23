import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Service from "../../AxiosService";
import PageTitle from "../../components/PageTitle";
import { Button } from "@material-ui/core";
import { Add } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  topSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    height: 35,
    "&:hover": {
      color: "#000",
    },
  },
}));

const ContributionsPage = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.topSection}>
        <PageTitle title={`Your Contributions`} />
        <Button
          variant="contained"
          startIcon={<Add />}
          className={classes.addButton}
        >
          Make A Contribution
        </Button>
      </div>
    </div>
  );
};

export default ContributionsPage;
