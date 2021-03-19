import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(1),
    width: "300px",
    display: "flex",
    // marginBottom: "30px",
    height: "40px",
    justifyContent: "center",
  },
  numbers: {
    color: theme.palette.primary.main,
  },
  cardRoot: {
    width: "300px",
    padding: "10px 10px",
    marginTop: "30px",
    marginRight: "50px",
    border: "1px solid",
    borderRadius: 0,
    height: "100%",
  },
  individualStats: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // marginBottom: "5px",
  },
  formControl: {
    marginTop: 0,
    paddingTop: "15px",
    paddingBottom: "10px",
    width: "200px",
    "& label": {
      paddingLeft: "7px",
      paddingRight: "7px",
      paddingTop: "5px",
      marginLeft: "10px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "0px",
    },
  },
}));

const CourseMaterialAnalysis = ({ timeTakenCourseMaterial }) => {
  const classes = useStyles();
  console.log(timeTakenCourseMaterial);

  const [selectedChapterId, setSelectedChapterId] = useState("");

  return (
    <div className={classes.root}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          <FormControl margin="dense" className={classes.formControl}>
            <InputLabel>Select Chapter</InputLabel>
            <Select
              label="Select Chapter"
              variant="outlined"
              value={selectedChapterId ? selectedChapterId : ""}
              onChange={(e) => {
                setSelectedChapterId(e.target.value);
              }}
            >
              {timeTakenCourseMaterial &&
                timeTakenCourseMaterial.length > 0 &&
                timeTakenCourseMaterial.map((chapter, index) => {
                  return (
                    <MenuItem key={index} value={chapter.chapter_id}>
                      Chapter {index + 1}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </div>
        <div style={{ marginLeft: "10px" }}>
          <Paper className={classes.paper}>
            {selectedChapterId === "" ? (
              <div>
                <Typography variant="h6">No Chapter Selected</Typography>
              </div>
            ) : (
              <div>
                {timeTakenCourseMaterial &&
                  timeTakenCourseMaterial.length > 0 &&
                  timeTakenCourseMaterial.map((chapter, index) => {
                    if (chapter.chapter_id === selectedChapterId) {
                      return (
                        <div>
                          <Typography
                            variant="h6"
                            style={{ textAlign: "center" }}
                          >
                            <span style={{ fontWeight: 600 }}>
                              Chapter {index + 1}:{" "}
                            </span>
                            {chapter.chapter_title}
                          </Typography>
                        </div>
                      );
                    }
                    return null;
                  })}
              </div>
            )}
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default CourseMaterialAnalysis;
