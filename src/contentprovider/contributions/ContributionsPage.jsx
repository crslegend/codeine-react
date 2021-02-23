import React, { Fragment, useEffect, useState } from "react";
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

import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
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

  const handleStripePaymentGateway = async (amount, email, userId) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    const data = {
      total_price: amount,
      email: email,
      description: "Monthly Contributions",
      pId: userId,
    };

    axios
      .post("/create-checkout-session", data)
      .then((res) => {
        console.log(res);
        stripe.redirectToCheckout({
          sessionId: res.data.id,
        });
      })
      .catch((err) => console.log(err));
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

        handleStripePaymentGateway(
          paymentAmount,
          res.data.email,
          decoded.user_id
        );
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.topSection}>
        <PageTitle title={`Your Contributions`} />
        <Button
          variant="contained"
          startIcon={<Add />}
          className={classes.addButton}
          onClick={() => setPaymentDialog(true)}
        >
          Make A Contribution
        </Button>
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
