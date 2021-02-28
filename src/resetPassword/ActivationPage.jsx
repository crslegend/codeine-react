import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import logo from "../assets/CodeineLogos/Member.svg";
import Service from "../AxiosService";

const useStyles = makeStyles((theme) => ({
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
    minWidth: "120px",
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

const ActivationPage = () => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      //if member, go to member landing page
      Service.client
        .get(`/auth/members/${id}`)
        .then((res) => {
          Service.client.post(`/auth/members/${id}/activate`).then((res) => {
            history.push("/member/login");
          });
        })
        .catch((err) => {});
      Service.client
        .get(`/auth/partners/${id}`)
        .then((res) => {
          Service.client.post(`/auth/partners/${id}/activate`).then((res) => {
            history.push("/partner/login");
          });
        })
        .catch((err) => {});
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Paper elevation={3} className={classes.paper}>
        <Link to="/" className={classes.codeineLogo}>
          <img src={logo} alt="logo" width="90%" />
        </Link>
        <Typography
          variant="body1"
          style={{ paddingTop: "10px", textAlign: "center" }}
        >
          Your account has been activated successfully!
        </Typography>
        <Typography
          variant="body1"
          style={{ paddingTop: "10px", textAlign: "center" }}
        >
          Please wait while we re-direct you to login.
        </Typography>
      </Paper>
    </div>
  );
};

export default ActivationPage;
