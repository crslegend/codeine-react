import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  CircularProgress,
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
    company_name: "",
    job_title: "",
    bio: "",
  });

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
    setRegisterDetails({
      ...registerDetails,
      company_name: e.target.value,
    });
  };

  const handleJobTitleChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      job_title: e.target.value,
    });
  };

  const handleBioChange = (e) => {
    setRegisterDetails({
      ...registerDetails,
      bio: e.target.value,
    });
  };

  const handlePageChange = (e) => {
    e.preventDefault();
    setPageNum(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // call admin login ednpoint
    Service.client
      .post("/auth/contentProviders", registerDetails)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setAwaitApproval(true);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
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
            Our admins are currently reviewing your application. An email will
            be sent to you once your application has been approved.
          </Typography>
        </Paper>
      </div>
    );
  }

  if (pageNum === 1) {
    return (
      <div>
        <form onSubmit={handlePageChange}>
          <Paper elevation={3} className={classes.paper}>
            <Link to="/partner" className={classes.codeineLogo}>
              <img src={logo} alt="logo" width="90%" />
            </Link>
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
                "Next Step"
              )}
            </Button>

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
            placeholder="Company"
            value={registerDetails && registerDetails.company_name}
            onChange={handleCompanyChange}
            type="text"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Job Title"
            value={registerDetails && registerDetails.job_title}
            onChange={handleJobTitleChange}
            type="text"
            required
          />
          <TextField
            variant="outlined"
            margin="dense"
            placeholder="Bio"
            value={registerDetails && registerDetails.bio}
            onChange={handleBioChange}
            type="text"
            required
            multiline
            rows={3}
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
