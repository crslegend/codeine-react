import React, { Fragment } from "react";
import { IconButton, TextField, Tooltip, Typography } from "@material-ui/core";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-scss";
import { Help } from "@material-ui/icons";

const VideoCreationModal = ({ video, setVideo }) => {
  return (
    <Fragment>
      <label htmlFor="title">
        <Typography variant="body2">Title of Video</Typography>
      </label>
      <TextField
        id="title"
        variant="outlined"
        fullWidth
        margin="dense"
        value={video && video.title}
        onChange={(e) => {
          setVideo({
            ...video,
            title: e.target.value,
          });
        }}
        inputProps={{ style: { fontSize: "14px" } }}
        required
        placeholder="Enter Title"
        style={{ marginBottom: "15px" }}
        autoFocus
      />
      <label htmlFor="description">
        <Typography variant="body2">Description of Video</Typography>
      </label>
      <TextField
        id="description"
        variant="outlined"
        fullWidth
        margin="dense"
        value={video && video.description}
        onChange={(e) => {
          setVideo({
            ...video,
            description: e.target.value,
          });
        }}
        inputProps={{ style: { fontSize: "14px" } }}
        required
        placeholder="Enter Description"
        style={{ marginBottom: "15px" }}
      />
      <label htmlFor="url">
        <Typography variant="body2">Video URL</Typography>
      </label>
      <TextField
        id="url"
        variant="outlined"
        fullWidth
        margin="dense"
        value={video && video.video_url}
        onChange={(e) => {
          setVideo({
            ...video,
            video_url: e.target.value,
          });
        }}
        inputProps={{ style: { fontSize: "14px" } }}
        required
        placeholder="https://www.google.com"
        style={{ marginBottom: "15px" }}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <Typography variant="body2">Add Code Snippet (Optional)</Typography>
        <Tooltip
          title={
            <Typography variant="body2">
              You can add code snippets to be displayed at a given time frame of
              the video
            </Typography>
          }
        >
          <IconButton disableRipple size="small">
            <Help fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      </div>
    </Fragment>
  );
};

export default VideoCreationModal;
