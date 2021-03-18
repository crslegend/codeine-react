import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
import Service from "../../AxiosService";
import {
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Info } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(5),
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    justifyContent: "space-between",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
}));

const DashboardPage = () => {
  const classes = useStyles();

  const [courses, setCourses] = useState([]);
  const [overallData, setOverallData] = useState();

  const getConversionRate = () => {
    Service.client
      .get(`/analytics/course-conversion-rate`, { params: { days: 1 } })
      .then((res) => {
        console.log(res);
        // let arr = res.data.breakdown;
        setCourses(res.data.breakdown);
        setOverallData({
          enrollments: res.data.enrollments,
          overall_conversion_rate: res.data.overall_conversion_rate,
          overall_view: res.data.overall_view,
          total_enrollments: res.data.total_enrollments,
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getConversionRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageTitle title="Dashboard" />
      <Paper className={classes.paper}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6" style={{ paddingRight: "5px" }}>
              Overall Views
            </Typography>
            <Tooltip
              title={
                <Typography variant="body2">
                  The total number of views across all of your courses
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          </div>
          <Typography variant="h1" className={classes.numbers}>
            {overallData && overallData.overall_view}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6">Overall Conversion Rate</Typography>
            <Tooltip
              title={
                <Typography variant="body2">
                  % of total views across all of courses converted to new
                  enrollments
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          </div>
          <Typography variant="h1" className={classes.numbers}>
            {overallData &&
              (overallData.overall_conversion_rate < 1 ? (
                <span style={{ color: "#C74343" }}>{"< 1%"}</span>
              ) : (
                overallData.overall_conversion_rate.toFixed(4) + "%"
              ))}
          </Typography>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6">Total Enrollments</Typography>
            <Tooltip
              title={
                <Typography variant="body2">
                  The total number of enrollments across all of your courses
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          </div>
          <Typography variant="h1" className={classes.numbers}>
            {`${overallData && overallData.total_enrollments}`}
          </Typography>
        </div>
      </Paper>
      <Grid container></Grid>
    </div>
  );
};

export default DashboardPage;
