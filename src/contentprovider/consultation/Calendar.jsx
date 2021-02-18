import React, { Fragment, useEffect, useState } from "react";
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
} from "@devexpress/dx-react-scheduler-material-ui";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import { consults } from "./Data";

const messages = {
  moreInformationLabel: "",
};

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const mapAppointmentData = (item) => ({
  id: item.id,
  title: !item.member
    ? "Open"
    : `Consultation with ${item.member.first_name} ${item.member.last_name}`,
  startDate: new Date(item.start_time),
  endDate: new Date(item.end_time),
  meeting_link: item.meeting_link,
  rejected: item.is_rejected,
  confirmed: item.is_confirmed,
  member: item.member,
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

const Calendar = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { consultations, loading } = state;
  //const [consultations, setConsultations] = useState(consults);
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

  /*useEffect(() => {
    setLoading(true);
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_partner_id;
      Service.client
        .get("/consultations", { params: { partner__user__id: userid } })
        .then((res) => {
          let i = 0;
          res.data.forEach((item) => {
            const slot = {
              id: i,
              title: !item.member
                ? "Open"
                : `Consultation with ${item.member.first_name} ${item.member.last_name}`,
              startDate: new Date(item.start_time),
              endDate: new Date(item.end_time),
              meeting_link: item.meeting_link,
              rejected: item.is_rejected,
              confirmed: item.is_confirmed,
              member: item.member,
            };
            console.log(slot);
            consultations.push(slot);
            i += 1;
          });
          setLoading(false);
        })
        .catch((error) => {
          setConsultations(null);
        });
    }
  }, [consultations, setConsultations, setLoading]);*/

  useEffect(() => {
    setLoading(true);
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_partner_id;
      Service.client
        .get("/consultations", { params: { partner__user__id: userid } })
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
  }, [setConsultations, setLoading]);

  console.log(consultations);

  const BasicLayout = ({
    onFieldChange,
    appointmentData,
    readOnly,
    ...restProps
  }) => {
    const onLinkChange = (nextValue) => {
      onFieldChange({ meeting_link: nextValue });
    };
    const onConfirmChange = (nextValue) => {
      onFieldChange({ confirmed: nextValue, rejected: !nextValue });
    };

    const onRejectChange = (nextValue) => {
      onFieldChange({ rejected: nextValue, confirmed: !nextValue });
    };

    if (appointmentData.member !== undefined) {
      setAllowDeleting(false);
    } else {
      setAllowDeleting(true);
    }

    if (appointmentData.endDate < currentDate) {
      setAllowUpdating(false);
    } else {
      setAllowUpdating(true);
    }

    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        readOnly={!allowDeleting}
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
        <AppointmentForm.BooleanEditor
          style={{ marginTop: "10px" }}
          value={appointmentData.confirmed}
          onValueChange={onConfirmChange}
          readOnly={allowDeleting || !allowUpdating}
          label="Confirm Consultation"
        />
        <AppointmentForm.BooleanEditor
          style={{ marginTop: "10px" }}
          value={appointmentData.rejected}
          onValueChange={onRejectChange}
          readOnly={allowDeleting || !allowUpdating}
          label="Reject Consultation"
        />
      </AppointmentForm.BasicLayout>
    );
  };

  const handleCurrentViewChange = (newViewName) => {
    setCurrentViewName(newViewName);
  };

  const onCommitChanges = React.useCallback(
    ({ changed, deleted }) => {
      if (changed) {
        setConsultations(
          consultations.map((appointment) =>
            changed[appointment.id]
              ? { ...appointment, ...changed[appointment.id] }
              : appointment
          )
        );
      }
      if (deleted !== undefined) {
        setConsultations(
          consultations.filter((appointment) => appointment.id !== deleted)
        );
      }
    },
    [setConsultations, consultations]
  );

  const weekview = React.useCallback(
    React.memo(({ onDoubleClick, startDate, ...restProps }) => (
      <WeekView.TimeTableCell {...restProps} onDoubleClick={undefined} />
    )),
    []
  );

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
          <Toolbar />
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
          <ConfirmationDialog />
        </Scheduler>
      </Paper>
    </Fragment>
  );
};

export default Calendar;
