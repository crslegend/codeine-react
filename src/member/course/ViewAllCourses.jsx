import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Navbar from "../../components/Navbar";
import {
  Button,
  FormControl,
  InputLabel,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Footer from "../landing/Footer";
import logo from "../../assets/CodeineLogos/Member.svg";
import SearchBar from "material-ui-search-bar";
import PageTitle from "../../components/PageTitle";

import Service from "../../AxiosService";
import Cookies from "js-cookie";

const styles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontDisplay: "swap",
  },
  listItem: {
    width: "100%",
    padding: 10,
    borderLeft: "5px solid #fff",
    "&:hover": {
      backgroundColor: "#F4F4F4",
      borderLeft: "5px solid #F4F4F4",
    },
  },
  listIcon: {
    marginLeft: "15px",
    marginRight: "20px",
  },
  activeLink: {
    width: "100%",
    padding: 10,
    color: theme.palette.primary.main,
    backgroundColor: "#F4F4F4",
    borderLeft: "5px solid",
    "&:hover": {
      borderLeft: "5px solid #437FC7",
    },
  },
  avatar: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    fontSize: "60px",
  },
  courses: {
    paddingTop: "65px",
    minHeight: "calc(100vh - 130px)",
  },
  title: {
    paddingTop: theme.spacing(3),
    paddingLeft: theme.spacing(10),
  },
  searchSection: {
    display: "flex",
    alignItems: "center",
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(10),
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
  const classes = styles();
  const history = useHistory();

  const [loggedIn, setLoggedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [sortMethod, setSortMethod] = useState("");

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  const getAllCourses = () => {
    Service.client
      .get(`/courses`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  const onSortChange = () => {};

  const handleRequestSearch = () => {
    getAllCourses();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  useEffect(() => {
    checkIfLoggedIn();
    getAllCourses();
  }, []);

  const memberNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/partner" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Partners for Personal
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/industry" style={{ textDecoration: "none" }}>
          <Typography variant="h6" style={{ fontSize: "15px", color: "#000" }}>
            Partners for Enterprise
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/login" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            Log In
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          component={Link}
          to="/member/register"
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Sign Up
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const loggedInNavbar = (
    <Fragment>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Link to="/member/home" style={{ textDecoration: "none" }}>
          <Typography
            variant="h6"
            style={{ fontSize: "15px", color: "#437FC7" }}
          >
            View Dashboard
          </Typography>
        </Link>
      </ListItem>
      <ListItem style={{ whiteSpace: "nowrap" }}>
        <Button
          style={{
            backgroundColor: "#437FC7",
            textTransform: "capitalize",
          }}
          onClick={() => {
            Service.removeCredentials();
            setLoggedIn(false);
            history.push("/");
          }}
        >
          <Typography variant="h6" style={{ fontSize: "15px", color: "#fff" }}>
            Logout
          </Typography>
        </Button>
      </ListItem>
    </Fragment>
  );

  const navLogo = (
    <Fragment>
      <Link
        to="/"
        style={{
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "10px",
          width: 100,
        }}
      >
        <img src={logo} width="120%" />
      </Link>
    </Fragment>
  );

  return (
    <div className={classes.root}>
      <Navbar
        logo={navLogo}
        bgColor="#fff"
        navbarItems={loggedIn && loggedIn ? loggedInNavbar : memberNavbar}
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
      </div>
      <Footer />
    </div>
  );
};

export default ViewAllCourses;
