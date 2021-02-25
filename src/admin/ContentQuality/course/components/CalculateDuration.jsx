import React from "react";
import ReactPlayer from "react-player";

const returnDuration = (duration) => {
  console.log(duration);
  return duration;
};

const CalculateDuration = (url) => {
  const ref = React.createRef();

  const handleDuration = (duration) => {
    returnDuration(duration);
  };

  const player = (
    <ReactPlayer ref={ref} url={url} onDuration={handleDuration} controls />
  );
  return <div style={{ display: "none" }}>{player}</div>;
};

export default { CalculateDuration, returnDuration };
