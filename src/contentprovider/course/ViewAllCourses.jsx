import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Popover,
} from "@material-ui/core";
import PageTitle from "../../components/PageTitle";
import { Add, MoreVert } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";

import Service from "../../AxiosService";

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
}));

const ViewAllCourses = () => {
  const classes = useStyles();
  // const history = useHistory();

  const [allCourses, setAllCourses] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const getAllCourses = () => {
    Service.client
      .get(`/courses/ebd49e8d-a724-432a-938b-5de1c0ccde9f`)
      .then((res) => {
        // console.log(res);
        setAllCourses(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={allCourses && allCourses.thumbnail}
            title={allCourses && allCourses.title}
          />
          <CardContent>{allCourses && allCourses.title}</CardContent>
          <CardActions style={{ float: "right" }}>
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
                <Button className={classes.popoverButtons}>Edit Course</Button>
                <Button className={classes.popoverButtons}>
                  <span style={{ color: "red" }}>Delete Course</span>
                </Button>
              </div>
            </Popover>
          </CardActions>
        </Card>
      </div>
    </Fragment>
  );
};

export default ViewAllCourses;
