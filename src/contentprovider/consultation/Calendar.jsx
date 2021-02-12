import React, { Fragment, useState } from "react";
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
import { appointments } from "./Data";

const messages = {
  moreInformationLabel: "",
};

const views = [
  {
    type: "month",
    name: "Auto Mode",
    maxAppointmentsPerCell: "2",
  },
];

const TextEditor = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  if (props.type === "multilineTextEditor") {
    return null;
  }
  return <AppointmentForm.TextEditor {...props} />;
};

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onLinkChange = (nextValue) => {
    onFieldChange({ meeting_link: nextValue });
  };
  const onConfirmChange = (nextValue) => {
    onFieldChange({ confirmed: nextValue, rejected: !nextValue });
  };

  const onRejectChange = (nextValue) => {
    onFieldChange({ rejected: nextValue, confirmed: !nextValue });
  };

  return (
    <AppointmentForm.BasicLayout
      appointmentData={appointmentData}
      onFieldChange={onFieldChange}
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
        label="Confirm Consultation"
      />

      <AppointmentForm.BooleanEditor
        style={{ marginTop: "10px" }}
        value={appointmentData.rejected}
        onValueChange={onRejectChange}
        label="Reject Consultation"
      />
    </AppointmentForm.BasicLayout>
  );
};

const Calendar = () => {
  const [consultations, setConsultations] = useState(appointments);
  const [addedAppointment, setAddedAppointment] = React.useState({});
  const [currentViewName, setCurrentViewName] = useState("month");
  const currentDate = new Date();

  const [editingOptions, setEditingOptions] = React.useState({
    allowDeleting: true,
    allowUpdating: true,
  });

  const { allowDeleting, allowUpdating } = editingOptions;

  /*useEffect(() => {
    Service.client
      .get("/contentProvider/consultations")
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        res.data.map(
          (item) =>
            setSlot({
              ...slot,
              title: !item.member
                ? "Open"
                : `Consultation with ${item.member.first_name} ${item.member.last_name}`,
            }),
          console.log(slot),
          consultations.push(slot)
        );
      })
      .catch((error) => {
        setData(null);
      });
  }, []);*/

  const handleCurrentViewChange = (newViewName) => {
    setCurrentViewName(newViewName);
  };

  const onCommitChanges = React.useCallback(
    ({ added, changed, deleted }) => {
      if (added) {
        const startingAddedId =
          consultations.length > 0
            ? consultations[consultations.length - 1].id + 1
            : 0;
        setConsultations([...consultations, { id: startingAddedId, ...added }]);
      }
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
    React.memo(({ onDoubleClick, startDate, ...restProps }) => {
      if (startDate < currentDate) {
        return (
          <WeekView.TimeTableCell {...restProps} onDoubleClick={undefined} />
        );
      } else {
        return (
          <WeekView.TimeTableCell
            {...restProps}
            onDoubleClick={onDoubleClick}
          />
        );
      }
    }),
    [currentDate]
  );

  const monthview = React.useCallback(
    React.memo(({ onDoubleClick, ...restProps }) => (
      <MonthView.TimeTableCell {...restProps} onDoubleClick={undefined} />
    )),
    []
  );

  const onAddedAppointmentChange = React.useCallback((appointment) => {
    setAddedAppointment(appointment);
  });

  return (
    <Fragment>
      <Paper>
        <Scheduler data={consultations} height="700">
          <ViewState
            defaultCurrentDate={currentDate}
            currentViewName={currentViewName}
            onCurrentViewNameChange={handleCurrentViewChange}
          />
          <EditingState
            onCommitChanges={onCommitChanges}
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={onAddedAppointmentChange}
          />
          <IntegratedEditing />
          <WeekView name="week" timeTableCellComponent={weekview} />
          <MonthView name="month" timeTableCellComponent={monthview} />
          <Toolbar />
          <DateNavigator />
          <TodayButton />
          <Appointments />
          <AppointmentTooltip showOpenButton />
          <AppointmentForm
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
