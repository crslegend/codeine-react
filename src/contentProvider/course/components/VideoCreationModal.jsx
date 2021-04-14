import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import Toast from "../../../components/Toast.js";
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
import { Delete, Help } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  snippetDiv: {
    display: "flex",
    flexDirection: "column",
    border: "2px solid #676767",
    borderRadius: "5px",
    padding: theme.spacing(2, 2),
    marginTop: "10px",
  },
}));

const VideoCreationModal = ({
  video,
  setVideo,
  codeSnippetArr,
  setCodeSnippetArr,
}) => {
  const classes = useStyles();

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [newObj, setNewObj] = useState({ start: "", end: "", code: "" });
  //   console.log(codeSnippetArr);

  const handleAddCodeSnippet = () => {
    const startArr = newObj.start.split(":");
    const endArr = newObj.end.split(":");

    const pattern1 = /^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    const pattern2 = /^[0-5][0-9]:[0-5][0-9]$/;
    let invalid = false;
    if (startArr.length < 2) {
      invalid = true;
    } else if (startArr.length === 2) {
      if (!pattern2.test(newObj.start)) {
        invalid = true;
      }
    } else if (startArr.length === 3) {
      if (!pattern1.test(newObj.start)) {
        invalid = true;
      }
    }

    if (invalid) {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter a valid format for start time",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    if (endArr.length < 2) {
      invalid = true;
    } else if (endArr.length === 2) {
      if (!pattern2.test(newObj.end)) {
        invalid = true;
      }
    } else if (endArr.length === 3) {
      if (!pattern1.test(newObj.end)) {
        invalid = true;
      }
    }

    if (invalid) {
      setSbOpen(true);
      setSnackbar({
        message: "Please enter a valid format for end time",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    let arr = [...codeSnippetArr];
    arr.push(newObj);
    setCodeSnippetArr(arr);
    setNewObj({
      start: "",
      end: "",
      code: "",
    });
  };

  const handleChangeInput = (e, index) => {
    let arr = [...codeSnippetArr];
    if (e.target.name === "start") {
      arr[index].start = e.target.value;
    } else if (e.target.value === "end") {
      arr[index].end = e.target.value;
    } else {
      arr[index].code = e.target.value;
    }
    setCodeSnippetArr(arr);
    //   arr[index] =
  };

  const handleRemove = (index) => {
    let arr = [...codeSnippetArr];
    arr.splice(index, 1);
    setCodeSnippetArr(arr);
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
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
        multiline
        rows={5}
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
        <Typography variant="body2">
          Add Code Snippet to Video (Optional)
        </Typography>
        <Tooltip
          title={
            <Typography variant="body2">
              You can add code snippets to be displayed at a given time frame of
              the video. Members will be able to copy the displayed code snippet
              while watching the video
            </Typography>
          }
        >
          <IconButton disableRipple size="small">
            <Help fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      </div>
      {codeSnippetArr &&
        codeSnippetArr.length > 0 &&
        codeSnippetArr.map((obj, index) => {
          return (
            <div className={classes.snippetDiv} key={index}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" style={{ paddingRight: "10px" }}>
                  Start Time
                </Typography>
                <div style={{ marginRight: "30px" }}>
                  <TextField
                    name="start"
                    variant="outlined"
                    margin="dense"
                    inputProps={{ style: { fontSize: "14px" } }}
                    value={obj && obj.start}
                    onChange={(e) => handleChangeInput(e, index)}
                  />
                </div>
                <Typography variant="body2" style={{ paddingRight: "10px" }}>
                  End Time
                </Typography>
                <div>
                  <TextField
                    name="end"
                    variant="outlined"
                    margin="dense"
                    inputProps={{ style: { fontSize: "14px" } }}
                    value={obj && obj.end}
                    onChange={(e) => handleChangeInput(e, index)}
                  />
                </div>
                <IconButton
                  size="small"
                  style={{ marginLeft: "10px" }}
                  onClick={() => handleRemove(index)}
                >
                  <Delete style={{ color: "#C74343" }} />
                </IconButton>
              </div>
              <div style={{ marginTop: "10px" }}>
                <AceEditor
                  name="code"
                  placeholder="Enter code snippet here"
                  theme="monokai"
                  fontSize={14}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: true,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,
                    newLineMode: "windows",
                  }}
                  minLines={2}
                  maxLines={Infinity}
                  width="100%"
                  value={obj && obj.code}
                  onChange={(newValue) => console.log(1)}
                />
              </div>
            </div>
          );
        })}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" style={{ paddingRight: "10px" }}>
            Start Time
          </Typography>
          <div style={{ marginRight: "30px" }}>
            <TextField
              variant="outlined"
              margin="dense"
              inputProps={{ style: { fontSize: "14px" } }}
              placeholder="04:20"
              value={newObj && newObj.start}
              onChange={(e) => setNewObj({ ...newObj, start: e.target.value })}
            />
          </div>
          <Typography variant="body2" style={{ paddingRight: "10px" }}>
            End Time
          </Typography>
          <div>
            <TextField
              variant="outlined"
              margin="dense"
              inputProps={{ style: { fontSize: "14px" } }}
              placeholder="05:20"
              value={newObj && newObj.end}
              onChange={(e) => setNewObj({ ...newObj, end: e.target.value })}
            />
          </div>
        </div>
        <div style={{ marginTop: "10px", width: "100%" }}>
          <AceEditor
            placeholder="Enter code snippet here"
            theme="monokai"
            // mode={"auto"}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              newLineMode: "windows",
            }}
            minLines={2}
            maxLines={Infinity}
            value={newObj && newObj.code}
            onChange={(newValue) => setNewObj({ ...newObj, code: newValue })}
            width="100%"
          />
        </div>
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <Button
          variant="outlined"
          style={{ marginLeft: "auto", textTransform: "capitalize" }}
          disabled={
            newObj.start === "" || newObj.end === "" || newObj.code === ""
          }
          onClick={() => handleAddCodeSnippet()}
          size="small"
        >
          Add Code Snippet
        </Button>
      </div>
    </Fragment>
  );
};

export default VideoCreationModal;
