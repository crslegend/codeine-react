import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { Pagination, Rating } from "@material-ui/lab";
import { Assignment } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

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
  card: {
    width: 200,
    minHeight: 250,
    marginRight: "30px",
    display: "flex",
    flexDirection: "column",
  },
  cardActionArea: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  media: {
    height: 0,
    paddingTop: "56.25%",
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  searchBar: {
    width: 350,
  },
  input: {
    fontWeight: 600,
  },
  formControl: {
    marginLeft: theme.spacing(5),
    minWidth: 120,
    maxHeight: 50,
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
  const history = useHistory();

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const [allCourses, setAllCourses] = useState([]);

  const itemsPerPage = 4;
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
    console.log(sort);

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
      .get(`/privateCourses`, { params: { ...queryParams } })
      .then((res) => {
        console.log(res);
        setAllCourses(res.data.results);
        setNumPages(Math.ceil(res.data.results.length / itemsPerPage));
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
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getAllCourses();
    } // eslint-disable-next-line
  }, [searchValue]);

  return (
    <Fragment>
      <Box className={classes.heading}>
        <Typography variant="h4" style={{ marginLeft: "56px", color: "#fff" }}>
          My Enrolled Courses
        </Typography>
      </Box>
      <div className={classes.content}>
        <div className={classes.searchSection}>
          <SearchBar
            placeholder="Search Courses"
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            onCancelSearch={handleCancelSearch}
            onRequestSearch={handleRequestSearch}
            className={classes.searchBar}
            classes={{
              input: classes.input,
            }}
          />
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel>Sort By</InputLabel>
            <Select
              label="Sort By"
              value={sortMethod}
              onChange={(event) => {
                onSortChange(event);
              }}
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
        <div className={classes.courses}>
          {allCourses && allCourses.length > 0 ? (
            allCourses
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((course, index) => {
                return (
                  <Card key={index} className={classes.card}>
                    <a href={`/courses/${course.id}`} className={classes.link}>
                      <CardActionArea
                        // onClick={() => {
                        //   return <a href={`/courses/${course.id}`} />;
                        // }}
                        className={classes.cardActionArea}
                      >
                        <CardMedia
                          className={classes.media}
                          image={course && course.thumbnail}
                          title={course && course.title}
                        />
                        <CardContent>
                          <Typography
                            variant="body1"
                            style={{ fontWeight: 600, paddingBottom: "10px" }}
                          >
                            {course && course.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{ opacity: 0.7, paddingBottom: "10px" }}
                          >
                            {course.partner && course.partner.first_name}{" "}
                            {course.partner && course.partner.last_name}
                          </Typography>
                          {(() => {})()}
                          <div>
                            <Rating
                              size="small"
                              readOnly
                              value={
                                course && course.rating
                                  ? parseFloat(course.rating)
                                  : 0
                              }
                            />
                          </div>
                        </CardContent>
                      </CardActionArea>
                    </a>
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
