import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import Cookies from "js-cookie";
import CreateNewTicket from "../../helpdeskComponents/CreateNewTicket";
import PageTitle from "../../components/PageTitle.js";
import { useHistory } from "react-router";
import jwt_decode from "jwt-decode";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  contactUs: {
    backgroundColor: theme.palette.red.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
}));

const CreateNewTicketPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [partnerType, setPartnerType] = useState();
  const [issueType, setIssueType] = useState();

  const checkPartnerType = () => {
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/partners/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);
          if (res.data.partner.organization) {
            setPartnerType("partner-org");
          } else {
            setPartnerType("partner");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    checkPartnerType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton
          style={{ marginRight: "20px" }}
          onClick={() => history.push(`/partner/home/helpdesk`)}
        >
          <ArrowBack />
        </IconButton>
        <PageTitle title="Contact Us" />
      </div>

      <div style={{ marginTop: "20px" }}>
        <CreateNewTicket
          user={partnerType}
          issueType={issueType}
          setIssueType={setIssueType}
        />
      </div>
    </div>
  );
};

export default CreateNewTicketPage;
