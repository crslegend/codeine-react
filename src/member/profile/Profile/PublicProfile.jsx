import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Avatar,
  Badge,
  IconButton,
} from "@material-ui/core";
import { LocationOn } from "@material-ui/icons";
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
    marginTop: "-60px",
    padding: "70px 30px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "10px",
      padding: "70px 10px",
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
}));

const PublicProfile = (props) => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [member, setMember] = useState("");

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getMemberData = () => {
    Service.client
      .get(`/auth/members/${id}`)
      .then((res) => {
        // console.log(res);

        if (!res.data.member) {
          history.push("/404");
        } else {
          setMember(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
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
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              {member && member.first_name} {member && member.last_name}
            </Typography>
            <Typography variant="subtitle1">
              joined on {member && formatDate(member.date_joined)}
            </Typography>
            <div style={{ display: "flex", marginTop: "15px" }}>
              <LocationOn />
              <Typography
                variant="body2"
                style={{ marginLeft: "5px", marginBottom: "25px" }}
              >
                From {member && member.location}
              </Typography>
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
              <Typography variant="body2">points</Typography>
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
