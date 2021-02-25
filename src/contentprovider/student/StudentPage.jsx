import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import CloseIcon from "@material-ui/icons/Close";
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
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  avatar: {
    fontSize: "50px",
    width: "100px",
    height: "100px",
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
      field: "Course Title",
      headerName: "Course",
      width: 160,
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
      width: 130,
    },
  ];

  const removeDuplicateStudent = (arrayList) => {
    for (let i = 0; i < arrayList.length; i++) {
      arrayList[i].id = arrayList[i].user.id;
      arrayList[i].first_name = arrayList[i].user.first_name;
      arrayList[i].last_name = arrayList[i].user.last_name;
      arrayList[i].email = arrayList[i].user.email;
      arrayList[i].is_active = arrayList[i].user.is_active;
      arrayList[i].profile_photo = arrayList[i].user.profile_photo;
      arrayList[i].date_joined = arrayList[i].user.date_joined;
    }

    let newArray = [];

    let uniqueStudent = {};

    for (let i in arrayList) {
      let studentID = arrayList[i].id;

      uniqueStudent[studentID] = arrayList[i];
    }

    for (let i in uniqueStudent) {
      newArray.push(uniqueStudent[i]);
    }
    console.log(newArray);
    return newArray;
  };

  let studentRows = removeDuplicateStudent(allStudentList);

  const [searchValue, setSearchValue] = useState("");
  const [sortMethod, setSortMethod] = useState("");

  const getAllStudents = (filter) => {
    let queryParams = {
      search: searchValue,
    };

    if (filter !== undefined) {
      queryParams = {
        ...queryParams,
        courseId: filter,
      };
    }

    Service.client
      .get(`/enrolled-members`, { params: { ...queryParams } })
      .then((res) => {
        console.log("members: " + res.data[0].member);
        console.log("course: " + res.data[0].course);
        //setAllStudentList(res.data);
      })
      .catch((err) => console.log(err));

    for (var i = 0; i < allStudentList.length; i++) {}
  };

  const [allCourseList, setAllCourseList] = useState([]);

  const getAllCoursesByPartner = () => {
    Service.client
      .get(`/private-courses`)
      .then((res) => {
        console.log(res);
        setAllCourseList(res.data.results);
        //console.log("course list : " + res.data.results);
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
    console.log("onsortchange: " + e.target.value);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = (e) => {
    setSelectedStudent(e.row);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
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
                {allCourseList.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
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
          //checkboxSelection
          disableSelectionOnClick
          onRowClick={(e) => handleClickOpen(e)}
        />
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Admin Detail
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={2}>
                <Typography>
                  ID <br />
                  First Name <br />
                  Last Name <br />
                  Email <br />
                  Status <br />
                  Date Joined <br />
                  Courses Joined <br />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>
                  {selectedStudent.id} <br />
                  {selectedStudent.first_name} <br />
                  {selectedStudent.last_name} <br />
                  {selectedStudent.email} <br />
                </Typography>
                {selectedStudent.is_active ? (
                  <Typography style={{ color: "green" }}>Active</Typography>
                ) : (
                  <Typography style={{ color: "red" }}>Deactived</Typography>
                )}{" "}
                <Typography>
                  {formatDate(selectedStudent.date_joined)} <br />
                </Typography>
                <br />
              </Grid>
              <Grid item xs={4}>
                {selectedStudent.profile_photo ? (
                  <Avatar
                    src={selectedStudent.profile_photo}
                    alt=""
                    className={classes.avatar}
                  />
                ) : (
                  <Avatar className={classes.avatar}>
                    {selectedStudent.email.charAt(0)}
                  </Avatar>
                )}
              </Grid>
            </Grid>
            <br />
          </DialogContent>
        </Dialog>
      </Grid>
    </Fragment>
  );
};

export default StudentPage;
