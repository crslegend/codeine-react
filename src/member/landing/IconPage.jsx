import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Card, Tooltip } from "@material-ui/core";
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
    height: "700px",
  },
  heading1: {
    marginTop: "13vh",
    color: "#D4D4D4",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  heading2: {
    marginTop: "3vh",
    marginBottom: "55px",
    lineHeight: "40px",
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
          <Typography variant="h2" className={classes.heading1}>
            Not sure where to start?
          </Typography>
          <Typography variant="h4" className={classes.heading2}>
            Check out their pros and cons to decide which
            <br />
            coding languages are for you!
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* PY icon */}
            <Tooltip
              title={
                <Card className={classes.description}>
                  <Typography
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#3675A9",
                    }}
                  >
                    PYTHON COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      paddingTop: "5px",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
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
                    - Readable and Simplified Syntax
                    <br />
                    - Open Source <br />- Dynamically Typed
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "5px 0px 3px",
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
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#F3BF04",
                    }}
                  >
                    JAVASCRIPT COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "5px",
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
                      margin: "5px 0px 3px",
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
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#E57001",
                    }}
                  >
                    JAVA COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "5px",
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
                      margin: "5px 0px 3px",
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
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#CC0000",
                    }}
                  >
                    RUBY COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "5px",
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
                      margin: "5px 0px 3px",
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
                    - Poor Runtime Speed <br />- Lack of Flexibility
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
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#004482",
                    }}
                  >
                    C++ COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "5px",
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
                      margin: "5px 0px 3px",
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
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#6A1577",
                    }}
                  >
                    C# COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "5px",
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
                      margin: "5px 0px 3px",
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
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#E44D26",
                    }}
                  >
                    HTML COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "5px",
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
                    - Easy to Learn and Understand <br /> - Great Browser
                    Support
                    <br />- SEO Friendly
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      margin: "5px 0px 3px",
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
                    variant="h6"
                    style={{
                      textAlign: "center",
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      color: "#264DE4",
                    }}
                  >
                    CSS COURSES
                  </Typography>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 700,
                      fontFamily: "Roboto Mono",
                      marginBottom: "5px",
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
                      margin: "5px 0px 3px",
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
                    - Cross-browser Issues <br />- Poor Security
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
