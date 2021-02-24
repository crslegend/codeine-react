import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
import { IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { useHistory, useParams } from "react-router-dom";

const styles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    alignItems: "center",
  },
}));

const ViewAllQuizzes = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const getAllQuizzes = () => {};

  useEffect(() => {
    getAllQuizzes();
  }, []);

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <IconButton
          onClick={() => history.push(`/partner/home/content/view/${id}`)}
          style={{ marginRight: "30px" }}
        >
          <ArrowBack />
        </IconButton>
        <PageTitle title="View All Quizzes" />
      </div>
    </Fragment>
  );
};

export default ViewAllQuizzes;
