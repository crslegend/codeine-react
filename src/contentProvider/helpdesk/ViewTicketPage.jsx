import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Button, Typography } from "@material-ui/core";

import Service from "../../AxiosService";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ViewTicket from "../../helpdeskComponents/ViewTicket.jsx";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";

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

const ViewTicketPage = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [enquiry, setEnquiry] = useState();
  const [reply, setReply] = useState();
  const [file, setFile] = useState();

  const [userAvatar, setUserAvatar] = useState();

  const getEnquiry = () => {
    Service.client
      .get(`helpdesk/tickets/${id}`)
      .then((res) => {
        console.log(res);
        setEnquiry(res.data);
      })
      .catch((err) => console.log(err));
  };

  const getUserDetails = () => {
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/partners/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);
          setUserAvatar(res.data.profile_photo);
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    getEnquiry();
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replyToTicket = () => {
    const formData = new FormData();

    Service.client
      .post(`helpdesk/tickets/${id}/messages`)
      .then()
      .catch((err) => console.log(err));
  };

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
      <ViewTicket
        enquiry={enquiry}
        user="partner"
        reply={reply}
        setReply={setReply}
        file={file}
        setFile={setFile}
        userAvatar={userAvatar}
        replyToTicket={replyToTicket}
      />
    </div>
  );
};

export default ViewTicketPage;
