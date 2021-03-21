import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Add, DragHandle, Info } from "@material-ui/icons";
import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  paper: {
    padding: theme.spacing(4),
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    marginBottom: "30px",
  },
  formControl: {
    marginTop: "15px",
    marginBottom: "10px",
    width: "200px",
  },
}));

const AdminAnalyticsPage = () => {
  const classes = useStyles();

  const [numDays, setNumDays] = useState(7);
  const [earningsReport, setEarningsReport] = useState();
  const [platformReport, setPlatformReport] = useState();

  const getAnalytics = async () => {
    if (numDays && numDays !== "") {
      Service.client
        .get(`/analytics/first-enrollment-count`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/course-enrollment-count`, {
          params: { days: numDays },
        })
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/admin-earnings-report`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);
          let obj = {
            expenses: res.data.expenses,
            total_contribution_income:
              res.data.total_contribution_income === null
                ? 0
                : res.data.total_contribution_income,
            total_subscription_revenue: res.data.total_subscription_revenue,
            total_income:
              res.data.total_contribution_income === null
                ? 0 + res.data.total_subscription_revenue
                : res.data.total_contribution_income +
                  res.data.total_subscription_revenue,
          };
          obj = {
            ...obj,
            total_income_less_expenses: obj.total_income - obj.expenses,
          };
          setEarningsReport(obj);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/platform-health-check`, { params: { days: numDays } })
        .then((res) => {
          console.log(res);
          setPlatformReport(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/analytics/first-enrollment-count`)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/course-enrollment-count`)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/admin-earnings-report`)
        .then((res) => {
          // console.log(res);
          let obj = {
            expenses: res.data.expenses,
            total_contribution_income:
              res.data.total_contribution_income === null
                ? 0
                : res.data.total_contribution_income,
            total_subscription_revenue: res.data.total_subscription_revenue,
            total_income:
              res.data.total_contribution_income === null
                ? 0 + res.data.total_subscription_revenue
                : res.data.total_contribution_income +
                  res.data.total_subscription_revenue,
          };
          obj = {
            ...obj,
            total_income_less_expenses: obj.total_income - obj.expenses,
          };
          setEarningsReport(obj);
        })
        .catch((err) => console.log(err));

      Service.client
        .get(`/analytics/platform-health-check`)
        .then((res) => {
          // console.log(res);
          setPlatformReport(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  return (
    <div className={classes.root}>
      <Typography variant="h2" style={{ paddingBottom: "20px" }}>
        Analytics
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
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
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "10px" }}
        >
          Earnings Report
        </Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Fundings</Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total amount of funding received from organizations
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {earningsReport &&
                (earningsReport.total_contribution_income === 0 ||
                !earningsReport.total_contribution_income ? (
                  <span style={{ color: "#C74343" }}>{"$0"}</span>
                ) : (
                  "$" + earningsReport.total_contribution_income
                ))}
            </Typography>
          </div>
          <Add style={{ fontSize: "50px" }} color="disabled" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Subscriptions</Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total amount of earnings from pro-tier members
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {earningsReport &&
                (earningsReport.total_subscription_revenue === 0 ||
                !earningsReport.total_subscription_revenue ? (
                  <span style={{ color: "#C74343" }}>{"$0"}</span>
                ) : (
                  "$" + earningsReport.total_subscription_revenue
                ))}
            </Typography>
          </div>
          <DragHandle style={{ fontSize: "50px" }} color="disabled" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Total Income</Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total income before accounting for expenses
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {earningsReport &&
                (earningsReport.total_income === 0 ? (
                  <span style={{ color: "#C74343" }}>{"$0"}</span>
                ) : (
                  "$" + earningsReport.total_income
                ))}
            </Typography>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Expenses</Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total expenses needed to run Codeine
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {earningsReport && (
                <span style={{ color: "#C74343" }}>
                  {`$${earningsReport.expenses}`}
                </span>
              )}
            </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6">Net Income</Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total net income after accounting for expenses
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {earningsReport &&
                (earningsReport.total_income_less_expenses < 0 ? (
                  <span style={{ color: "#C74343" }}>{`-$${
                    earningsReport.total_income_less_expenses * -1
                  }`}</span>
                ) : earningsReport.total_income_less_expenses === 0 ? (
                  <span style={{ color: "#C74343" }}>{`$0`}</span>
                ) : (
                  "$" + earningsReport.total_income_less_expenses
                ))}
            </Typography>
          </div>
        </div>
      </Paper>
      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "10px" }}
        >
          Codeine's Health Report
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                New Content
              </Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total number of hours of new content produced by the
                    partners
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {platformReport &&
                platformReport.hours_of_content &&
                (platformReport.hours_of_content <= 1 ? (
                  <span
                    style={{ color: "#C74343" }}
                  >{`${platformReport.hours_of_content}hr`}</span>
                ) : (
                  platformReport.hours_of_content + "hrs"
                ))}
            </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                New Consultation
              </Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total number of consultation slots newly added by the
                    partners
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {platformReport &&
                platformReport.new_consultation_slots &&
                (platformReport.new_consultation_slots === 0 ? (
                  <span style={{ color: "#C74343" }}>
                    {platformReport.new_consultation_slots}
                  </span>
                ) : (
                  platformReport.new_consultation_slots
                ))}
            </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                New Pro-Tier Members
              </Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total number of members who upgraded to pro-tier
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {platformReport &&
                platformReport.new_pro_members &&
                (platformReport.new_pro_members === 0 ? (
                  <span style={{ color: "#C74343" }}>
                    {platformReport.new_pro_members}
                  </span>
                ) : (
                  platformReport.new_pro_members
                ))}
            </Typography>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex" }}>
              <Typography variant="h6" style={{ paddingRight: "5px" }}>
                New Projects
              </Typography>
              <TooltipMui
                title={
                  <Typography variant="body2">
                    Total number of project listings newly added by our partners
                  </Typography>
                }
              >
                <IconButton disableRipple size="small">
                  <Info fontSize="small" color="primary" />
                </IconButton>
              </TooltipMui>
            </div>
            <Typography variant="h1" className={classes.numbers}>
              {platformReport &&
                platformReport.new_industry_projects &&
                (platformReport.new_industry_projects === 0 ? (
                  <span style={{ color: "#C74343" }}>
                    {platformReport.new_industry_projects}
                  </span>
                ) : (
                  platformReport.new_industry_projects
                ))}
            </Typography>
          </div>
        </div>
      </Paper>
    </div>
  );
};

export default AdminAnalyticsPage;
