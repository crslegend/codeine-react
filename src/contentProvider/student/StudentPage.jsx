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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import SearchBar from "material-ui-search-bar";
import { DataGrid } from "@material-ui/data-grid";
import CloseIcon from "@material-ui/icons/Close";
// import MailOutlineIcon from "@material-ui/icons/MailOutline";
// import TodayIcon from "@material-ui/icons/Today";
import Service from "../../AxiosService";
// import jwt_decode from "jwt-decode";
import PageTitle from "../../components/PageTitle";

const useStyles = makeStyles((theme) => ({
  paper: {
    height: "calc(100vh - 115px)",
  },
  searchSection: {
    display: "flex",
    // alignItems: "center",
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
  dataGrid: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
  border: {
    border: "1px solid",
    borderRadius: "5px",
    borderColor: "#437FC7",
    marginTop: "15px",
    overflow: "auto",
    height: "230px",
  },
  profileLink: {
    textDecoration: "none",
    color: "#000000",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  pro: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    width: "30px",
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
      return newDate;
    }
    return "";
  };

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    getAllStudents();
    getAllCoursesByPartner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getAllStudents();
      getAllCoursesByPartner();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

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
    membership_tier: "",
  });

  const studentColumns = [
    {
      field: "profile_photo",
      headerName: "-",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    {
      field: "first_name",
      headerName: "First Name",
      width: 160,
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
      field: "numOfCourses",
      headerName: "No. of Courses",
      width: 160,
    },
    {
      field: "date_joined",
      headerName: "Date Joined",
      valueFormatter: (params) => formatDate(params.value),
      width: 160,
    },
    {
      field: "is_active",
      headerName: "Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 130,
    },
    {
      field: "membership_tier",
      hidden: true,
    },
  ];

  const getListOfCourseEnrolledByStudent = (studentId) => {
    let listOfEnrolledCourses = [];

    for (let i in allStudentList) {
      if (allStudentList[i].member.id === studentId) {
        listOfEnrolledCourses.push(allStudentList[i].course);
      }
    }
    return listOfEnrolledCourses;
  };

  const removeDuplicateStudent = (arrayList) => {
    for (let i = 0; i < arrayList.length; i++) {
      arrayList[i].id = arrayList[i].member.id;
      arrayList[i].first_name = arrayList[i].member.first_name;
      arrayList[i].last_name = arrayList[i].member.last_name;
      arrayList[i].email = arrayList[i].member.email;
      arrayList[i].is_active = arrayList[i].member.is_active;
      arrayList[i].profile_photo = arrayList[i].member.profile_photo;
      arrayList[i].date_joined = arrayList[i].member.date_joined;
      arrayList[i].numOfCourses = getListOfCourseEnrolledByStudent(
        arrayList[i].member.id
      ).length;
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
    return newArray;
  };

  let studentRows = removeDuplicateStudent(allStudentList);

  const [sortMethod, setSortMethod] = useState("None");

  const getAllStudents = (filter) => {
    let queryParams = {
      search: searchValue,
    };

    if (filter !== "None") {
      queryParams = {
        ...queryParams,
        courseId: filter,
      };
    }

    Service.client
      .get(`/enrolled-members`, { params: { ...queryParams } })
      .then((res) => {
        let arr = [];
        let obj = {};
        for (let i = 0; i < res.data.length; i++) {
          obj = {
            course: res.data[i].course,
            first_name: res.data[i].first_name,
            last_name: res.data[i].last_name,
            email: res.data[i].email,
            is_active: res.data[i].is_active,
            date_joined: res.data[i].date_joined,
            profile_photo: res.data[i].profile_photo,
            member: res.data[i].member,
            membership_tier: res.data[i].member.member.membership_tier,
          };
          arr.push(obj);
        }
        setAllStudentList(arr);
        studentRows = removeDuplicateStudent(allStudentList);
      })
      .catch((err) => console.log(err));
  };

  const [allCourseList, setAllCourseList] = useState([]);

  const getAllCoursesByPartner = () => {
    Service.client
      .get(`/private-courses`)
      .then((res) => {
        setAllCourseList(res.data.results);
      })
      .catch((err) => console.log(err));
  };

  const handleRequestSearch = () => {
    getAllStudents();
    setSortMethod("None");
  };

  const handleCancelSearch = () => {
    setSearchValue("");
    setSortMethod("None");
  };

  const onSortChange = (e) => {
    setSortMethod(e.target.value);
    getAllStudents(e.target.value);
    // console.log("onsortchange: " + e.target.value);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleClickOpen = (e) => {
    setSelectedStudent(e.row);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleProfileLink = (m) => {
    if (m.membership_tier === "PRO") {
      // console.log("hell");
      return `/member/profile/${m.id}`;
    }
  };

  const toRenderProfileLinkOrNot = (m) => {
    if (m.membership_tier === "PRO") {
      return true;
    }

    return false;
  };

  return (
    <Fragment>
      <PageTitle title="My Students" />
      <div className={classes.searchSection}>
        <div className={classes.searchBar}>
          <SearchBar
            style={{
              marginBottom: "20px",
            }}
            placeholder="Search Students"
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
          {allCourseList && (
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel style={{ top: -1 }}>Filter</InputLabel>
              <Select
                label="Sort By"
                value={sortMethod}
                onChange={(event) => {
                  onSortChange(event);
                }}
                style={{ height: 47, backgroundColor: "#fff" }}
              >
                <MenuItem key={null} value={"None"}>
                  None
                </MenuItem>
                {allCourseList.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    {item.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </div>
      </div>
      <Grid item xs={12} style={{ height: `calc(100vh - 280px)`, width: "100%" }}>
        <DataGrid
          rows={studentRows}
          columns={studentColumns.map((column) => ({
            ...column,
          }))}
          pageSize={10}
          //checkboxSelection
          disableSelectionOnClick
          onRowClick={(e) => handleClickOpen(e)}
          className={classes.dataGrid}
        />
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle id="form-dialog-title">
            Enrolled Student Detail
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
                {toRenderProfileLinkOrNot(selectedStudent) ? (
                  <a
                    href={handleProfileLink(selectedStudent)}
                    style={{ textDecoration: "none" }}
                  >
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
                  </a>
                ) : selectedStudent.profile_photo ? (
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
              <Grid item xs={10}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {toRenderProfileLinkOrNot(selectedStudent) ? (
                    <a
                      href={handleProfileLink(selectedStudent)}
                      className={classes.profileLink}
                    >
                      <Typography style={{ fontSize: "20px" }}>
                        <strong>
                          {selectedStudent.first_name}{" "}
                          {selectedStudent.last_name}{" "}
                        </strong>
                      </Typography>
                    </a>
                  ) : (
                    <Typography style={{ fontSize: "20px" }}>
                      <strong>
                        {selectedStudent.first_name} {selectedStudent.last_name}{" "}
                      </strong>
                    </Typography>
                  )}
                  {selectedStudent &&
                    selectedStudent.membership_tier === "PRO" && (
                      <div style={{ marginTop: "4px" }}>
                        <Typography variant="subtitle1" className={classes.pro}>
                          PRO
                        </Typography>
                      </div>
                    )}
                  {selectedStudent.is_active ? (
                    <Typography style={{ color: "green" }}>
                      {"\u00A0"}(Active){" "}
                    </Typography>
                  ) : (
                    <Typography style={{ color: "red" }}>
                      {"\u00A0"}(Deactived)
                    </Typography>
                  )}
                </div>
                <Typography style={{ color: "black" }}>
                  {selectedStudent.email} <br />
                </Typography>
                <Typography
                  style={{ fontSize: "14px", marginTop: "0px", color: "black" }}
                >
                  Joined on {formatDate(selectedStudent.date_joined)}
                </Typography>
              </Grid>

              <Grid item xs={12} className={classes.border}>
                <Typography
                  style={{
                    fontSize: "18px",
                    marginLeft: "15px",
                    marginTop: "10px",
                    color: "#437FC7",
                  }}
                >
                  <strong>Enrolled Course(s)</strong>
                </Typography>

                <List>
                  {getListOfCourseEnrolledByStudent(selectedStudent.id).map(
                    (value) => {
                      return (
                        <ListItem key={value.id}>
                          <ListItemAvatar>
                            <Avatar alt="logo" src={value.thumbnail} />
                          </ListItemAvatar>
                          <ListItemText
                            id={value.id}
                            primary={value.title}
                            secondary={
                              `Enrolled In: ` + formatDate(value.published_date)
                            }
                          />
                        </ListItem>
                      );
                    }
                  )}
                </List>
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
