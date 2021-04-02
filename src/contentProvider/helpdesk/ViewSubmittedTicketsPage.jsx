import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Button, Typography } from "@material-ui/core";

import PageTitle from "../../components/PageTitle.js";
import Service from "../../AxiosService";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import SubmittedTickets from "../../helpdeskComponents/SubmittedTickets.jsx";

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

  const [enquiries, setEnquiries] = useState();

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
        <Link className={classes.backLink} to={`/partner/home/helpdesk`}>
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
      <div style={{ marginTop: "20px" }}>
        <SubmittedTickets user={"partner"} enquiries={enquiries} />
      </div>
    </div>
  );
};

export default ViewSubmittedTicketsPage;
