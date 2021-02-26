import React, { Fragment, useEffect, useState } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { ViewState, EditingState, IntegratedEditing } from "@devexpress/dx-react-scheduler";
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

const messages = {
  detailsLabel: "Edit Consultation",
  moreInformationLabel: "",
  repeatLabel: "",
  allDayLabel: "",
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

const BooleanEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.label === "") {
    return null;
  }
  return <AppointmentForm.BooleanEditor {...props} />;
};

const ToolbarWithLoading = withStyles(styles, { name: "Toolbar" })(({ children, classes, ...restProps }) => (
  <div className={classes.toolbarRoot}>
    <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
    <LinearProgress className={classes.progress} />
  </div>
));

const usaTime = (date) => new Date(date).toLocaleString("en-US", { timeZone: "UTC" });

const Calendar = ({ consultations, loading, setConsultations, setLoading, handleGetAllConsultations }) => {
  const [currentViewName, setCurrentViewName] = useState("week");
  const currentDate = usaTime(new Date());
  console.log(currentDate);
  const [allowDeleting, setAllowDeleting] = useState(true);
  const [allowUpdating, setAllowUpdating] = useState(true);

  // handles retrieval of all consultations
  useEffect(() => {
    handleGetAllConsultations(setConsultations, setLoading);
  }, []);

  // handles updating of consultation slot
  const handleUpdate = React.useCallback((id, appointment) => {
    let updateConsult = {};

    if (appointment.endDate !== undefined) {
      appointment.endDate = new Date(appointment.endDate);

      appointment.endDate = new Date(appointment.endDate.toString().replace(/GMT.*$/, "GMT+0000")).toISOString(
        "en-US",
        { timeZone: "UTC" }
      );

      updateConsult = {
        ...updateConsult,
        end_time: appointment.endDate,
      };
    }
    if (appointment.startDate !== undefined) {
      appointment.startDate = new Date(appointment.startDate);

      appointment.startDate = new Date(
        appointment.startDate.toString().replace(/GMT.*$/, "GMT+0000")
      ).toISOString("en-US", { timeZone: "UTC" });

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
    if (appointment.allDay !== undefined) {
      updateConsult = {
        ...updateConsult,
        is_all_day: appointment.allDay,
      };
    }
    if (appointment.max_members !== undefined) {
      updateConsult = {
        ...updateConsult,
        max_members: appointment.max_members,
      };
    }
    if (appointment.price_per_pax !== undefined) {
      updateConsult = {
        ...updateConsult,
        price_per_pax: appointment.price_per_pax,
      };
    }
    console.log(updateConsult);

    Service.client
      .put(`/consultations/${id}`, updateConsult)
      .then((res) => {
        console.log(res);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // handles deletion of consultation slot
  const handleDelete = React.useCallback(
    (id) => {
      console.log(id);
      Service.client
        .patch(`/consultations/${id}/cancel`)
        .then((res) => {
          console.log(res);

          window.location.reload();
        })
        .catch((error) => {
          console.log(id);
          console.log(error);
        });
    },

    []
  );

  const BasicLayout = ({ onFieldChange, appointmentData, readOnly, ...restProps }) => {
    console.log(appointmentData);
    const onLinkChange = (nextValue) => {
      onFieldChange({ meeting_link: nextValue });
    };

    const onRateChange = (nextValue) => {
      onFieldChange({ price_per_pax: nextValue });
    };

    const onMaxMemberChange = (nextValue) => {
      onFieldChange({ max_members: nextValue });
    };

    if (appointmentData.endDate < currentDate) {
      setAllowUpdating(false);
      setAllowDeleting(false);
      console.log("correct");
    } else {
      setAllowUpdating(true);
      setAllowDeleting(true);
    }
    console.log(allowUpdating);
    return (
      <AppointmentForm.BasicLayout
        appointmentData={appointmentData}
        onFieldChange={onFieldChange}
        readOnly={!allowDeleting || !allowUpdating}
        {...restProps}
      >
        <AppointmentForm.Label style={{ marginTop: "10px" }} text="Conference Link" type="title" />
        <AppointmentForm.TextEditor
          value={appointmentData.meeting_link}
          onValueChange={onLinkChange}
          readOnly={!allowDeleting || !allowUpdating}
          placeholder="Enter conference link"
        />
        <AppointmentForm.Label style={{ marginTop: "10px" }} text="Rate per pax ($)" type="title" />
        <AppointmentForm.TextEditor
          value={appointmentData.price_per_pax}
          onValueChange={onRateChange}
          readOnly={appointmentData.member.length !== 0}
          placeholder="Enter price per hour e.g. 100.50"
        />
        <AppointmentForm.Label style={{ marginTop: "10px" }} text="Max no. of pax" type="title" />
        <AppointmentForm.TextEditor
          value={appointmentData.max_members}
          onValueChange={onMaxMemberChange}
          readOnly={!allowDeleting || !allowUpdating}
          placeholder="Enter maximum number of bookings allowed"
        />
        <AppointmentForm.Label style={{ marginTop: "10px" }} text="Member" type="title" />
        <AppointmentForm.TextEditor value={appointmentData.member} readOnly />
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
          changed[appointment.id] ? handleUpdate(appointment.id, changed[appointment.id]) : appointment
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
        return <AppointmentForm.CommandButton id={id} {...restProps} disabled={!allowDeleting} />;
      }
      if (id === "saveButton") {
        return <AppointmentForm.CommandButton id={id} {...restProps} disabled={!allowUpdating} />;
      }
      return <AppointmentForm.CommandButton id={id} {...restProps} />;
    },
    [allowDeleting, allowUpdating]
  );

  return (
    <Fragment>
      <Paper>
        <Scheduler data={consultations} height="750">
          <ViewState
            defaultCurrentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={handleCurrentViewChange}
          />
          <EditingState onCommitChanges={onCommitChanges} />
          <WeekView name="week" timeTableCellComponent={weekview} />
          <MonthView name="month" timeTableCellComponent={monthview} />
          <Toolbar {...(loading ? { rootComponent: ToolbarWithLoading } : null)} />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <IntegratedEditing />
          {/* <AppointmentTooltip showOpenButton />
          <AppointmentForm
            commandButtonComponent={CommandButton}
            basicLayoutComponent={BasicLayout}
            textEditorComponent={TextEditor}
            booleanEditorComponent={BooleanEditor}
            messages={messages}
          /> */}
          <ViewSwitcher />
          <ConfirmationDialog />
        </Scheduler>
      </Paper>
    </Fragment>
  );
};

export default Calendar;
