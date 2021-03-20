import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Paper, Typography } from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Info } from "@material-ui/icons";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    minWidth: "100%",
    display: "flex",
    flexDirection: "column",
    marginBottom: "30px",
    justifyContent: "center",
    // alignItems: "center",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    width: "200px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "5px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
  tooltip: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: theme.spacing(1),
  },
}));

const StudentDemographics = ({ memberDemographics }) => {
  const classes = useStyles();
  console.log(memberDemographics);

  const [genderData, setGenderData] = useState();
  const [locationData, setLocationData] = useState();

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const loadData = () => {
    if (memberDemographics) {
      let arr = [];
      let obj = {};
      for (let i = 0; i < memberDemographics.genders.length; i++) {
        obj = {
          gender:
            memberDemographics.genders[i].gender === null
              ? "Unknown"
              : memberDemographics.genders[i].gender === "M"
              ? "Male"
              : "Female",
          number: memberDemographics.genders[i].id__count,
        };
        arr.push(obj);
      }

      setGenderData(arr);

      arr = [];
      obj = {};
      for (let i = 0; i < memberDemographics.locations.length; i++) {
        obj = {
          location:
            memberDemographics.locations[i].location === null
              ? "Unknown"
              : memberDemographics.locations[i].location,
          Number: memberDemographics.locations[i].id__count,
        };
        arr.push(obj);
      }
      console.log(arr);
      setLocationData(arr);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 600,
            paddingBottom: "20px",
            textAlign: "center",
          }}
        >
          Students' Demographics for The Course
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
              <Typography variant="h6">Average Age</Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    The average age of the enrolled members in the course
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            {memberDemographics && memberDemographics.average_age ? (
              <Typography variant="h1" className={classes.numbers}>
                {memberDemographics.average_age}
              </Typography>
            ) : (
              <Typography variant="body1">Not Available</Typography>
            )}
          </div>
        </div>
        <div style={{ display: "flex", width: "100%" }}>
          <div
            style={{ display: "flex", flexDirection: "column", width: "30%" }}
          >
            <Typography variant="h6" style={{ textAlign: "center" }}>
              Gender Breakdown
            </Typography>
            {genderData && genderData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData && genderData}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="number"
                    nameKey="gender"
                    label
                  >
                    {genderData &&
                      genderData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography variant="body1" style={{ textAlign: "center" }}>
                Not available
              </Typography>
            )}
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", width: "70%" }}
          >
            <Typography variant="h6" style={{ textAlign: "center" }}>
              Country of Origin Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={locationData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 20,
                  bottom: 35,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="location">
                  <Label
                    value={`Country of Origin`}
                    position="bottom"
                    offset={5}
                    style={{ textAnchor: "middle" }}
                  />
                </XAxis>
                <YAxis>
                  <Label
                    value="Number of Enrolled Students"
                    position="left"
                    angle={-90}
                    offset={5}
                    style={{ textAnchor: "middle" }}
                  />
                </YAxis>
                <Tooltip />

                <Bar dataKey="Number" fill="#164D8F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default StudentDemographics;
