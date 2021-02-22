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
import { Add, MoreVert } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Service from "../../AxiosService";
import { Rating } from "@material-ui/lab";
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
    marginRight: "30px",
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
}));

const ViewAllCourses = () => {
  const classes = useStyles();
  const history = useHistory();

  const [allCourses, setAllCourses] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const [popover, setPopover] = useState({
    popoverId: null,
    anchorEl: null,
  });

  const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState();

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const getAllCourses = () => {
    let decoded;
    if (Cookies.get("t1")) {
      decoded = jwt_decode(Cookies.get("t1"));
    }

    let queryParams = {
      search: searchValue,
      partnerId: decoded.user_id,
    };

    Service.client
      .get(`/privateCourses`, { params: { ...queryParams } })
      .then((res) => {
        console.log(res);
        setAllCourses(res.data.results);
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

  const onSortChange = () => {};

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
              setSortMethod(event.target.value);
              onSortChange(event.target.value);
            }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="+published_date">
              Published Date (Ascending)
            </MenuItem>
            <MenuItem value="-published_date">
              Published Date (Descending)
            </MenuItem>
            <MenuItem value="+rating">Rating (Ascending)</MenuItem>
            <MenuItem value="-rating">Rating (Descending)</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={classes.courses}>
        {allCourses &&
          allCourses.length > 0 &&
          allCourses.map((course, index) => {
            return (
              <Card key={index} className={classes.card}>
                <CardActionArea
                  onClick={() =>
                    history.push(`/partner/home/content/view/${course.id}`)
                  }
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
                        course && course.rating ? parseFloat(course.rating) : 0
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
          })}
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
