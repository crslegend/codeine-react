import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Button, Typography } from "@material-ui/core";

import PageTitle from "../../components/PageTitle.js";
import Service from "../../AxiosService";
import { useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
}));

const ViewAnIssuePage = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [enquiry, setEnquiry] = useState();

  const getEnquiry = () => {
    Service.client
      .get(`helpdesk/tickets/${id}`)
      .then((res) => {
        console.log(res);
        setEnquiry(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getEnquiry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <Link className={classes.backLink} to={`/partner/home/helpdesk`}>
          <Typography style={{ marginRight: "8px" }} variant="body1">
            Helpdesk
          </Typography>
        </Link>
        <Link
          className={classes.backLink}
          to={`/partner/home/helpdesk/tickets`}
        >
          <Typography style={{ marginRight: "8px" }} variant="body1">
            My Submitted Enquiries
          </Typography>
        </Link>
        <Typography variant="body1">View an Enquiry</Typography>
      </Breadcrumbs>
    </div>
  );
};

export default ViewAnIssuePage;
