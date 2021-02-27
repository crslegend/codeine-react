import React, { useEffect, useState } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  ViewSwitcher,
  MonthView,
  Appointments,
  Toolbar,
  TodayButton,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
// import Service from "../../AxiosService";

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

const Calendar = ({
  consultations,
  loading,
  setConsultations,
  setLoading,
  handleGetAllConsultations,
  setSelectedConsultation,
}) => {
  const [currentViewName, setCurrentViewName] = useState("week");
  const currentDate = usaTime(new Date());

  // handles retrieval of all consultations
  useEffect(() => {
    handleGetAllConsultations(setConsultations, setLoading);
    // eslint-disable-next-line
  }, []);

  const handleCurrentViewChange = (newViewName) => {
    setCurrentViewName(newViewName);
  };

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

  const AppointmentProps = ({ children, ...restProps }) => {
    return (
      <Appointments.Appointment
        onClick={(e) => {
          setSelectedConsultation(e.data);
        }}
        {...restProps}
      >
        {children}
      </Appointments.Appointment>
    );
  };

  return (
    <Paper style={{ height: "60vh" }}>
      <Scheduler data={consultations} height="auto">
        <ViewState
          defaultCurrentDate={currentDate}
          currentViewName={currentViewName}
          onCurrentViewNameChange={handleCurrentViewChange}
        />
        <WeekView
          name="week"
          timeTableCellComponent={weekview}
          cellDuration={120}
          startDayHour={6}
        />
        <MonthView name="month" timeTableCellComponent={monthview} />
        <Toolbar
          {...(loading ? { rootComponent: ToolbarWithLoading } : null)}
        />
        <DateNavigator />
        <TodayButton />
        <Appointments appointmentComponent={AppointmentProps} />
        <ViewSwitcher />
      </Scheduler>
    </Paper>
  );
};

export default Calendar;
