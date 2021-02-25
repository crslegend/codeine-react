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
    backgroundColor: theme.palette.primary.main,
    height: 35,
    "&:hover": {
      color: "#000",
    },
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

  const getAllContributions = async () => {
    Service.client
      .get(`/contributions`)
      .then((res) => {
        console.log(res);

        let arr = [];
        for (let i = 0; i < res.data.length; i++) {
          const obj = {
            id: res.data[i].id,
            payment_amount: res.data[i].payment_transaction.payment_amount,
            payment_type: res.data[i].payment_transaction.payment_type,
            payment_status: res.data[i].payment_transaction.payment_status,
            timestamp: res.data[i].payment_transaction.timestamp,
            expiry_date: res.data[i].expiry_date,
          };
          arr.push(obj);
        }

        setContributions(arr);
      })
      .catch((err) => console.log(err));

    Service.client
      .get(`/contributions`, { params: { latest: 1 } })
      .then((res) => {
        console.log(res);

        if (res.data.expiry_date) {
          const futureDate = new Date(res.data.expiry_date);
          const currentDate = new Date();
          const diffTime = futureDate - currentDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 35) {
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
      total_price: amount,
      email: email,
      description: "Monthly Contributions",
      pId: userId,
      numOfMonths: numOfMonths,
      contribution: contributionId,
    };

    axios
      .post("/create-checkout-session", data)
      .then((res) => {
        console.log(res);
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
        message: "Contribution amount has to be higher",
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
        console.log(res);
        const emailAdd = res.data.email;

        if (
          res.data.partner.organization &&
          res.data.partner.organization.organization_name
        ) {
          // means enterprise partner
          if (paymentAmount < 500) {
            setSbOpen(true);
            setSnackbar({
              message:
                "Contribution amount has to be greater than or equals to $500 for enterprise",
              severity: "error",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 3000,
            });
            return;
          }
        }

        let data = {
          contribution: paymentAmount.toString(),
          payment_type: "Credit Card",
          month_duration: parseInt(month),
        };
        console.log(data);

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
      headerName: "Contribution Amount",
      valueFormatter: (params) => `$${params.value}`,
      width: 150,
    },
    { field: "payment_type", headerName: "Paid By", width: 150 },
    { field: "payment_status", headerName: "Status", width: 150 },
    {
      field: "timestamp",
      headerName: "Paid On",
      valueFormatter: (params) => formatDate(params.value),
      width: 250,
    },
    {
      field: "expiry_date",
      headerName: "Expires On",
      valueFormatter: (params) => formatDate(params.value),
      width: 250,
    },
  ];

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.topSection}>
        <PageTitle title={`Contributions`} />
        <Button
          variant="contained"
          startIcon={<Add />}
          className={classes.addButton}
          onClick={() => setPaymentDialog(true)}
        >
          Make A Contribution
        </Button>
      </div>

      <Paper className={classes.paper}>
        <Typography
          variant="h5"
          style={{ fontWeight: 600, paddingBottom: "20px" }}
        >
          Current Active Contribution
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
              <span style={{ fontWeight: 600 }}>Payment Amount: </span>$
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

            <Typography variant="body1">
              You have yet to make contribution for this month.
            </Typography>
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
        Contribution History
      </Typography>

      <div style={{ height: "calc(100vh - 450px)", width: "100%" }}>
        <DataGrid
          rows={contributions}
          columns={columns}
          pageSize={10}
          className={classes.dataGrid}
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
        <DialogTitle>Contribution</DialogTitle>
        <DialogContent>
          <label htmlFor="amount">
            <Typography>Enter contribution amount below</Typography>
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
            <Typography>Enter number of contribution months</Typography>
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
    </Fragment>
  );
};

export default ContributionsPage;
