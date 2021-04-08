import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import MemberNavBar from "../MemberNavBar";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import Footer from "../landing/Footer";

import SearchBar from "material-ui-search-bar";

import Service from "../../AxiosService";
import Cookies from "js-cookie";

import { NoteAdd } from "@material-ui/icons";
import ProjectCard from "../landing/components/ProjectCard";

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
}));

const ViewAllIndustryProject = () => {
  const classes = styles();

  const [loggedIn, setLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [sortMethod, setSortMethod] = useState("");

  const [allIndustryProjects, setAllIndustryProjects] = useState([]);
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allIndustryProjects.length / itemsPerPage)
  );

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getAllIndustryProjects = (sort) => {
    let queryParams = {
      search: searchValue,
      isAvailable: true,
      isCompleted: false,
    };

    if (sort !== undefined) {
      if (sort === "date_listed" || sort === "-date_listed") {
        queryParams = {
          ...queryParams,
          sortDate: sort,
        };
      }
    } else {
      if (sortMethod === "date_listed" || sortMethod === "-date_listed") {
        queryParams = {
          ...queryParams,
          sortDate: sortMethod,
        };
      }
    }

    Service.client
      .get(`/industry-projects`, { params: { ...queryParams } })
      .then((res) => {
        if (sort === undefined || sort === "") {
          res.data.sort((a, b) => b.date_listed.localeCompare(a.date_listed));
        }
        setAllIndustryProjects(res.data);
        setNumPages(Math.ceil(res.data.length / itemsPerPage));
      })
      .catch((err) => console.log(err));
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllIndustryProjects(e.target.value);
  };

  const handleRequestSearch = () => {
    getAllIndustryProjects();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    checkIfLoggedIn();
    getAllIndustryProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getAllIndustryProjects();
    } // eslint-disable-next-line
  }, [searchValue]);

  return (
    <div className={classes.root}>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div className={classes.industryProjects}>
        <div className={classes.title}>
          <Typography variant="h2" className={classes.heading}>
            all industry projects
          </Typography>
        </div>
        <div className={classes.searchSection}>
          <div className={classes.searchBar}>
            <SearchBar
              placeholder="Search for Industry Projects"
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
                <MenuItem value="date_listed">Oldest First</MenuItem>
                <MenuItem value="-date_listed">Newest First</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div>
          {allIndustryProjects && allIndustryProjects.length > 0 ? (
            allIndustryProjects
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((industryProject, index) => (
                <ProjectCard
                  key={industryProject.id}
                  project={industryProject}
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
          {allIndustryProjects && allIndustryProjects.length > 0 && (
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
      <Footer />
    </div>
  );
};

export default ViewAllIndustryProject;
