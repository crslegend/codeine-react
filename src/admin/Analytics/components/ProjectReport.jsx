import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, IconButton, Paper, Typography } from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Info } from "@material-ui/icons";
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
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
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

const ProjectReport = ({ popularSkill, projectSearches }) => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Paper className={classes.paper}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "10px" }}
        >
          Project Listings Report
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => history.push(`/admin/analytics/projects`)}
        >
          View More Project-Related Analysis
        </Button>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            <Typography variant="h6">Skills Breakdown</Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Breakdown of skills required in project listings
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </TooltipMui>
          </div>
          <ResponsiveContainer width="100%" height={430}>
            <BarChart
              data={popularSkill && popularSkill}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="skill">
                <Label
                  value={`Skills Required in Listed Projects`}
                  position="bottom"
                  offset={5}
                  style={{ textAnchor: "middle" }}
                />
              </XAxis>
              <YAxis>
                <Label
                  value="Number of Projects"
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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            <Typography variant="h6">Project Searches</Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Keywords entered by the students and the respective occurences
                  when searching for projects on Codeine
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </TooltipMui>
          </div>
          <ResponsiveContainer width="100%" height={430}>
            <BarChart
              data={projectSearches && projectSearches}
              margin={{
                top: 10,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="keyword">
                <Label
                  value={`Keywords Entered by Members`}
                  position="bottom"
                  offset={5}
                  style={{ textAnchor: "middle" }}
                />
              </XAxis>
              <YAxis>
                <Label
                  value="Number of Occurences for that keyword"
                  position="left"
                  angle={-90}
                  offset={5}
                  style={{ textAnchor: "middle" }}
                />
              </YAxis>
              <Tooltip />

              <Bar dataKey="Occurences" fill="#164D8F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Paper>
  );
};

export default ProjectReport;
