import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { Pagination } from "@material-ui/lab";
import { Assignment } from "@material-ui/icons";
import { Link } from "react-router-dom";
import Label from "../../landing/components/Label.jsx";

const styles = makeStyles((theme) => ({
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  content: {
    padding: theme.spacing(5),
  },
  courses: {
    display: "flex",
    marginTop: "30px",
  },
  cardroot: {
    width: "300px",
    padding: "10px 0px",
    marginTop: "30px",
    marginRight: "50px",
    border: "1px solid",
    borderRadius: 0,
  },
  cardlink: {
    height: "100%",
    "&:hover $focusHighlight": {
      opacity: 0,
    },
  },
  pro: {
    fontFamily: "Roboto Mono",
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    width: "100%",
  },
  formControl: {
    marginLeft: theme.spacing(5),
    width: "250px",
    maxHeight: 50,
  },
  searchBar: {
    width: "75%",
  },
  paginationSection: {
    float: "right",
    marginTop: theme.spacing(2),
    paddingBottom: theme.spacing(5),
  },
  pagination: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    [theme.breakpoints.down("sm")]: {
      size: "small",
    },
  },
  link: {
    textDecoration: "none",
    color: "black",
    "&:hover": {
      backgroundColor: "none",
    },
  },
}));

const CoursesPage = () => {
  const classes = styles();
  // const history = useHistory();

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const [allCourses, setAllCourses] = useState([]);

  const [progressArr, setProgressArr] = useState([]);

  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allCourses.length / itemsPerPage)
  );

  const getAllCourses = (sort) => {
    let decoded;
    if (Cookies.get("t1")) {
      decoded = jwt_decode(Cookies.get("t1"));
    }

    let queryParams = {
      search: searchValue,
      memberId: decoded.user_id,
    };
    //console.log(sort);

    if (sort !== undefined) {
      if (sort === "rating" || sort === "-rating") {
        queryParams = {
          ...queryParams,
          sortRating: sort,
        };
      }

      if (sort === "published_date" || sort === "-published_date") {
        queryParams = {
          ...queryParams,
          sortDate: sort,
        };
      }
    } else {
      if (sortMethod === "rating" || sortMethod === "-rating") {
        queryParams = {
          ...queryParams,
          sortRating: sortMethod,
        };
      }

      if (sortMethod === "published_date" || sortMethod === "-published_date") {
        queryParams = {
          ...queryParams,
          sortDate: sortMethod,
        };
      }
    }

    Service.client
      .get(`/private-courses`, { params: { ...queryParams } })
      .then((res) => {
        //console.log(res);
        setAllCourses(res.data.results);
        setNumPages(Math.ceil(res.data.results.length / itemsPerPage));
      })
      .catch((err) => console.log(err));

    Service.client
      .get(`enrollments`)
      .then((res) => {
        // console.log(res);
        let arr = res.data;
        arr = arr.filter((course) => course.course !== null);
        // console.log(arr);
        setProgressArr(arr);
      })
      .catch((err) => console.log(err));
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllCourses(e.target.value);
  };

  const handleRequestSearch = () => {
    getAllCourses();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    getAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getAllCourses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const getProgress = (course) => {
    for (let i = 0; i < progressArr.length; i++) {
      if (course.id === progressArr[i].course.id) {
        // console.log(progressArr[i].progress);
        return progressArr[i].progress;
      }
    }
  };

  return (
    <Fragment>
      <Box className={classes.heading}>
        <Typography variant="h4" style={{ marginLeft: "56px", color: "#fff" }}>
          My Enrolled Courses
        </Typography>
      </Box>
      <div className={classes.content}>
        <div className={classes.searchSection}>
          <div className={classes.searchBar}>
            <SearchBar
              placeholder="Search Courses"
              value={searchValue}
              onChange={(newValue) => setSearchValue(newValue)}
              onCancelSearch={handleCancelSearch}
              onRequestSearch={handleRequestSearch}
              // className={classes.searchBar}
              classes={{
                input: classes.input,
              }}
            />
          </div>
          <div>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel style={{ top: -4 }}>Sort By</InputLabel>
              <Select
                label="Sort By"
                value={sortMethod}
                onChange={(event) => {
                  onSortChange(event);
                }}
                style={{ height: 47, backgroundColor: "#fff" }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="-published_date">
                  Published Date (Least Recent)
                </MenuItem>
                <MenuItem value="published_date">
                  Published Date (Most Recent)
                </MenuItem>
                <MenuItem value="rating">Rating (Ascending)</MenuItem>
                <MenuItem value="-rating">Rating (Descending)</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.courses}>
          {allCourses && allCourses.length > 0 ? (
            allCourses
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((course, index) => {
                return (
                  <Card key={index} elevation={0} className={classes.cardroot}>
                    <Link
                      className={classes.cardlink}
                      to={`/courses/${course && course.id}`}
                      component={CardActionArea}
                    >
                      <CardContent
                        style={{
                          height: "inherit",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          padding: "10px 10px",
                        }}
                      >
                        <div>
                          {course && course.pro === true ? (
                            <div style={{ height: "25px" }}>
                              <Typography
                                variant="subtitle1"
                                className={classes.pro}
                              >
                                PRO
                              </Typography>
                            </div>
                          ) : (
                            <div style={{ marginTop: "25px" }}></div>
                          )}

                          <Typography
                            style={{
                              fontFamily: "Roboto Mono",
                              fontWeight: 600,
                            }}
                            variant="h5"
                          >
                            {course && course.title}
                          </Typography>
                          <Typography
                            variant="h6"
                            style={{
                              paddingBottom: "30px",
                              fontFamily: "Roboto Mono",
                              fontWeight: 600,
                            }}
                          >
                            {course &&
                              course.partner.first_name +
                                " " +
                                course.partner.last_name}
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="body1"
                            style={{
                              fontFamily: "Roboto Mono",
                              fontWeight: 600,
                            }}
                          >
                            duration: {course && course.duration}h
                          </Typography>
                          <Typography
                            variant="body1"
                            style={{
                              fontFamily: "Roboto Mono",
                              fontWeight: 600,
                            }}
                          >
                            exp points: {course && course.exp_points}p
                          </Typography>
                          <div style={{ display: "flex", margin: "10px 0" }}>
                            {course &&
                              course.categories.map((category) => (
                                <Label label={category} />
                              ))}
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                    <Box
                      display="flex"
                      style={{
                        height: "16px",
                      }}
                    >
                      <Box width="300px">
                        <LinearProgress
                          variant="determinate"
                          style={{ height: "10px" }}
                          thickness={10}
                          value={progressArr && parseInt(getProgress(course))}
                        />
                      </Box>
                    </Box>
                  </Card>
                );
              })
          ) : (
            <div
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <Assignment fontSize="large" />
              <Typography variant="h5">No Courses Found</Typography>
            </div>
          )}
        </div>
        <div className={classes.paginationSection}>
          {allCourses && allCourses.length > 0 && (
            <Pagination
              count={noOfPages}
              page={page}
              onChange={handlePageChange}
              defaultPage={1}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
              className={classes.pagination}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CoursesPage;
