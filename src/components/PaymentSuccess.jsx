import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper, Typography } from "@material-ui/core";
import { useLocation, useHistory } from "react-router-dom";
import Service from "../AxiosService";
import logo from "../assets/codeineLogos/Partner.svg";
import logo1 from "../assets/codeineLogos/Member.svg";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  codeineLogo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10px",
    width: "25%",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "40%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateX(-50%) translateY(-50%)",
    padding: "20px 30px",
  },
  button: {
    marginTop: "20px",
    marginBottom: "20px",
    width: 120,
  },
}));

const PaymentSuccess = () => {
  const classes = styles();
  // const { id } = useParams();
  const location = useLocation();
  const history = useHistory();

  const [user, setUser] = useState();

  const handleRedirect = () => {
    if (user === "partner") {
      history.push(`/partner/home/contributions`);
    } else {
      // return to member consult
      history.push(`/member/consultation`);
    }
  };

  useEffect(() => {
    if (new URLSearchParams(location.search).get("pId") !== null) {
      setUser("partner");
    } else {
      setUser("member");
    }

    // in future create payment transaction for the user
    if (new URLSearchParams(location.search).get("contribution") !== null) {
      const contributionId = new URLSearchParams(location.search).get(
        "contribution"
      );
      Service.client
        .patch(`/contributions/${contributionId}/update`, {
          payment_status: "COMPLETED",
        })
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));
    }

    // in future create consultation application for member
    if (new URLSearchParams(location.search).get("consultation") !== null) {
      const consultationId = new URLSearchParams(location.search).get(
        "consultation"
      );
      console.log(consultationId);

      Service.client
        .post(`/consultations/${consultationId}/apply`)
        .then((res) => {
          // console.log(res.data);
          handlePaymentSuccess(
            res.data.id,
            res.data.consultation_slot.price_per_pax
          );
        })
        .catch((err) => console.log(err));
    }

    // create transaction for upgrade to pro-tier for member
    if (
      new URLSearchParams(location.search).get("upgradeTransaction") !== null
    ) {
      const upgradeId = new URLSearchParams(location.search).get(
        "upgradeTransaction"
      );

      Service.client
        .patch(`auth/membership-subscriptions/${upgradeId}/update`, {
          payment_status: "COMPLETED",
        })
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePaymentSuccess = (applicationId, price) => {
    Service.client
      .post(`/consultations/application/${applicationId}/payment`, {
        payment_amount: price.toString(),
        payment_type: "VISA",
        payment_status: "COMPLETED",
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <div className={classes.codeineLogo}>
          <img
            src={user && user === "partner" ? logo : logo1}
            alt="logo"
            width="90%"
          />
        </div>
        <Typography
          variant="h5"
          style={{ paddingTop: "20px", fontWeight: 600, textAlign: "center" }}
        >
          We have received your payment!
        </Typography>
        <Typography
          variant="body1"
          style={{ paddingTop: "10px", textAlign: "center" }}
        >
          Click on the button below to continue.
        </Typography>
        {user && user === "partner" ? (
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "25px" }}
            onClick={() => handleRedirect()}
          >
            View My Contributions
          </Button>
        ) : new URLSearchParams(location.search).get("consultation") !==
          null ? (
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "25px" }}
            onClick={() => handleRedirect()}
          >
            Go Back To Consultations
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "25px" }}
            onClick={() => history.push(`/member/payment`)}
          >
            Go Back To My Payments
          </Button>
        )}
      </Paper>
    </div>
  );
};

export default PaymentSuccess;
