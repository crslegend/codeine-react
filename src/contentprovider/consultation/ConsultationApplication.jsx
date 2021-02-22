import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button, Box, Typography } from "@material-ui/core";
import jwt_decode from "jwt-decode";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({}));

const deleteConsultation = () => {};

const ConsultationApplication = () => {
  const classes = useStyles();

  const [allConsultations, setAllConsultations] = useState([]);

  useEffect(() => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      console.log(userid);
      Service.client
        .get("/consultations", { params: { member_id: userid } })
        .then((res) => {
          setAllConsultations(res.data);
        })
        .catch((error) => {
          setAllConsultations(null);
        });
    }
  }, [setAllConsultations]);

  console.log(allConsultations);
  const formatStatus = (status) => {
    if (status === "Confirmed") {
      return "green";
    } else if (status === "Rejected") {
      return "red";
    } else {
      return "orange";
    }
  };

  const consultationColumns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "meeting_link", headerName: "Meeting Link", width: 400 },
    { field: "start_time", headerName: "Start Time", width: 250 },
    {
      field: "end_time",
      headerName: "End Time",
      type: "date",
      width: 250,
    },
    {
      field: "partner",
      headerName: "Created By",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => (
        <strong>
          <Typography style={{ color: formatStatus(params.value) }}>
            {params.value}
            {console.log(params.value)}
          </Typography>
        </strong>
      ),
      width: 150,
    },
    {
      width: 150,
      field: "is_cancelled",
      headerName: "Remove",
      renderCell: () => (
        <Button
          style={{ color: "#437FC7", textTransform: "capitalize" }}
          onClick={() => {
            deleteConsultation();
          }}
        >
          Cancel
        </Button>
      ),
    },
  ];

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const consultationRows = allConsultations;

  for (var h = 0; h < allConsultations.length; h++) {
    consultationRows[h].start_time = formatDate(allConsultations[h].start_time);
    consultationRows[h].end_time = formatDate(allConsultations[h].end_time);

    if (allConsultations[h].is_confirmed) {
      consultationRows[h].status = "Confirmed";
    } else if (allConsultations[h].is_rejected) {
      consultationRows[h].status = "Rejected";
    } else {
      consultationRows[h].status = "Pending";
    }
  }

  return (
    <div style={{ height: "650px", width: "100%", marginBottom: "40px" }}>
      <DataGrid
        rows={consultationRows}
        columns={consultationColumns.map((column) => ({
          ...column,
          //disableClickEventBubbling: true,
        }))}
        pageSize={10}
        checkboxSelection
        disableSelectionOnClick
        /*{onRowClick={(e) => handleClickOpenMember(e)}}*/
      />
    </div>
  );
};

export default ConsultationApplication;
