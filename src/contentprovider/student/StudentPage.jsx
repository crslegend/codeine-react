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

  useEffect(() => {
    getAllStudents();
    getAllCoursesByPartner();
  }, []);

  // Enrolled Course Student data
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
    {
      field: "first_name",
      headerName: "First Name",
      width: 130,
    },
    {
      field: "last_name",
      headerName: "Last Name",
      width: 160,
    },
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

  for (let i = 0; i < allStudentList.length; i++) {
    studentRows[i].id = allStudentList[i].user.id;
    studentRows[i].first_name = allStudentList[i].user.first_name;
    studentRows[i].last_name = allStudentList[i].user.last_name;
    studentRows[i].email = allStudentList[i].user.email;
    studentRows[i].is_active = allStudentList[i].user.is_active;
    studentRows[i].profile_photo = allStudentList[i].user.profile_photo;
    studentRows[i].date_joined = allStudentList[i].user.date_joined;
  }

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const getAllStudents = (filter) => {
    let queryParams = {
      search: searchValue,
    };
    console.log(filter);

    if (filter !== undefined) {
      queryParams = {
        ...queryParams,
        courseId: filter,
      };
    }

    Service.client
      .get(`/enrolled-members`, { params: { ...queryParams } })
      .then((res) => {
        console.log("members: " + res.data[0].user.id);
        setAllStudentList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const [allCourseList, setAllCourseList] = useState([]);

  const getAllCoursesByPartner = () => {
    Service.client
      .get(`/private-courses`)
      .then((res) => {
        console.log(res);
        setAllCourseList(res.data.results);
        //console.log("course list : " + res.data.results[0]);
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
          {allCourseList && (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel>Filter By Courses</InputLabel>
              <Select
                label="Sort By"
                value={sortMethod}
                onChange={(event) => {
                  onSortChange(event);
                }}
              >
                {allCourseList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
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
