import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Avatar,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
} from "@material-ui/core";
import { LocationOn, Email } from "@material-ui/icons";
import {
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
  Tooltip,
} from "recharts";
import MemberNavBar from "../../MemberNavBar";
import Cookies from "js-cookie";
import Service from "../../../AxiosService";
import { useParams, Link } from "react-router-dom";
import Label from "./components/Label";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    paddingTop: "65px",
  },
  cardroot: {
    marginRight: "20px",
    marginTop: "-45px",
    height: "680px",
    padding: "55px 15px 30px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "10px",
      padding: "55px 0px 30px",
    },
  },
  rightContainer: {
    marginTop: "50px",
    marginLeft: "30px",
    paddingRight: theme.spacing(7),
  },
  avatar: {
    marginRight: "40px",
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      marginRight: "10px",
    },
  },
  pro: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
  courseLink: {
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

const CustomTooltip = ({ payload, label, active, category }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#437FC7",
          padding: "5px 10px",
          color: "#FFFFFF",
          opacity: 0.9,
          borderRadius: "5px",
        }}
      >
        <Typography variant="subtitle1">{`${payload[0].payload.category} : ${payload[0].value}`}</Typography>
      </div>
    );
  }

  return null;
};

const PublicProfile = (props) => {
  const classes = useStyles();
  const { id } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [member, setMember] = useState("");

  const [dataList, setDataList] = useState([]);
  const [languageList, setLanguageList] = useState([]);

  const [courses, setCourses] = useState([]);
  const [courseDialog, setCourseDialog] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const handleSetRadarData = (statsData) => {
    let list = [];
    list.push({
      category: "UI/UX",
      display: "UI/UX",
      points: statsData.UI,
    });
    list.push({
      category: "Frontend",
      display: "FE",
      points: statsData.FE,
    });
    list.push({
      category: "Backend",
      display: "BE",
      points: statsData.BE,
    });
    list.push({
      category: "Security",
      display: "SEC",
      points: statsData.SEC,
    });
    list.push({
      category: "Database Administration",
      display: "DB",
      points: statsData.DB,
    });

    list.push({
      category: "Machine Learning",
      display: "ML",
      points: statsData.ML,
    });
    setDataList(list);
  };

  const handleTopLanguages = (statsData) => {
    let list = [];
    if (statsData.JAVA > 0) {
      list.push({
        language: "Java",
        background: "#E57001",
        font: "#FFFFFF",
        points: statsData.JAVA,
      });
    }
    if (statsData.CPP > 0) {
      list.push({
        language: "C++",
        background: "#004482",
        font: "#FFFFFF",
        points: statsData.CPP,
      });
    }
    if (statsData.CS > 0) {
      list.push({
        language: "C#",
        background: "#6A1577",
        font: "#FFFFFF",
        points: statsData.CS,
      });
    }
    if (statsData.CSS > 0) {
      list.push({
        language: "CSS",
        background: "#264DE4",
        font: "#FFFFFF",
        points: statsData.CSS,
      });
    }
    if (statsData.HTML > 0) {
      list.push({
        language: "HTML",
        background: "#E44D26",
        font: "#000000",
        points: statsData.HTML,
      });
    }
    if (statsData.JS > 0) {
      list.push({
        language: "Javascript",
        background: "#F7DF1E",
        font: "#000000",
        points: statsData.JS,
      });
    }
    if (statsData.PY > 0) {
      list.push({
        language: "Python",
        background: "#3675A9",
        font: "#FED74A",
        points: statsData.PY,
      });
    }
    if (statsData.RUBY > 0) {
      list.push({
        language: "Ruby",
        background: "#CC0000",
        font: "#FFFFFF",
        points: statsData.RUBY,
      });
    }

    setLanguageList(list.sort((a, b) => b.points - a.points).slice(0, 3));
  };

  const getMemberData = () => {
    Service.client
      .get(`/auth/members/${id}`)
      .then((res) => {
        setMember(res.data);
        if (dataList.length === 0) {
          handleSetRadarData(res.data.member.stats);
        }
        if (languageList.length === 0) {
          handleTopLanguages(res.data.member.stats);
        }
      })
      .catch((err) => console.log(err));
  };

  const getMemberCompletedCourses = () => {
    Service.client
      .get(`/auth/members/${id}/courses`)
      .then((res) => {
        //console.log(res.data);
        res.data = res.data
          .filter((course) => course.course !== null)
          .filter((course) => course.progress === "100.00");
        setCourses(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getMemberData();
    getMemberCompletedCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDate = (date) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      return newDate;
    }
    return "";
  };

  return (
    <Fragment>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Grid container className={classes.root}>
        {console.log(member)}
        <Grid item xs={3}>
          <div className={classes.avatar}>
            {member.profile_photo && member.profile_photo ? (
              <Avatar
                style={{ width: "120px", height: "120px" }}
                src={member.profile_photo}
              />
            ) : (
              <Avatar style={{ width: "120px", height: "120px" }}>
                <Typography variant="h1">
                  {member && member.first_name.charAt(0)}
                </Typography>
              </Avatar>
            )}
          </div>

          <Card elevation={0} className={classes.cardroot}>
            <CardContent>
              <div style={{ display: "flex" }}>
                <Typography variant="h6" style={{ fontWeight: 600 }}>
                  {member && member.first_name} {member && member.last_name}
                </Typography>
                {member && member.member.membership_tier === "PRO" ? (
                  <div style={{ marginTop: "4px" }}>
                    <Typography variant="subtitle1" className={classes.pro}>
                      PRO
                    </Typography>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <Typography variant="subtitle1">
                joined on {member && formatDate(member.date_joined)}
              </Typography>
              <div style={{ marginBottom: "25px" }}>
                <div style={{ display: "flex", marginTop: "15px" }}>
                  <Email />
                  <Typography
                    variant="body2"
                    style={{ marginLeft: member.location ? "5px" : "0px" }}
                  >
                    {member && member.email}
                  </Typography>
                </div>
                {member && member.location ? (
                  <div style={{ display: "flex", marginTop: "5px" }}>
                    <LocationOn />
                    <Typography variant="body2" style={{ marginLeft: "5px" }}>
                      From {member && member.location}
                    </Typography>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <Typography
                variant="body2"
                style={{ fontWeight: 600, marginBottom: "15px" }}
              >
                Accomplishments
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="body2">badges</Typography>
                <Typography variant="body2">0</Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <Typography variant="body2">exp. points</Typography>
                <Typography variant="body2">0</Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "25px",
                }}
              >
                <Typography variant="body2">completed courses</Typography>
                <Typography variant="body2">{courses.length}</Typography>
              </div>
              <Typography
                variant="body2"
                style={{ fontWeight: 600, marginBottom: "15px" }}
              >
                Skills
              </Typography>
              <RadarChart
                width={290}
                style={{ margin: "0px auto" }}
                height={300}
                data={dataList && dataList}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="display" />
                <PolarRadiusAxis />
                <Tooltip content={<CustomTooltip />} />
                <Radar
                  name="Category"
                  dataKey="points"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          <Grid container className={classes.rightContainer}>
            {languageList && languageList.length > 0 ? (
              <Grid item xs={12} style={{ marginBottom: "40px" }}>
                <Typography
                  variant="h5"
                  style={{ fontWeight: 600, marginBottom: "15px" }}
                >
                  Top languages
                </Typography>
                <div style={{ display: "flex" }}>
                  {languageList &&
                    languageList.map((language, index) => {
                      return (
                        <Card
                          style={{
                            color: `${language.font}`,
                            backgroundColor: `${language.background}`,
                            padding: "10px 30px",
                            marginRight: "40px",
                            width: "250px",
                            height: "150px",
                          }}
                          key={index}
                          elevation={0}
                        >
                          <CardContent
                            style={{
                              height: "inherit",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              <Typography
                                style={{
                                  fontWeight: 600,
                                }}
                                variant="h2"
                              >
                                {language.language}
                              </Typography>
                            </div>
                            <div>
                              <Typography
                                style={{
                                  fontWeight: 600,
                                  marginBottom: "10px",
                                }}
                                variant="h6"
                              >
                                {language.points} points
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </Grid>
            ) : (
              ""
            )}

            <Grid item xs={12} style={{ marginBottom: "40px" }}>
              <Typography
                variant="h5"
                style={{ fontWeight: 600, marginBottom: "15px" }}
              >
                Badges
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: "40px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h5"
                  style={{ fontWeight: 600, marginBottom: "15px" }}
                >
                  Courses
                </Typography>
                {courses && courses.length > 0 ? (
                  <Button
                    style={{ textTransform: "none", marginBottom: "15px" }}
                    color="primary"
                    variant="outlined"
                    onClick={() => setCourseDialog(true)}
                  >
                    See All Courses
                  </Button>
                ) : (
                  ""
                )}
              </div>

              <TableContainer
                style={{
                  border: "2px solid #474747",
                }}
                component={Grid}
              >
                <Table size="small" aria-label="course table">
                  <TableHead>
                    <TableRow
                      style={{
                        backgroundColor: "#C4C4C4",
                      }}
                    >
                      <TableCell>title</TableCell>
                      <TableCell>category</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses && courses.length > 0 ? (
                      courses.slice(0, 5).map((row, index) => (
                        <TableRow
                          key={index}
                          style={{
                            borderTop: "1.2px solid #474747",
                          }}
                        >
                          <TableCell component="th" scope="row">
                            <Link
                              className={classes.courseLink}
                              to={`/courses/${row.course.id}`}
                            >
                              {row.course.title}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div style={{ display: "flex" }}>
                              {row.course.categories &&
                                row.course.categories.map((label) => (
                                  <Label label={label} />
                                ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow
                        key="error"
                        style={{
                          borderTop: "1.2px solid #474747",
                        }}
                      >
                        <TableCell
                          colSpan={2}
                          style={{
                            textAlign: "center",
                            height: "150px",
                          }}
                          valign="middle"
                        >
                          Member has not completed any courses
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12} style={{ marginBottom: "40px" }}>
              <Typography
                variant="h5"
                style={{ fontWeight: 600, marginBottom: "15px" }}
              >
                Experiences
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Dialog
        open={courseDialog}
        onClose={() => setCourseDialog(false)}
        style={{ borderRadius: "50px" }}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth={true}
      >
        <TableContainer style={{ maxHeight: "500px" }} component={Grid}>
          <Table size="small" aria-label="course table">
            <TableHead>
              <TableRow
                style={{
                  backgroundColor: "#C4C4C4",
                  height: "55px",
                }}
              >
                <TableCell>title</TableCell>
                <TableCell>category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses &&
                courses.map((row, index) => (
                  <TableRow
                    key={index}
                    style={{
                      borderTop: "1.2px solid #474747",
                      height: "40px",
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Link
                        className={classes.courseLink}
                        to={`/courses/${row.course.id}`}
                      >
                        {row.course.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: "flex" }}>
                        {row.course.categories &&
                          row.course.categories.map((label) => (
                            <Label label={label} />
                          ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>
    </Fragment>
  );
};

export default PublicProfile;