import React, { Fragment, useState } from "react";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  Appointments,
  Resources,
  Toolbar,
  TodayButton,
  DateNavigator,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import { appointments, resourcesData } from "./Data";

const resources = [
  {
    fieldName: "courseId",
    title: "Course",
    instances: resourcesData,
  },
];

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

const BasicLayout = ({ onFieldChange, appointmentData, ...restProps }) => {
  const onLinkChange = (nextValue) => {
    onFieldChange({ meeting_link: nextValue });
  };
  const onConfirmChange = (nextValue) => {
    onFieldChange({ confirmed: nextValue });
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
        text="Price"
        type="title"
      />
      <AppointmentForm.TextEditor value={appointmentData.member} readOnly />

      <AppointmentForm.BooleanEditor
        style={{ marginTop: "10px" }}
        value={appointmentData.confirmed}
        onValueChange={onConfirmChange}
        label="Confirm Consultation"
      />
    </AppointmentForm.BasicLayout>
  );
};

const Calendar = () => {
  const [consultations, setConsultations] = useState([]);
  const [addedAppointment, setAddedAppointment] = React.useState({});
  const currentDate = new Date();

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
    setAddedAppointment(appointment);
  });

  return (
    <Fragment>
      <Paper>
        <Scheduler data={appointments}>
          <ViewState defaultCurrentDate={currentDate} />
          <EditingState
            onCommitChanges={onCommitChanges}
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={onAddedAppointmentChange}
          />
          <IntegratedEditing />
          <MonthView />
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
          <Resources data={resources} />
          <DragDropProvider />
        </Scheduler>
      </Paper>
    </Fragment>
  );
};

export default Calendar;
