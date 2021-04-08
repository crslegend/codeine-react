import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../MemberNavBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Breadcrumbs,
  CircularProgress,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router";
import Footer from "../landing/Footer";

import SearchBar from "material-ui-search-bar";
import Service from "../../AxiosService";
import Cookies from "js-cookie";
import CourseCard from "../landing/components/CourseCard";
// import components from "./components/NavbarComponents";
import { NoteAdd } from "@material-ui/icons";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
  courses: {
    paddingTop: "65px",
    minHeight: "calc(100vh - 220px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
  },
  title: {
    paddingTop: theme.spacing(3),
  },
  heading: {
    lineHeight: "50px",
    fontWeight: 600,
    fontFamily: "Roboto Mono",
  },
  cards: {
    display: "flex",
    flexDirection: "row",
    paddingTop: theme.spacing(2),
  },
  cardRoot: {
    width: 200,
    marginRight: "40px",
  },
  cardMedia: {
    height: 0,
    paddingTop: "56.25%",
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
}));

const ViewAllCourses = () => {
  const classes = styles();

  const { id } = useParams();
  const location = useLocation();

  const [loggedIn, setLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [sortMethod, setSortMethod] = useState("");

  const [allCourses, setAllCourses] = useState([]);
  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allCourses.length / itemsPerPage)
  );

  const [loading, setLoading] = useState(true);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getAllCourses = (sort) => {
    let queryParams = {
      search: searchValue,
    };
    //console.log(sort);

    if ((id !== null || id !== undefined) && location.pathname !== "/courses") {
      queryParams = {
        ...queryParams,
        coding_language: id,
      };
    }
    // console.log(id);

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
      .get(`/courses`, { params: { ...queryParams } })
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setAllCourses(res.data.results);
        setNumPages(Math.ceil(res.data.results.length / itemsPerPage));
      })
      .catch((err) => console.log(err));

    // ANALYTICS: log search strings when members search for courses
    if (loggedIn && queryParams.search !== "") {
      Service.client
        .post(
          `/analytics`,
          { payload: "search course" },
          {
            params: {
              search_string: queryParams.search,
            },
          }
        )
        .then((res) => {})
        .catch((err) => console.log(err));
    }
  };
  //console.log(allCourses);

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
    checkIfLoggedIn();
    getAllCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLoading(true);
    getAllCourses();
    checkIfLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (searchValue === "") {
      getAllCourses();
    } // eslint-disable-next-line
  }, [searchValue]);

  const handlePageNaming = () => {
    if (id === null || id === undefined) {
      return "Courses";
    } else {
      if (id === "PY") {
        return "Python Courses";
      } else if (id === "JS") {
        return "Javascript Courses";
      } else if (id === "JAVA") {
        return "Java Courses";
      } else if (id === "HTML") {
        return "HTML Courses";
      } else if (id === "CPP") {
        return "C++ Courses";
      } else if (id === "RUBY") {
        return "Ruby Courses";
      } else if (id === "CS") {
        return "C# Courses";
      } else if (id === "CSS") {
        return "CSS Courses";
      }
    }
  };

  return (
    <div className={classes.root}>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div className={classes.courses}>
        {id && id ? (
          <Breadcrumbs
            style={{ margin: "10px 0px" }}
            separator="›"
            aria-label="breadcrumb"
          >
            <Link className={classes.backLink} to="/courses">
              <Typography style={{ marginRight: "8px" }} variant="body1">
                Courses
              </Typography>
            </Link>
            <Typography variant="body1">{handlePageNaming()}</Typography>
          </Breadcrumbs>
        ) : (
          ""
        )}

        <div className={classes.title}>
          <Typography variant="h2" className={classes.heading}>
            {handlePageNaming()}
          </Typography>
        </div>
        <div className={classes.searchSection}>
          <div className={classes.searchBar}>
            <SearchBar
              placeholder="Search for Courses"
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
                  Published Date (Most Recent)
                </MenuItem>
                <MenuItem value="published_date">
                  Published Date (Least Recent)
                </MenuItem>
                <MenuItem value="rating">Rating (Ascending)</MenuItem>
                <MenuItem value="-rating">Rating (Descending)</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {loading ? (
          <div
            style={{
              marginTop: "50px",
              display: "flex",
              justifyContent: "center",
              wdith: "100%",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <Fragment>
            <div className={classes.cards}>
              {allCourses && allCourses.length > 0 ? (
                allCourses
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((course, index) => (
                    <CourseCard key={index} course={course} />
                  ))
              ) : (
                /*{
                  return (
                  <Card key={index} className={classes.cardRoot}>
                    <CardActionArea
                      onClick={() => {
                        history.push(`/courses/${course.id}`);
                      }}
                      style={{ height: "100%" }}
                    >
                      <div style={{ height: "30%" }}>
                        <CardMedia
                          className={classes.cardMedia}
                          image={course.thumbnail && course.thumbnail}
                          title={course && course.title}
                        />
                      </div>
                      <div style={{ height: "5%" }} />
                      <div style={{ height: "65%" }}>
                        <CardContent
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                          }}
                        >
                          <div>
                            <Typography variant="h6">{course.title}</Typography>
                            <br />
                          </div>

                          <div>
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7, paddingBottom: "10px" }}
                            >
                              {course.partner && course.partner.first_name}{" "}
                              {course.partner && course.partner.last_name}
                            </Typography>
                            <Typography
                              variant="body2"
                              style={{ opacity: 0.7, paddingBottom: "10px" }}
                            >
                              Pusblished On:
                              <br />
                              {course.published_date &&
                                formatDate(course.published_date)}
                            </Typography>
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
                      </div>
                    </CardActionArea>
                  </Card>
                            );
                
                }*/
                <div
                  style={{
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    textAlign: "center",
                    marginTop: "20px",
                  }}
                >
                  <NoteAdd fontSize="large" />
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
          </Fragment>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllCourses;
