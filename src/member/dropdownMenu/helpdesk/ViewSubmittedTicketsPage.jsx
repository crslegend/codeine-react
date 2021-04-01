import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Button, Typography } from "@material-ui/core";

import MemberNavBar from "../../MemberNavBar.jsx";
import Cookies from "js-cookie";
import PageTitle from "../../../components/PageTitle.js";
import Service from "../../../AxiosService";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import SubmittedTickets from "../../../helpdeskComponents/SubmittedTickets.jsx";

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

const ViewSubmittedTicketsPage = () => {
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
      .get(`helpdesk/tickets`, { params: { is_user: "true" } })
      .then((res) => {
        console.log(res);
        setEnquiries(res.data);
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
              <Typography variant="body1">My Submitted Enquiries</Typography>
            </Breadcrumbs>
          </div>

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
              to="/member/helpdesk/contact-us"
            >
              Contact Us
            </Button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <SubmittedTickets user={"member"} enquiries={enquiries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSubmittedTicketsPage;
