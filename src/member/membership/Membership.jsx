import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import pricing from "../../assets/PricingAsset.png";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import MemberNavBar from "../MemberNavBar";
import PageTitle from "../../components/PageTitle";
import {
  DialogActions,
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  DialogTitle,
} from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";
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
    backgroundColor: "#F7DF1E",
    color: "#000",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    fontSize: 16,
  },
  toggle: {
    border: "1px solid #437FC7",
    color: "#437FC7",
    "&.Mui-selected": {
      backgroundColor: "#164D8F",
      color: "#fff",
      "&:hover": {
        backgroundColor: "#164D8F",
        color: "#fff",
      },
    },
  },
  superscript: {
    padding: "3px",
    borderTopRightRadius: "12px",
    borderBottomRightRadius: "12px",
    backgroundColor: theme.palette.yellow.main,
    color: "#000",
    marginLeft: "0px",
    lineHeight: "0px",
    fontWeight: 600,
  },
}));

const Membership = () => {
  const classes = useStyles();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);

  const [month, setMonth] = useState(1);
  const [user, setUser] = useState();
  const [plan, setPlan] = useState({
    monthly: true,
    annual: false,
  });

  const [pendingDialog, setPendingDialog] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
      const decoded = jwt_decode(Cookies.get("t1"));
      // console.log(decoded);
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          // console.log(res);

          setUser(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleStripePaymentGateway = async (
    amount,
    email,
    userId,
    numOfMonths,
    transactionId
  ) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    const data = {
      total_price: amount * numOfMonths,
      email: email,
      description:
        numOfMonths && numOfMonths === 1
          ? `Pro Membership for 1 Month`
          : `Pro Membership for ${numOfMonths} Months`,
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

  const handlePayment = () => {
    // console.log(user);

    const data = {
      subscription_fee: plan && plan.monthly ? "5.99" : "3.99",
      payment_type: "Credit Card",
      month_duration: parseInt(month),
    };
    // console.log(data);
    Service.client
      .post(`/auth/membership-subscriptions`, data)
      .then((res) => {
        // console.log(res);

        handleStripePaymentGateway(
          parseFloat(data.subscription_fee),
          user.email,
          user.id,
          month,
          res.data.id
        );
      })
      .catch((err) => {
        console.log(err);
        setPendingDialog(true);
      });
  };

  useEffect(() => {
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <div
          style={{
            width: "80%",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "20px",
          }}
        >
          <PageTitle title="Pro Membership" />
          <div
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <div style={{ width: "60%" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img alt="pricing plan" src={pricing} width="100%" />
              </div>
            </div>
            <div style={{ width: "10%" }} />
            <div
              style={{ width: "40%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h5" style={{ paddingBottom: "20px" }}>
                Choose Your Membership Plan
              </Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <ToggleButton
                  value="monthly"
                  style={{ marginRight: "20px", height: 35 }}
                  selected={plan && plan.monthly}
                  onClick={() => {
                    setPlan({
                      monthly: true,
                      annual: false,
                    });
                    setMonth(1);
                  }}
                  className={classes.toggle}
                >
                  Monthly
                </ToggleButton>
                <div>
                  <ToggleButton
                    value="annual"
                    selected={plan && plan.annual}
                    style={{ height: 35 }}
                    onClick={() => {
                      setPlan({
                        monthly: false,
                        annual: true,
                      });
                      setMonth(12);
                    }}
                    className={classes.toggle}
                  >
                    Annual
                  </ToggleButton>
                  <sup className={classes.superscript}>Save $24!</sup>
                </div>
              </div>

              {plan && plan.monthly && (
                <div>
                  <label htmlFor="month">
                    <Typography variant="body1">
                      Enter number of months
                    </Typography>
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
                    autoFocus
                  />
                </div>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={() => handlePayment()}
                style={{ marginTop: "20px" }}
              >
                Proceed To Pay
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={pendingDialog} onClose={() => setPendingDialog(false)}>
        <DialogTitle>Pending Transaction</DialogTitle>
        <DialogContent>
          You have a past transaction that is still pending for completion
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push(`/member/payment`)}
          >
            Bring Me There
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default Membership;
