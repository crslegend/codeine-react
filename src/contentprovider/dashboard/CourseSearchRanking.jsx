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
  IconButton,
} from "@material-ui/core";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Label,
// } from "recharts";
import { LooksOne, LooksTwo, Looks3, ArrowBack } from "@material-ui/icons";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  paper: {
    padding: theme.spacing(4),
    width: "100%",
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
  statsDiv: {
    display: "flex",
    flexDirection: "column",
    // border: "2px solid #e2e2e2",
    backgroundColor: "#eeeeee",
    padding: theme.spacing(2),
    borderRadius: "5px",
    minWidth: "250px",
    justifyContent: "space-between",
  },
  result: {
    width: "70%",
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    border: "2px solid #e2e2e2",
    borderRadius: "5px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

const CourseSearchRanking = () => {
  const classes = useStyles();
  const history = useHistory();

  const [numDays, setNumDays] = useState(7);
  const [data, setData] = useState();

  const getSearchRanking = () => {
    if (numDays && numDays !== "") {
      Service.client
        .get(`/analytics/course-search-ranking`, { params: { days: numDays } })
        .then((res) => {
          // console.log(res);

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
          // console.log(res);

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
    <div className={classes.root}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={() => history.push(`/partner/home/dashboard`)}
          style={{ marginRight: "30px" }}
        >
          <ArrowBack />
        </IconButton>
        <PageTitle title="Course Search Ranking" />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "auto",
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
          Below shows the keywords entered by the students when searching for
          courses on Codeine and the respective occurences and rankings
        </Typography>
        {data && data && (
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
                justifyContent: "space-around",
                alignItems: "flex-end",
              }}
            >
              <div className={classes.statsDiv} style={{ minHeight: 130 }}>
                <div style={{ textAlign: "center" }}>
                  <LooksTwo
                    style={{
                      fontSize: 55,
                      color: "#A9A9A9",
                    }}
                  />
                </div>
                <div>
                  <Typography variant="h6" style={{ textAlign: "center" }}>
                    Keywords: {data[1] ? data[1].keyword : "-"}
                  </Typography>
                  <Typography variant="h6" style={{ textAlign: "center" }}>
                    Occurence: {data[1] ? data[1].Occurences : "-"}
                  </Typography>
                </div>
              </div>
              <div className={classes.statsDiv} style={{ minHeight: 150 }}>
                <div style={{ textAlign: "center" }}>
                  <LooksOne
                    style={{
                      fontSize: 70,
                      color: "#d4af37",
                    }}
                  />
                </div>
                <div>
                  <Typography variant="h6" style={{ textAlign: "center" }}>
                    Keywords: {data[0] ? data[0].keyword : "-"}
                  </Typography>
                  <Typography variant="h6" style={{ textAlign: "center" }}>
                    Occurence: {data[0] ? data[0].Occurences : "-"}
                  </Typography>
                </div>
              </div>
              <div className={classes.statsDiv} style={{ minHeight: 130 }}>
                <div style={{ textAlign: "center" }}>
                  <Looks3
                    style={{
                      fontSize: 55,
                      color: "#cd7f32",
                    }}
                  />
                </div>
                <div>
                  <Typography variant="h6" style={{ textAlign: "center" }}>
                    Keywords: {data[2] ? data[2].keyword : "-"}
                  </Typography>
                  <Typography variant="h6" style={{ textAlign: "center" }}>
                    Occurence: {data[2] ? data[2].Occurences : "-"}
                  </Typography>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "30px" }}>
              {data.length > 0 &&
                data.map((result, index) => {
                  if (index === 0) {
                    return (
                      <div className={classes.result}>
                        <Typography
                          variant="h3"
                          style={{
                            color: "#d4af37",
                            fontWeight: 600,
                            textAlign: "center",
                          }}
                        >
                          #1
                        </Typography>

                        <Typography variant="h6">
                          Keywords: {result.keyword}
                        </Typography>
                        <Typography variant="h6">
                          Occurence: {result.Occurences}
                        </Typography>
                      </div>
                    );
                  } else if (index === 1) {
                    return (
                      <div className={classes.result}>
                        <Typography
                          variant="h3"
                          style={{
                            color: "#A9A9A9",
                            fontWeight: 600,
                            textAlign: "center",
                          }}
                        >
                          #2
                        </Typography>
                        <Typography variant="h6">
                          Keywords: {result.keyword}
                        </Typography>
                        <Typography variant="h6">
                          Occurence: {result.Occurences}
                        </Typography>
                      </div>
                    );
                  } else if (index === 2) {
                    return (
                      <div className={classes.result}>
                        <Typography
                          variant="h3"
                          style={{ color: "#cd7f32", fontWeight: 600 }}
                        >
                          #3
                        </Typography>
                        <Typography variant="h6">
                          Keywords: {result.keyword}
                        </Typography>
                        <Typography variant="h6">
                          Occurence: {result.Occurences}
                        </Typography>
                      </div>
                    );
                  } else {
                    return (
                      <div className={classes.result}>
                        <Typography variant="h3" style={{ fontWeight: 600 }}>
                          #{index + 1}
                        </Typography>
                        <Typography variant="h6">
                          Keywords: {result.keyword}
                        </Typography>
                        <Typography variant="h6">
                          Occurence: {result.Occurences}
                        </Typography>
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        )}

        {/* <ResponsiveContainer width="100%" height={430}>
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
        </ResponsiveContainer> */}
      </Paper>
    </div>
  );
};

export default CourseSearchRanking;
