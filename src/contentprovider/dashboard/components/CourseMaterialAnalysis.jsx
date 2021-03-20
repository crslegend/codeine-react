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
import {
  Label,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import DefaultTooltipContent from "recharts/lib/component/DefaultTooltipContent";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: theme.spacing(2),
    minWidth: "300px",
    display: "flex",
    // marginBottom: "30px",
    height: "40px",
    justifyContent: "center",
    alignItems: "center",
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
  tooltip: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: theme.spacing(1),
  },
}));

const CourseMaterialAnalysis = ({ timeTakenCourseMaterial }) => {
  const classes = useStyles();
  // console.log(timeTakenCourseMaterial);

  const handleSelectChapter = (e) => {
    setSelectedChapterId(e.target.value);

    let index;
    for (let i = 0; i < timeTakenCourseMaterial.length; i++) {
      if (timeTakenCourseMaterial[i].chapter_id === e.target.value) {
        index = i;
        break;
      }
    }
    const courseMaterials = timeTakenCourseMaterial[index].course_materials;
    // console.log(courseMaterials);
    let loadedData = [];
    let obj = {};
    for (let i = 0; i < courseMaterials.length; i++) {
      obj = {
        name: courseMaterials[i].course_material_title,
        Type:
          courseMaterials[i].material_type
            .toLowerCase()
            .charAt(0)
            .toUpperCase() +
          courseMaterials[i].material_type.toLowerCase().slice(1),
        Time: parseFloat(
          (courseMaterials[i].average_time_taken / 3600).toFixed(6)
        ),
      };
      loadedData.push(obj);
    }
    setData(loadedData);
  };

  const findIndexOfChapter = () => {
    if (selectedChapterId !== "") {
      for (let i = 0; i < timeTakenCourseMaterial.length; i++) {
        if (timeTakenCourseMaterial[i].chapter_id === selectedChapterId) {
          return i + 1;
        }
      }
    } else {
      return "";
    }
  };

  const [data, setData] = useState([]);
  const [selectedChapterId, setSelectedChapterId] = useState("");

  const CustomTooltip = (props) => {
    const { active, payload } = props;
    // console.log(props);
    if (active && payload && payload.length) {
      return (
        <div className={classes.tooltip}>
          {`${payload[0].payload.name}`}
          <br />
          {`${payload[0].payload.Type}`}
          <br />
          <span
            style={{ color: "#437FC7" }}
          >{`${payload[0].payload.Time} hrs`}</span>
        </div>
      );
    }
    return null;
  };

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
                handleSelectChapter(e);
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
              <Typography variant="body2">No Chapter Selected</Typography>
            ) : (
              <div>
                {timeTakenCourseMaterial &&
                  timeTakenCourseMaterial.length > 0 &&
                  timeTakenCourseMaterial.map((chapter, index) => {
                    if (chapter.chapter_id === selectedChapterId) {
                      return (
                        <Typography
                          key={index}
                          variant="body2"
                          style={{ textAlign: "center" }}
                        >
                          <span style={{ fontWeight: 600 }}>
                            Chapter {index + 1}:{" "}
                          </span>
                          {chapter.chapter_title}
                        </Typography>
                      );
                    }
                    return null;
                  })}
              </div>
            )}
          </Paper>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          width={600}
          height={400}
          data={data}
          margin={{
            top: 25,
            right: 30,
            left: 40,
            bottom: 30,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name">
            <Label
              value={`Course Materials in Chapter ${findIndexOfChapter()}`}
              position="bottom"
              offset={10}
              style={{ textAnchor: "middle" }}
            />
          </XAxis>
          <YAxis>
            <Label
              value="Average Time Taken (Hours)"
              position="left"
              angle={-90}
              offset={30}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="Time"
            stroke="#437FC7"
            strokeWidth={2}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseMaterialAnalysis;
