import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Info, LooksOne, LooksTwo, Looks3 } from "@material-ui/icons";
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
  result: {
    width: "100%",
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    border: "2px solid #e2e2e2",
    borderRadius: "5px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
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
                  Breakdown of skills required in listed projects
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
          <Divider
            style={{ marginTop: "20px", marginBottom: "10px", height: 2 }}
          />
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
                  Keywords entered by the students when searching for projects
                  on Codeine and the respective occurences
                </Typography>
              }
            >
              <IconButton disableRipple size="small">
                <Info fontSize="small" color="primary" />
              </IconButton>
            </TooltipMui>
          </div>
          {projectSearches && projectSearches && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "flex-end",
                }}
              >
                <div className={classes.statsDiv} style={{ minHeight: 130 }}>
                  <div style={{ textAlign: "center" }}>
                    <LooksTwo
                      style={{
                        fontSize: 55,
                        color: "#A9A9A9",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      Keywords:{" "}
                      {projectSearches[1] ? projectSearches[1].keyword : "-"}
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {projectSearches[1] ? projectSearches[1].Occurences : "-"}
                    </Typography>
                  </div>
                </div>
                <div
                  className={classes.statsDiv}
                  style={{
                    minHeight: 150,
                    marginLeft: "20px",
                    marginRight: "20px",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <LooksOne
                      style={{
                        fontSize: 70,
                        color: "#d4af37",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      Keywords:{" "}
                      {projectSearches[0] ? projectSearches[0].keyword : "-"}
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {projectSearches[0] ? projectSearches[0].Occurences : "-"}
                    </Typography>
                  </div>
                </div>
                <div className={classes.statsDiv} style={{ minHeight: 130 }}>
                  <div style={{ textAlign: "center" }}>
                    <Looks3
                      style={{
                        fontSize: 55,
                        color: "#cd7f32",
                      }}
                    />
                  </div>
                  <div>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      Keywords:{" "}
                      {projectSearches[2] ? projectSearches[2].keyword : "-"}
                    </Typography>
                    <Typography variant="body1" style={{ textAlign: "center" }}>
                      Occurence:{" "}
                      {projectSearches[2] ? projectSearches[2].Occurences : "-"}
                    </Typography>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "30px" }}>
                {projectSearches.length > 0 &&
                  projectSearches.map((result, index) => {
                    if (index === 0) {
                      return (
                        <div key={index} className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              color: "#d4af37",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #1
                          </Typography>

                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    } else if (index === 1) {
                      return (
                        <div key={index} className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{
                              color: "#A9A9A9",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            #2
                          </Typography>
                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    } else if (index === 2) {
                      return (
                        <div key={index} className={classes.result}>
                          <Typography
                            variant="h3"
                            style={{ color: "#cd7f32", fontWeight: 600 }}
                          >
                            #3
                          </Typography>
                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    } else {
                      return (
                        <div key={index} className={classes.result}>
                          <Typography variant="h3" style={{ fontWeight: 600 }}>
                            #{index + 1}
                          </Typography>
                          <Typography variant="h6">
                            Keywords: {result.keyword}
                          </Typography>
                          <Typography variant="h6">
                            Occurence: {result.Occurences}
                          </Typography>
                        </div>
                      );
                    }
                  })}
              </div>
            </div>
          )}
          {/* <ResponsiveContainer width="100%" height={430}>
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
          </ResponsiveContainer> */}
        </div>
      </div>
    </Paper>
  );
};

export default ProjectReport;
