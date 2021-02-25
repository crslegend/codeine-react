import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";

import Service from "../../AxiosService";
import PageTitle from "../../components/PageTitle";
import { Add } from "@material-ui/icons";
import Toast from "../../components/Toast.js";
import { DataGrid } from "@material-ui/data-grid";

import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  topSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    height: 35,
    "&:hover": {
      color: "#000",
    },
  },
  paper: {
    height: "calc(100vh - 115px)",
  },
}));

const WalletPage = () => {
  const classes = useStyles();

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  // Transactions datagrid
  const [allTransactionList, setAllTransactionList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({
    id: "",
    date: "",
    amount: "",
  });

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 300 },
    { field: "date", headerName: "Transaction Date", width: 180 },
    { field: "amount", headerName: "Amount", width: 130 },
    {
      field: "duration",
      headerName: "Duration",
      width: 130,
    },
  ];

  let transactionRows = allTransactionList;
  const [searchValueTransaction, setSearchValueTransaction] = useState("");

  const getTransactionData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/members`)
        .then((res) => {
          setAllTransactionList(res.data);
          transactionRows = allTransactionList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.topSection}>
        <PageTitle title={`Wallet`} />
      </div>
      <div style={{ height: "calc(100vh - 300px)", width: "100%" }}>
        <DataGrid
          rows={transactionRows}
          columns={transactionColumns.map((column) => ({
            ...column,
            //disableClickEventBubbling: true,
          }))}
          pageSize={10}
          //checkboxSelection
          disableSelectionOnClick
          //onRowClick={(e) => handleClickOpenAdmin(e)}
        />
      </div>
    </Fragment>
  );
};

export default WalletPage;
