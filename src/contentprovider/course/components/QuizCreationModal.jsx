import React, { Fragment } from "react";
import { Typography, TextField } from "@material-ui/core";

const QuizCreationModel = ({ quiz, setQuiz }) => {
  return (
    <Fragment>
      <label htmlFor="title">
        <Typography variant="body2">Title of Quiz (Required)</Typography>
      </label>
      <TextField
        id="title"
        variant="outlined"
        fullWidth
        margin="dense"
        value={quiz && quiz.title}
        onChange={(e) => {
          setQuiz({
            ...quiz,
            title: e.target.value,
          });
        }}
        required
        placeholder="Enter Title"
        style={{ marginBottom: "15px" }}
      />
      <label htmlFor="description">
        <Typography variant="body2">Description of Quiz (Required)</Typography>
      </label>
      <TextField
        id="description"
        variant="outlined"
        fullWidth
        margin="dense"
        value={quiz && quiz.description}
        onChange={(e) => {
          setQuiz({
            ...quiz,
            description: e.target.value,
          });
        }}
        required
        placeholder="Enter Description"
        style={{ marginBottom: "15px" }}
      />
      <label htmlFor="marks">
        <Typography variant="body2">Passing Marks (Required)</Typography>
      </label>
      <TextField
        id="marks"
        variant="outlined"
        fullWidth
        margin="dense"
        value={quiz && quiz.passing_marks}
        onChange={(e) => {
          setQuiz({
            ...quiz,
            passing_marks: e.target.value,
          });
        }}
        InputProps={{
          inputProps: { min: 0 },
        }}
        required
        style={{ marginBottom: "15px" }}
        type="number"
      />
      {/* <label htmlFor="marks">
        <Typography variant="body2">Instructions</Typography>
      </label>
      <TextField
        id="marks"
        variant="outlined"
        fullWidth
        margin="dense"
        value={quiz && quiz.instructions}
        onChange={(e) => {
          setQuiz({
            ...quiz,
            instructions: e.target.value,
          });
        }}
        required
        placeholder="eg. Read the questions carefully"
        style={{ marginBottom: "15px" }}
      /> */}
    </Fragment>
  );
};

export default QuizCreationModel;
