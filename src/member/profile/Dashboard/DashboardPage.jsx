import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TooltipMui from "@material-ui/core/Tooltip";
import PageTitle from "../../../components/PageTitle";
import Service from "../../../AxiosService";
import { Info } from "@material-ui/icons";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
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
  Card,
  Button,
  CardMedia,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
import { lighten } from "@material-ui/core/styles";
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
import silver from "../../../assets/silver_medal.png";
import bronze from "../../../assets/bronze_medal.png";
import gold from "../../../assets/gold_medal.png";

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
  badgeheader: {
    color: theme.palette.primary.main,
    textAlign: "center",
    margin: "0px auto",
    paddingLeft: "80px",
  },
  cardmediafirst: {
    height: "150px",
    width: "150px",
    borderRadius: "50%",
    margin: "15px auto",
  },
  cardmedia: {
    height: "130px",
    width: "130px",
    borderRadius: "50%",
    margin: "15px auto",
  },
  badgeDetail: {
    display: "flex",
    padding: theme.spacing(2),
    color: theme.palette.primary.main,
    border: "1px solid #164D8F",
    borderRadius: "5px",
    marginBottom: "10px",
  },
  dialogmedia: {
    height: "100px",
    width: "100px",
    borderRadius: "50%",
    marginRight: "35px",
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  //   const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);

  const [numDays, setNumDays] = useState(7);
  const [timeSpentOnPlatform, setTimeSpentOnPlatform] = useState();
  const [timeSpentCategories, setTimeSpentCategories] = useState();

  const [badges, setBadges] = useState([]);
  const [memberBadges, setMemberBadges] = useState([]);

  const [badgesDialog, setBadgesDialog] = useState(false);

  const handleBadgePoints = (badge) => {
    let totalPoints = 0;
    for (
      var i = 0;
      i < badge.achievement.achievement_requirements.length;
      i++
    ) {
      totalPoints =
        totalPoints +
        badge.achievement.achievement_requirements[i].experience_point;
    }
    console.log(badge);

    let tempItem = {
      badgeDetails: badge,
      totalPoints: totalPoints,
    };
    return tempItem;
  };

  const checkIfLoggedIn = () => {
    let decoded;
    let tempList = [];

    if (Cookies.get("t1")) {
      setLoggedIn(true);
      decoded = jwt_decode(Cookies.get("t1"));
      if (memberBadges.length === 0) {
        Service.client
          .get(`/members/${decoded.user_id}/profile`)
          .then((res) => {
            for (var i = 0; i < res.data.achievements.length; i++) {
              tempList.push(handleBadgePoints(res.data.achievements[i]));
            }
            setMemberBadges(
              tempList.sort((a, b) => b.totalPoints - a.totalPoints)
            );
          });
      }
    }
  };

  const getAllBadge = () => {
    let list = [];

    Service.client.get(`/achievements`).then((res) => {
      res.data = res.data.filter((badge) => !badge.is_deleted);

      for (var i = 0; i < res.data.length; i++) {
        for (var j = 0; j < memberBadges.length; j++) {
          if (res.data[i].id === memberBadges[j].badgeDetails.achievement.id) {
            list.push({
              achievement_requirements: res.data[i].achievement_requirements,
              badge: res.data[i].badge,
              title: res.data[i].title,
              id: res.data[i].id,
              is_owned: true,
            });
          } else if (
            res.data[i].id !== memberBadges[j].badgeDetails.achievement.id &&
            j === memberBadges.length - 1
          ) {
            list.push({
              achievement_requirements: res.data[i].achievement_requirements,
              badge: res.data[i].badge,
              title: res.data[i].title,
              id: res.data[i].id,
              is_owned: false,
            });
          }
        }
      }
    });

    setBadges(list);
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
    getAllBadge();
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
        <div style={{ width: "80%", margin: "auto" }}>
          <PageTitle title="Dashboard" />
          <div
            style={{
              display: "flex",
            }}
          >
            <Typography variant="h5" className={classes.badgeheader}>
              Your Top Badges
              <Divider
                style={{
                  paddingTop: "0.5px",
                  marginTop: "3px",
                  backgroundColor: lighten("#437FC7", 0.5),
                }}
              />
            </Typography>

            <Button
              variant="outlined"
              size="small"
              onClick={() => setBadgesDialog(true)}
              style={{ textTransform: "none" }}
            >
              view all
            </Button>
          </div>
          <Card
            elevation={0}
            style={{
              backgroundColor: "transparent",
              display: "flex",
              justifyContent: "center",
              margin: "30px 0px",
              paddingTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#A9A9A9",
              }}
            >
              <Typography
                variant="h4"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                2
              </Typography>
              <CardMedia
                className={classes.cardmedia}
                image={
                  memberBadges.length > 1
                    ? memberBadges &&
                      memberBadges[1].badgeDetails.achievement.badge
                    : silver
                }
              />
              <Typography
                variant="body1"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                {memberBadges.length > 1
                  ? memberBadges &&
                    memberBadges[2].badgeDetails.achievement.title
                  : ""}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                margin: "-30px 70px 0px",
                color: "#d4af37",
              }}
            >
              <Typography
                variant="h4"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                1
              </Typography>
              <CardMedia
                className={classes.cardmediafirst}
                image={
                  memberBadges.length > 0
                    ? memberBadges &&
                      memberBadges[0].badgeDetails.achievement.badge
                    : gold
                }
              />
              <Typography
                variant="body1"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                {memberBadges.length > 0
                  ? memberBadges &&
                    memberBadges[0].badgeDetails.achievement.title
                  : ""}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                color: "#cd7f32",
              }}
            >
              <Typography
                variant="h4"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                3
              </Typography>
              <CardMedia
                className={classes.cardmedia}
                image={
                  memberBadges.length > 2
                    ? memberBadges &&
                      memberBadges[2].badgeDetails.achievement.badge
                    : bronze
                }
              />
              <Typography
                variant="body1"
                style={{ fontWeight: 600, textAlign: "center" }}
              >
                {memberBadges.length > 2
                  ? memberBadges &&
                    memberBadges[2].badgeDetails.achievement.title
                  : ""}
              </Typography>
            </div>
          </Card>

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
          {console.log(badges)}
          {badges &&
            badges.length > 0 &&
            badges.map((badge, index) => {
              return (
                <div
                  key={index}
                  style={{
                    WebkitFilter: !badge.is_owned ? "grayscale(1)" : "",
                  }}
                  className={classes.badgeDetail}
                >
                  <CardMedia
                    className={classes.dialogmedia}
                    image={badge.badge}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="h6"
                      style={{ fontWeight: 600, paddingBottom: "5px" }}
                    >
                      {badge.title}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        color: "#000000",
                      }}
                    >
                      {badge.achievement_requirements.length > 0 &&
                        badge.achievement_requirements.map((requirement) => {
                          if (requirement.stat === "UI") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in UI/UX"}
                              </Typography>
                            );
                          } else if (requirement.stat === "FE") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Frontend"}
                              </Typography>
                            );
                          } else if (requirement.stat === "BE") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Backend"}
                              </Typography>
                            );
                          } else if (requirement.stat === "DB") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Database Administration"}
                              </Typography>
                            );
                          } else if (requirement.stat === "SEC") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Security"}
                              </Typography>
                            );
                          } else if (requirement.stat === "ML") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Machine Learning"}
                              </Typography>
                            );
                          } else if (requirement.stat === "PY") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Python"}
                              </Typography>
                            );
                          } else if (requirement.stat === "JAVA") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Java"}
                              </Typography>
                            );
                          } else if (requirement.stat === "JS") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Javascript"}
                              </Typography>
                            );
                          } else if (requirement.stat === "RUBY") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in Ruby"}
                              </Typography>
                            );
                          } else if (requirement.stat === "CPP") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in C++"}
                              </Typography>
                            );
                          } else if (requirement.stat === "CS") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in C#"}
                              </Typography>
                            );
                          } else if (requirement.stat === "HTML") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in HTML"}
                              </Typography>
                            );
                          } else if (requirement.stat === "CSS") {
                            return (
                              <Typography variant="body2">
                                {requirement.experience_point +
                                  " Exp Points in CSS"}
                              </Typography>
                            );
                          }
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPage;
