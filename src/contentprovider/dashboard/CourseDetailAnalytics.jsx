import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Service from "../../AxiosService";
import { useParams } from "react-router";
import PageTitle from "../../components/PageTitle";
import {
  Avatar,
  Box,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import CourseMaterialAnalysis from "./components/CourseMaterialAnalysis";
import FinalQuizAnalysis from "./components/FinalQuizAnalysis";
import StudentAnalysis from "./components/StudentAnalysis";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  cardRoot: {
    width: "300px",
    padding: "10px 10px",
    marginTop: "30px",
    marginRight: "50px",
    border: "1px solid",
    borderRadius: 0,
    height: "100%",
  },
  individualStats: {
    display: "flex",
    flexDirection: "column",
    // alignItems: "center",
    // marginBottom: "5px",
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    width: "200px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "7px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  tab: {
    textTransform: "capitalize",
    fontSize: 18,
    fontWeight: 600,
    color: "#000000",
  },
  tabPanel: {
    minHeight: "200px",
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

const CourseDetailAnalytics = () => {
  const classes = useStyles();
  const { id } = useParams();

  const [value, setValue] = useState(0);
  const tabPanelsArr = [0, 1, 2, 3];
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [overallData, setOverallData] = useState();
  const [courseDetail, setCourseDetail] = useState();
  const [coursePic, setCoursePic] = useState();
  const [timeTakenCourse, setTimeTakenCourse] = useState();
  const [timeTakenCourseMaterial, setTimeTakenCourseMaterial] = useState();
  const [finalQuizPerformance, setFinalQuizPerformance] = useState();

  const [inactiveMembers, setInactiveMembers] = useState();
  const [falseStarters, setFalseStarters] = useState();
  const [memberDemographics, setMemberDemographics] = useState();
  const [numDaysForStudents, setNumDaysForStudents] = useState();

  const formatSecondsToHours = (time) => {
    let newTime = time / 3600;

    if (newTime.toString().length >= 5) {
      return newTime.toFixed(5);
    } else if (newTime.toString.length <= 3) {
      return newTime.toFixed(3);
    } else {
      return newTime.toFixed(newTime.toString.length);
    }
  };

  const getAnalytics = async () => {
    // get conversion rate
    Service.client
      .get(`/analytics/course-conversion-rate`)
      .then((res) => {
        // console.log(res);
        // let arr = res.data.breakdown;
        for (let i = 0; i < res.data.breakdown.length; i++) {
          if (res.data.breakdown[i].course_id === id) {
            setOverallData(res.data.breakdown[i]);
            break;
          }
        }
      })
      .catch((err) => console.log(err));

    // get time taken for course material
    Service.client
      .get(`/analytics/course-material-time`, {
        params: { course_id: id },
      })
      .then((res) => {
        // console.log(res);
        setCoursePic(res.data.course_image);
        setTimeTakenCourseMaterial(res.data.chapters);
      })
      .catch((err) => console.log(err));

    // get time taken for course
    Service.client
      .get(`/analytics/course-time`, {
        params: { course_id: id },
      })
      .then((res) => {
        // console.log(res);
        setTimeTakenCourse(res.data.average_time_taken);
        setCourseDetail({
          course_title: res.data.course_title,
          description: res.data.description,
        });
      })
      .catch((err) => console.log(err));

    // get final quiz performance for course
    Service.client
      .get(`/analytics/course-assessment-performance`)
      .then((res) => {
        // console.log(res);
        setFinalQuizPerformance(res.data);
      })
      .catch((err) => console.log(err));

    // get inactive members (default without days)
    Service.client
      .get(`/analytics/inactive-members`, {
        params: { course_id: id },
      })
      .then((res) => {
        console.log(res);
        setInactiveMembers(res.data);
      })
      .catch((err) => console.log(err));

    // get false starters (default without days)
    Service.client
      .get(`/analytics/course-members-stats`, {
        params: { course_id: id },
      })
      .then((res) => {
        console.log(res);
        setFalseStarters(res.data);
      })
      .catch((err) => console.log(err));

    // get members' demographics
    Service.client
      .get(`/analytics/members-demographics`, {
        params: { course_id: id },
      })
      .then((res) => {
        // console.log(res);
        setMemberDemographics(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageTitle title="Course Analysis" />

      <Paper className={classes.paper}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar className={classes.avatar} src={coursePic && coursePic} />
          <div style={{ marginLeft: "20px" }}>
            <Typography
              variant="h5"
              style={{ fontWeight: 600, paddingBottom: "10px" }}
            >
              {courseDetail && courseDetail.course_title}
            </Typography>
            <Typography variant="body2">
              {courseDetail && courseDetail.description}
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
          }}
        >
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Number of Views
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.view_count}
            </Typography>
          </div>
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Number of Enrollments
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.enrollment_count}
            </Typography>
          </div>
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Conversion Rate
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {overallData &&
                (overallData.conversion_rate === 0 ? (
                  <span style={{ color: "#C74343" }}>{"0%"}</span>
                ) : overallData.conversion_rate < 1 ? (
                  <span style={{ color: "#C74343" }}>{"<1%"}</span>
                ) : (
                  overallData.conversion_rate.toFixed(4) + "%"
                ))}
            </Typography>
          </div>
          <div className={classes.individualStats}>
            <Typography variant="h6" style={{ paddingRight: "10px" }}>
              Average Time Taken
            </Typography>
            <Typography variant="h1" className={classes.numbers}>
              {timeTakenCourse
                ? formatSecondsToHours(timeTakenCourse) + `hrs`
                : `0 hrs`}
            </Typography>
          </div>
        </div>
      </Paper>

      <div>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          onChange={handleChange}
          classes={{
            root: classes.tabs,
          }}
        >
          <Tab className={classes.tab} label="Course Materials" />
          <Tab className={classes.tab} label="Final Quiz" />
          <Tab className={classes.tab} label="Students' Engagement" />
          <Tab className={classes.tab} label="Students' Demographics" />
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
                    return (
                      <CourseMaterialAnalysis
                        timeTakenCourseMaterial={timeTakenCourseMaterial}
                        // formatSecondsToHours={formatSecondsToHours}
                      />
                    );
                  } else if (value === 1) {
                    return (
                      <FinalQuizAnalysis
                        finalQuizPerformance={finalQuizPerformance}
                        courseId={id}
                      />
                    );
                  } else if (value === 2) {
                    return (
                      <StudentAnalysis
                        inactiveMembers={inactiveMembers}
                        falseStarters={falseStarters}
                        numDaysForStudents={numDaysForStudents}
                        setNumDaysForStudents={setNumDaysForStudents}
                        courseId={id}
                      />
                    );
                  } else if (value === 3) {
                    return (
                      <StudentAnalysis
                        memberDemographics={memberDemographics}
                        courseId={id}
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

export default CourseDetailAnalytics;
