import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, CircularProgress, TextField, Button } from "@material-ui/core";
import { HelpOutline, Launch, Menu, VerticalSplit } from "@material-ui/icons";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import Splitter, { SplitDirection } from "@devbookhq/splitter";

import Service from "../../AxiosService";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
  },
  courseSection: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    height: "100%",
  },
  linkMui: {
    cursor: "pointer",
  },
  rightCol: {
    // padding: theme.spacing(2),
    overflow: "auto",
    height: "100%",
  },
  loader: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  codeBody: {
    display: "flex",
    border: "2px solid #C74343",
    background: "rgba(164, 201, 245, 0.1)",
    borderRadius: "5px",
    marginTop: "15px",
    boxShadow: "2px 3px 0px #C74343",
  },
  floatingButtonWrapper: {
    position: "relative",
    marginTop: theme.spacing(3),
    height: 380,
  },
  speedDial: {
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(4),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  fieldRoot: {
    backgroundColor: "#ECECEC",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
  fieldInput: {
    padding: "12px",
    fontSize: "14px",
  },
  focused: {
    border: "1px solid #222",
    boxShadow: "2px 3px 0px #222",
    borderBottomLeftRadius: "5px",
    borderBottomRightRadius: "5px",
  },
}));

const OnlyIDE = () => {
  const classes = useStyles();
  const { portNum } = useParams();

  const [split, setSplit] = useState(false);
  const [innerPortNum, setInnerPortNum] = useState();
  const [enteredValue, setEnteredValue] = useState("");

  const [loadingIDE, setLoadingIDE] = useState(true);

  // speed dial props
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // speed dial actions
  const actions = [
    {
      icon: <HelpOutline />,
      name: "Tutorial",
      action: () => {
        window.open("https://www.youtube.com/watch?v=WPqXP_kLzpo", "_blank");
        handleClose();
      },
    },
    {
      icon: <VerticalSplit />,
      name: "Split Screen",
      action: () => {
        setSplit(!split);
      },
    },
  ];

  const checkIDE = () => {
    setInterval(
      () =>
        Service.client.get(`ide/${portNum}`).then((res) => {
          if (res.data.ready) {
            setLoadingIDE(false);
            clearInterval();
          }
        }),
      3000
    );
  };

  useEffect(() => {
    checkIDE();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!split) {
    return (
      <div className={classes.root}>
        {loadingIDE ? (
          <div className={classes.loader}>
            <CircularProgress />
            <Typography variant="h6" style={{ paddingTop: "10px" }}>
              Fetching your IDE...
            </Typography>
          </div>
        ) : null}
        <iframe width="100%" height="100%" src={`http://localhost:${portNum}`} title="ide" loading="lazy" />
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          hidden={false}
          icon={<Menu />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="up"
          FabProps={{
            size: "medium",
          }}
        >
          {actions.map((action) => (
            <SpeedDialAction key={action.name} icon={action.icon} tooltipTitle={action.name} onClick={action.action} />
          ))}
        </SpeedDial>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      {loadingIDE ? (
        <div className={classes.loader}>
          <CircularProgress />
          <Typography variant="h6" style={{ paddingTop: "10px" }}>
            Fetching your IDE...
          </Typography>
        </div>
      ) : null}

      <Splitter direction={SplitDirection.Horizontal} initialSizes={[50, 50]}>
        <div className={classes.leftCol}>
          <iframe width="100%" height="100%" src={`http://localhost:${portNum}`} title="ide" loading="lazy" />
          <SpeedDial
            ariaLabel="SpeedDial example"
            className={classes.speedDial}
            hidden={false}
            icon={<Menu />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            direction="up"
            FabProps={{
              size: "medium",
            }}
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.action}
              />
            ))}
          </SpeedDial>
        </div>
        <div className={classes.rightCol}>
          <div style={{ margin: "8px", display: "flex", alignItems: "center" }}>
            <Typography variant="body2" style={{ marginRight: "5px", paddingTop: "8px" }}>
              http://localhost:
            </Typography>
            <TextField
              autoComplete="off"
              margin="dense"
              variant="filled"
              id="url"
              name="url"
              inputProps={{ maxLength: 10 }}
              InputProps={{
                disableUnderline: true,
                classes: {
                  root: classes.fieldRoot,
                  focused: classes.focused,
                  input: classes.fieldInput,
                },
              }}
              required
              value={enteredValue}
              onChange={(event) => setEnteredValue(event.target.value)}
            />
            <Button size="small" color="primary" style={{ marginLeft: 8 }} variant="contained" onClick={() => setInnerPortNum(enteredValue)}>
              Go
            </Button>
          </div>
          {innerPortNum && (
            <iframe
              width="100%"
              height="100%"
              src={`http://localhost:${portNum}/absproxy/${innerPortNum}`}
              title="ide"
              loading="lazy"
            />
          )}
        </div>
      </Splitter>
    </div>
  );
};

export default OnlyIDE;
