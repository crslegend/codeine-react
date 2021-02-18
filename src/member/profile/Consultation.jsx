import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button, Box, Typography } from "@material-ui/core";
import jwt_decode from "jwt-decode";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    margin: "-30px -56px 40px",
  },
}));

const deleteConsultation = () => {};

const Consultation = () => {
  const classes = useStyles();

  const [allConsultations, setAllConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState({
    partner: "",
    status: "",
    meeting_link: "",
    start_time: "",
    duration: "",
  });

  useEffect(() => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_member_id;
      Service.client
        .get("/consultations", { params: { member__user__id: userid } })
        .then((res) => {
          setAllConsultations(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          setAllConsultations(null);
        });
    }
  }, []);

  const consultationColumns = [
    { field: "meeting_url", headerName: "Meeting Link", width: 600 },
    { field: "start_time", headerName: "Date & Time", width: 200 },
    {
      field: "duration",
      headerName: "Duration",
      width: 150,
    },
    {
      field: "partner",
      headerName: "Created By",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },
    {
      width: 100,
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

  const consultationRows = allConsultations;

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  for (var h = 0; h < allConsultations.length; h++) {
    consultationRows[h].start_time = formatDate(
      setAllConsultations[h].start_time
    );
  }

  /*
  useEffect(() => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/members`)
        .then((res) => {
          setAllMemberList(res.data);
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  }, []);
*/
  return (
    <Fragment>
      <Box className={classes.heading}>
        <Typography variant="h4" style={{ marginLeft: "56px", color: "#fff" }}>
          My Consultations
        </Typography>
      </Box>
      <div style={{ height: "700px", width: "100%" }}>
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
    </Fragment>
  );
};

export default Consultation;
