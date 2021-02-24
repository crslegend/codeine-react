import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import { useParams, useHistory } from "react-router-dom";
import components from "./components/NavbarComponents";
import { Grid, Button, IconButton, Paper } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator,
  AppointmentTooltip,
} from "@devexpress/dx-react-scheduler-material-ui";
import Toast from "../../components/Toast.js";
import Cookies from "js-cookie";
import Service from "../../AxiosService";

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

const usaTime = (date) =>
  new Date(date).toLocaleString("en-US", { timeZone: "UTC" });

const mapAppointmentData = (item) => ({
  id: item.id,
  title: item.title,
  startDate: usaTime(item.start_time),
  endDate: usaTime(item.end_time),
  //meeting_link: item.meeting_link,
  //member: handleMemberList(item.confirmed_applications),
  max_members: item.max_members,
  price_per_pax: item.price_per_pax,
  curr_members: item.confirmed_applications.length,
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
  console.log(id);

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

  const [loggedIn, setLoggedIn] = useState(true);
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
    // if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
    //   const userid = jwt_decode(Service.getJWT()).user_id;
    // }

    // Edit endpoint to get upcoming consultation
    Service.client
      .get("/consultations", {
        params: { partner_id: id, is_cancelled: "False" },
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

  // handles retrieval of all consultations
  useEffect(() => {
    handleGetAllConsultations(id, setConsultations, setLoading);
  }, [id, setConsultations, setLoading]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const weekview = React.useCallback(
    React.memo(({ onDoubleClick, startDate, ...restProps }) => (
      <WeekView.TimeTableCell {...restProps} onDoubleClick={undefined} />
    )),
    []
  );

  const Header = withStyles({ name: "Header" })(
    ({ children, appointmentData, classes, ...restProps }) => (
      <AppointmentTooltip.Header
        {...restProps}
        appointmentData={appointmentData}
      >
        <Button
          /* eslint-disable-next-line no-alert */
          onClick={() => alert(JSON.stringify(appointmentData))}
          style={{
            textTransform: "none",
            marginTop: "5px",
            marginRight: "5px",
          }}
          variant="contained"
          color="primary"
        >
          Book Now
        </Button>
      </AppointmentTooltip.Header>
    )
  );

  const Content = withStyles({ name: "Content" })(
    ({ children, appointmentData, classes, ...restProps }) => (
      <AppointmentTooltip.Content
        {...restProps}
        appointmentData={appointmentData}
      >
        <Grid
          container
          style={{
            marginTop: "15px",
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
          setLoggedIn(false);
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
            <Scheduler data={consultations} height="750">
              <ViewState defaultCurrentDate={currentDate} />
              <WeekView name="week" timeTableCellComponent={weekview} />
              <Toolbar
                {...(loading ? { rootComponent: ToolbarWithLoading } : null)}
              />
              <DateNavigator />
              <TodayButton />
              <Appointments />
              <AppointmentTooltip
                headerComponent={Header}
                contentComponent={Content}
              />
            </Scheduler>
          </Paper>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  );
};

export default BookConsult;
