import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router";
import Service from "../../AxiosService";
import { IconButton } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import ViewTicket from "../../helpdeskComponents/ViewTicket";

const useStyles = makeStyles((theme) => ({}));

const ViewTicketPage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [enquiry, setEnquiry] = useState();
  const [reply, setReply] = useState();
  const [file, setFile] = useState();

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

  const markTicketAsResolved = () => {
    Service.client
      .patch(`helpdesk/tickets/${id}/resolve`)
      .then((res) => {
        getEnquiry();
      })
      .catch((err) => console.log(err));
  };

  const reopenTicket = () => {
    Service.client
      .patch(`helpdesk/tickets/${id}/open`)
      .then((res) => {
        getEnquiry();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <IconButton onClick={() => history.push(`/admin/helpdesk`)}>
        <ArrowBack />
      </IconButton>
      <div style={{ marginTop: "20px" }}>
        <ViewTicket
          enquiry={enquiry}
          user="admin"
          reply={reply}
          setReply={setReply}
          file={file}
          setFile={setFile}
          replyToTicket={replyToTicket}
          markTicketAsResolved={markTicketAsResolved}
          reopenTicket={reopenTicket}
        />
      </div>
    </div>
  );
};

export default ViewTicketPage;
