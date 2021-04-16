import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";

import Service from "../../AxiosService";
import PageTitle from "../../components/PageTitle";
import { Add } from "@material-ui/icons";
import Toast from "../../components/Toast.js";

import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { DataGrid } from "@material-ui/data-grid";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const useStyles = makeStyles((theme) => ({
  topSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    color: "#fff",
    height: 35,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(3),
    width: "50%",
    margin: "20px auto",
  },
  dataGrid: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
}));

const ContributionsPage = () => {
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

  const [paymentDialog, setPaymentDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState();
  const [month, setMonth] = useState(1);

  const [contributions, setContributions] = useState([]);

  const [latestContribution, setLatestContribution] = useState();

  const [selectedTransaction, setSelectedTransaction] = useState();
  const [selectedTransactionDialog, setSelectedTransactionDialog] = useState(
    false
  );

  const [existPending, setExistPending] = useState(false);

  const getAllContributions = async () => {
    Service.client
      .get(`/contributions`)
      .then((res) => {
        // console.log(res);

        let arr = [];
        let checkExist = false;
        for (let i = 0; i < res.data.length; i++) {
          if (
            res.data[i].payment_transaction.payment_status ===
            "PENDING_COMPLETION"
          ) {
            checkExist = true;
          }
          const obj = {
            id: res.data[i].payment_transaction.id,
            payment_amount: res.data[i].payment_transaction.payment_amount,
            payment_type: res.data[i].payment_transaction.payment_type,
            payment_status: res.data[i].payment_transaction.payment_status,
            timestamp: res.data[i].payment_transaction.timestamp,
            expiry_date: res.data[i].expiry_date,
            month_duration: res.data[i].month_duration,
          };
          arr.push(obj);
        }
        setExistPending(checkExist);
        setContributions(arr);
      })
      .catch((err) => console.log(err));

    Service.client
      .get(`/contributions`, {
        params: { latest: 1 },
      })
      .then((res) => {
        // console.log(res);

        if (
          res.data.expiry_date &&
          res.data.payment_transaction &&
          res.data.payment_transaction.payment_status === "COMPLETED"
        ) {
          const futureDate = new Date(res.data.expiry_date);
          const currentDate = new Date();
          const diffTime = futureDate - currentDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 29) {
            // check = false;
            setLatestContribution(res.data);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const handleStripePaymentGateway = async (
    amount,
    email,
    userId,
    numOfMonths,
    contributionId
  ) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    const data = {
      total_price: amount * numOfMonths,
      email: email,
      description:
        numOfMonths && numOfMonths === 1
          ? `Fund a month`
          : `Fund for ${numOfMonths} months`,
      pId: userId,
      numOfMonths: numOfMonths,
      contribution: contributionId,
    };

    axios
      .post("/create-checkout-session", data)
      .then((res) => {
        // console.log(res);
        stripe.redirectToCheckout({
          sessionId: res.data.id,
        });
      })
      .catch((err) => console.log(err.response));
  };

  const handlePaymentDialog = () => {
    if (paymentAmount < 1) {
      setSbOpen(true);
      setSnackbar({
        message: "Minimum funding amount of $1",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (month < 1) {
      setSbOpen(true);
      setSnackbar({
        message: "Number of months has to be at least 1",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    const decoded = jwt_decode(Cookies.get("t1"));

    // console.log(decoded);
    Service.client
      .get(`/auth/partners/${decoded.user_id}`)
      .then((res) => {
        // console.log(res);
        const emailAdd = res.data.email;

        // if (
        //   res.data.partner.organization &&
        //   res.data.partner.organization.organization_name
        // ) {
        //   // means enterprise partner
        //   if (paymentAmount < 500) {
        //     setSbOpen(true);
        //     setSnackbar({
        //       message:
        //         "Contribution amount has to be greater than or equals to $500 for enterprise",
        //       severity: "error",
        //       anchorOrigin: {
        //         vertical: "bottom",
        //         horizontal: "center",
        //       },
        //       autoHideDuration: 3000,
        //     });
        //     return;
        //   }
        // }

        let data = {
          contribution: paymentAmount.toString(),
          payment_type: "Credit Card",
          month_duration: parseInt(month),
        };
        // console.log(data);

        Service.client
          .post(`contributions`, data)
          .then((res) => {
            console.log(res);

            handleStripePaymentGateway(
              paymentAmount,
              emailAdd,
              decoded.user_id,
              month,
              res.data.id
            );
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAllContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    {
      field: "payment_amount",
      headerName: "Funding Amount",
      valueFormatter: (params) => `$${params.value}`,
      width: 170,
    },
    { field: "payment_type", headerName: "Paid By", width: 150 },
    {
      field: "payment_status",
      headerName: "Status",
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
      width: 190,
    },
    {
      field: "timestamp",
      headerName: "Paid On",
      valueFormatter: (params) => formatDate(params.value),
      width: 230,
    },
    {
      field: "expiry_date",
      headerName: "Expires On",
      valueFormatter: (params) => formatDateToReturnWithoutTime(params.value),
      width: 150,
    },
    {
      field: "month_duration",
      headerName: "No. of Months",
      width: 150,
      hide: true,
    },
  ];

  const handleClickOpen = (e) => {
    console.log(e.row);
    setSelectedTransaction(e.row);
    setSelectedTransactionDialog(true);
  };

  const handleContinueTransaction = () => {
    const decoded = jwt_decode(Cookies.get("t1"));
    const month_duration = selectedTransaction.month_duration;
    const amountToPay =
      parseFloat(selectedTransaction.payment_amount) /
      selectedTransaction.month_duration;

    const cId = selectedTransaction.id;

    // console.log(decoded);
    Service.client
      .get(`/auth/partners/${decoded.user_id}`)
      .then((res) => {
        const emailAdd = res.data.email;

        handleStripePaymentGateway(
          amountToPay,
          emailAdd,
          decoded.user_id,
          month_duration,
          cId
        );
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteTransaction = () => {
    Service.client
      .delete(`contributions/${selectedTransaction.id}`)
      .then((res) => {
        // console.log(res);
        setSelectedTransaction();
        setSelectedTransactionDialog(false);
        getAllContributions();
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.topSection}>
        <PageTitle title={`Funding`} />
        <Button
          color="primary"
          variant="contained"
          startIcon={<Add />}
          className={classes.addButton}
          onClick={() => setPaymentDialog(true)}
          disabled={existPending}
        >
          Help Fund Codeine
        </Button>
      </div>

      <Paper className={classes.paper}>
        <Typography
          variant="h5"
          style={{ fontWeight: 600, paddingBottom: "20px" }}
        >
          Current Active Funding
        </Typography>
        {latestContribution && latestContribution ? (
          <Fragment>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="body1"
                style={{ marginRight: "10px", fontWeight: 600 }}
              >
                Status:{" "}
              </Typography>
              <Chip
                label="Active"
                style={{ backgroundColor: "green", color: "#fff" }}
                size="small"
              />
            </div>

            <Typography variant="body1" style={{ paddingBottom: "5px" }}>
              <span style={{ fontWeight: 600 }}>Paid On: </span>
              {formatDate(latestContribution.payment_transaction.timestamp)}
            </Typography>
            <Typography variant="body1" style={{ paddingBottom: "5px" }}>
              <span style={{ fontWeight: 600 }}>Paid By: </span>
              {latestContribution.payment_transaction.payment_type}
            </Typography>
            <Typography variant="body1" style={{ paddingBottom: "5px" }}>
              <span style={{ fontWeight: 600 }}>Contribution Amount: </span>$
              {latestContribution.payment_transaction.payment_amount}
            </Typography>
            <Typography variant="body1" style={{ paddingBottom: "5px" }}>
              <span style={{ fontWeight: 600 }}>Expires On: </span>
              {formatDateToReturnWithoutTime(latestContribution.expiry_date)}
            </Typography>
          </Fragment>
        ) : (
          <Fragment>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="body1"
                style={{ marginRight: "10px", fontWeight: 600 }}
              >
                Status:{" "}
              </Typography>
              <Chip
                label="Inactive"
                style={{ backgroundColor: "#C74343", color: "#fff" }}
                size="small"
              />
            </div>

            <Typography variant="body1">No funds received yet</Typography>
          </Fragment>
        )}
      </Paper>

      <Typography
        variant="h5"
        style={{
          fontWeight: 600,
          paddingTop: "10px",
          paddingBottom: "10px",
        }}
      >
        Funding History
      </Typography>

      <div
        style={{
          height: "calc(100vh - 250px)",
          width: "100%",
          marginBottom: "30px",
        }}
      >
        <DataGrid
          rows={contributions}
          columns={columns}
          pageSize={10}
          className={classes.dataGrid}
          onRowClick={(e) => handleClickOpen(e)}
        />
      </div>

      <Dialog
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Funding</DialogTitle>
        <DialogContent>
          <label htmlFor="amount">
            <Typography>Enter funding amount below</Typography>
          </label>
          <TextField
            id="amount"
            variant="outlined"
            placeholder="Enter amount (eg. 50.50)"
            type="number"
            required
            fullWidth
            margin="dense"
            value={paymentAmount && paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <label htmlFor="month">
            <Typography>Enter number of months to fund</Typography>
          </label>
          <TextField
            id="month"
            variant="outlined"
            placeholder="Enter number of months"
            type="number"
            required
            fullWidth
            margin="dense"
            value={month && month}
            onChange={(e) => setMonth(e.target.value)}
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setPaymentDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePaymentDialog()}
          >
            Proceed To Pay
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={selectedTransactionDialog}
        onClose={() => {
          setSelectedTransaction();
          setSelectedTransactionDialog(false);
        }}
        maxWidth="sm"
        fullWidth={true}
      >
        {selectedTransaction &&
        selectedTransaction &&
        selectedTransaction.payment_status !== "COMPLETED" ? (
          <Fragment>
            <DialogTitle>Transaction Pending Completion</DialogTitle>
            <DialogContent>This transaction is incomplete.</DialogContent>
            <DialogActions>
              <Button
                onClick={() => handleDeleteTransaction()}
                style={{ backgroundColor: "#C74343", color: "#fff" }}
              >
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
                <Typography
                  variant="body1"
                  style={{ marginRight: "10px", fontWeight: 600 }}
                >
                  Transaction Status:{" "}
                </Typography>
                <Chip
                  label="Completed"
                  style={{ backgroundColor: "green", color: "#fff" }}
                  size="small"
                />
              </div>
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                <span style={{ fontWeight: 600 }}>Transaction ID: </span>
                {selectedTransaction && selectedTransaction.id}
              </Typography>
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                <span style={{ fontWeight: 600 }}>Paid On: </span>
                {formatDate(
                  selectedTransaction && selectedTransaction.timestamp
                )}
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
                {formatDateToReturnWithoutTime(
                  selectedTransaction && selectedTransaction.expiry_date
                )}
              </Typography>
            </DialogContent>
          </Fragment>
        )}
      </Dialog>
    </Fragment>
  );
};

export default ContributionsPage;
