import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ToggleButton } from "@material-ui/lab";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
}));
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
      PaperProps={{
        style: {
          width: "600px",
        },
      }}
    >
      <DialogTitle>New Code Snippet for Review</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: "30px" }}>
          <label htmlFor="title">
            <Typography variant="body2">Snippet Title</Typography>
          </label>
          <TextField
            id="title"
            placeholder="Enter Snippet Title"
            autoComplete="off"
            variant="outlined"
            margin="dense"
            fullWidth
            value={snippetTitle && snippetTitle}
            onChange={(e) => {
              setSnippetTitle(e.target.value);
            }}
            autoFocus
          />
        </div>
        <div style={{ marginBottom: "30px" }}>
          <Typography variant="body2" style={{ paddingBottom: "10px" }}>
            Category (Choost at least 1)
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
        <div style={{ marginBottom: "30px" }}>
          <Typography variant="body2" style={{ paddingBottom: "10px" }}>
            Coding Language/Framework (Choost at least 1)
          </Typography>
          <div>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.PY}
              onChange={() => {
                setCodeLanguage({ ...codeLanguage, PY: !codeLanguage.PY });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              Python
            </ToggleButton>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.JAVA}
              onChange={() => {
                setCodeLanguage({
                  ...codeLanguage,
                  JAVA: !codeLanguage.JAVA,
                });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              Java
            </ToggleButton>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.JS}
              onChange={() => {
                setCodeLanguage({ ...codeLanguage, JS: !codeLanguage.JS });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              Javascript
            </ToggleButton>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.CPP}
              onChange={() => {
                setCodeLanguage({ ...codeLanguage, CPP: !codeLanguage.CPP });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              C++
            </ToggleButton>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.CS}
              onChange={() => {
                setCodeLanguage({ ...codeLanguage, CS: !codeLanguage.CS });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              C#
            </ToggleButton>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.HTML}
              onChange={() => {
                setCodeLanguage({
                  ...codeLanguage,
                  HTML: !codeLanguage.HTML,
                });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              HTML
            </ToggleButton>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.CSS}
              onChange={() => {
                setCodeLanguage({ ...codeLanguage, CSS: !codeLanguage.CSS });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              CSS
            </ToggleButton>
            <ToggleButton
              value=""
              size="small"
              selected={codeLanguage && codeLanguage.RUBY}
              onChange={() => {
                setCodeLanguage({
                  ...codeLanguage,
                  RUBY: !codeLanguage.RUBY,
                });
              }}
              className={`${classes.languageButtons} ${classes.categoryButtons}`}
            >
              Ruby
            </ToggleButton>
          </div>
        </div>
        <Typography variant="body2" style={{ paddingBottom: "10px" }}>
          Enter Code Snippet Below
        </Typography>
        {/* <AceEditor
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
          /> */}
        <ReactQuill
          value={snippet && snippet}
          onChange={(value) => setSnippet(value)}
          modules={editor}
          format={format}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={() => {
            setAddSnippetDialog(false);
            setSnippet("");
            setCodeLanguage({
              PY: false,
              JAVA: false,
              JS: false,
              CPP: false,
              CS: false,
              HTML: false,
              CSS: false,
              RUBY: false,
            });
            setCategories({
              SEC: false,
              DB: false,
              FE: false,
              BE: false,
              UI: false,
              ML: false,
            });
          }}
        >
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
