import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  Select,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ToggleButton } from "@material-ui/lab";

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

const styles = makeStyles((theme) => ({
  languageButtons: {
    width: 80,
    marginRight: "15px",
    height: 30,
  },
  categoryButtons: {
    marginBottom: "10px",
    height: 30,
  },
  formControl: {
    minWidth: "250px",
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #484850",
      boxShadow: "2px 2px 0px #222",
      borderRadius: "5px 5px 0 0",
      backgroundColor: "transparent",
      borderBottomLeftRadius: "5px",
      borderBottomRightRadius: "5px",
    },
  },
  leftDiv: {
    width: "70%",
    paddingRight: theme.spacing(2),
  },
  rightDiv: {
    width: "30%",
  },
  dialogContent: {
    display: "flex",
  },
  fieldRoot: {
    backgroundColor: "#FFFFFF",
  },
  fieldInput: {
    padding: "12px",
    fontSize: "14px",
  },
  focused: {
    boxShadow: "2px 2px 0px #222",
  },
  notchedOutline: {
    borderColor: "#222 !important",
    borderWidth: "1px !important",
  },
}));

const AddSnippetDialog = ({
  addSnippetDialog,
  setAddSnippetDialog,
  snippetTitle,
  setSnippetTitle,
  categories,
  setCategories,
  codeLanguage,
  setCodeLanguage,
  handleAddNewSnippet,
  snippet,
  setSnippet,
}) => {
  const classes = styles();

  return (
    <Dialog
      open={addSnippetDialog}
      onClose={() => {
        setAddSnippetDialog(false);
      }}
      onExited={() => {
        setSnippet("");
        setCodeLanguage("java");
        setCategories({
          SEC: false,
          DB: false,
          FE: false,
          BE: false,
          UI: false,
          ML: false,
        });
      }}
      PaperProps={{
        style: {
          width: "75%",
          maxWidth: "none",
        },
      }}
    >
      <DialogTitle>New Code Snippet for Review</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.leftDiv}>
          <Typography variant="body2" style={{ paddingBottom: "10px" }}>
            Enter Code Snippet Below
          </Typography>
          <AceEditor
            placeholder="Enter your code here for review"
            mode={codeLanguage}
            theme="monokai"
            value={snippet}
            onChange={(newValue) => setSnippet(newValue)}
            name="code-editor"
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            width="100%"
            setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              newLineMode: "windows",
            }}
          />
        </div>
        <div className={classes.rightDiv}>
          <div style={{ marginBottom: "30px" }}>
            <label htmlFor="title">
              <Typography variant="body2">Name</Typography>
            </label>
            <TextField
              id="title"
              placeholder="Enter Snippet Name"
              autoComplete="off"
              variant="outlined"
              margin="dense"
              InputProps={{
                classes: {
                  root: classes.fieldRoot,
                  focused: classes.focused,
                  input: classes.fieldInput,
                  notchedOutline: classes.notchedOutline,
                },
              }}
              fullWidth
              value={snippetTitle && snippetTitle}
              onChange={(e) => {
                setSnippetTitle(e.target.value);
              }}
              autoFocus
            />
          </div>
          <div style={{ margin: "30px 0 " }}>
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Category (Choose at least 1)
            </Typography>
            <div>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.SEC}
                onChange={() => {
                  setCategories({ ...categories, SEC: !categories.SEC });
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Security
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.DB}
                onChange={() => {
                  setCategories({ ...categories, DB: !categories.DB });
                }}
                className={`${classes.categoryButtons}`}
                style={{ marginRight: "15px" }}
              >
                Database Administration
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.FE}
                onChange={() => {
                  setCategories({ ...categories, FE: !categories.FE });
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Frontend
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.BE}
                onChange={() => {
                  setCategories({ ...categories, BE: !categories.BE });
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                Backend
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.UI}
                onChange={() => {
                  setCategories({ ...categories, UI: !categories.UI });
                }}
                className={`${classes.languageButtons} ${classes.categoryButtons}`}
              >
                UI/UX
              </ToggleButton>
              <ToggleButton
                value=""
                size="small"
                selected={categories && categories.ML}
                onChange={() => {
                  setCategories({ ...categories, ML: !categories.ML });
                }}
                className={`${classes.categoryButtons}`}
              >
                Machine Learning
              </ToggleButton>
            </div>
          </div>
          <label htmlFor="language-select">
            <Typography variant="body2" style={{ marginTop: 8 }}>
              Select Coding Language
            </Typography>
          </label>
          <FormControl
            variant="outlined"
            margin="dense"
            className={classes.formControl}
          >
            <Select
              native
              id="language-select"
              value={codeLanguage}
              onChange={(e) => setCodeLanguage(e.target.value)}
              inputProps={{
                name: "age",
                id: "outlined-age-native-simple",
              }}
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="javascript">Javascript</option>
              <option value="c_cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="html">HTML</option>
              <option value="scss">CSS</option>
              <option value="ruby">Ruby</option>
            </Select>
          </FormControl>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => setAddSnippetDialog(false)}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddNewSnippet()}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSnippetDialog;
