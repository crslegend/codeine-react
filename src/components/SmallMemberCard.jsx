import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, CardHeader, Avatar, Paper } from "@material-ui/core";

import profilePhoto from "../assets/placeholders/user-profile-placeholder.jpg";

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    width: "100%",
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
  },
  cardHeader: {
    padding: theme.spacing(1),
  },
}));

const SmallMemberCard = ({ member }) => {
  const classes = useStyles();

  // console.log(member);
  return (
    <div style={{ padding: 8 }}>
      <Paper className={classes.cardRoot} elevation={2}>
        <CardHeader
          avatar={
            <Avatar
              aria-label={member.email}
              className={classes.avatar}
              size="small"
              src={member.profile_photo ? member.profile_photo : profilePhoto}
            />
          }
          title={`${member.first_name} ${member.last_name}`}
          subheader={member.email}
          className={classes.cardHeader}
        />
      </Paper>
    </div>
  );
};

export default SmallMemberCard;
