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
import { Button, TextField, Typography } from "@material-ui/core";
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
    backgroundColor: "  #F7DF1E",
    color: "#000",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    fontSize: 16,
  },
}));

const Membership = () => {
  const classes = useStyles();

  const [loggedIn, setLoggedIn] = useState(false);

  const [month, setMonth] = useState(1);
  const [user, setUser] = useState();

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
          ? `Pro-Tier for 1 Month`
          : `Pro-Tier for ${numOfMonths} Months`,
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
      subscription_fee: "5.99",
      payment_type: "Credit Card",
      month_duration: parseInt(month),
    };
    // console.log(data);
    Service.client
      .post(`/auth/membership-subscriptions`, data)
      .then((res) => {
        // console.log(res);

        handleStripePaymentGateway(
          5.99,
          user.email,
          user.id,
          month,
          res.data.id
        );
      })
      .catch((err) => console.log(err));
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
          <PageTitle title="Pro-Tier Membership" />
          <div
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <div style={{ width: "60%" }}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <img alt="pricing plan" src={pricing} width="85%" />
              </div>
            </div>
            <div style={{ width: "10%" }} />
            <div
              style={{ width: "40%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h5" style={{ paddingBottom: "10px" }}>
                Enter the number of months for membership below
              </Typography>
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
    </Fragment>
  );
};

export default Membership;
