import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Typography,
  Grid,
} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import { Add, MoreVert, NoteAdd } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Service from "../../AxiosService";
import { Pagination, Rating } from "@material-ui/lab";
import SearchBar from "material-ui-search-bar";

const useStyles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    height: 35,
  },
  courses: {
    display: "flex",
    marginTop: "30px",
  },
  card: {
    width: 200,
    minHeight: 280,
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
  popoverContents: {
    display: "flex",
    flexDirection: "column",
  },
  popoverButtons: {
    width: 150,
    textTransform: "capitalize",
  },
  dialogButtons: {
    width: 100,
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
  const classes = useStyles();
  const history = useHistory();

  const [allCourses, setAllCourses] = useState([]);
  // const [anchorEl, setAnchorEl] = useState(null);

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

  const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState();

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allCourses.length / itemsPerPage)
  );

  const [paymentDialog, setPaymentDialog] = useState(false);
  const [unpublishDialog, setUnpublishDialog] = useState(false);
  const [unpublishCourseId, setUnpublishCourseId] = useState();

  const getAllCourses = (sort) => {
    let decoded;
    if (Cookies.get("t1")) {
      decoded = jwt_decode(Cookies.get("t1"));
    }

    let queryParams = {
      search: searchValue,
      partnerId: decoded.user_id,
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
      .get(`/private-courses`, { params: { ...queryParams } })
      .then((res) => {
        console.log(res);
        setAllCourses(res.data.results);
        setNumPages(Math.ceil(res.data.results.length / itemsPerPage));
      })
      .catch((err) => console.log(err));
  };

  const handleClick = (event, courseId) => {
    setPopover({
      popoverId: courseId,
      anchorEl: event.currentTarget,
    });
  };

  const handleClose = () => {
    setPopover({
      popoverId: null,
      anchorEl: null,
    });
  };

  const handleDeleteCourse = (courseId) => {
    Service.client
      .delete(`/courses/${courseId}`)
      .then((res) => {
        console.log(res);
        setDeleteCourseDialog(false);
        setDeleteCourseId();
        getAllCourses();
      })
      .catch((err) => console.log(err));
  };

  const handleRequestSearch = () => {
    getAllCourses();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllCourses(e.target.value);
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

  console.log(allCourses);

  const handlePublishCourse = (courseId) => {
    let check = true;
    Service.client
      .get(`/contributions`, { params: { latest: 1 } })
      .then((res) => {
        console.log(res);

        if (res.data.expiry_date) {
          const futureDate = new Date(res.data.expiry_date);
          const currentDate = new Date();
          const diffTime = futureDate - currentDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays > 29) {
            check = false;
          }
        }

        if (check) {
          localStorage.removeItem("courseId");
          setPaymentDialog(true);
        } else {
          Service.client
            .patch(`/courses/${courseId}/publish`)
            .then((res) => {
              getAllCourses();
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleUnpublishCourse = () => {
    Service.client
      .patch(`/courses/${unpublishCourseId}/unpublish`)
      .then((res) => {
        setUnpublishCourseId();
        setUnpublishDialog(false);
        getAllCourses();
      })
      .catch((err) => console.log(err));
  };

  const checkIfCourseIsReadyToPublish = (course) => {
    const assessment = course.assessment && course.assessment;
    const chapters = course.chapters && course.chapters;
    if (!assessment) {
      return false;
    } else {
      // check assessement first
      if (!assessment.questions || assessment.questions.length === 0) {
        return false;
      }

      // check chapters
      if (!chapters || chapters.length === 0) {
        return false;
      } else {
        // check course materials in each chapter
        for (let i = 0; i < chapters.length; i++) {
          if (
            !chapters[i].course_materials ||
            chapters[i].course_materials.length === 0
          ) {
            return false;
          } else {
            for (let j = 0; j < chapters[i].course_materials.length; j++) {
              if (chapters[i].course_materials[j].material_type === "QUIZ") {
                if (
                  !chapters[i].course_materials[j].quiz.questions ||
                  chapters[i].course_materials[j].quiz.questions.length === 0
                ) {
                  return false;
                }
              }
            }
          }
        }
      }
    }

    return true;
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // const newDateTime = new Date(date).toLocaleTimeString("en-SG");
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const publishedChip = (
    <Chip
      label="Published"
      size="small"
      style={{ color: "#fff", backgroundColor: "green" }}
    />
  );
  const unPublishedChip = <Chip label="Not Published" size="small" />;
  const deletedChip = (
    <Chip
      label="Deleted"
      size="small"
      style={{ color: "#fff", backgroundColor: "#C74343" }}
    />
  );

  const notReadyChip = (
    <Chip
      label="Incomplete Course"
      size="small"
      style={{ color: "#000", backgroundColor: "#fcdb03" }}
    />
  );

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <PageTitle title="My Courses" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          className={classes.addButton}
          component={Link}
          to="/partner/home/content/new"
        >
          Create New Course
        </Button>
      </div>
      <div className={classes.searchSection}>
        <div className={classes.searchBar}>
          <SearchBar
            placeholder="Search Courses"
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            onCancelSearch={handleCancelSearch}
            onRequestSearch={handleRequestSearch}
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
      <div className={classes.courses}>
        {allCourses && allCourses.length > 0 ? (
          allCourses
            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
            .map((course, index) => {
              return (
                <Card key={index} className={classes.card}>
                  <CardActionArea
                    onClick={() =>
                      history.push(`/partner/home/content/view/${course.id}`)
                    }
                    className={classes.cardActionArea}
                    disabled={course && course.is_deleted}
                    style={{
                      opacity: course && course.is_deleted && 0.5,
                    }}
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
                      {(() => {
                        if (course.is_deleted) {
                          return deletedChip;
                        } else if (course.is_published) {
                          return publishedChip;
                        } else if (!course.is_published) {
                          if (checkIfCourseIsReadyToPublish(course)) {
                            return unPublishedChip;
                          }
                          return notReadyChip;
                        }
                      })()}
                      {course.published_date && course.published_date && (
                        <Typography
                          variant="body2"
                          style={{
                            opacity: 0.7,
                            paddingBottom: "10px",
                            paddingTop: "10px",
                          }}
                        >
                          Pusblished On:
                          <br />
                          {formatDate(course.published_date)}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                  <CardActions
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      opacity: course && course.is_deleted && 0.5,
                    }}
                  >
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
                    <div>
                      <IconButton
                        onClick={(e) => handleClick(e, course.id)}
                        size="small"
                        disabled={course && course.is_deleted}
                      >
                        <MoreVert />
                      </IconButton>
                      <Popover
                        open={popover.popoverId === course.id}
                        onClose={handleClose}
                        anchorEl={popover.anchorEl}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "right",
                        }}
                      >
                        <div className={classes.popoverContents}>
                          {course && course.is_published ? (
                            <Button
                              className={classes.popoverButtons}
                              onClick={() => {
                                handleClose();
                                setUnpublishCourseId(course.id);
                                setUnpublishDialog(true);
                              }}
                            >
                              Unpublish
                            </Button>
                          ) : checkIfCourseIsReadyToPublish(course) ? (
                            <Button
                              className={classes.popoverButtons}
                              onClick={() => {
                                handleClose();
                                handlePublishCourse(course.id);
                              }}
                            >
                              Publish
                            </Button>
                          ) : null}
                          <Button
                            className={classes.popoverButtons}
                            component={Link}
                            to={course && `/partner/home/content/${course.id}`}
                          >
                            Edit Course
                          </Button>
                          <Button
                            className={classes.popoverButtons}
                            onClick={() => {
                              setDeleteCourseId(course.id);
                              setDeleteCourseDialog(true);
                              handleClose();
                            }}
                          >
                            <span style={{ color: "red" }}>Delete Course</span>
                          </Button>
                        </div>
                      </Popover>
                    </div>
                  </CardActions>
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

      <Dialog
        open={deleteCourseDialog}
        onClose={() => {
          setDeleteCourseId();
          setDeleteCourseDialog(false);
        }}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Delete Course?</DialogTitle>
        <DialogContent>This action cannot be reverted.</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setDeleteCourseId();
              setDeleteCourseDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.dialogButtons}
            onClick={() => {
              handleDeleteCourse(deleteCourseId);
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={paymentDialog}
        onClose={() => setPaymentDialog(false)}
        PaperProps={{
          style: {
            width: "500px",
          },
        }}
      >
        <DialogTitle>You have yet to contribute for this month</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setPaymentDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push(`/partner/home/contributions`)}
          >
            Go To Contributions
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={unpublishDialog}
        onClose={() => setUnpublishDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Unpublish Course?</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setUnpublishDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUnpublishCourse()}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ViewAllCourses;
