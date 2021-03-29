import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import Navbar from "../components/Navbar";
import logo from "../assets/codeineLogos/Member.svg";
import {
  Avatar,
  ListItem,
  Typography,
  Popover,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@material-ui/core";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import pricing from "../assets/PricingAsset.png";

import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const useStyles = makeStyles((theme) => ({
  popover: {
    width: "300px",
    padding: theme.spacing(1),
  },
  typography: {
    cursor: "pointer",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#f5f5f5",
      cursor: "pointer",
    },
  },
  toprow: {
    display: "flex",
    marginBottom: "5px",
    padding: theme.spacing(1),
    "&:hover": {
      backgroundColor: "#f5f5f5",
      cursor: "pointer",
    },
  },
}));

const MemberNavBar = (props) => {
  const classes = useStyles();
  const { loggedIn, setLoggedIn } = props;
  const history = useHistory();

  const [user, setUser] = useState({
    first_name: "Member",
    email: "Member panel",
    profile_photo: "",
  });
  const [upgradeToProDialog, setUpgradeToProDialog] = useState(false);
  const [month, setMonth] = useState(1);

  const getUserDetails = () => {
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      // console.log(decoded);
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          if (!res.data.member) {
            //history.push("/404");
          } else {
            setUser(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getUserDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const navLogo = (
    <Fragment>
      <a
        href="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" alt="" />
      </a>
    </Fragment>
  );

  const loggedOutNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="outlined"
          component={Link}
          to="/partner"
          style={{ textTransform: "capitalize" }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Teach on Codeine
          </Typography>
        </Button>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          to="/member/login"
          variant="outlined"
          component={Link}
          style={{ textTransform: "capitalize" }}
          color="primary"
        >
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Button>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/member/register"
          style={{
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const loggedInNavBar = (
    <Fragment>
      {user && user.member && user.member.membership_tier !== "PRO" && (
        <ListItem style={{ whiteSpace: "nowrap" }}>
          <Button
            variant="outlined"
            color="primary"
            style={{ textTransform: "none" }}
            onClick={() => setUpgradeToProDialog(true)}
          >
            Upgrade
          </Button>
        </ListItem>
      )}
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Avatar
          onClick={handleClick}
          src={user && user.profile_photo}
          alt=""
          style={{ width: "34px", height: "34px", cursor: "pointer" }}
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className={classes.popover}>
            <div className={classes.toprow}>
              <Avatar
                src={user && user.profile_photo}
                alt=""
                style={{ width: "55px", height: "55px", marginRight: "15px" }}
              />
              <div
                style={{
                  flexDirection: "column",
                  width: "100%",
                }}
                onClick={() => {
                  history.push("/member/profile");
                }}
              >
                <Typography
                  style={{
                    fontWeight: "600",
                    paddingTop: "5px",
                    cursor: "pointer",
                  }}
                >
                  {user && user.first_name + " " + user.last_name}
                </Typography>
                <Typography
                  style={{
                    fontSize: "14px",
                    color: "#757575",
                    cursor: "pointer",
                  }}
                >
                  Manage your profile
                </Typography>
              </div>
            </div>

            <Divider style={{ marginBottom: "5px" }} />

            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/member/dashboard");
                // alert("Clicked on Dashboard");
              }}
            >
              Dashboard
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/member/courses");
              }}
            >
              Courses
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/member/consultations");
              }}
            >
              Consultations
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/member/articles");
              }}
            >
              Articles
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                //history.push("/");
                alert("clicked on Industry projects");
              }}
            >
              Industry Projects
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                //history.push("/");
                alert("clicked on Helpdesk");
              }}
            >
              Helpdesk
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/member/payment");
              }}
            >
              My Payments
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                Service.removeCredentials();
                setLoggedIn(false);
                history.push("/");
              }}
            >
              Log out
            </Typography>
          </div>
        </Popover>
      </ListItem>
    </Fragment>
  );

  return (
    <Fragment>
      <Navbar
        logo={navLogo}
        navbarItems={loggedIn ? loggedInNavBar : loggedOutNavbar}
        bgColor="#fff"
      />
      <Dialog
        open={upgradeToProDialog}
        onClose={() => setUpgradeToProDialog(false)}
        PaperProps={{
          style: {
            width: "600px",
          },
        }}
      >
        <DialogTitle>Upgrade To Pro-Tier</DialogTitle>
        <DialogContent>
          <Typography variant="h6" style={{ paddingBottom: "20px" }}>
            Price per month: <span style={{ color: "#437FC7" }}>$5.99</span>
          </Typography>
          <img width="100%" alt="pricing" src={pricing}></img>
          <label htmlFor="month">
            <Typography variant="body1" style={{ marginTop: "20px" }}>
              Enter number of months for Pro-Tier
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
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setUpgradeToProDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePayment()}
          >
            Proceed To Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default MemberNavBar;
