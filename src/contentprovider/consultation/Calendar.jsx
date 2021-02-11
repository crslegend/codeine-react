import React, { Fragment, useState } from "react";
import { Paper, Snackbar, Typography } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
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
  DragDropProvider,
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
    allowDragging: true,
  });
  const [createAlertOpen, setCreateAlertOpen] = useState(false);

  const { allowDeleting, allowUpdating, allowDragging } = editingOptions;

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

  const handleCreateAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setCreateAlertOpen(false);
  };

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

  const onAddedAppointmentChange = React.useCallback((appointment) => {
    if (appointment.startDate < currentDate) {
      return (
        <Snackbar
          open={createAlertOpen}
          autoHideDuration={4000}
          onClose={handleCreateAlertClose}
        >
          <Alert
            onClose={handleCreateAlertClose}
            elevation={6}
            severity="error"
          >
            <Typography variant="body1">
              Please enter all address fields or select an address from the
              dropdown!
            </Typography>
          </Alert>
        </Snackbar>
      );
    } else {
      setAddedAppointment(appointment);
    }
  });

  const allowDrag = React.useCallback(() => allowDragging && allowUpdating, [
    allowDragging,
    allowUpdating,
  ]);

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
          <WeekView name="week" />
          <MonthView name="month" />
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
          <DragDropProvider allowDrag={allowDrag} />
          <ViewSwitcher />
          <ConfirmationDialog />
        </Scheduler>
      </Paper>
    </Fragment>
  );
};

export default Calendar;
