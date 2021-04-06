import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../MemberNavBar";
import {
  Grid,
  Button,
  CardMedia,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Breadcrumbs,
  Typography,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import Footer from "../landing/Footer";
import Service from "../../AxiosService";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import Toast from "../../components/Toast.js";
import Label from "../landing/components/Label";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  mainSection: {
    paddingTop: "65px",
    // minHeight: "calc(80vh - 10px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(10),
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
  cardmedia: {
    height: "100%",
    width: "7vw",
  },
}));

const ViewIndustryProjectDetails = () => {
  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  const classes = useStyles();
  const history = useHistory();
  const [industryProject, setIndustryProject] = useState();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [decoded, setDecoded] = useState("");
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

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [onlyForProDialog, setOnlyForProDialog] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
      setDecoded(jwt_decode(Cookies.get("t1")));
    }
  };

  const getlndustryProject = () => {
    Service.client
      .get(`/industry-projects/${id}`)
      .then((res) => {
        // console.log(res);
        setIndustryProject(res.data);
        let newCategories = { ...categories };
        for (let i = 0; i < res.data.categories.length; i++) {
          newCategories = {
            ...newCategories,
            [res.data.categories[i]]: true,
          };
        }
        setCategories(newCategories);
      })
      .catch((err) => console.log(err));
  };

  const logEventForAnalytics = () => {
    // ANALYTICS: log user stats when viewing a project listing
    if (Cookies.get("t1")) {
      Service.client
        .post(
          `/analytics`,
          { payload: "view industry project" },
          {
            params: {
              industry_project_id: id,
            },
          }
        )
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
    getlndustryProject();
    logEventForAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    Service.client.get(`/auth/members/${decoded.user_id}`).then((res) => {
      // to check whether member applying is pro-tier
      if (res.data.member.membership_tier !== "FREE") {
        Service.client
          .post(`/industry-projects/${id}/applications`)
          .then((res) => {
            setOpenApplyDialog(false);
            setSbOpen(true);
            setSnackbar({
              message: "You have successfully applied!",
              severity: "success",
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
              autoHideDuration: 3000,
            });
          })
          .catch((err) => console.log(err));
      } else {
        setOnlyForProDialog(true);
      }
    });
  };

  const handleClose = () => {
    setOpenApplyDialog(false);
    setOnlyForProDialog(false);
  };

  const handleOpenApplyDialog = () => {
    setOpenApplyDialog(true);
  };

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div className={classes.mainSection}>
        <Breadcrumbs
          style={{ margin: "20px 0px" }}
          separator="›"
          aria-label="breadcrumb"
        >
          <Link
            className={classes.backLink}
            onClick={() => history.push("/industryprojects")}
          >
            <Typography style={{ marginRight: "8px" }} variant="body1">
              All Industry Projects
            </Typography>
          </Link>
          <Typography variant="body1">Overview</Typography>
        </Breadcrumbs>

        {industryProject ? (
          <div>
            <div className={classes.titleSection}>
              <Grid container justify="space-between">
                <Grid style={{ backgroundColor: "#FFF" }} item xs={1}>
                  <CardMedia
                    className={classes.cardmedia}
                    image={
                      industryProject.partner.partner.organization
                        .organization_photo
                    }
                    title="Organisation Photo"
                  ></CardMedia>
                </Grid>
                <Grid style={{ backgroundColor: "#FFF" }} item xs={11}>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                        }}
                        variant="h5"
                      >
                        {industryProject && industryProject.title}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenApplyDialog}
                      >
                        Apply
                      </Button>
                    </div>
                    <Typography variant="h6">
                      {industryProject &&
                        industryProject.partner.partner.organization
                          .organization_name}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "5px",
                      }}
                    ></div>
                  </CardContent>
                </Grid>
                <div
                  style={{
                    width: "61%",
                    backgroundColor: "#FFF",
                    marginTop: 20,
                  }}
                >
                  <CardContent>
                    <Typography style={{ fontWeight: 600 }}>
                      Categories
                    </Typography>
                    <div style={{ display: "flex", marginTop: 5 }}>
                      {industryProject &&
                        industryProject.categories.map((category) => (
                          <Label label={category} />
                        ))}
                      {console.log(industryProject)}
                    </div>
                    <Typography
                      style={{
                        marginTop: 15,
                        marginBottom: 5,
                        fontWeight: 600,
                      }}
                    >
                      Description
                    </Typography>
                    {industryProject && industryProject.description}
                  </CardContent>
                </div>
                <div
                  style={{
                    width: "36%",
                    backgroundColor: "#FFF",
                    marginTop: 20,
                  }}
                >
                  <CardContent>
                    <Typography style={{ fontWeight: 600 }}>
                      Date Listed:
                    </Typography>
                    {industryProject && formatDate(industryProject.date_listed)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      Start Date:
                    </Typography>
                    {industryProject && formatDate(industryProject.start_date)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      End Date:
                    </Typography>
                    {industryProject && formatDate(industryProject.end_date)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      Application Deadline:
                    </Typography>
                    {industryProject &&
                      formatDate(industryProject.application_deadline)}
                  </CardContent>
                </div>
              </Grid>
            </div>
          </div>
        ) : (
          <div>Loading....</div>
        )}
      </div>

      <Dialog
        open={onlyForProDialog}
        onClose={() => setOnlyForProDialog(false)}
        PaperProps={{
          style: {
            width: "500px",
          },
        }}
      >
        <DialogTitle>This course is only for pro-tier members</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              setOnlyForProDialog(false);
            }}
          >
            Stay as Free-Tier
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // direct user to pay for pro-tier membership
              history.push(`/member/payment`);
            }}
          >
            Upgrade to Pro-Tier
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
      <Dialog
        open={openApplyDialog}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Apply</DialogTitle>
        <DialogContent>
          You are applying for this industry project.
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setOpenApplyDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              handleSubmit();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewIndustryProjectDetails;
