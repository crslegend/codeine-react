import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Button, Typography } from "@material-ui/core";

import MemberNavBar from "../../MemberNavBar.jsx";
import Cookies from "js-cookie";
import PageTitle from "../../../components/PageTitle.js";
import Service from "../../../AxiosService";
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

  const [loggedIn, setLoggedIn] = useState(false);
  const [enquiry, setEnquiry] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

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
    checkIfLoggedIn();
    getEnquiry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <div style={{ width: "80%", margin: "auto" }}>
          <div style={{ paddingTop: "20px" }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link className={classes.backLink} to={`/member/helpdesk`}>
                <Typography style={{ marginRight: "8px" }} variant="body1">
                  Helpdesk
                </Typography>
              </Link>
              <Link
                className={classes.backLink}
                to={`/member/helpdesk/tickets`}
              >
                <Typography style={{ marginRight: "8px" }} variant="body1">
                  My Submitted Enquiries
                </Typography>
              </Link>
              <Typography variant="body1">View an Enquiry</Typography>
            </Breadcrumbs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAnIssuePage;
