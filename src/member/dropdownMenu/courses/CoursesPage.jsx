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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import Service from "../../../AxiosService";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import { Pagination } from "@material-ui/lab";
import { Assignment } from "@material-ui/icons";
import MemberNavBar from "../../MemberNavBar";
import { Rating } from "@material-ui/lab";
import Label from "../../landing/components/Label.jsx";
import Toast from "../../../components/Toast.js";
import PageTitle from "../../../components/PageTitle";

const styles = makeStyles((theme) => ({
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  content: {
    // padding: theme.spacing(5),
  },
  courses: {
    // paddingLeft: theme.spacing(5),
    display: "flex",
  },
  cardActionArea: {
    flexGrow: 1,
    flexDirection: "column",
    alignItems: "stretch",
    height: "90%",
  },
  cardroot: {
    width: "300px",
    padding: "10px 10px 10px",
    marginRight: "35px",
    border: "1px solid",
    borderRadius: 0,
  },
  pro: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
  },
  free: {
    backgroundColor: "#F7DF1E",
    color: "#000000",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "38px",
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(5),
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
    marginTop: theme.spacing(7),
    marginRight: theme.spacing(3),
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

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const [sbOpen, setSbOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    severity: "error",
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "center",
    },
    autoHideDuration: 3000,
  });

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [progressArr, setProgressArr] = useState([]);
  const [doneReview] = useState([]);

  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allCourses.length / itemsPerPage)
  );

  const [reviewDialog, setReviewDialog] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    description: "",
  });

  const handleSubmitReview = (courseId) => {
    if (review.rating === 0 || review.description === "") {
      setSbOpen(true);
      setSnackbar({
        message: "Please give a rating and description for the review!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    Service.client
      .post(`/courses/${courseId}/reviews`, review)
      .then((res) => {
        console.log(res);
        getAllCourses();
        setReviewDialog(false);
        setReview();
        setSbOpen(true);
        setSnackbar({
          message: "Course review submitted successfully!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      })
      .catch((err) => console.log(err));
  };

  const getReview = (course) => {
    for (let i = 0; i < doneReview.length; i++) {
      if (course === doneReview[i].course) {
        return true;
      }
    }
    return false;
  };

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
        //console.log(res.data);
        let arr = res.data;
        arr = arr.filter((course) => course.course !== null);
        setProgressArr(arr);
        arr.map((item) => {
          return Service.client
            .get(`/courses/${item.course.id}/reviews`)
            .then((res) => {
              if (res.data.length > 0) {
                for (let i = 0; i < res.data.length; i++) {
                  if (res.data[i].member.id === decoded.user_id) {
                    doneReview.push(res.data[i]);
                  }
                }
              }
              console.log(doneReview);
            })
            .catch((err) => console.log(err));
        });
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
    checkIfLoggedIn();
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

  const handleReviewDialog = (course) => {
    setSelectedCourse(course);
    setReviewDialog(true);
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ paddingTop: "65px", width: "80%", margin: "auto" }}>
        <div className={classes.content}>
          <PageTitle title="My Enrolled Courses" />
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
        </div>
        <div className={classes.courses}>
          {allCourses && allCourses.length > 0 ? (
            allCourses
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((course, index) => {
                return (
                  <Card key={index} elevation={0} className={classes.cardroot}>
                    <a
                      href={`/courses/enroll/${course.id}`}
                      className={classes.link}
                    >
                      <CardActionArea
                        // onClick={() => {
                        //   return <a href={`/courses/${course.id}`} />;
                        // }}
                        className={classes.cardActionArea}
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
                              <div style={{ height: "25px" }}>
                                <Typography
                                  variant="subtitle1"
                                  className={classes.free}
                                >
                                  FREE
                                </Typography>
                              </div>
                            )}

                            <Typography
                              style={{
                                fontWeight: 600,
                              }}
                              variant="h6"
                            >
                              {course && course.title}
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{
                                paddingBottom: "30px",
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
                                fontWeight: 600,
                              }}
                            >
                              duration: {course && course.duration}h
                            </Typography>
                            <Typography
                              variant="body1"
                              style={{
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
                      </CardActionArea>
                    </a>
                    <Box style={{ height: "10%" }}>
                      <LinearProgress
                        variant="determinate"
                        style={{ height: "10px", marginBottom: "2px" }}
                        value={progressArr && parseInt(getProgress(course))}
                      />
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle1">
                          {getProgress(course)}% complete
                        </Typography>
                        {getProgress(course) === "100.00" ? (
                          <Button
                            color="primary"
                            disabled={getReview(course.id)}
                            style={{
                              fontSize: "12px",
                              textTransform: "none",
                              padding: 0,
                            }}
                            onClick={() => handleReviewDialog(course)}
                          >
                            {getReview(course.id)
                              ? "Rating received"
                              : "Leave a rating"}
                          </Button>
                        ) : (
                          ""
                        )}
                      </div>
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
        <Dialog
          open={reviewDialog}
          onClose={() => setReviewDialog(false)}
          PaperProps={{
            style: {
              width: "500px",
            },
          }}
        >
          <DialogTitle>
            You have completed the course! Give a review.
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" style={{ paddingBottom: "5px" }}>
              Give Rating
            </Typography>

            <Rating
              value={review && review.rating}
              onChange={(event, newValue) => {
                setReview({
                  ...review,
                  rating: newValue,
                });
              }}
              style={{ marginBottom: "20px" }}
            />
            <label htmlFor="description">
              <Typography variant="body1" style={{ paddingBottom: "5px" }}>
                Give Review Description
              </Typography>
            </label>
            <TextField
              id="description"
              variant="outlined"
              margin="dense"
              value={review && review.description}
              onChange={(e) =>
                setReview({
                  ...review,
                  description: e.target.value,
                })
              }
              fullWidth
              placeholder="Enter review description"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              className={classes.dialogButtons}
              onClick={() => {
                setReviewDialog(false);
              }}
            >
              Later
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleSubmitReview(selectedCourse.id);
              }}
            >
              Give Review
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Fragment>
  );
};

export default CoursesPage;
