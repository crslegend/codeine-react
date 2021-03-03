import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Service from "../../AxiosService";
import logo from "../../assets/CodeineLogos/Partner.svg";

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

const ContentProviderRegisterPage = () => {
  const classes = useStyles();
  // const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1);

  const [awaitApproval, setAwaitApproval] = useState(false);

  const [registerDetails, setRegisterDetails] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [enterprise, setEnterprise] = useState(false);
  const [company, setCompany] = useState();

  const handleEmailChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      password: e.target.value,
    });
  };

  const handleNameChange = (e) => {
    if (e.target.name === "first") {
      setRegisterDetails({
        ...registerDetails,
        first_name: e.target.value,
      });
    } else {
      setRegisterDetails({
        ...registerDetails,
        last_name: e.target.value,
      });
    }
  };

  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };

  // const handlePageChange = (e) => {
  //   e.preventDefault();
  //   setPageNum(2);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // call admin register ednpoint
    if (company) {
      const data = { ...registerDetails, organization_name: company };
      Service.client
        .post("/auth/partners", data, {
          timeout: 20000,
        })
        .then((res) => {
          // console.log(res);
          setLoading(false);
          setAwaitApproval(true);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      Service.client
        .post("/auth/partners", registerDetails, {
          timeout: 20000,
        })
        .then((res) => {
          // console.log(res);
          setLoading(false);
          setAwaitApproval(true);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };

  if (awaitApproval) {
    return (
      <div>
        <Paper elevation={3} className={classes.paper}>
          <Link to="/partner" className={classes.codeineLogo}>
            <img src={logo} alt="logo" width="90%" />
          </Link>
          <Typography
            variant="h5"
            style={{ paddingTop: "20px", fontWeight: 600, textAlign: "center" }}
          >
            Thank you for registering with Codeine!
          </Typography>
          <Typography
            variant="body1"
            style={{ paddingTop: "10px", textAlign: "center" }}
          >
            Please check your email to activate you account!
          </Typography>
        </Paper>
      </div>
    );
  }

  if (pageNum === 1) {
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} className={classes.paper}>
            <Link to="/partner" className={classes.codeineLogo}>
              <img src={logo} alt="logo" width="110%" />
            </Link>
            <TextField
              variant="outlined"
              margin="dense"
              placeholder="First Name"
              value={registerDetails && registerDetails.first_name}
              onChange={handleNameChange}
              type="text"
              required
              name="first"
            />
            <TextField
              variant="outlined"
              margin="dense"
              placeholder="Last Name"
              value={registerDetails && registerDetails.last_name}
              onChange={handleNameChange}
              type="text"
              required
              name="last"
            />
            <TextField
              variant="outlined"
              margin="dense"
              placeholder="Email"
              value={registerDetails && registerDetails.email}
              onChange={handleEmailChange}
              type="email"
              required
            />
            <TextField
              variant="outlined"
              margin="dense"
              placeholder="Password"
              value={registerDetails && registerDetails.password}
              onChange={handlePasswordChange}
              type="password"
              required
            />
            {enterprise && (
              <TextField
                variant="outlined"
                margin="dense"
                placeholder="Company"
                value={registerDetails && registerDetails.company_name}
                onChange={handleCompanyChange}
                type="text"
                required={enterprise}
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={enterprise}
                  onChange={() => setEnterprise(!enterprise)}
                  color="primary"
                />
              }
              label="Register as Enterprise"
            />

            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
            >
              {loading ? (
                <CircularProgress size="1.5rem" style={{ color: "#FFF" }} />
              ) : (
                "Register"
              )}
            </Button>

            {/* <Button
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
            >
              Next Step
            </Button> */}

            <Typography variant="body1">
              Already have an account? Click{" "}
              <span>
                <Link
                  to="/partner/login"
                  style={{ textDecoration: "none", color: "#437FC7" }}
                >
                  here
                </Link>
              </span>{" "}
              to login!
            </Typography>
          </Paper>
        </form>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Paper elevation={3} className={classes.paper}>
          <Link to="/partner" className={classes.codeineLogo}>
            <img src={logo} alt="logo" width="90%" />
          </Link>
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="First Name"
            value={registerDetails && registerDetails.first_name}
            onChange={handleNameChange}
            type="text"
            required
            name="first"
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Last Name"
            value={registerDetails && registerDetails.last_name}
            onChange={handleNameChange}
            type="text"
            required
            name="last"
          />
          {enterprise && (
            <TextField
              variant="outlined"
              margin="dense"
              placeholder="Company"
              value={registerDetails && registerDetails.company_name}
              onChange={handleCompanyChange}
              type="text"
              required={enterprise}
            />
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={enterprise}
                onChange={() => setEnterprise(!enterprise)}
                color="primary"
              />
            }
            label="Register as Enterprise"
          />
          <div>
            <Button
              variant="contained"
              // color="secondary"
              className={classes.button}
              style={{ marginRight: "20px" }}
              onClick={() => setPageNum(1)}
            >
              Back
            </Button>
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              className={classes.button}
              type="submit"
            >
              {loading ? (
                <CircularProgress size="1.5rem" style={{ color: "#FFF" }} />
              ) : (
                "Register"
              )}
            </Button>
          </div>

          <Typography variant="body1">
            Already have an account? Click{" "}
            <span>
              <Link
                to="/partner/login"
                style={{ textDecoration: "none", color: "#437FC7" }}
              >
                here
              </Link>
            </span>{" "}
            to login!
          </Typography>
        </Paper>
      </form>
    </div>
  );
};

export default ContentProviderRegisterPage;
