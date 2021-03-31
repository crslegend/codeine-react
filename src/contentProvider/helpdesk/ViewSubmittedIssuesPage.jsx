import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Button, Typography } from "@material-ui/core";

import Cookies from "js-cookie";
import PageTitle from "../../components/PageTitle.js";
import Service from "../../AxiosService";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  contactUs: {
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
}));

const ViewSubmittedIssuesPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);

  const [enquiries, setEnquiries] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getSubmittedEnquiries = () => {
    Service.client
      .get(`helpdesk/tickets`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getSubmittedEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Breadcrumbs
        style={{ margin: "20px 0px" }}
        separator="›"
        aria-label="breadcrumb"
      >
        <Link
          className={classes.backLink}
          onClick={() => history.push(`/partner/home/helpdesk`)}
        >
          <Typography style={{ marginRight: "8px" }} variant="body1">
            Helpdesk
          </Typography>
        </Link>
        <Typography variant="body1">My Submitted Enquiries</Typography>
      </Breadcrumbs>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <PageTitle title="My Submitted Enquiries" />
        <Button
          variant="contained"
          className={classes.contactUs}
          component={Link}
          to="/partner/home/helpdesk/contact-us"
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
};

export default ViewSubmittedIssuesPage;
