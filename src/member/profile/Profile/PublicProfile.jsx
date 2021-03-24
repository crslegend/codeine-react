import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  Button,
  Typography,
  Avatar,
  Badge,
} from "@material-ui/core";
import { LocationOn, Email, CasinoSharp } from "@material-ui/icons";
import {
  Radar,
  RadarChart,
  PolarAngleAxis,
  PolarRadiusAxis,
  PolarGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MemberNavBar from "../../MemberNavBar";
import Cookies from "js-cookie";
import Service from "../../../AxiosService";
import { useParams, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(7),
    paddingRight: theme.spacing(7),
    paddingTop: "65px",
  },
  cardroot: {
    marginRight: "40px",
    marginTop: "-45px",
    padding: "55px 15px 30px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "10px",
      padding: "55px 0px 30px",
    },
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
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [member, setMember] = useState("");
  const [data, setData] = useState({
    category: "",
    points: "",
  });
  const [dataList, setDataList] = useState([]);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const handleSetRadarData = (statsData) => {
    let list = [];
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
      category: "UI/UX",
      display: "UI/UX",
      points: statsData.UI,
    });
    list.push({
      category: "Machine Learning",
      display: "ML",
      points: statsData.ML,
    });
    setDataList(list);
  };

  const getMemberData = () => {
    Service.client
      .get(`/auth/members/${id}`)
      .then((res) => {
        setMember(res.data);
        if (dataList.length === 0) {
          handleSetRadarData(res.data.member.stats);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getMemberData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(dataList);

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
              <div style={{ display: "flex", marginTop: "15px" }}>
                <Email />
                <Typography variant="body2" style={{ marginLeft: "5px" }}>
                  {member && member.email}
                </Typography>
              </div>
              {member && member.location ? (
                <div style={{ display: "flex", marginTop: "5px" }}>
                  <LocationOn />
                  <Typography
                    variant="body2"
                    style={{ marginLeft: "5px", marginBottom: "25px" }}
                  >
                    From {member && member.location}
                  </Typography>
                </div>
              ) : (
                ""
              )}
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
                <Typography variant="body2">0</Typography>
              </div>
              <Typography
                variant="body2"
                style={{ fontWeight: 600, marginBottom: "15px" }}
              >
                Skills
              </Typography>
              <ResponsiveContainer width={300} height={300}>
                <RadarChart
                  width={300}
                  height={300}
                  outerRadius={110}
                  cx={150}
                  cy={150}
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
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          main
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default PublicProfile;
