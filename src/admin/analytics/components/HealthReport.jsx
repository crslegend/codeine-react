import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Paper, Typography } from "@material-ui/core";
import TooltipMui from "@material-ui/core/Tooltip";
import { Info } from "@material-ui/icons";

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

const HealthReport = ({ platformReport }) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography
        variant="h6"
        style={{ fontWeight: 600, paddingBottom: "10px" }}
      >
        Codeine's Health Report
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className={classes.statsDiv}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6" style={{ paddingRight: "5px" }}>
              New Content
            </Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Total number of hours of new content produced by the partners
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
        <div className={classes.statsDiv}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6" style={{ paddingRight: "5px" }}>
              New Consultation
            </Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Total number of consultation slots newly added by the partners
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
        <div className={classes.statsDiv}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6" style={{ paddingRight: "5px" }}>
              New Pro Members
            </Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Total number of members who upgraded to pro membership
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
        <div className={classes.statsDiv}>
          <div style={{ display: "flex" }}>
            <Typography variant="h6" style={{ paddingRight: "5px" }}>
              New Projects
            </Typography>
            <TooltipMui
              title={
                <Typography variant="body2">
                  Total number of project listings newly added by organizations
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
  );
};

export default HealthReport;
