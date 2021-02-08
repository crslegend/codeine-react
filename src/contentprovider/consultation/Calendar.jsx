import React, { Fragment, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import {
  ViewState,
  EditingState,
  IntegratedEditing,
} from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  WeekView,
  Appointments,
  Toolbar,
  TodayButton,
  ViewSwitcher,
  DateNavigator,
  AppointmentForm,
  AppointmentTooltip,
  DragDropProvider,
} from "@devexpress/dx-react-scheduler-material-ui";
import Service from "../../AxiosService";

const Calendar = () => {
  const currentDate = new Date();
  const [consultations, setConsultations] = useState([]);
  const [addedAppointment, setAddedAppointment] = React.useState({});
  const [
    isAppointmentBeingCreated,
    setIsAppointmentBeingCreated,
  ] = React.useState(false);
  const [editingOptions, setEditingOptions] = React.useState({
    allowAdding: true,
    allowDeleting: true,
    allowUpdating: true,
  });
  const { allowAdding, allowDeleting, allowUpdating } = editingOptions;

  useEffect(() => {
    Service.client.get("/contentProvider/consultations").then((res) => {
      setConsultations(res.data);
      console.log(res.data);
    });
  }, []);

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
      setIsAppointmentBeingCreated(false);
    },
    [setConsultations, setIsAppointmentBeingCreated, consultations]
  );

  const onAddedAppointmentChange = React.useCallback((appointment) => {
    setAddedAppointment(appointment);
    setIsAppointmentBeingCreated(true);
  });

  const TimeTableCell = React.useCallback(
    React.memo(({ onDoubleClick, ...restProps }) => (
      <WeekView.TimeTableCell
        {...restProps}
        onDoubleClick={allowAdding ? onDoubleClick : undefined}
      />
    )),
    [allowAdding]
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
      return <AppointmentForm.CommandButton id={id} {...restProps} />;
    },
    [allowDeleting]
  );

  return (
    <Fragment>
      <Paper>
        <Scheduler data={consultations}>
          <ViewState defaultCurrentDate={currentDate} />
          <EditingState
            onCommitChanges={onCommitChanges}
            addedAppointment={addedAppointment}
            onAddedAppointmentChange={onAddedAppointmentChange}
          />

          <IntegratedEditing />
          <MonthView />
          <WeekView startDayHour={0} endDayHour={24} name="Week" />
          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
          <TodayButton />
          <Appointments />
          <AppointmentTooltip showOpenButton showDeleteButton="true" />
          <AppointmentForm
            commandButtonComponent={CommandButton}
            readOnly={isAppointmentBeingCreated ? false : !allowUpdating}
          />
          <DragDropProvider allowDrag="true" allowResize="true" />
        </Scheduler>
      </Paper>
    </Fragment>
  );
};

export default Calendar;
