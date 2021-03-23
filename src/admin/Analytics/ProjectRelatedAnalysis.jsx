import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Service from "../../AxiosService";
import {
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { ArrowBack, Info } from "@material-ui/icons";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
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
  statsDiv: {
    display: "flex",
    flexDirection: "column",
    // border: "2px solid #e2e2e2",
    backgroundColor: "#eeeeee",
    padding: theme.spacing(2),
    borderRadius: "5px",
    marginRight: "30px",
  },
}));

const ProjectRelatedAnalysis = () => {
  const classes = useStyles();
  const history = useHistory();

  const [numDays, setNumDays] = useState(7);
  const [projects, setProjects] = useState();
  const [overallData, setOverallData] = useState();

  const getConversionRate = () => {
    if (numDays && numDays !== "") {
      Service.client
        .get(`/analytics/ip-application-rate`, { params: { days: numDays } })
        .then((res) => {
          console.log(res);
          setOverallData({
            applications: res.data.applications,
            overall_conversion_rate: res.data.overall_conversion_rate,
            overall_views: res.data.overall_views,
          });
          setProjects(res.data.breakdown_by_industry_project);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/analytics/ip-application-rate`)
        .then((res) => {
          // console.log(res);
          setOverallData({
            applications: res.data.applications,
            overall_conversion_rate: res.data.overall_conversion_rate,
            overall_views: res.data.overall_views,
          });
          setProjects(res.data.breakdown_by_industry_project);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getConversionRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getConversionRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <IconButton
          onClick={() =>
            history.push({ pathname: `/admin/analytics`, state: { tab: 3 } })
          }
          style={{ marginRight: "20px" }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h2">Project-Related Analytics</Typography>
      </div>
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

      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "10px" }}
        >
          Projects Conversion Statistics
        </Typography>
        <div style={{ display: "flex" }}>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                Overall Views
              </Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    The total number of views across all listed projects on
                    Codeine
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.overall_views}
            </Typography>
          </div>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                Applications
              </Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    The total number of applications to the listed projects
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.applications}
            </Typography>
          </div>
          <div className={classes.statsDiv}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                Conversion Rate
              </Typography>
              <Tooltip
                title={
                  <Typography variant="body2">
                    % of total views across all of listed projects converted to
                    new applications to the listed projects
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {overallData && overallData.applications + `%`}
            </Typography>
          </div>
        </div>
      </Paper>

      <Typography
        variant="h6"
        style={{ fontWeight: 600, paddingBottom: "20px" }}
      >
        Listed Projects
      </Typography>

      <Grid container style={{ marginBottom: "25px" }}>
        {projects &&
          projects.length > 0 &&
          projects.map((project, index) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                style={{ marginBottom: "30px" }}
              >
                <Card elevation={0} className={classes.cardRoot}>
                  <CardContent
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      style={{
                        fontWeight: 600,
                        paddingBottom: "10px",
                      }}
                      variant="h6"
                    >
                      {project.ip_title}
                    </Typography>
                    <div>
                      <div className={classes.individualStats}>
                        <Typography
                          variant="body2"
                          style={{ paddingRight: "10px" }}
                        >
                          Number of Views
                        </Typography>
                        <Typography variant="h4" className={classes.numbers}>
                          {project.view_count}
                        </Typography>
                      </div>
                      <div className={classes.individualStats}>
                        <Typography
                          variant="body2"
                          style={{ paddingRight: "10px" }}
                        >
                          Number of Applications
                        </Typography>
                        <Typography variant="h4" className={classes.numbers}>
                          {project.application_count}
                        </Typography>
                      </div>
                      <div className={classes.individualStats}>
                        <Typography
                          variant="body2"
                          style={{ paddingRight: "10px" }}
                        >
                          Conversion Rate
                        </Typography>
                        <Typography variant="h4" className={classes.numbers}>
                          {project.conversion_rate === 0 ? (
                            <span style={{ color: "#C74343" }}>{"0%"}</span>
                          ) : project.conversion_rate < 1 ? (
                            <span style={{ color: "#C74343" }}>{"<1%"}</span>
                          ) : (
                            project.conversion_rate.toFixed(4) + "%"
                          )}
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </div>
  );
};

export default ProjectRelatedAnalysis;
