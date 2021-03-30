import React, { useState, useEffect } from "react";
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
  Bar,
  BarChart,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Text,
  ResponsiveContainer,
} from "recharts";

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
    marginTop: "15px",
    marginBottom: "10px",
    width: "200px",
  },
  tooltip: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: theme.spacing(1),
  },
}));

const CourseMaterialAnalysis = ({ timeTakenCourseMaterial }) => {
  const classes = useStyles();

  const handleSelectChapter = (chapterId) => {
    setSelectedChapterId(chapterId);

    let index;
    for (let i = 0; i < timeTakenCourseMaterial.length; i++) {
      if (timeTakenCourseMaterial[i].chapter_id === chapterId) {
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
          (courseMaterials[i].average_time_taken / 60).toFixed(6)
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
          >{`${payload[0].payload.Time} mins`}</span>
        </div>
      );
    }
    return null;
  };

  const CustomizedAxisTick = (props) => {
    const { x, y, payload } = props;

    return (
      <Text x={x} y={y} width={150} textAnchor="middle" verticalAnchor="start">
        {payload.value}
      </Text>
    );
  };

  const setInitialChapter = () => {
    if (timeTakenCourseMaterial && timeTakenCourseMaterial[0]) {
      setSelectedChapterId(timeTakenCourseMaterial[0].chapter_id);
      handleSelectChapter(timeTakenCourseMaterial[0].chapter_id);
    }
  };

  useEffect(() => {
    setInitialChapter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeTakenCourseMaterial]);

  return (
    <div className={classes.root}>
      <div
        style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
      >
        <div>
          <FormControl
            margin="dense"
            variant="outlined"
            className={classes.formControl}
          >
            <InputLabel>Select Chapter</InputLabel>
            <Select
              label="Select Chapter"
              value={selectedChapterId ? selectedChapterId : ""}
              onChange={(e) => {
                handleSelectChapter(e.target.value);
              }}
              style={{ backgroundColor: "#fff" }}
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
      </div>

      <Paper style={{ width: "100%", padding: "24px" }}>
        <div style={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ textAlign: "center" }}>
            {selectedChapterId === "" ? (
              <Typography variant="h6">No Chapter Selected</Typography>
            ) : (
              <div>
                {timeTakenCourseMaterial &&
                  timeTakenCourseMaterial.length > 0 &&
                  timeTakenCourseMaterial.map((chapter, index) => {
                    if (chapter.chapter_id === selectedChapterId) {
                      return (
                        <Typography
                          key={index}
                          variant="h6"
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
          </div>
        </div>
        <ResponsiveContainer
          width="100%"
          height={400}
          style={{ backgroundColor: "#fff" }}
        >
          <BarChart
            data={data && data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 35,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={<CustomizedAxisTick />}
              height={90}
            >
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
                offset={0}
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />

            <Bar dataKey="Time" fill="#164D8F" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
};

export default CourseMaterialAnalysis;
