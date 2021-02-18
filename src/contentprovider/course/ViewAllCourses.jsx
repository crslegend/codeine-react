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
  IconButton,
  Popover,
  Typography,
} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import { Add, MoreVert } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Service from "../../AxiosService";
import { Rating } from "@material-ui/lab";

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
    marginTop: "30px",
  },
  card: {
    width: 200,
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
}));

const ViewAllCourses = () => {
  const classes = useStyles();
  const history = useHistory();

  const [allCourses, setAllCourses] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const [deleteCourseDialog, setDeleteCourseDialog] = useState(false);
  const [deleteCourseId, setDeleteCourseId] = useState();

  const getAllCourses = () => {
    let decoded;
    if (Cookies.get("t1")) {
      decoded = jwt_decode(Cookies.get("t1"));
    }
    Service.client
      .get(`/privateCourses`, { params: { partnerId: decoded.user_id } })
      .then((res) => {
        console.log(res);
        setAllCourses(res.data.results);
      })
      .catch((err) => console.log(err));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  useEffect(() => {
    getAllCourses();
  }, []);

  console.log(allCourses);

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
                    <Chip
                      label={
                        course && course.is_published
                          ? "Published"
                          : "Not Published"
                      }
                      size="small"
                    />
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
                    <IconButton onClick={handleClick} size="small">
                      <MoreVert />
                    </IconButton>
                    <Popover
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      anchorReference="anchorPosition"
                      anchorPosition={{ top: 405, left: 475 }}
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
