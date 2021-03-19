import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Avatar,
  ListItem,
  Typography,
  Popover,
  IconButton,
} from "@material-ui/core";
import Service from "../AxiosService";

const useStyles = makeStyles((theme) => ({
  popover: {
    width: "300px",
  },
  typography: {
    padding: theme.spacing(3),
    cursor: "pointer",
  },
}));

const MemberLanding = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const { user } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <IconButton onClick={handleClick} size="small">
          <Avatar
            src={user.profile_photo}
            alt=""
            style={{ width: "34px", height: "34px" }}
          />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <div className={classes.popover}>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/");
              }}
            >
              Courses
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/");
              }}
            >
              Consultations
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/");
              }}
            >
              Industry Projects
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/");
              }}
            >
              Helpdesk
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/");
              }}
            >
              Profile
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                history.push("/");
              }}
            >
              My Payments
            </Typography>
            <Typography
              className={classes.typography}
              onClick={() => {
                Service.removeCredentials();
                history.push("/");
              }}
            >
              Log out
            </Typography>
          </div>
        </Popover>
      </ListItem>
    </Fragment>
  );
};

export default MemberLanding;
