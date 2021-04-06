import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../../MemberNavBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import SearchBar from "material-ui-search-bar";
import Toast from "../../../components/Toast";
import PageTitle from "../../../components/PageTitle";
import Service from "../../../AxiosService";
import Cookies from "js-cookie";
import { NoteAdd } from "@material-ui/icons";
import ApplicationCard from "./ApplicationCard";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  industryProjects: {
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
  heading: {
    height: "80px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cancelButton: {
    textTransform: "capitalize",
  },
  formControl: {
    margin: "20px 0px",
    // marginRight: theme.spacing(9),
    width: "250px",
    maxHeight: 50,
  },
}));

const IndustryProject = () => {
  const classes = styles();

  const [loggedIn, setLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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

  const [sortMethod, setSortMethod] = useState("");

  const [allApplications, setAllApplications] = useState([]);
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allApplications.length / itemsPerPage)
  );

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getAllApplications = (sort) => {
    let queryParams = {
      search: searchValue,
      isAvailable: true,
    };
    //console.log(sort);

    if (sort !== undefined) {
      if (sort === "published_date" || sort === "-published_date") {
        queryParams = {
          ...queryParams,
          sortDate: sort,
        };
      }
    } else {
      if (sortMethod === "published_date" || sortMethod === "-published_date") {
        queryParams = {
          ...queryParams,
          sortDate: sortMethod,
        };
      }
    }

    Service.client
      .get(`/industry-projects/applications/member`)
      .then((res) => {
        // console.log(res);
        setAllApplications(res.data);
        setNumPages(Math.ceil(res.data.length / itemsPerPage));
      })
      .catch((err) => console.log(err));
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllApplications(e.target.value);
  };

  const handleRequestSearch = () => {
    getAllApplications();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    checkIfLoggedIn();
    getAllApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getAllApplications();
    } // eslint-disable-next-line
  }, [searchValue]);

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ paddingTop: "65px" }}>
        <div style={{ width: "80%", margin: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <PageTitle title="My Applications" />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel style={{ top: -4 }}>Filter by</InputLabel>
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
              </Select>
            </FormControl>
          </div>
          <div>
            {allApplications && allApplications.length > 0 ? (
              allApplications
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((application, index) => (
                  <ApplicationCard
                    getAllApplications={() => getAllApplications()}
                    key={application.id}
                    application={application}
                    setSbOpen={setSbOpen}
                    setSnackbar={setSnackbar}
                  />
                ))
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
                <Typography variant="h5">No Industry Project Found</Typography>
              </div>
            )}
          </div>
          <div className={classes.paginationSection}>
            {allApplications && allApplications.length > 0 && (
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
      </div>
    </Fragment>
  );
};

export default IndustryProject;
