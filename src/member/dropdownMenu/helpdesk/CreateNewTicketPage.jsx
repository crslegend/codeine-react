import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../../MemberNavBar.jsx";
import Cookies from "js-cookie";
import CreateNewTicket from "../../../helpdeskComponents/CreateNewTicket";
import PageTitle from "../../../components/PageTitle.js";
import { Breadcrumbs, Button, Paper, Typography } from "@material-ui/core";
import { useHistory } from "react-router";
import Service from "../../../AxiosService";
import Toast from "../../../components/Toast";
import logo from "../../../assets/codeineLogos/Member.svg";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(4),
    width: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  codeineLogo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: "10px",
    width: "25%",
  },
  backLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.main,
      textDecoration: "underline #437FC7",
    },
  },
}));

const CreateNewTicketPage = () => {
  const classes = useStyles();
  const history = useHistory();

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

  const [loggedIn, setLoggedIn] = useState(false);
  const [submittedScreen, setSubmittedScreen] = useState(false);

  const [issueType, setIssueType] = useState();
  const [selectedTagging, setSelectedTagging] = useState();
  const [description, setDescription] = useState();
  const [file, setFile] = useState();
  const [transactionId, setTransactionId] = useState();

  const [courses, setCourses] = useState();
  const [articles, setArticles] = useState();
  const [consultations, setConsultations] = useState();
  const [industryProjects, setIndustryProjects] = useState();
  const [codeReviews, setCodeReviews] = useState();

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getAllData = async () => {
    Service.client
      .get(`/private-courses`)
      .then((res) => {
        // console.log(res);
        setCourses(res.data.results);
      })
      .catch((err) => console.log(err));

    Service.client
      .get(`/articles/user/`)
      .then((res) => {
        // console.log(res);
        let arr = res.data;
        if (arr.length > 0) {
          arr = arr.filter((article) => article.is_published);
        }
        // console.log(arr);
        setArticles(arr);
      })
      .catch((err) => {
        console.log(err);
      });

    Service.client
      .get(`/consultations/member/applications`, {
        params: { is_past: "True" },
      })
      .then((res) => {
        // console.log(res);
        setConsultations(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    Service.client
      .get(`/industry-projects/applications/member`)
      .then((res) => {
        // console.log(res);
        setIndustryProjects(res.data);
      })
      .catch((err) => console.log(err));

    Service.client
      .get(`/code-reviews/user/`)
      .then((res) => {
        // console.log(res);
        setCodeReviews(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    checkIfLoggedIn();
    getAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (description === "" || !description) {
      setSbOpen(true);
      setSnackbar({
        message: "Please give details for your enquiry!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("ticket_type", issueType);
    formData.append("description", description);

    if (file) {
      formData.append("photo", file[0].file);
    }

    if (issueType === "COURSE") {
      if (!selectedTagging || selectedTagging === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Please select the specific course!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }
      formData.append("course_id", selectedTagging);
    } else if (issueType === "PAYMENT") {
      if (!transactionId || transactionId === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Please give the transaction ID!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }
      formData.append("transaction_id", transactionId);
    } else if (issueType === "ARTICLE") {
      if (!selectedTagging || selectedTagging === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Please select the specific article!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }
      formData.append("article_id", selectedTagging);
    } else if (issueType === "INDUSTRY_PROJECT") {
      if (!selectedTagging || selectedTagging === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Please select the specific project!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }
      formData.append("industry_project_id", selectedTagging);
    } else if (issueType === "CONSULTATION") {
      if (!selectedTagging || selectedTagging === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Please select the specific consultation!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }
      formData.append("consultation_slot_id", selectedTagging);
    } else if (issueType === "CODE_REVIEWS") {
      if (!selectedTagging || selectedTagging === "") {
        setSbOpen(true);
        setSnackbar({
          message: "Please select the specific code review!",
          severity: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
        return;
      }
      formData.append("code_review_id", selectedTagging);
    }

    Service.client
      .post(`/helpdesk/tickets`, formData)
      .then((res) => {
        // console.log(res);
        setSubmittedScreen(true);
        setIssueType();
        setDescription();
        setFile();
        setTransactionId();
        setSelectedTagging();
      })
      .catch((err) => console.log(err));
  };

  if (submittedScreen) {
    return (
      <div>
        <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <div style={{ marginTop: "65px" }}>
          <Paper className={classes.paper}>
            <div className={classes.codeineLogo}>
              <img src={logo} alt="logo" width="90%" />
            </div>
            <Typography
              variant="h6"
              style={{
                paddingTop: "20px",
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              We have received your enquiry! We will reply to you as soon as we
              can.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              style={{ marginTop: "25px", textTransform: "capitalize" }}
              onClick={() => history.push(`/member/helpdesk/tickets`)}
            >
              View My Submitted Issues
            </Button>
          </Paper>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <div style={{ width: "80%", margin: "auto" }}>
          <div style={{ paddingTop: "20px" }}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link className={classes.backLink} to={`/member/helpdesk`}>
                <Typography style={{ marginRight: "8px" }} variant="body1">
                  Helpdesk
                </Typography>
              </Link>
              <Typography variant="body1">Contact Us</Typography>
            </Breadcrumbs>
          </div>
          <PageTitle title="Contact Us" />

          <div style={{ marginTop: "20px", marginBottom: "30px" }}>
            <CreateNewTicket
              user={"member"}
              issueType={issueType}
              setIssueType={setIssueType}
              selectedTagging={selectedTagging}
              setSelectedTagging={setSelectedTagging}
              description={description}
              setDescription={setDescription}
              handleSubmit={handleSubmit}
              file={file}
              setFile={setFile}
              courses={courses}
              articles={articles}
              consultations={consultations}
              industryProjects={industryProjects}
              transactionId={transactionId}
              setTransactionId={setTransactionId}
              codeReviews={codeReviews}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNewTicketPage;
