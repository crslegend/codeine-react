import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Card, IconButton } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import hljs from "highlight.js";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  flex: {
    display: "flex",
    alignItems: "center",
  },
  gutter: {
    padding: theme.spacing(0.8, 2),
    background: "rgba(67, 127, 199, 0.2)",
    color: theme.palette.secondary.main,
  },
  codeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 2),
    background: "rgba(164, 201, 245, 0.1)",
    display: "flex",
    "&:hover": {
      background: "rgba(164, 201, 245, 0.3)",
      cursor: "pointer",
    },
  },
  selectedCodeBody: {
    flexGrow: 1,
    padding: theme.spacing(0.8, 2),
    background: "rgba(255, 123, 110, 0.2)",
    display: "flex",
    "&:hover": {
      background: "rgba(255, 123, 110, 0.3)",
      cursor: "pointer",
    },
  },
  iconButton: {
    padding: 0,
    margin: "-4px 8px",
    fontSize: "22px",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.secondary.main,
      background: "transparent",
    },
  },
}));

const CodeLine = ({ index, code, language, selectedLine, setSelectedLine }) => {
  const classes = useStyles();

  const [hover, setHover] = useState(false);
  const [addComment, setAddComment] = useState(false);

  return (
    <Fragment>
      <div
        className={classes.flex}
        onClick={() => setSelectedLine(index)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className={classes.gutter}>{index}</div>
        <div className={selectedLine !== index ? classes.codeBody : classes.selectedCodeBody}>
          <pre style={{ margin: 0 }}>
            <div dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(code, [language]).value }} />
          </pre>
          {hover && (
            <IconButton classes={{ root: classes.iconButton }} size="small" onClick={() => setAddComment(!addComment)}>
              <AddCircle fontSize="inherit" />
            </IconButton>
          )}
        </div>
      </div>
      {addComment && <Card>Add Comment</Card>}
    </Fragment>
  );
};

export default CodeLine;
