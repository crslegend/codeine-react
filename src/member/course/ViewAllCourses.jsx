import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { Link, useHistory } from "react-router-dom";
import Footer from "../landing/Footer";
import logo from "../../assets/CodeineLogos/Member.svg";
import SearchBar from "material-ui-search-bar";
import PageTitle from "../../components/PageTitle";

import Service from "../../AxiosService";
import Cookies from "js-cookie";

import components from "./components/NavbarComponents";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  courses: {
    paddingTop: "65px",
    minHeight: "calc(100vh - 130px)",
    paddingLeft: theme.spacing(15),
    paddingRight: theme.spacing(15),
  },
  title: {
    paddingTop: theme.spacing(3),
  },
  cards: {
    display: "flex",
    flexDirection: "row",
    paddingTop: theme.spacing(2),
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
  const classes = styles();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [sortMethod, setSortMethod] = useState("");

  const [allCourses, setAllCourses] = useState([]);
  const itemsPerPage = 4;
  const [page, setPage] = useState(1);
  const [noOfPages, setNumPages] = useState(
    Math.ceil(allCourses.length / itemsPerPage)
  );

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getAllCourses = () => {
    Service.client
      .get(`/courses`)
      .then((res) => {
        // console.log(res);
        setAllCourses(res.data.results);
        setNumPages(Math.ceil(res.data.results.length / itemsPerPage));
      })
      .catch((err) => console.log(err));
  };
  console.log(allCourses);

  const onSortChange = () => {};

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
    checkIfLoggedIn();
    getAllCourses();
  }, []);

  //   const getPartnerById = (id) => {
  //     console.log(id);
  //     Service.client
  //       .get(`/auth/partners/${id}`)
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => console.log(err));
  //   };

  return (
    <div className={classes.root}>
      <Navbar
        logo={components.navLogo}
        bgColor="#fff"
        navbarItems={
          loggedIn && loggedIn
            ? components.loggedInNavbar(() => {
                Service.removeCredentials();
                setLoggedIn(false);
                history.push("/");
              })
            : components.memberNavbar
        }
      />
      <div className={classes.courses}>
        <div className={classes.title}>
          <PageTitle title="All Courses" />
        </div>
        <div className={classes.searchSection}>
          <SearchBar
            placeholder="Search for Courses"
            value={searchValue}
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
              <MenuItem value="publish">Recently Published</MenuItem>
              <MenuItem value="A-Z">(A-Z) Alphabetically</MenuItem>
              <MenuItem value="Z-A">(Z-A) Alphabetically</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={classes.cards}>
          {allCourses &&
            allCourses.length > 0 &&
            allCourses.map((course, index) => {
              return (
                <Card key={index} className={classes.cardRoot}>
                  <CardActionArea
                    onClick={() => {
                      history.push(`/courses/${course.id}`);
                    }}
                  >
                    <CardMedia
                      className={classes.cardMedia}
                      image={course.thumbnail && course.thumbnail}
                      title={course && course.title}
                    />
                    <CardContent>
                      <Typography variant="h6">{course.title}</Typography>
                      <br />
                      <Typography variant="body2">
                        Insert partner name here
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
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
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllCourses;
