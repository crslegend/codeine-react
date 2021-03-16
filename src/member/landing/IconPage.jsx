import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Button,
  Card,
  Box,
  Tooltip,
} from "@material-ui/core";
import { Link } from "react-router-dom";

import py from "../../assets/icons/py_icon.png";
import js from "../../assets/icons/js_icon.png";
import java from "../../assets/icons/java_icon.png";
import ruby from "../../assets/icons/ruby_icon.png";
import cplus from "../../assets/icons/c++_icon.png";
import csharp from "../../assets/icons/csharp_icon.png";
import html from "../../assets/icons/html_icon.png";
import css from "../../assets/icons/css_icon.png";

const styles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#1E1E1E",
    height: "100vh",
  },
  heading1: {
    marginTop: "20vh",
    color: "#D4D4D4",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  heading2: {
    marginTop: "15px",
    marginBottom: "55px",
    color: "#D4D4D4",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  description: {
    borderRadius: 0,
    backgroundColor: "#D4D4D4",
    padding: "15px 10px",
  },
  button: {
    fontFamily: "Roboto Mono",
  },
}));

const IconPage = () => {
  const classes = styles();
  const [openPYDialog, setOpenPYDialog] = useState(false);
  const [openJSDialog, setOpenJSDialog] = useState(false);
  const [openJAVADialog, setOpenJAVADialog] = useState(false);
  const [openRBDialog, setOpenRBDialog] = useState(false);
  const [openCPDialog, setOpenCPDialog] = useState(false);
  const [openCSDialog, setOpenCSDialog] = useState(false);
  const [openHTMLDialog, setOpenHTMLDialog] = useState(false);
  const [openCSSDialog, setOpenCSSDialog] = useState(false);

  return (
    <Fragment>
      <Grid container className={classes.root}>
        <Grid item xs={1} />
        <Grid item xs={10}>
          <Typography variant="h1" className={classes.heading1}>
            Not sure where to start?
          </Typography>
          <Typography variant="h1" className={classes.heading2}>
            Hover over these languages to find out <br />
            their pros & cons!
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* PY icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      paddingTop: "10px",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Readibe and Simplified Syntax
                    <br />
                    - Open Source <br />- Dynamically Typed
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "8px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Weak in Mobile Computing <br />
                    - Not Memory Efficient <br />
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="py_icon"
                src={py}
                style={{
                  transform: openPYDialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openPYDialog ? "-8px 8px 1px 1px #D4D4D4" : "none",
                }}
                onMouseOver={() => setOpenPYDialog(true)}
                onMouseOut={() => setOpenPYDialog(false)}
              />
            </Tooltip>
            {/* JS icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Client-side Script <br />
                    - Easy to Learn and Understand <br />- Less Overhead
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "6px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Compromises Security <br />- Single Inheritance
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="js_icon"
                src={js}
                style={{
                  transform: openJSDialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openJSDialog ? "-8px 8px 1px 1px #D4D4D4" : "none",
                }}
                onMouseOver={() => setOpenJSDialog(true)}
                onMouseOut={() => setOpenJSDialog(false)}
              />
            </Tooltip>
            {/* Java icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Object-oriented Programming <br />
                    - Write Once Run Anywhere <br />- Efficient Memory
                    Allocation
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "6px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Poor Performance <br />- No Backup Facility
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="java_icon"
                src={java}
                style={{
                  transform: openJAVADialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openJAVADialog
                    ? "-8px 8px 1px 1px #D4D4D4"
                    : "none",
                }}
                onMouseOver={() => setOpenJAVADialog(true)}
                onMouseOut={() => setOpenJAVADialog(false)}
              />
            </Tooltip>
            {/* Ruby icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Open Source <br /> - Object-oriented Programming <br />-
                    Built-in Security Mechanisms
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "6px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Poor Runtime Speed <br />- Lack of flexibility
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="ruby_icon"
                src={ruby}
                style={{
                  transform: openRBDialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openRBDialog ? "-8px 8px 1px 1px #D4D4D4" : "none",
                }}
                onMouseOver={() => setOpenRBDialog(true)}
                onMouseOut={() => setOpenRBDialog(false)}
              />
            </Tooltip>
            {/* c++ icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Efficient Performance <br /> - Multi-paradigm Programming
                    <br />- Portable Language
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "6px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - No Garbage Collection Support <br />- Poor Security
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="c++_icon"
                src={cplus}
                style={{
                  transform: openCPDialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openCPDialog ? "-8px 8px 1px 1px #D4D4D4" : "none",
                }}
                onMouseOver={() => setOpenCPDialog(true)}
                onMouseOut={() => setOpenCPDialog(false)}
              />
            </Tooltip>
            {/* c# icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Automatic Garbage Collection <br /> - Object-oriented
                    Programming
                    <br />- Automated Memory Allocation
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "6px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Poor Flexbilty <br />- Difficult to Master
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="c#_icon"
                src={csharp}
                style={{
                  transform: openCSDialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openCSDialog ? "-8px 8px 1px 1px #D4D4D4" : "none",
                }}
                onMouseOver={() => setOpenCSDialog(true)}
                onMouseOut={() => setOpenCSDialog(false)}
              />
            </Tooltip>
            {/* html icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Easy to learn and Understand <br /> - Great Browser
                    Support
                    <br />- SEO Friendly
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "6px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Poor Security <br />- Cannot Create Dynamic Pages
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="html_icon"
                src={html}
                style={{
                  transform: openHTMLDialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openHTMLDialog
                    ? "-8px 8px 1px 1px #D4D4D4"
                    : "none",
                }}
                onMouseOver={() => setOpenHTMLDialog(true)}
                onMouseOut={() => setOpenHTMLDialog(false)}
              />
            </Tooltip>
            {/* css icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "3px",
                    }}
                  >
                    Pros
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Enables Consistent Styling <br /> - Device Friendly
                    <br />- SEO Friendly
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "6px 0px 3px",
                    }}
                  >
                    Cons
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{
                      fontFamily: "Roboto Mono",
                    }}
                  >
                    - Cross-browser Issues <br />- Poor security
                  </Typography>
                </Card>
              }
            >
              <img
                width="8%"
                alt="css_icon"
                src={css}
                style={{
                  transform: openCSSDialog ? "scale(1.1, 1.1)" : "none",
                  boxShadow: openCSSDialog
                    ? "-8px 8px 1px 1px #D4D4D4"
                    : "none",
                }}
                onMouseOver={() => setOpenCSSDialog(true)}
                onMouseOut={() => setOpenCSSDialog(false)}
              />
            </Tooltip>
          </div>
        </Grid>

        <Grid item xs={1} />
      </Grid>
    </Fragment>
  );
};

export default IconPage;
