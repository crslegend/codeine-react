import React, { Fragment, useEffect, useState } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  ViewSwitcher,
  MonthView,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator,
  AppointmentForm,
  AppointmentTooltip,
  ConfirmationDialog,
  AllDayPanel,
} from "@devexpress/dx-react-scheduler-material-ui";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";

const messages = {
  moreInformationLabel: "",
};

const styles = {
  toolbarRoot: {
    position: "relative",
  },
  progress: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    left: 0,
  },
};

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

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
  title: !item.member
    ? item.title
    : `Consultation with ${item.member.first_name} ${item.member.last_name}`,
  startDate: usaTime(item.start_time),
  endDate: usaTime(item.end_time),
  meeting_link: item.meeting_link,
  member: item.member,
  rRule: item.rRule,
  allDay: item.allDay,
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

const handleGetAllConsultations = (setConsultations, setLoading) => {
  setLoading(true);
  if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
    const userid = jwt_decode(Service.getJWT()).user_id;
    Service.client
      .get("/consultations", { params: { search: userid } })
      .then((res) => {
        setTimeout(() => {
          setConsultations(res.data);
          setLoading(false);
        }, 600);
      })
      .catch((error) => {
        setConsultations(null);
      });
  }
};

const Calendar = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { consultations, loading } = state;
  const [currentViewName, setCurrentViewName] = useState("week");
  const currentDate = new Date();
  const [allowDeleting, setAllowDeleting] = useState(true);
  const [allowUpdating, setAllowUpdating] = useState(true);

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

  // handles retrieval of all consultations
  useEffect(() => {
    handleGetAllConsultations(setConsultations, setLoading);
  }, [setConsultations, setLoading]);

  // handles updating of consultation slot
  const handleUpdate = React.useCallback(
    (id, appointment) => {
      let updateConsult = {};

      if (appointment.endDate !== undefined) {
        appointment.endDate = new Date(appointment.endDate);
        console.log(appointment.endDate);
        appointment.endDate = new Date(
          appointment.endDate.toString().replace(/GMT.*$/, "GMT+0000")
        ).toISOString("en-US", { timeZone: "UTC" });
        console.log(appointment.endDate);
        updateConsult = {
          ...updateConsult,
          end_time: appointment.endDate,
        };
      }
      if (appointment.startDate !== undefined) {
        appointment.startDate = new Date(appointment.startDate);
        console.log(appointment.startDate);
        appointment.startDate = new Date(
          appointment.startDate.toString().replace(/GMT.*$/, "GMT+0000")
        ).toISOString("en-US", { timeZone: "UTC" });
        console.log(appointment.startDate);
        updateConsult = {
          ...updateConsult,
          start_time: appointment.startDate,
        };
      }

      if (appointment.title !== undefined) {
        updateConsult = {
          ...updateConsult,
          title: appointment.title,
        };
      }

      if (appointment.meeting_link !== undefined) {
        updateConsult = {
          ...updateConsult,
          meeting_link: appointment.meeting_link,
        };
      }
      console.log(updateConsult);

      if (appointment.rRule !== undefined) {
        updateConsult = {
          ...updateConsult,
          rRule: appointment.rRule,
        };
      }
      console.log(appointment.rRule);

      if (appointment.allDay !== undefined) {
        updateConsult = {
          ...updateConsult,
          allDay: appointment.allDay,
        };
      }
      console.log(appointment.allDay);

      Service.client
        .put(`/consultations/${id}`, updateConsult)
        .then((res) => {
          console.log(res);
          handleGetAllConsultations(setConsultations, setLoading);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [setConsultations, setLoading]
  );

  // handles deletion of consultation slot
  const handleDelete = React.useCallback(
    (id) => {
      console.log(id);
      Service.client
        .delete(`/consultations/${id}`)
        .then((res) => {
          console.log(res);
          handleGetAllConsultations(setConsultations, setLoading);
        })
        .catch((error) => {
          console.log(id);
          console.log(error);
        });
    },
    [setConsultations, setLoading]
  );

  const BasicLayout = ({
    onFieldChange,
    appointmentData,
    readOnly,
    ...restProps
  }) => {
    const onLinkChange = (nextValue) => {
      onFieldChange({ meeting_link: nextValue });
    };

    if (
      appointmentData.member === undefined ||
      appointmentData.member === null
    ) {
      setAllowDeleting(true);
    } else {
      setAllowDeleting(false);
    }

    if (appointmentData.endDate < currentDate) {
      setAllowUpdating(false);
      setAllowDeleting(false);
    } else {
      setAllowUpdating(true);
    }

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        readOnly={!allowDeleting || !allowUpdating}
        {...restProps}
      >
        <AppointmentForm.Label
          style={{ marginTop: "10px" }}
          text="Conference Link"
          type="title"
        />
        <AppointmentForm.TextEditor
          value={appointmentData.meeting_link}
          onValueChange={onLinkChange}
          readOnly={!allowUpdating}
          placeholder="Enter conference link"
        />
        <AppointmentForm.Label
          style={{ marginTop: "10px" }}
          text="Member"
          type="title"
        />
        <AppointmentForm.TextEditor value={appointmentData.member} readOnly />

        {console.log(allowDeleting)}
      </AppointmentForm.BasicLayout>
    );
  };

  const handleCurrentViewChange = (newViewName) => {
    setCurrentViewName(newViewName);
  };

  const onCommitChanges = React.useCallback(
    ({ changed, deleted }) => {
      if (changed) {
        consultations.map((appointment) =>
          changed[appointment.id]
            ? handleUpdate(appointment.id, changed[appointment.id])
            : appointment
        );
      }
      if (deleted !== undefined) {
        consultations.forEach((appointment) => {
          if (appointment.id === deleted) {
            console.log(appointment.id);
            handleDelete(deleted);
          }
        });
      }
    },
    [consultations, handleUpdate, handleDelete]
  );

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

  const CommandButton = React.useCallback(
    ({ id, ...restProps }) => {
      if (id === "deleteButton") {
        return (
          <AppointmentForm.CommandButton
            id={id}
            {...restProps}
            disabled={!allowDeleting}
          />
        );
      }
      if (id === "saveButton") {
        return (
          <AppointmentForm.CommandButton
            id={id}
            {...restProps}
            disabled={!allowUpdating}
          />
        );
      }
      return <AppointmentForm.CommandButton id={id} {...restProps} />;
    },
    [allowDeleting, allowUpdating]
  );

  return (
    <Fragment>
      <Paper>
        <Scheduler data={consultations} height="700">
          <ViewState
            defaultCurrentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={handleCurrentViewChange}
          />
          <EditingState onCommitChanges={onCommitChanges} />
          <IntegratedEditing />
          <WeekView name="week" timeTableCellComponent={weekview} />
          <MonthView name="month" timeTableCellComponent={monthview} />
          <Toolbar
            {...(loading ? { rootComponent: ToolbarWithLoading } : null)}
          />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <AppointmentTooltip showOpenButton />
          <AppointmentForm
            commandButtonComponent={CommandButton}
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
            messages={messages}
          />
          <ViewSwitcher />
          <AllDayPanel />
          <ConfirmationDialog />
        </Scheduler>
      </Paper>
    </Fragment>
  );
};

export default Calendar;
