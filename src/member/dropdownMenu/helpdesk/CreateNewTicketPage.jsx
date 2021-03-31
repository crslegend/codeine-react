import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../../MemberNavBar.jsx";
import Cookies from "js-cookie";
import CreateNewTicket from "../../../helpdeskComponents/CreateNewTicket";
import PageTitle from "../../../components/PageTitle.js";
import { IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { useHistory } from "react-router";

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

  const [loggedIn, setLoggedIn] = useState(false);

  const [issueType, setIssueType] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <div style={{ width: "80%", margin: "auto" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <IconButton
              style={{ marginRight: "20px" }}
              onClick={() => history.push(`/member/helpdesk`)}
            >
              <ArrowBack />
            </IconButton>
            <PageTitle title="Contact Us" />
          </div>

          <div style={{ marginTop: "20px" }}>
            <CreateNewTicket
              user={"member"}
              issueType={issueType}
              setIssueType={setIssueType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewTicketPage;
