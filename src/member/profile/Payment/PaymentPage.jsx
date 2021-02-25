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
    if (status === "Payment") {
      return "blue";
    } else {
      return "green";
    }
  };

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 400 },
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
      field: "partner",
      headerName: "Consultation Held By",
      width: 200,
    },
    {
      field: "amount",
      headerName: "Amount",
      renderCell: (params) => (
        <Typography variant="body2">${params.value}</Typography>
      ),
      width: 150,
    },
    {
      field: "type",
      headerName: "Transaction Type",
      renderCell: (params) => (
        <strong>
          <Typography style={{ color: formatStatus(params.value) }}>
            {params.value}
          </Typography>
        </strong>
      ),
      width: 200,
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
    //transactionRows[h].title = allTransactions[h].application.title;
    //transactionRows[h].partner = allTransactions[h].application.partner;

    transactionRows[h].date = formatDate(
      allTransactions[h].payment_transaction.timestamp
    );
    transactionRows[h].amount =
      allTransactions[h].payment_transaction.payment_amount;

    if (allTransactions[h].payment_transaction.payment_status === "COMPLETED") {
      transactionRows[h].type = "Payment";
    } else {
      transactionRows[h].type = "Refund";
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
