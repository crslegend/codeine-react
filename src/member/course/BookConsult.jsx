import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import { useParams, useHistory } from "react-router-dom";
import components from "./components/NavbarComponents";
import {
  Grid,
  Button,
  IconButton,
  Paper,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  MonthView,
  ViewSwitcher,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import Toast from "../../components/Toast.js";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Service from "../../AxiosService";
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISH_KEY);

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  mainSection: {
    paddingTop: "65px",
    marginTop: "40px",
    minHeight: "calc(100vh - 10px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(10),
  },
  toolbarRoot: {
    position: "relative",
  },
  progress: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
}));

const ToolbarWithLoading = withStyles(styles, { name: "Toolbar" })(
  ({ children, classes, ...restProps }) => (
    <div className={classes.toolbarRoot}>
      <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
      <LinearProgress className={classes.progress} />
    </div>
  )
);

const checkMemberAlreadyBooked = (applications) => {
  const decoded = jwt_decode(Cookies.get("t1"));
  for (let i = 0; i < applications.length; i++) {
    if (decoded.user_id === applications[i].member.id) {
      return true;
    }
  }
  return false;
};

const mapAppointmentData = (item) => ({
  id: item.id,
  title: item.title,
  startDate: item.start_time,
  endDate: item.end_time,
  applications: item.confirmed_applications,
  max_members: item.max_members,
  price_per_pax: item.price_per_pax,
  curr_members: item.confirmed_applications.length,
  in_consult: checkMemberAlreadyBooked(item.confirmed_applications),
});

const initialState = {
  consultations: [],
  loading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "setLoading":
      return { ...state, loading: action.payload };
    case "setConsultations":
      return {
        ...state,
        consultations: action.payload.map(mapAppointmentData),
      };
    default:
      return state;
  }
};

const BookConsult = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

  const [currentViewName, setCurrentViewName] = useState("week");
  const [stripeDialog, setStripeDialog] = useState(false);

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

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { consultations, loading } = state;
  const currentDate = new Date();

  const setConsultations = React.useCallback(
    (nextConsultations) =>
      dispatch({
        type: "setConsultations",
        payload: nextConsultations,
      }),
    [dispatch]
  );

  const setLoading = React.useCallback(
    (nextLoading) =>
      dispatch({
        type: "setLoading",
        payload: nextLoading,
      }),
    [dispatch]
  );

  const handleGetAllConsultations = (id, setConsultations, setLoading) => {
    setLoading(true);

    // Edit endpoint to get upcoming consultation
    Service.client
      .get("/consultations", {
        params: {
          partner_id: id,
          is_cancelled: "False",
          search_date: currentDate,
        },
      })
      .then((res) => {
        setTimeout(() => {
          setConsultations(res.data);
          setLoading(false);
        }, 600);
      })
      .catch((error) => {
        setConsultations(null);
      });
  };

  const handlePaymentDialog = (slot) => {
    if (slot.in_consult === true) {
      setSbOpen(true);
      setSnackbar({
        message: "You have already signed up for this consultation slot.",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    // free consultation will not go through stripe
    if (slot.price_per_pax > 0) {
      setStripeDialog(true);
      const decoded = jwt_decode(Cookies.get("t1"));

      Service.client.get(`/auth/members/${decoded.user_id}`).then((res) => {
        const emailAdd = res.data.email;

        handleStripePaymentGateway(
          slot.price_per_pax,
          emailAdd,
          decoded.user_id,
          slot.id
        );
      });
    } else {
      Service.client
        .post(`/consultations/${slot.id}/apply`)
        .then((res) => {
          console.log(res.data);
          handleGetAllConsultations(id, setConsultations, setLoading);
          setSbOpen(true);
          setSnackbar({
            message:
              "You have successfully signed up for this consultation slot.",
            severity: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
            },
            autoHideDuration: 3000,
          });
          return;
        })
        .catch((err) => console.log(err));
    }
  };

  const handleStripePaymentGateway = async (
    amount,
    email,
    userId,
    consultationId
  ) => {
    // Get Stripe.js instance
    const stripe = await stripePromise;

    const data = {
      total_price: amount,
      email: email,
      description: "Book a consultation",
      mId: userId,
      pId: id,
      consultation: consultationId,
    };
    console.log(data);

    axios
      .post("/create-consultation-checkout-session", data)
      .then((res) => {
        console.log(res);
        stripe.redirectToCheckout({
          sessionId: res.data.id,
        });
      })
      .catch((err) => console.log(err.response));
  };

  // handles retrieval of all consultations
  useEffect(() => {
    handleGetAllConsultations(id, setConsultations, setLoading);
    // eslint-disable-next-line
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weekview = React.useCallback(
    React.memo(({ onDoubleClick, startDate, ...restProps }) => (
      <WeekView.TimeTableCell {...restProps} onDoubleClick={undefined} />
    )),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const monthview = React.useCallback(
    React.memo(({ onDoubleClick, ...restProps }) => (
      <MonthView.TimeTableCell {...restProps} onDoubleClick={undefined} />
    )),
    []
  );

  const handleCurrentViewChange = (newViewName) => {
    setCurrentViewName(newViewName);
  };

  const Content = withStyles({ name: "Content" })(
    ({ children, appointmentData, classes, ...restProps }) => (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
      >
        <Grid
          container
          style={{
            margin: "10px 0px",
            padding: "10px 0",
            backgroundColor: "#F4F4F4",
          }}
        >
          <Grid item xs={1} />
          <Grid item xs={4}>
            Price: <br />
            Maximum intake: <br />
            Availability:
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={4}>
            ${appointmentData.price_per_pax}
            <br />
            {appointmentData.max_members} <br />
            {appointmentData.max_members - appointmentData.curr_members} <br />
          </Grid>
        </Grid>
        {appointmentData.in_consult ? (
          <Typography
            variant="body2"
            style={{ color: "red", textAlign: "center" }}
          >
            You have signed up for this consultation.
          </Typography>
        ) : null}
        <Button
          /* eslint-disable-next-line no-alert */
          disabled={
            appointmentData.max_members - appointmentData.curr_members <= 0
          }
          onClick={() => handlePaymentDialog(appointmentData)}
          style={{
            textTransform: "none",
            margin: "15px 0px 15px 0px",
            float: "right",
          }}
          variant="contained"
          color="primary"
        >
          Book now
        </Button>
      </AppointmentTooltip.Content>
    )
  );

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Navbar
        logo={components.navLogo}
        bgColor="#fff"
        navbarItems={components.loggedInNavbar(() => {
          Service.removeCredentials();
          history.push("/");
        })}
      />
      <Grid container className={classes.mainSection}>
        <Grid item xs={1}>
          <IconButton
            style={{
              marginTop: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
            onClick={() => history.goBack()}
          >
            <ArrowBack />
          </IconButton>
        </Grid>
        <Grid item xs={10}>
          <Paper>
            <Scheduler data={consultations} height="auto">
              <ViewState
                defaultCurrentDate={currentDate}
                currentViewName={currentViewName}
                onCurrentViewNameChange={handleCurrentViewChange}
              />
              <WeekView
                name="week"
                timeTableCellComponent={weekview}
                cellDuration={60}
                startDayHour={6}
              />
              <MonthView name="month" timeTableCellComponent={monthview} />
              <Toolbar
                {...(loading ? { rootComponent: ToolbarWithLoading } : null)}
              />
              <DateNavigator />
              <TodayButton />
              <Appointments />
              <AppointmentTooltip contentComponent={Content} />
              <ViewSwitcher />
            </Scheduler>
          </Paper>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
      <Dialog style={{ textAlign: "center" }} open={stripeDialog}>
        <DialogTitle>Please wait</DialogTitle>
        <DialogContent>Redirecting to payment gateway...</DialogContent>
      </Dialog>
    </div>
  );
};

export default BookConsult;
