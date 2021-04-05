import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import {
  Button,
  Chip,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@material-ui/core";
// import jwt_decode from "jwt-decode";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import MemberNavBar from "../../MemberNavBar";
import PageTitle from "../../../components/PageTitle";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useHistory } from "react-router";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const useStyles = makeStyles((theme) => ({
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "65px",
  },
  dataGrid: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        // cursor: "pointer",
      },
    },
  },
  dataGridClick: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
  paper: {
    padding: theme.spacing(5),
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
  },
  pro: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    fontSize: 16,
  },
  free: {
    backgroundColor: "  #F7DF1E",
    color: "#000",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    fontSize: 16,
  },
}));

const Payment = () => {
  const classes = useStyles();
  const history = useHistory();

  const [allTransactions, setAllTransactions] = useState([]);
  const [latestTransactionForPro, setLatestTransactionForPro] = useState();
  const [membershipTransactions, setMembershipTransactions] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState();
  const [selectedTransactionDialog, setSelectedTransactionDialog] = useState(false);
  const [existPending, setExistPending] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTransactionData = async () => {
    Service.client
      .get("/consultations/member/payments")
      .then((res) => {
        // console.log(res);
        setAllTransactions(res.data);
      })
      .catch((error) => {
        // setAllTransactions(null);
      });

    Service.client
      .get(`auth/membership-subscriptions`)
      .then((res) => {
        // console.log(res.data);
        let arr = [];
        let obj = {};
        let pendingCheck = false;
        for (let i = 0; i < res.data.length; i++) {
          obj = {
            id: res.data[i].payment_transaction.id,
            expiry_date: res.data[i].expiry_date,
            payment_amount: res.data[i].payment_transaction.payment_amount,
            payment_status: res.data[i].payment_transaction.payment_status,
            payment_type: res.data[i].payment_transaction.payment_type,
            date: res.data[i].payment_transaction.timestamp,
            month_duration: res.data[i].month_duration,
          };
          arr.push(obj);
          if (res.data[i].payment_transaction.payment_status === "PENDING_COMPLETION" && !pendingCheck) {
            pendingCheck = true;
          }
        }
        setExistPending(pendingCheck);
        setMembershipTransactions(arr.reverse());
      })
      .catch((err) => console.log(err));

    Service.client
      .get(`/auth/membership-subscriptions`, {
        params: { latest: 1 },
      })
      .then((res) => {
        // console.log(res);
        if (res.data.payment_transaction.payment_status === "COMPLETED") {
          const futureDate = new Date(res.data.expiry_date);
          const currentDate = new Date();
          const diffTime = futureDate - currentDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          // console.log(diffDays);
          if (diffDays > 0) {
            // check = false;
            setLatestTransactionForPro(res.data);
          }
        } else if (res.data.payment_transaction.payment_status === "PENDING_COMPLETION") {
          setExistPending(true);
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(allTransactions);

  useEffect(() => {
    getTransactionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setAllTransactions]);

  const handleStripePaymentGateway = async (amount, email, userId, numOfMonths, transactionId) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    const data = {
      total_price: amount * numOfMonths,
      email: email,
      description: numOfMonths && numOfMonths === 1 ? `Pro-Tier for 1 Month` : `Pro-Tier for ${numOfMonths} Months`,
      mId: userId,
      numOfMonths: numOfMonths,
      transaction: transactionId,
    };

    axios
      .post("/create-checkout-session-upgrade-pro", data)
      .then((res) => {
        // console.log(res);
        stripe.redirectToCheckout({
          sessionId: res.data.id,
        });
      })
      .catch((err) => console.log(err.response));
  };

  const formatStatus = (status) => {
    if (status !== "Payment") {
      return "green";
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      const newDateTime = new Date(date).toLocaleTimeString("en-SG");
      // console.log(newDate);
      return newDate + " " + newDateTime;
    }
    return "";
  };

  const formatDateToReturnWithoutTime = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // const newDateTime = new Date(date).toLocaleTimeString("en-SG");
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const handleClickOpen = (e) => {
    console.log(e.row);
    setSelectedTransaction(e.row);
    setSelectedTransactionDialog(true);
  };

  const handleContinueTransaction = () => {
    const decoded = jwt_decode(Cookies.get("t1"));
    const month_duration = selectedTransaction.month_duration;
    const amountToPay = parseFloat(selectedTransaction.payment_amount) / selectedTransaction.month_duration;

    const cId = selectedTransaction.id;

    // console.log(decoded);
    Service.client
      .get(`/auth/members/${decoded.user_id}`)
      .then((res) => {
        const emailAdd = res.data.email;

        handleStripePaymentGateway(amountToPay, emailAdd, decoded.user_id, month_duration, cId);
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTransaction = () => {
    Service.client
      .delete(`/auth/membership-subscriptions/${selectedTransaction.id}`)
      .then((res) => {
        // console.log(res);
        setSelectedTransactionDialog(false);
        setTimeout(() => {
          setSelectedTransaction();
          getTransactionData();
        }, 500);
      })
      .catch((err) => console.log(err));
  };

  const paymentColumns = [
    { field: "id", headerName: "Transaction ID", width: 350 },
    {
      field: "payment_amount",
      headerName: "Amount Paid",
      width: 150,
      valueFormatter: (params) => `$${params.value}`,
    },
    {
      field: "payment_type",
      headerName: "Paid By",
      width: 150,
    },
    {
      field: "payment_status",
      headerName: "Payment Status",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.value && params.value === "COMPLETED" ? (
            <div variant="body2" style={{ color: "green" }}>
              {params.value}
            </div>
          ) : (
            <div variant="body2" style={{ color: "red" }}>
              {`PENDING COMPLETION`}
            </div>
          )}
        </div>
      ),
    },
    {
      field: "date",
      headerName: "Payment On",
      type: "date",
      width: 260,
      valueFormatter: (params) => formatDate(params.value),
    },
    {
      field: "expiry_date",
      headerName: "Expires On",
      valueFormatter: (params) => formatDateToReturnWithoutTime(params.value),
      width: 150,
    },
    {
      field: "month_duration",
      hide: true,
    },
  ];

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 350 },
    {
      field: "date",
      headerName: "Payment Date",
      type: "date",
      width: 250,
    },
    {
      field: "title",
      headerName: "Consultation Title",
      width: 250,
    },
    {
      field: "consultation_date",
      headerName: "Consultation Date",
      type: "date",
      width: 220,
    },
    {
      field: "partner",
      headerName: "Instructor",
      width: 200,
    },

    {
      field: "type",
      headerName: "Transaction Type",
      renderCell: (params) => (
        <div variant="body2" style={{ color: formatStatus(params.value) }}>
          {params.value}
        </div>
      ),
      width: 170,
    },
    {
      field: "debit",
      headerName: "Debit",
      renderCell: (params) => params.value && <div variant="body2">${params.value}</div>,
      width: 120,
    },
    {
      field: "credit",
      headerName: "Credit",
      renderCell: (params) =>
        params.value && (
          <div style={{ color: "green" }} variant="body2">
            ${params.value}
          </div>
        ),
      width: 120,
    },
  ];

  const transactionRows = [...allTransactions];

  for (var h = 0; h < allTransactions.length; h++) {
    transactionRows[h].title = allTransactions[h].consultation_slot.title;

    transactionRows[h].partner = allTransactions[h].consultation_slot.partner_name;

    transactionRows[h].expiry_date = allTransactions[h].expiry_date
      ? formatDateToReturnWithoutTime(allTransactions[h].expiry_date)
      : "-";

    transactionRows[h].consultation_date = formatDateToReturnWithoutTime(
      allTransactions[h].consultation_slot.start_time
    );

    transactionRows[h].date = formatDateToReturnWithoutTime(allTransactions[h].payment_transaction.timestamp);

    transactionRows[h].id = allTransactions[h].payment_transaction.id;

    if (allTransactions[h].payment_transaction.payment_status === "COMPLETED") {
      transactionRows[h].type = "Payment";
      transactionRows[h].debit = allTransactions[h].payment_transaction.payment_amount;
    } else {
      transactionRows[h].type = "Refund";
      transactionRows[h].credit = allTransactions[h].payment_transaction.payment_amount;
    }
  }

  return (
    <Fragment>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <div
          style={{
            width: "80%",
            margin: "auto",
          }}
        >
          <PageTitle title="My Payments" />
          <Paper className={classes.paper}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <Typography variant="h5" style={{ fontWeight: 600, paddingRight: "10px" }}>
                Current Tier:
              </Typography>
              {latestTransactionForPro ? (
                <Chip
                  label="PRO"
                  style={{
                    background:
                      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
                    color: "#fff",
                  }}
                  size="small"
                />
              ) : (
                <Chip label="FREE" style={{ background: "rgba(84,84,84,1)", color: "#000" }} size="small" />
              )}

              <div style={{ marginLeft: "auto" }}>
                {latestTransactionForPro ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginLeft: "30px", height: 30 }}
                    onClick={() => history.push(`/member/membership`)}
                    disabled={existPending}
                  >
                    Extend Pro-Tier Membership
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginLeft: "30px", height: 30 }}
                    onClick={() => history.push(`/member/membership`)}
                    disabled={existPending}
                  >
                    Upgrade To Pro-Tier
                  </Button>
                )}
              </div>
            </div>

            <Typography variant="h6" style={{ fontWeight: 600, paddingBottom: "5px" }}>
              Paid On:{" "}
              <span style={{ fontWeight: 500 }}>
                {latestTransactionForPro
                  ? formatDateToReturnWithoutTime(latestTransactionForPro.payment_transaction.timestamp)
                  : "-"}
              </span>
            </Typography>
            <Typography variant="h6" style={{ fontWeight: 600, paddingBottom: "5px" }}>
              Paid By:{" "}
              <span style={{ fontWeight: 500 }}>
                {latestTransactionForPro ? latestTransactionForPro.payment_transaction.payment_type : "-"}
              </span>
            </Typography>
            <Typography variant="h6" style={{ fontWeight: 600, paddingBottom: "5px" }}>
              Pro-Tier Membership Expires On:{" "}
              <span style={{ fontWeight: 500 }}>
                {latestTransactionForPro ? formatDateToReturnWithoutTime(latestTransactionForPro.expiry_date) : "-"}
              </span>
            </Typography>
          </Paper>
          <Typography variant="h5" style={{ fontWeight: "600", paddingBottom: "10px" }}>
            Membership Transactions
          </Typography>
          <div style={{ height: "500px", width: "100%", marginBottom: "25px" }}>
            <DataGrid
              className={classes.dataGridClick}
              rows={membershipTransactions}
              columns={paymentColumns}
              pageSize={10}
              disableSelectionOnClick
              onRowClick={(e) => handleClickOpen(e)}
            />
          </div>

          <Typography variant="h5" style={{ fontWeight: "600", paddingBottom: "10px" }}>
            Consultation Transactions
          </Typography>
          <div style={{ height: "500px", width: "100%", marginBottom: "25px" }}>
            <DataGrid
              className={classes.dataGrid}
              rows={transactionRows}
              columns={transactionColumns}
              pageSize={10}
              disableSelectionOnClick
              /*{onRowClick={(e) => handleClickOpenMember(e)}}*/
            />
          </div>
        </div>
      </div>

      <Dialog
        open={selectedTransactionDialog}
        onClose={() => {
          setSelectedTransactionDialog(false);
          setTimeout(() => {
            setSelectedTransaction();
          }, 500);
        }}
        maxWidth="sm"
        fullWidth={true}
      >
        {selectedTransaction && selectedTransaction && selectedTransaction.payment_status !== "COMPLETED" ? (
          <Fragment>
            <DialogTitle>Transaction Pending Completion</DialogTitle>
            <DialogContent>This transaction is incomplete.</DialogContent>
            <DialogActions>
              <Button onClick={() => handleDeleteTransaction()} style={{ backgroundColor: "#C74343", color: "#fff" }}>
                Delete Transaction
              </Button>
              <Button
                style={{ backgroundColor: "#437FC7", color: "#fff" }}
                className={classes.dialogButtons}
                onClick={() => {
                  handleContinueTransaction();
                }}
              >
                Continue To Payment
              </Button>
            </DialogActions>
          </Fragment>
        ) : (
          <Fragment>
            <DialogTitle>Transaction Complete</DialogTitle>
            <DialogContent>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="body1" style={{ marginRight: "10px", fontWeight: 600 }}>
                  Transaction Status:{" "}
                </Typography>
                <Chip label="Completed" style={{ backgroundColor: "green", color: "#fff" }} size="small" />
              </div>
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                <span style={{ fontWeight: 600 }}>Transaction ID: </span>
                {selectedTransaction && selectedTransaction.id}
              </Typography>
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                <span style={{ fontWeight: 600 }}>Paid On: </span>
                {formatDate(selectedTransaction && selectedTransaction.date)}
              </Typography>
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                <span style={{ fontWeight: 600 }}>Paid By: </span>
                {selectedTransaction && selectedTransaction.payment_type}
              </Typography>
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                <span style={{ fontWeight: 600 }}>Contribution Amount: </span>$
                {selectedTransaction && selectedTransaction.payment_amount}
              </Typography>
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                <span style={{ fontWeight: 600 }}>Expires On: </span>
                {formatDateToReturnWithoutTime(selectedTransaction && selectedTransaction.expiry_date)}
              </Typography>
            </DialogContent>
          </Fragment>
        )}
      </Dialog>
    </Fragment>
  );
};

export default Payment;
