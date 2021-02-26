import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Box, Typography } from "@material-ui/core";
import jwt_decode from "jwt-decode";
import Service from "../../../AxiosService";

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
  const [application, setApplication] = useState();

  const getTransactionData = () => {
    Service.client
      .get("/consultations/member/payments")
      .then((res) => {
        setAllTransactions(res.data);
      })
      .catch((error) => {
        setAllTransactions(null);
      });
  };
  console.log(allTransactions);

  useEffect(() => {
    getTransactionData();
  }, [setAllTransactions]);

  const formatStatus = (status) => {
    if (status !== "Payment") {
      return "green";
    }
  };

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 320 },
    {
      field: "date",
      headerName: "Payment Date",
      type: "date",
      width: 250,
    },
    {
      field: "title",
      headerName: "Consultation Title",
      width: 300,
    },
    {
      field: "consultation_date",
      headerName: "Consultation Date",
      type: "date",
      width: 250,
    },
    {
      field: "partner",
      headerName: "Consultation Held By",
      width: 200,
    },

    {
      field: "type",
      headerName: "Transaction Type",
      renderCell: (params) => (
        <strong>
          <Typography
            variant="body2"
            style={{ color: formatStatus(params.value) }}
          >
            {params.value}
          </Typography>
        </strong>
      ),
      width: 200,
    },
    {
      field: "debit",
      headerName: "Debit",
      renderCell: (params) =>
        params.value && (
          <Typography variant="body2">${params.value}</Typography>
        ),
      width: 120,
    },
    {
      field: "credit",
      headerName: "Credit",
      renderCell: (params) =>
        params.value && (
          <Typography style={{ color: "green" }} variant="body2">
            ${params.value}
          </Typography>
        ),
      width: 120,
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

  const transactionRows = allTransactions;

  for (var h = 0; h < allTransactions.length; h++) {
    transactionRows[h].title = allTransactions[h].consultation_slot.title;
    transactionRows[h].partner =
      allTransactions[h].consultation_slot.partner_name;

    transactionRows[h].consultation_date = formatDate(
      allTransactions[h].consultation_slot.start_time
    );

    transactionRows[h].date = formatDate(
      allTransactions[h].payment_transaction.timestamp
    );

    if (allTransactions[h].payment_transaction.payment_status === "COMPLETED") {
      transactionRows[h].type = "Payment";
      transactionRows[h].debit =
        allTransactions[h].payment_transaction.payment_amount;
    } else {
      transactionRows[h].type = "Refund";
      transactionRows[h].credit =
        allTransactions[h].payment_transaction.payment_amount;
    }
  }
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
