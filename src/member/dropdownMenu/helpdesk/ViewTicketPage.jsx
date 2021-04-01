import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Breadcrumbs, Typography } from "@material-ui/core";

import MemberNavBar from "../../MemberNavBar.jsx";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Service from "../../../AxiosService";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import ViewTicket from "../../../helpdeskComponents/ViewTicket.jsx";

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

  const [loggedIn, setLoggedIn] = useState(false);
  const [enquiry, setEnquiry] = useState();
  const [reply, setReply] = useState();
  const [file, setFile] = useState();

  const [userAvatar, setUserAvatar] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          setUserAvatar(res.data.profile_photo);
        })
        .catch((err) => {});
    }
  };

  const getEnquiry = () => {
    Service.client
      .get(`helpdesk/tickets/${id}`)
      .then((res) => {
        // console.log(res);
        setEnquiry(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getEnquiry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replyToTicket = () => {
    const formData = new FormData();
    formData.append("message", reply);
    formData.append("ticket_id", id);
    if (file) {
      formData.append("file", file[0].file);
    }

    Service.client
      .post(`helpdesk/tickets/${id}/messages`, formData)
      .then((res) => {
        // console.log(res);
        getEnquiry();
        setReply();
        setFile();
      })
      .catch((err) => console.log(err));
  };

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
          <ViewTicket
            enquiry={enquiry}
            user="member"
            reply={reply}
            setReply={setReply}
            file={file}
            setFile={setFile}
            userAvatar={userAvatar}
            replyToTicket={replyToTicket}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewTicketPage;
