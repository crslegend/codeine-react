import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
}));

const Payment = () => {
  const classes = useStyles();
  const [allTransactions, setAllTransactions] = useState([]);

  const formatStatus = (status) => {
    if (status === "Confirmed") {
      return "green";
    } else if (status === "Rejected") {
      return "red";
    } else {
      return "orange";
    }
  };

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 400 },
    {
      field: "start_time",
      headerName: "Payment Date",
      type: "date",
      width: 250,
    },
    {
      field: "title",
      headerName: "Consultation Title",
      width: 300,
      renderCell: (params) => {
        //console.log(params.row.meeting_link);
        return (
          <a
            href={params.row.meeting_link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {params.row.meeting_link}
          </a>
        );
      },
    },
    {
      field: "payment_amount",
      headerName: "Amount",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => (
        <strong>
          <Typography style={{ color: formatStatus(params.value) }}>
            {params.value}
          </Typography>
        </strong>
      ),
      width: 150,
    },
  ];

  const transactionRows = allTransactions;

  return (
    <Fragment>
      <Box className={classes.heading}>
        <Typography variant="h4" style={{ marginLeft: "56px", color: "#fff" }}>
          Past Transactions
        </Typography>
      </Box>
      <div style={{ height: "700px", width: "100%" }}>
        <DataGrid
          rows={transactionRows}
          columns={transactionColumns.map((column) => ({
            ...column,
          }))}
          pageSize={10}
          disableSelectionOnClick
          /*{onRowClick={(e) => handleClickOpenMember(e)}}*/
        />
      </div>
    </Fragment>
  );
};

export default Payment;
