import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { AttachMoney } from "@material-ui/icons";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";

import Calendar from "./Calendar";
import AddConsultation from "./AddConsultation";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    marginLeft: "20px",
  },
  rate: {
    marginTop: "40px",
    borderRadius: "10px",
    "& label": {
      color: "#000000",
    },
  },
}));

const Consultation = () => {
  const classes = useStyles();
  const [rate, setRate] = useState("0");
  const [submitRate, setSubmitRate] = useState(false);

  const handleRateChange = (event) => {
    setRate(event.target.value);
  };

  const updateRate = () => {
    setSubmitRate(false);

    const formData = new FormData();
    formData.append("consultation_rate", rate);

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      console.log(userid);
      Service.client
        .put(`/auth/partners/${userid}`, formData)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      console.log(userid);
      Service.client
        .get(`/auth/partners/${userid}`)
        .then((res) => {
          setRate(res.data.partner.consultation_rate);
          console.log(res.data);
        })
        .catch((error) => {
          setRate(0);
        });
    }
  }, [setRate]);

  console.log(rate);

  return (
    <div className={classes.root}>
      <Typography variant="h1" style={{ marginBottom: "50px" }}>
        Upcoming schedule at a glance
      </Typography>
      <Calendar />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <TextField
          className={classes.rate}
          id="consultation-rate"
          label="Consultation Rate (per hour)"
          type="number"
          value={rate}
          onChange={handleRateChange}
          InputProps={{
            inputProps: { min: 0 },
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney style={{ fontSize: "large" }} />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              console.log("Enter key pressed");
              setSubmitRate(true);
            }
          }}
          helperText="Press enter to confirm update"
        />
        <AddConsultation />
      </div>
      <Dialog open={submitRate}>
        <DialogTitle className={classes.dialog}>Please confirm!</DialogTitle>
        <DialogContent>Update consultation rate to ${rate}?</DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitRate(false)}>Cancel</Button>
          <Button onClick={updateRate}>Okay</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Consultation;
