import React, { Fragment, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  MonthView,
  Appointments,
  Toolbar,
  TodayButton,
  ViewSwitcher,
  DateNavigator,
} from "@devexpress/dx-react-scheduler-material-ui";
import Service from "../../AxiosService";

const Calendar = () => {
  const currentDate = new Date();
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    Service.client.get("/contentProvider/consultations").then((res) => {
      setConsultations(res.data);
      console.log(res.data);
    });
  }, []);

  return (
    <Fragment>
      <Paper>
        <Scheduler data={consultations}>
          <ViewState defaultCurrentDate={currentDate} />
          <MonthView />
          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
          <TodayButton />
          <Appointments />
        </Scheduler>
      </Paper>
    </Fragment>
  );
};

export default Calendar;
