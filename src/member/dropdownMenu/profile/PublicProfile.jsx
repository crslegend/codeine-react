import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  ListItem,
  Card,
  CardContent,
  IconButton,
  Button,
  Typography,
  Avatar,
  Table,
  TableCell,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { LocationOn, Email, Edit, LinkOutlined } from "@material-ui/icons";
import {
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import MemberNavBar from "../../MemberNavBar";
import Navbar from "../../../components/Navbar";
import partnerLogo from "../../../assets/codeineLogos/Partner.svg";
import adminLogo from "../../../assets/codeineLogos/Admin.svg";
import Service from "../../../AxiosService";
import { useHistory, useParams, Link } from "react-router-dom";
import { useLocation } from "react-router";
import Toast from "../../../components/Toast.js";
import jwt_decode from "jwt-decode";
import Label from "./components/Label";
import ExperienceCard from "./components/ExperienceCard";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "1200px",
    margin: "0 auto",
    paddingTop: "65px",
  },
  cardroot: {
    marginRight: "20px",
    marginTop: "-50px",
    height: "80%",
    padding: "55px 10px 30px",
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
    background:
      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
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
  seeAll: {
    marginBottom: "20px",
    color: "#515050",
    fontWeight: 600,
    "&:hover": {
      textDecoration: "underline #515050",
      color: "#515050",
      backgroundColor: "transparent",
    },
  },
  seeBadges: {
    marginTop: "-10px",
    marginRight: "-9px",
    color: "#515050",
    fontSize: "12px",
    fontWeight: 600,
    "&:hover": {
      textDecoration: "underline #515050",
      color: "#515050",
      backgroundColor: "transparent",
    },
  },
  proBorderWrapper: {
    borderRadius: "50%",
    background:
      "linear-gradient(231deg, rgba(255,43,26,1) 0%, rgba(255,185,26,1) 54%, rgba(255,189,26,1) 100%)",
    padding: 5,
  },
  freeBorderWrapper: {
    borderRadius: "50%",
    background: "rgba(84,84,84,1)",
    padding: 5,
  },
  innerBorderWrapper: {
    borderRadius: "50%",
    background: "#FFF",
    padding: 3,
  },
  cardmedia: {
    height: "40px",
    width: "40px",
    borderRadius: "50%",
    marginRight: "10px",
    marginBottom: "10px",
  },
  badgeDetail: {
    display: "flex",
    padding: theme.spacing(2),
    border: "1px solid #164D8F",
    borderRadius: "5px",
    marginBottom: "10px",
  },
}));

const CustomTooltip = ({ payload, active, category }) => {
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
        <Typography variant="subtitle1">
          {payload[0].payload.category
            ? `${payload[0].payload.category} : ${payload[0].value}`
            : `${payload[0].payload.name} : ${payload[0].value}`}
        </Typography>
      </div>
    );
  }

  return null;
};

const PublicProfile = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [userType, setUserType] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [member, setMember] = useState("");
  const [dataList, setDataList] = useState([]);
  const [languageList, setLanguageList] = useState([]);

  const [courses, setCourses] = useState([]);
  const [courseDialog, setCourseDialog] = useState(false);

  const [badges, setBadges] = useState([]);
  const [badgesDialog, setBadgesDialog] = useState(false);
  const [experiences, setExperiences] = useState([]);

  const checkIfMemberIdIsPro = () => {
    Service.client
      .get(`/auth/members/${id}`)
      .then((res) => {
        // console.log(res.data);
        if (res.data.member.membership_tier === "FREE") {
          history.push(`/404`);
          // history.go();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkIfLoggedIn = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      const userid = jwt_decode(Service.getJWT()).user_id;
      Service.client
        .get(`/auth/members/${userid}`)
        .then((res) => {
          setLoggedIn(true);
          if (res.data.member !== null) {
            setUserType("member");
            if (userid === id) {
              setIsOwner(true);
            }
          } else if (res.data.is_admin) {
            setUserType("admin");
          } else if (res.data.partner !== null) {
            setUserType("partner");
          }
        })
        .catch((err) => {
          console.log(err);
        });
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

  const getPoints = () => {
    let tempPoints = 0;
    for (var i = 0; i < dataList.length; i++) {
      tempPoints = tempPoints + dataList[i].points;
    }
    for (var j = 0; j < languageList.length; j++) {
      tempPoints = tempPoints + languageList[j].points;
    }
    return tempPoints;
  };

  const handleTopLanguages = (statsData) => {
    let list = [];

    list.push({
      name: "Java",
      fill: "#E57001",
      font: "#FFFFFF",
      points: statsData.JAVA,
    });

    list.push({
      name: "C++",
      fill: "#004482",
      font: "#FFFFFF",
      points: statsData.CPP,
    });

    list.push({
      name: "C#",
      fill: "#6A1577",
      font: "#FFFFFF",
      points: statsData.CS,
    });

    list.push({
      name: "CSS",
      fill: "#264DE4",
      font: "#FFFFFF",
      points: statsData.CSS,
    });

    list.push({
      name: "HTML",
      fill: "#E44D26",
      font: "#000000",
      points: statsData.HTML,
    });

    list.push({
      name: "Javascript",
      fill: "#F7DF1E",
      font: "#000000",
      points: statsData.JS,
    });

    list.push({
      name: "Python",
      fill: "#3675A9",
      font: "#FED74A",
      points: statsData.PY,
    });

    list.push({
      name: "Ruby",
      fill: "#CC0000",
      font: "#FFFFFF",
      points: statsData.RUBY,
    });

    list = list.sort((a, b) => a.points - b.points);

    setLanguageList(list);
  };

  const getMemberData = () => {
    Service.client
      .get(`/members/${id}/profile`)
      .then((res) => {
        //console.log(res.data);
        setMember(res.data.member);

        if (dataList.length === 0) {
          handleSetRadarData(res.data.member.member.stats);
        }

        if (languageList.length === 0) {
          handleTopLanguages(res.data.member.member.stats);
        }

        res.data.courses = res.data.courses
          .filter((course) => course.course !== null)
          .filter((course) => course.progress === "100.00");
        setCourses(res.data.courses);

        setBadges(res.data.achievements.reverse());

        setExperiences(
          res.data.cv.sort((a, b) => b.start_date.localeCompare(a.start_date))
        );
      })

      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfMemberIdIsPro();
    checkIfLoggedIn();
    getMemberData();
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

  const navLogo = (
    <Fragment>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link
          to="/"
          style={{
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingLeft: "10px",
            marginRight: "35px",
            width: 100,
          }}
        >
          {userType === "partner" && (
            <img src={partnerLogo} width="120%" alt="codeine logo" />
          )}
          {userType === "admin" && (
            <img src={adminLogo} width="120%" alt="codeine logo" />
          )}
        </Link>
      </div>
    </Fragment>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          variant="contained"
          color={userType === "admin" ? "secondary" : "primary"}
          style={{
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            if (userType === "partner") {
              history.push("/partner");
            } else if (userType === "admin") {
              history.push("/admin");
            }
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Log Out
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      {userType === "partner" || userType === "admin" ? (
        <Navbar logo={navLogo} bgColor="#fff" navbarItems={loggedInNavbar} />
      ) : (
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      )}

      <Grid container className={classes.root}>
        <Grid item xs={4}>
          <div className={classes.avatar}>
            <div
              className={
                member && member.member.membership_tier === "PRO"
                  ? classes.proBorderWrapper
                  : classes.freeBorderWrapper
              }
            >
              <div className={classes.innerBorderWrapper}>
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
            </div>
          </div>

          <Card elevation={0} className={classes.cardroot}>
            <CardContent>
              {isOwner && isOwner === true ? (
                <div
                  style={{
                    display: "grid",
                    justifyContent: "flex-end",
                  }}
                >
                  <CopyToClipboard
                    text={`localhost:3000${location.pathname}`}
                    onCopy={() => {
                      setSbOpen(true);
                      setSnackbar({
                        ...snackbar,
                        message: "Profile link copied!",
                        severity: "info",
                      });
                      return true;
                    }}
                  >
                    <IconButton
                      style={{
                        marginTop: "-5px",
                        width: "40px",
                      }}
                    >
                      <LinkOutlined
                        style={{ fontSize: "26px", margin: "-4px" }}
                      />{" "}
                    </IconButton>
                  </CopyToClipboard>

                  <IconButton
                    onClick={() => history.push("/member/profile")}
                    style={{
                      width: "40px",
                      marginTop: "5px",
                    }}
                  >
                    <Edit style={{ fontSize: "24px", margin: "-4px" }} />
                  </IconButton>
                </div>
              ) : (
                ""
              )}

              <div style={{ display: "flex", marginTop: "-80px" }}>
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
                <Typography variant="body2">exp. points</Typography>
                <Typography variant="body2">{getPoints()}</Typography>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  style={{ fontWeight: 600, marginBottom: "15px" }}
                >
                  Badges
                </Typography>
                {badges && badges.length > 0 ? (
                  <Button
                    className={classes.seeBadges}
                    onClick={() => setBadgesDialog(true)}
                  >
                    See All({badges.length})
                  </Button>
                ) : (
                  ""
                )}
              </div>
              {badges && badges.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  {badges &&
                    badges.map((badge, index) => (
                      <CardMedia
                        key={index}
                        className={classes.cardmedia}
                        image={badge.achievement.badge}
                      />
                    ))}
                </div>
              ) : (
                <Grid style={{ height: "50px", paddingTop: "5px" }}>
                  <Typography
                    variant="subtitle1"
                    style={{
                      textAlign: "center",
                      color: "#C4C4C4",
                    }}
                  >
                    No Achieved Badges
                  </Typography>
                </Grid>
              )}
              <Typography
                variant="body2"
                style={{ fontWeight: 600, marginBottom: "15px" }}
              >
                Skills
              </Typography>
              <ResponsiveContainer width="100%" height={380}>
                <RadarChart
                  width="100%"
                  height="100%"
                  style={{
                    paddingBottom: "10px",
                  }}
                  data={dataList && dataList}
                >
                  <PolarGrid stroke="#050404" />
                  <PolarAngleAxis
                    tickLine={false}
                    dataKey="display"
                    stroke="#050404"
                  />
                  <PolarRadiusAxis stroke="#050404" />
                  <Tooltip content={<CustomTooltip />} />
                  <Radar
                    name="Category"
                    dataKey="points"
                    stroke="#C74343"
                    fill="#C74343"
                    fillOpacity={0.8}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Grid container className={classes.rightContainer}>
            {languageList && languageList.length > 0 ? (
              <Grid item xs={12}>
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  Language Proficiencies
                </Typography>
                <RadialBarChart
                  width={500}
                  height={300}
                  cx="50%"
                  cy="80%"
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                  innerRadius="20%"
                  outerRadius="150%"
                  data={languageList && languageList}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={15}
                    background
                    clockWise={true}
                    dataKey="points"
                  />
                  <Legend
                    iconSize={10}
                    wrapperStyle={{ top: 45, right: -150 }}
                    width={110}
                    height={170}
                    layout="vertical"
                    verticalAlign="top"
                    align="right"
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadialBarChart>
              </Grid>
            ) : (
              ""
            )}

            <Grid item xs={12} style={{ marginBottom: "60px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h5"
                  style={{ fontWeight: 600, marginBottom: "20px" }}
                >
                  Courses
                </Typography>
                {courses && courses.length > 0 ? (
                  <Button
                    className={classes.seeAll}
                    onClick={() => setCourseDialog(true)}
                  >
                    See All
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
                      <TableCell style={{ fontWeight: 600 }}>title</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>
                        category
                      </TableCell>
                      <TableCell style={{ width: "60px", fontWeight: 600 }}>
                        results
                      </TableCell>
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
                                row.course.categories.map((label, index) => (
                                  <Label label={label} key={index} />
                                ))}
                            </div>
                          </TableCell>
                          <TableCell
                            style={{ width: "60px", textAlign: "center" }}
                          >
                            {row.quiz_result.actual_score}
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
                style={{ fontWeight: 600, marginBottom: "20px" }}
              >
                Experiences
              </Typography>
              {experiences && experiences.length > 0 ? (
                experiences.map((experience, index) => {
                  return <ExperienceCard key={index} experience={experience} />;
                })
              ) : (
                <Grid style={{ height: "100px", paddingTop: "40px" }}>
                  <Typography style={{ textAlign: "center", color: "#C4C4C4" }}>
                    No Experience Yet
                  </Typography>
                </Grid>
              )}
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
                <TableCell style={{ fontWeight: 600 }}>title</TableCell>
                <TableCell style={{ fontWeight: 600 }}>category</TableCell>
                <TableCell style={{ width: "60px", fontWeight: 600 }}>
                  results
                </TableCell>
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
                          row.course.categories.map((label, index) => (
                            <Label label={label} key={index} />
                          ))}
                      </div>
                    </TableCell>
                    <TableCell style={{ width: "60px", textAlign: "center" }}>
                      {row.quiz_result.actual_score}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Dialog>

      <Dialog
        open={badgesDialog}
        onClose={() => setBadgesDialog(false)}
        style={{ borderRadius: "50px" }}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth={true}
      >
        <DialogTitle>All Achievements</DialogTitle>
        <DialogContent>
          {badges &&
            badges.length > 0 &&
            badges.map((badge, index) => {
              return (
                <div key={index} className={classes.badgeDetail}>
                  <CardMedia
                    className={classes.cardmedia}
                    style={{ margin: "auto 15px auto 0" }}
                    image={badge.achievement.badge}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 600, paddingBottom: "5px" }}
                    >
                      {badge.achievement.title}
                    </Typography>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {badge.achievement.achievement_requirements.length > 0 &&
                        badge.achievement.achievement_requirements.map(
                          (requirement, index) => {
                            if (requirement.stat === "UI") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in UI/UX"}
                                </Typography>
                              );
                            } else if (requirement.stat === "FE") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Frontend"}
                                </Typography>
                              );
                            } else if (requirement.stat === "BE") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Backend"}
                                </Typography>
                              );
                            } else if (requirement.stat === "DB") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Database Administration"}
                                </Typography>
                              );
                            } else if (requirement.stat === "SEC") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Security"}
                                </Typography>
                              );
                            } else if (requirement.stat === "ML") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Machine Learning"}
                                </Typography>
                              );
                            } else if (requirement.stat === "PY") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Python"}
                                </Typography>
                              );
                            } else if (requirement.stat === "JAVA") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Java"}
                                </Typography>
                              );
                            } else if (requirement.stat === "JS") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Javascript"}
                                </Typography>
                              );
                            } else if (requirement.stat === "RUBY") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in Ruby"}
                                </Typography>
                              );
                            } else if (requirement.stat === "CPP") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in C++"}
                                </Typography>
                              );
                            } else if (requirement.stat === "CS") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in C#"}
                                </Typography>
                              );
                            } else if (requirement.stat === "HTML") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in HTML"}
                                </Typography>
                              );
                            } else if (requirement.stat === "CSS") {
                              return (
                                <Typography key={index} variant="body2">
                                  {requirement.experience_point +
                                    " Exp Points in CSS"}
                                </Typography>
                              );
                            }
                          }
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default PublicProfile;
