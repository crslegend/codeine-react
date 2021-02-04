import React from "react";
// import image from "../assets/login4.jpg";
import { Button, Typography } from "@material-ui/core";

const NotFound = () => {
  return (
    <React.Fragment>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          // backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.4,
          zIndex: -1,
        }}
      >
        {/* <img src={image} style={{ height: "100vh", width: "100vw" }} /> */}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" style={{ marginTop: "35vh" }}>
          401 Unauthorized
        </Typography>
        <Typography variant="h6">
          You have reached an unauthorized page
        </Typography>
        <br />
        <Button
          variant="outlined"
          size="large"
          component="a"
          href="/"
          style={{
            borderColor: "#000000",
          }}
        >
          Bring Me Back
        </Button>
      </div>
    </React.Fragment>
  );
};

export default NotFound;
