import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TooltipMui from "@material-ui/core/Tooltip";
import PageTitle from "../../../components/PageTitle";
import Service from "../../../AxiosService";
import { Info } from "@material-ui/icons";
import Cookies from "js-cookie";
import MemberNavBar from "../../MemberNavBar";
// import { useHistory } from "react-router";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    marginBottom: "30px",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  cardRoot: {
    width: "270px",
    padding: "10px 10px",
    border: "1px solid",
    borderRadius: 0,
    height: "100%",
  },
  individualStats: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: "5px",
  },
  formControl: {
    marginTop: "15px",
    marginBottom: "10px",
    width: "200px",
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  //   const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);

  const [numDays, setNumDays] = useState(7);
  const [timeSpentOnPlatform, setTimeSpentOnPlatform] = useState();
  const [timeSpentCategories, setTimeSpentCategories] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const formatDataIntoArr = (data) => {
    // console.log(data);
    let arr = [];
    let obj = {};

    for (const key in data) {
      if (key === "PY") {
        obj = {
          category: "Python",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "BE") {
        obj = {
          category: "Backend",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "CPP") {
        obj = {
          category: "C++",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "CS") {
        obj = {
          category: "C#",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "CSS") {
        obj = {
          category: "CSS",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "DB") {
        obj = {
          category: "Database Administration",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "FE") {
        obj = {
          category: "Frontend",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "HTML") {
        obj = {
          category: "HTML",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "JAVA") {
        obj = {
          category: "JAVA",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "JS") {
        obj = {
          category: "Javascript",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "ML") {
        obj = {
          category: "Machine Learning",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "RUBY") {
        obj = {
          category: "Ruby",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "SEC") {
        obj = {
          category: "Security",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      } else if (key === "UI") {
        obj = {
          category: "UI/UX",
          Hours: data[key] > 0 ? parseFloat((data[key] / 3600).toFixed(2)) : 0,
        };
      }

      arr.push(obj);
    }
    setTimeSpentCategories(arr);
  };

  const getAnalytics = () => {
    // get time spent breakdown for member

    if (numDays && numDays !== "") {
      Service.client
        .get(`/analytics/time-spent-breakdown`, {
          params: { days: numDays },
          timeout: 20000,
        })
        .then((res) => {
          //   console.log(res);
          setTimeSpentOnPlatform(res.data.total_time_spent);
          formatDataIntoArr(res.data.breakdown_by_categories);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/analytics/time-spent-breakdown`, { timeout: 20000 })
        .then((res) => {
          //   console.log(res);
          setTimeSpentOnPlatform(res.data.total_time_spent);
          formatDataIntoArr(res.data.breakdown_by_categories);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getAnalytics();
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  return (
    <div>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <PageTitle title="Dashboard" />
        <div style={{ width: "80%", margin: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" style={{ paddingRight: "15px" }}>
              View By
            </Typography>
            <FormControl
              margin="dense"
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel>Date Range</InputLabel>
              <Select
                label="Date Range"
                value={numDays ? numDays : ""}
                onChange={(e) => {
                  setNumDays(e.target.value);
                }}
                style={{ backgroundColor: "#fff" }}
              >
                <MenuItem value="">
                  <em>Select a date range</em>
                </MenuItem>
                <MenuItem value="7">Past Week</MenuItem>
                <MenuItem value="14">Past 2 Weeks</MenuItem>
                <MenuItem value="30">Past Month</MenuItem>
                <MenuItem value="90">Past 3 Months</MenuItem>
                <MenuItem value="240">Past 6 Months</MenuItem>
              </Select>
            </FormControl>
          </div>

          <Paper className={classes.paper}>
            <Typography
              variant="h4"
              style={{ fontWeight: 600, paddingBottom: "10px" }}
            >
              Time Spent Breakdown
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Typography variant="h6">Total Time on Codeine</Typography>
                  <TooltipMui
                    title={
                      <Typography variant="body2">
                        Total number of hours you have spent on Codeine
                      </Typography>
                    }
                  >
                    <IconButton disableRipple size="small">
                      <Info fontSize="small" color="primary" />
                    </IconButton>
                  </TooltipMui>
                </div>
                <Typography variant="h1" className={classes.numbers}>
                  {timeSpentOnPlatform &&
                    (timeSpentOnPlatform / 3600).toFixed(2) + "hrs"}
                </Typography>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                style={{ textAlign: "center", paddingBottom: "20px" }}
              >
                Total Time Spent in Respective Cateogries
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={timeSpentCategories && timeSpentCategories}
                  margin={{
                    top: 0,
                    right: 30,
                    left: 20,
                    bottom: 25,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category">
                    <Label
                      value={`Available Categories on Codeine`}
                      position="bottom"
                      offset={5}
                      style={{ textAnchor: "middle" }}
                    />
                  </XAxis>
                  <YAxis>
                    <Label
                      value="Total Number of Hours Spent"
                      position="left"
                      angle={-90}
                      offset={-10}
                      style={{ textAnchor: "middle" }}
                    />
                  </YAxis>
                  <Tooltip />

                  <Bar dataKey="Hours" fill="#164D8F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
