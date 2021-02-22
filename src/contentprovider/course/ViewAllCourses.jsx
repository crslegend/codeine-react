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
    height: 50,
    "&:hover": {
      color: "#000",
    },
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
      .get(`/privateCourses`, { params: { ...queryParams } })
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

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <PageTitle title="Your Courses" />
        <Button
          variant="contained"
          startIcon={<Add />}
          className={classes.addButton}
          component={Link}
          to="/partner/home/content/new"
        >
          Create New Course
        </Button>
      </div>
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
                  <CardActionArea
                    onClick={() =>
                      history.push(`/partner/home/content/view/${course.id}`)
                    }
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
                      {(() => {
                        if (course.is_deleted) {
                          return deletedChip;
                        } else if (course.is_published) {
                          return publishedChip;
                        } else if (!course.is_published) {
                          return unPublishedChip;
                        }
                      })()}
                    </CardContent>
                  </CardActionArea>
                  <CardActions
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
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
                          horizontal: "center",
                        }}
                      >
                        <div className={classes.popoverContents}>
                          <Button className={classes.popoverButtons}>
                            Reply Comments
                          </Button>
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
    </Fragment>
  );
};

export default ViewAllCourses;
