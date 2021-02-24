import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "calc(100vh - 115px)",
  },
  formControl: {
    marginLeft: theme.spacing(5),
    minWidth: 200,
  },
}));

const StudentPage = () => {
  const classes = useStyles();

  const formatStatus = (status) => {
    if (status) {
      return "Active";
    } else {
      return "Deactivated";
    }
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  // Member data
  const [allStudentList, setAllStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    is_active: "",
    date_joined: "",
    profile_photo: "",
  });

  const studentColumns = [
    { field: "id", headerName: "ID", width: 300 },
    { field: "first_name", headerName: "First name", width: 130 },
    { field: "last_name", headerName: "Last name", width: 130 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <strong>
          {params.value ? (
            <Typography style={{ color: "green" }}>
              {formatStatus(params.value)}
            </Typography>
          ) : (
            <Typography style={{ color: "red" }}>
              {formatStatus(params.value)}
            </Typography>
          )}
        </strong>
      ),
      width: 160,
    },
  ];

  let studentRows = allStudentList;

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const getAllStudents = (sort) => {
    let queryParams = {
      search: searchValue,
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
        setAllStudentList(res.data.results);
      })
      .catch((err) => console.log(err));
  };

  const handleRequestSearch = () => {
    getAllStudents();
  };

  const handleCancelSearch = () => {
    setSearchValue("");
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllStudents(e.target.value);
  };

  return (
    <Fragment>
      <Grid container>
        <Grid item xs={7} className={classes.searchSection}>
          <SearchBar
            style={{
              marginBottom: "20px",
            }}
            placeholder="Search Students"
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            onCancelSearch={handleCancelSearch}
            onRequestSearch={handleRequestSearch}
            className={classes.searchBar}
            classes={{
              input: classes.input,
            }}
          />
        </Grid>
        <Grid item xs={5}>
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
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{ height: "calc(100vh - 200px)", width: "100%" }}
      >
        <DataGrid
          rows={studentRows}
          columns={studentColumns.map((column) => ({
            ...column,
            //disableClickEventBubbling: true,
          }))}
          pageSize={10}
          checkboxSelection
          disableSelectionOnClick
          //onRowClick={(e) => handleClickOpenStudent(e)}
        />
      </Grid>
    </Fragment>
  );
};

export default StudentPage;
