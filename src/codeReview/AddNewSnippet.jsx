import React, { Fragment, useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from "@material-ui/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Service from "../AxiosService";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const editor = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const format = [
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

const AddNewSnippet = () => {
  const [snippet, setSnippet] = useState();

  const handleAddNewSnippet = () => {
    const data = {
      title: "python print",
      code: snippet,
      coding_languages: {
        python: true,
      },
      categories: {
        python: "beginner",
      },
    };

    Service.client
      .post(`/code-reviews`, data)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  console.log(snippet);

  return (
    <div>
      <Button onClick={() => handleAddNewSnippet()}>Add</Button>
      {/* <ReactQuill
        value={snippet && snippet}
        onChange={(value) => setSnippet(value)}
        modules={editor}
        format={format}
      /> */}
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={snippet}
        onChange={(newValue) => setSnippet(newValue)}
        name="UNIQUE_ID_OF_DIV"
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
        }}
      />
      ,
    </div>
  );
};

export default AddNewSnippet;
