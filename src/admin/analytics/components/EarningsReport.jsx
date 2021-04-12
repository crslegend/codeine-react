import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Paper, Typography } from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Add, DragHandle, Info } from "@material-ui/icons";

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

const EarningsReport = ({ earningsReport }) => {
  const classes = useStyles();

  return (
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
        <div className={classes.statsDiv}>
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
        <div className={classes.statsDiv}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6">Subscriptions</Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Total amount of earnings from pro members
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
        <div className={classes.statsDiv}>
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
        <div className={classes.statsDiv}>
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
        <div className={classes.statsDiv}>
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
  );
};

export default EarningsReport;
