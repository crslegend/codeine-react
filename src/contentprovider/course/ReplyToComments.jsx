import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import PageTitle from "../../components/PageTitle";
import Toast from "../../components/Toast.js";
import Service from "../../AxiosService";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Chip, IconButton, Typography } from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";

const styles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    alignItems: "center",
  },
  courseDetails: {
    border: "2px solid lightgrey",
    borderRadius: "6px",
    width: "80%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(3),
    display: "flex",
  },
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const ReplyToComments = () => {
  const classes = styles();
  const history = useHistory();
  const { id } = useParams();

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

  const [pageNum, setPageNum] = useState(1);
  const [course, setCourse] = useState();
  const [comments, setComments] = useState([]);

  const getCourse = () => {
    Service.client
      .get(`/private-courses/${id}`)
      .then((res) => {
        // console.log(res);
        setCourse(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getCourse();
  }, []);
  console.log(course);

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
        <IconButton
          onClick={() => history.push("/partner/home/content")}
          style={{ marginRight: "30px" }}
        >
          <ArrowBack />
        </IconButton>
        <PageTitle title="View Comments for Course" />
      </div>
      <div className={classes.courseDetails}>
        <Avatar src={course && course.thumbnail} className={classes.avatar} />
        <div
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" style={{ fontWeight: 600 }}>
            {course && course.title}
          </Typography>
          <Typography variant="body2" style={{ paddingBottom: "10px" }}>
            {course && course.description}
          </Typography>
          <Typography variant="body2" style={{ paddingBottom: "15px" }}>
            Experience Points: {course && course.exp_points}
          </Typography>
          <Typography variant="body2">
            Course Status:{" "}
            {(() => {
              if (course) {
                if (course.is_deleted) {
                  return deletedChip;
                } else if (course.is_published) {
                  return publishedChip;
                } else if (!course.is_published) {
                  return unPublishedChip;
                }
              } else {
                return null;
              }
            })()}
          </Typography>
        </div>
      </div>
    </Fragment>
  );
};

export default ReplyToComments;
