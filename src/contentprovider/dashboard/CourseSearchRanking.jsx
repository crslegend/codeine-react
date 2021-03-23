import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Service from "../../AxiosService";
import PageTitle from "../../components/PageTitle";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    marginBottom: "30px",
  },
  formControl: {
    marginTop: "15px",
    marginBottom: "10px",
    width: "200px",
  },
}));

const CourseSearchRanking = () => {
  const classes = useStyles();

  const [numDays, setNumDays] = useState();
  const [data, setData] = useState();

  const getSearchRanking = () => {
    if (numDays && numDays !== "") {
      Service.client
        .get(`/analytics/course-search-ranking`, { params: { days: numDays } })
        .then((res) => {
          console.log(res);

          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              keyword: res.data[i].search_string,
              Occurences: res.data[i].search_count,
            };
            arr.push(obj);
          }
          setData(arr);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`/analytics/course-search-ranking`)
        .then((res) => {
          console.log(res);

          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              keyword: res.data[i].search_string,
              Occurences: res.data[i].search_count,
            };
            arr.push(obj);
          }
          setData(arr);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getSearchRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSearchRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numDays]);

  return (
    <div>
      <PageTitle title="Course Search Ranking" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" style={{ paddingRight: "15px" }}>
          View By
        </Typography>
        <FormControl
          margin="dense"
          variant="outlined"
          className={classes.formControl}
        >
          <InputLabel>Date Range</InputLabel>
          <Select
            label="Date Range"
            value={numDays ? numDays : ""}
            onChange={(e) => {
              setNumDays(e.target.value);
            }}
            style={{ backgroundColor: "#fff" }}
          >
            <MenuItem value="">
              <em>Select a date range</em>
            </MenuItem>
            <MenuItem value="7">Past Week</MenuItem>
            <MenuItem value="14">Past 2 Weeks</MenuItem>
            <MenuItem value="30">Past Month</MenuItem>
            <MenuItem value="90">Past 3 Months</MenuItem>
            <MenuItem value="240">Past 6 Months</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Paper className={classes.paper}>
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            paddingBottom: "20px",
            color: "#437FC7",
          }}
        >
          The bar chart below shows the keywords entered by the students and the
          respective occurences when searching for courses on Codeine
        </Typography>
        <ResponsiveContainer width="100%" height={430}>
          <BarChart
            data={data && data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="keyword">
              <Label
                value={`Keywords entered by students`}
                position="bottom"
                offset={5}
                style={{ textAnchor: "middle" }}
              />
            </XAxis>
            <YAxis>
              <Label
                value="Number of Occurences for that keyword"
                position="left"
                angle={-90}
                offset={5}
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Tooltip />

            <Bar dataKey="Occurences" fill="#164D8F" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
};

export default CourseSearchRanking;
