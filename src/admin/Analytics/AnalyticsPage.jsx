import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import Service from "../../AxiosService";
import { useHistory } from "react-router";
import EarningsReport from "./components/EarningsReport";
import HealthReport from "./components/HealthReport";
import CourseReport from "./components/CourseReport";
import ProjectReport from "./components/ProjectReport";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
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
  formControl: {
    marginTop: "15px",
    marginBottom: "10px",
    width: "200px",
  },
  tab: {
    // textTransform: "capitalize",
    // fontSize: 18,
    // fontWeight: 600,
    // color: "#000000",
    backgroundColor: "#00000000",
    fontWeight: "800",
  },
  tabPanel: {
    minHeight: "200px",
    paddingTop: "20px",
  },
  statsDiv: {
    display: "flex",
    flexDirection: "column",
    // border: "2px solid #e2e2e2",
    backgroundColor: "#eeeeee",
    padding: theme.spacing(2),
    borderRadius: "5px",
    // marginRight: "30px",
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={0}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const AdminAnalyticsPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [value, setValue] = useState(0);
  const tabPanelsArr = [0, 1, 2, 3];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [numDays, setNumDays] = useState(7);
  const [earningsReport, setEarningsReport] = useState();
  const [platformReport, setPlatformReport] = useState();
  const [coursesRanking, setCoursesRanking] = useState();
  const [firstCoursesRanking, setFirstCoursesRaking] = useState();
  const [courseSearches, setCourseSearches] = useState();

  const [popularSkill, setPopularSkill] = useState();
  const [projectSearches, setProjectSearches] = useState();
  const [
    projectApplicantConversion,
    setProjectApplicantConversion,
  ] = useState();

  const getAnalytics = async () => {
    if (numDays && numDays !== "") {
      Service.client
        .get(`/analytics/first-enrollment-count`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              title: res.data[i].course_title,
              Enrollment: res.data[i].first_enrollment_count,
            };
            arr.push(obj);
          }
          setFirstCoursesRaking(arr);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/course-enrollment-count`, {
          params: { days: numDays },
        })
        .then((res) => {
          // console.log(res);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              title: res.data[i].course_title,
              Enrollment: res.data[i].enrollment_count,
            };
            arr.push(obj);
          }
          setCoursesRanking(arr);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/admin-earnings-report`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
          let obj = {
            expenses: res.data.expenses,
            total_contribution_income:
              res.data.total_contribution_income === null
                ? 0
                : res.data.total_contribution_income,
            total_subscription_revenue: res.data.total_subscription_revenue,
            total_income:
              res.data.total_contribution_income === null
                ? 0 + res.data.total_subscription_revenue
                : res.data.total_contribution_income +
                  res.data.total_subscription_revenue,
          };
          obj = {
            ...obj,
            total_income_less_expenses: obj.total_income - obj.expenses,
          };
          setEarningsReport(obj);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/platform-health-check`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
          setPlatformReport(res.data);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/course-search-ranking`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              keyword: res.data[i].search_string,
              Occurences: res.data[i].search_count,
            };
            arr.push(obj);
          }
          setCourseSearches(arr);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/ip-search-ranking`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              keyword: res.data[i].search_string,
              Occurences: res.data[i].search_count,
            };
            arr.push(obj);
          }
          setProjectSearches(arr);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/ip-application-rate`, { params: { days: numDays } })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/analytics/first-enrollment-count`)
        .then((res) => {
          // console.log(res);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              title: res.data[i].course_title,
              Enrollment: res.data[i].first_enrollment_count,
            };
            arr.push(obj);
          }
          setFirstCoursesRaking(arr);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/course-enrollment-count`)
        .then((res) => {
          // console.log(res);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              title: res.data[i].course_title,
              Enrollment: res.data[i].enrollment_count,
            };
            arr.push(obj);
          }
          setCoursesRanking(arr);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/admin-earnings-report`)
        .then((res) => {
          // console.log(res);
          let obj = {
            expenses: res.data.expenses,
            total_contribution_income:
              res.data.total_contribution_income === null
                ? 0
                : res.data.total_contribution_income,
            total_subscription_revenue: res.data.total_subscription_revenue,
            total_income:
              res.data.total_contribution_income === null
                ? 0 + res.data.total_subscription_revenue
                : res.data.total_contribution_income +
                  res.data.total_subscription_revenue,
          };
          obj = {
            ...obj,
            total_income_less_expenses: obj.total_income - obj.expenses,
          };
          setEarningsReport(obj);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/platform-health-check`)
        .then((res) => {
          // console.log(res);
          setPlatformReport(res.data);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/course-search-ranking`)
        .then((res) => {
          // console.log(res);
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              keyword: res.data[i].search_string,
              Occurences: res.data[i].search_count,
            };
            arr.push(obj);
          }
          setCourseSearches(arr);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/ip-search-ranking`)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/ip-application-rate`)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));
    }

    Service.client
      .get(`/analytics/ip-popular-skills`)
      .then((res) => {
        // console.log(res);
        let arr = [];
        let counts = {};
        if (res.data.length > 0) {
          res.data.map((item) => {
            return item.categories.forEach((category) => arr.push(category));
          });
          // console.log(arr);
          arr.forEach((x) => {
            if (x === "FE") {
              counts["Frontend"] = (counts["Frontend"] || 0) + 1;
            } else if (x === "BE") {
              counts["Backend"] = (counts["Backend"] || 0) + 1;
            } else if (x === "DB") {
              counts["Database Administration"] =
                (counts["Database Administration"] || 0) + 1;
            } else if (x === "SEC") {
              counts["Security"] = (counts["Security"] || 0) + 1;
            } else if (x === "UI") {
              counts["UI/UX"] = (counts["UI/UX"] || 0) + 1;
            } else if (x === "ML") {
              counts["Machine Learning"] =
                (counts["Machine Learning"] || 0) + 1;
            }
          });
          // console.log(counts);
          arr = [];
          for (const skill in counts) {
            arr.push({ skill: skill, Number: counts[skill] });
          }
          // console.log(arr);
        }
        setPopularSkill(arr);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  return (
    <div className={classes.root}>
      <Typography variant="h2" style={{ paddingBottom: "20px" }}>
        Analytics
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "auto",
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

      <div>
        <Tabs
          value={value}
          indicatorColor="secondary"
          textColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          onChange={handleChange}
          classes={{
            root: classes.tabs,
          }}
        >
          <Tab className={classes.tab} label="Earnings" />
          <Tab className={classes.tab} label="Codeine's Health" />
          <Tab className={classes.tab} label="Courses" />
          <Tab className={classes.tab} label="Project Listings" />
        </Tabs>
        <Divider
          style={{
            height: "1px",
            backgroundColor: "#000000",
            width: "100%",
          }}
        />
        {tabPanelsArr &&
          tabPanelsArr.map((tabPanel, index) => {
            return (
              <TabPanel
                key={index}
                value={value}
                index={tabPanel}
                className={classes.tabPanel}
              >
                {(() => {
                  if (value === 0) {
                    return <EarningsReport earningsReport={earningsReport} />;
                  } else if (value === 1) {
                    return <HealthReport platformReport={platformReport} />;
                  } else if (value === 2) {
                    return (
                      <CourseReport
                        firstCoursesRanking={firstCoursesRanking}
                        coursesRanking={coursesRanking}
                        courseSearches={courseSearches}
                      />
                    );
                  } else if (value === 3) {
                    return (
                      <ProjectReport
                        popularSkill={popularSkill}
                        projectSearches={projectSearches}
                      />
                    );
                  } else {
                    return null;
                  }
                })()}
              </TabPanel>
            );
          })}
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
