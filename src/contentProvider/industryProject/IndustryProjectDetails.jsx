import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Typography,
  IconButton,
  Grid,
  CardMedia,
  CardContent,
  Paper,
  Avatar,
  Chip,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import green from "@material-ui/core/colors/green";
import SearchBar from "material-ui-search-bar";
import { ToggleButton } from "@material-ui/lab";
import { Edit, ArrowBack } from "@material-ui/icons";
import { KeyboardDatePicker } from "@material-ui/pickers";
import red from "@material-ui/core/colors/red";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Toast from "../../components/Toast.js";
import Label from "../../member/landing/components/Label";
import { Link, useHistory, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Service from "../../AxiosService";
import { formatISO, addDays } from "date-fns";

const useStyles = makeStyles((theme) => ({
  titleSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  marginBottom: {
    marginBottom: 20,
  },
  categoryButtons: {
    // marginBottom: "10px",
    height: 30,
    marginRight: 10,
    marginBottom: 10,
  },
  root: {
    width: "100%",
    padding: "10px 10px",
    marginTop: "30px",
    border: "1px solid",
    borderRadius: 0,
  },
  cardmedia: {
    height: "100%",
    width: "7vw",
  },
  titleSection: {
    // backgroundColor: "#FFF",
  },
  outlined: {
    marginTop: 25,
    border: `1px solid ${fade(red[500], 0.5)}`,
    color: "red",
    "&:hover": {
      border: `1px solid ${red[500]}`,
      backgroundColor: `${fade(red[500], 0.1)}`,
    },
    "&$disabled": {
      border: `1px solid ${theme.palette.action.disabled}`,
    },
  },
  deleteButton: {
    backgroundColor: theme.palette.red.main,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.darkred.main,
    },
  },
  completed: {
    marginTop: 10,
  },
}));

const IndustryProjectDetails = () => {
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

  const classes = useStyles();
  const history = useHistory();
  const [industryProject, setIndustryProject] = useState();
  const [editIndustryProject, setEditIndustryProject] = useState();
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

  const beforeDate = addDays(new Date(), 1);
  const currentDate = addDays(new Date(), 2);
  const afterDate = addDays(new Date(), 3);

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openCompleteDialog, setOpenCompleteDialog] = useState(false);

  let decoded;
  if (Cookies.get("t1")) {
    decoded = jwt_decode(Cookies.get("t1"));
  }

  let queryParams = {
    //   search: searchValue,
    partner_id: decoded.user_id,
  };

  const [allApplicantList, setAllApplicantList] = useState([]);
  let applicantsRows = allApplicantList;

  const getlndustryProject = () => {
    Service.client
      .get(`/industry-projects/${id}`)
      .then((res) => {
        // console.log(res);
        setIndustryProject(res.data);
        setEditIndustryProject(res.data);
        let newCategories = { ...categories };
        for (let i = 0; i < res.data.categories.length; i++) {
          newCategories = {
            ...newCategories,
            [res.data.categories[i]]: true,
          };
        }
        setCategories(newCategories);

        let arr = [];
        let obj = {};
        for (
          let i = 0;
          i < res.data.industry_project_applications.length;
          i++
        ) {
          obj = {
            id: res.data.industry_project_applications[i].id,
            name:
              res.data.industry_project_applications[i].member.first_name +
              " " +
              res.data.industry_project_applications[i].member.last_name,
            last_name:
              res.data.industry_project_applications[i].member.last_name,
            date_created:
              res.data.industry_project_applications[i].date_created,
            is_completed: res.data.is_completed,
            is_accepted: res.data.industry_project_applications[i].is_accepted,
            is_rejected: res.data.industry_project_applications[i].is_rejected,
            profile_photo:
              res.data.industry_project_applications[i].member.profile_photo,
          };
          arr.push(obj);
        }

        setAllApplicantList(arr);
        applicantsRows = allApplicantList;
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getlndustryProject();
  }, []);

  const handleSubmit = () => {
    let neverChooseOne = true;
    for (const property in categories) {
      if (categories[property]) {
        neverChooseOne = false;
        break;
      }
    }

    if (neverChooseOne) {
      setSbOpen(true);
      setSnackbar({
        message: "Please select at least 1 category",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 3000,
      });
      return;
    }

    const data = {
      ...editIndustryProject,
      start_date: formatISO(new Date(editIndustryProject.start_date), {
        representation: "date",
      }),
      end_date: formatISO(new Date(editIndustryProject.end_date), {
        representation: "date",
      }),
      application_deadline: formatISO(
        new Date(editIndustryProject.application_deadline),
        { representation: "date" }
      ),
      categories: [],
    };

    for (const property in categories) {
      if (categories[property]) {
        data.categories.push(property);
      }
    }

    console.log(data);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("application_deadline", data.application_deadline);
    formData.append("categories", JSON.stringify(data.categories));

    console.log(formData);

    Service.client
      .patch(`/industry-projects/${id}`, formData)
      .then((res) => {
        setOpenEditDialog(false);
        setSbOpen(true);
        setSnackbar({
          message: "Industry project updated successfully!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .then((res) => {
        Service.client.get(`/industry-projects/${id}`).then((res) => {
          setIndustryProject(res.data);
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDeleteSubmit = () => {
    const data = {
      is_available: true,
    };

    Service.client
      .patch(`/industry-projects/${id}`, { is_available: false })
      .then((res) => {
        setOpenDeleteDialog(false);
        setSbOpen(true);
        setSnackbar({
          message: "Industry project deleted successfully!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .then((res) => {
        history.push("/partner/home/industryproject");
      });
  };

  const handleCompleteSubmit = () => {
    Service.client
      .patch(`/industry-projects/${id}`, { is_completed: true })
      .then((res) => {
        setOpenCompleteDialog(false);
        setSbOpen(true);
        setSnackbar({
          message: "Industry project is marked as completed!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setOpenEditDialog(false);
    setOpenDeleteDialog(false);
  };

  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const formatStatus = (status) => {
    if (status) {
      return "Yes";
    } else {
      return "No";
    }
  };

  const applicationsColumns = [
    {
      field: "profile_photo",
      headerName: " ",
      width: 70,
      renderCell: (params) => <Avatar src={params.value} alt=""></Avatar>,
    },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "is_accepted",
      headerName: "Accepted",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      flex: 1,
    },
    {
      field: "is_rejected",
      headerName: "Rejected",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div style={{ color: "red" }}>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      flex: 1,
    },
    {
      field: "date_created",
      headerName: "Date Applied",
      valueFormatter: (params) => formatDate(params.value),
      flex: 1,
    },
  ];

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.mainSection}>
        <div style={{ marginTop: "20px" }}>
          <IconButton
            onClick={() => history.push("/partner/home/industryproject")}
          >
            <ArrowBack />
          </IconButton>
        </div>
        {industryProject ? (
          <div>
            <div className={classes.titleSection}>
              <Grid container justify="space-between">
                <Grid style={{ backgroundColor: "#FFF" }} item xs={1}>
                  <CardMedia
                    className={classes.cardmedia}
                    image={
                      industryProject.partner.partner.organization
                        .organization_photo
                    }
                    title="Organisation Photo"
                  ></CardMedia>
                </Grid>
                <Grid style={{ backgroundColor: "#FFF" }} item xs={11}>
                  <CardContent>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 600,
                        }}
                        variant="h5"
                      >
                        {industryProject && industryProject.title}
                      </Typography>
                      {industryProject && industryProject.is_completed ? (
                        <Chip
                          label="Completed"
                          style={{ backgroundColor: green[600], color: "#FFF" }}
                        />
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Edit />}
                          onClick={handleOpenEditDialog}
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                    <Typography variant="h6">
                      {industryProject &&
                        industryProject.partner.partner.organization
                          .organization_name}
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "5px",
                      }}
                    ></div>
                  </CardContent>
                </Grid>
                <div
                  style={{
                    width: "61%",
                    backgroundColor: "#FFF",
                    marginTop: 20,
                  }}
                >
                  <CardContent>
                    <Typography style={{ fontWeight: 600 }}>
                      Categories
                    </Typography>
                    <div style={{ display: "flex", marginTop: 5 }}>
                      {industryProject &&
                        industryProject.categories.map((category) => (
                          <Label label={category} />
                        ))}
                      {console.log(industryProject)}
                    </div>
                    <Typography
                      style={{
                        marginTop: 15,
                        marginBottom: 5,
                        fontWeight: 600,
                      }}
                    >
                      Description
                    </Typography>
                    {industryProject && industryProject.description}
                  </CardContent>
                </div>
                <div
                  style={{
                    width: "36%",
                    backgroundColor: "#FFF",
                    marginTop: 20,
                  }}
                >
                  <CardContent>
                    <Typography style={{ fontWeight: 600 }}>
                      Date Listed:
                    </Typography>
                    {industryProject && formatDate(industryProject.date_listed)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      Start Date:
                    </Typography>
                    {industryProject && formatDate(industryProject.start_date)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      End Date:
                    </Typography>
                    {industryProject && formatDate(industryProject.end_date)}
                    <Typography style={{ fontWeight: 600, marginTop: 15 }}>
                      Application Deadline:
                    </Typography>
                    {industryProject &&
                      formatDate(industryProject.application_deadline)}

                    <Button
                      fullWidth
                      variant="outlined"
                      className={classes.outlined}
                      classes={{ disabled: classes.disabled }}
                      onClick={handleOpenDeleteDialog}
                      disabled={industryProject.is_completed}
                    >
                      Delete
                    </Button>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      className={classes.completed}
                      onClick={() => setOpenCompleteDialog(true)}
                      disabled={industryProject.is_completed}
                    >
                      Mark as Completed
                    </Button>
                  </CardContent>
                </div>
              </Grid>
              <Typography
                variant="h5"
                style={{ marginTop: 10, marginBottom: "5px", color: "#437FC7" }}
              >
                Applicants
              </Typography>
              {/* <Typography
                variant="body1"
                style={{ marginBottom: "30px", color: "#000000" }}
              >
                Click on the respective applications below to view application
                details.
              </Typography> */}
              <Grid item xs={12} className={classes.searchSection}>
                <div className={classes.searchBar}>
                  <SearchBar
                    placeholder="Search applications..."
                    // value={searchValue}
                    // onChange={(newValue) => setSearchValue(newValue)}
                    // onRequestSearch={handleRequestSearch}
                    // onCancelSearch={handleCancelSearch}
                    // classes={{
                    //   input: classes.input,
                    // }}
                  />
                </div>
                <div>
                  {/* <FormControl
                    variant="outlined"
                    className={classes.formControl}
                  >
                    <InputLabel style={{ top: -4 }}>Filter by</InputLabel>
                    <Select
                      label="Filter by"
                      value={sortMethod}
                      onChange={(event) => {
                        onSortChange(event);
                      }}
                      style={{ height: 47, backgroundColor: "#fff" }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="upcoming">
                        Upcoming Consultations
                      </MenuItem>
                      <MenuItem value="past">Past Applications</MenuItem>
                    </Select>
                  </FormControl> */}
                </div>
              </Grid>
              <Paper
                style={{ height: "650px", width: "100%", marginTop: "20px" }}
              >
                <DataGrid
                  className={classes.dataGrid}
                  rows={applicantsRows}
                  columns={applicationsColumns.map((column) => ({
                    ...column,
                  }))}
                  pageSize={10}
                  disableSelectionOnClick
                  // onRowClick={(e) => handleClickOpenApplication(e)}
                />
              </Paper>
            </div>
            <Dialog
              open={openCompleteDialog}
              onClose={() => setOpenCompleteDialog(false)}
              aria-labelledby="form-dialog-title"
              classes={{ paper: classes.dialogPaper }}
            >
              <DialogTitle id="form-dialog-title">
                Mark Industry Project as Complete?
              </DialogTitle>
              <DialogContent>
                By marking this industry project as complete, you will not be
                able to make further edits or delete this industry project.{" "}
                <br />
                <span>Are you sure?</span>
              </DialogContent>
              <DialogActions style={{ marginTop: 40 }}>
                <Button
                  onClick={() => setOpenCompleteDialog(false)}
                  color="primary"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleCompleteSubmit()}
                  color="primary"
                  variant="contained"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openDeleteDialog}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              classes={{ paper: classes.dialogPaper }}
            >
              <DialogTitle id="form-dialog-title">
                Delete Industry Project?
              </DialogTitle>
              <DialogContent>
                Are you sure you want to delete this industry project?
              </DialogContent>
              <DialogActions style={{ marginTop: 40 }}>
                <Button
                  onClick={handleClose}
                  color="primary"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDeleteSubmit()}
                  className={classes.deleteButton}
                  variant="contained"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              open={openEditDialog}
              onClose={handleClose}
              aria-labelledby="form-dialog-title"
              classes={{ paper: classes.dialogPaper }}
            >
              <DialogTitle id="form-dialog-title">
                Edit Industry Project
              </DialogTitle>
              <DialogContent>
                <label htmlFor="title">
                  <Typography variant="body2">Title (Required)</Typography>
                </label>
                <TextField
                  id="title"
                  variant="outlined"
                  placeholder="Enter title"
                  margin="dense"
                  fullWidth
                  name="title"
                  value={editIndustryProject && editIndustryProject.title}
                  onChange={(e) =>
                    setEditIndustryProject({
                      ...editIndustryProject,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="description">
                  <Typography variant="body2">
                    Description (Required)
                  </Typography>
                </label>
                <TextField
                  id="description"
                  variant="outlined"
                  placeholder="Enter description"
                  margin="dense"
                  fullWidth
                  multiline
                  rows={8}
                  name="description"
                  value={editIndustryProject && editIndustryProject.description}
                  onChange={(e) =>
                    setEditIndustryProject({
                      ...editIndustryProject,
                      description: e.target.value,
                    })
                  }
                  required
                />
                <KeyboardDatePicker
                  className={classes.dateTimeField}
                  minDate={currentDate}
                  variant="inline"
                  label="Start Date"
                  name="start_date"
                  value={editIndustryProject && editIndustryProject.start_date}
                  onChange={(e) =>
                    setEditIndustryProject({
                      ...editIndustryProject,
                      start_date: e,
                    })
                  }
                  format="dd/MM/yyyy"
                />
                to
                <KeyboardDatePicker
                  className={classes.dateTimeField}
                  minDate={afterDate}
                  variant="inline"
                  label="End Date"
                  name="end_date"
                  value={editIndustryProject && editIndustryProject.end_date}
                  onChange={(e) =>
                    setEditIndustryProject({
                      ...editIndustryProject,
                      end_date: e,
                    })
                  }
                  format="dd/MM/yyyy"
                />
                <KeyboardDatePicker
                  className={classes.dateTimeField}
                  minDate={beforeDate}
                  variant="inline"
                  label="Application Deadline"
                  name="application_deadline"
                  value={
                    editIndustryProject &&
                    editIndustryProject.application_deadline
                  }
                  onChange={(e) =>
                    setEditIndustryProject({
                      ...editIndustryProject,
                      application_deadline: e,
                    })
                  }
                  format="dd/MM/yyyy"
                />
                <Typography variant="body2" style={{ paddingBottom: "10px" }}>
                  Category (Choost at least 1)
                </Typography>
                <div>
                  <ToggleButton
                    value=""
                    size="small"
                    selected={categories && categories.SEC}
                    onChange={() => {
                      setCategories({ ...categories, SEC: !categories.SEC });
                    }}
                    className={`${classes.languageButtons} ${classes.categoryButtons}`}
                  >
                    Security
                  </ToggleButton>
                  <ToggleButton
                    value=""
                    size="small"
                    selected={categories && categories.DB}
                    onChange={() => {
                      setCategories({ ...categories, DB: !categories.DB });
                    }}
                    className={`${classes.categoryButtons}`}
                  >
                    Database Administration
                  </ToggleButton>
                  <ToggleButton
                    value=""
                    size="small"
                    selected={categories && categories.FE}
                    onChange={() => {
                      setCategories({ ...categories, FE: !categories.FE });
                    }}
                    className={`${classes.languageButtons} ${classes.categoryButtons}`}
                  >
                    Frontend
                  </ToggleButton>
                  <ToggleButton
                    value=""
                    size="small"
                    selected={categories && categories.BE}
                    onChange={() => {
                      setCategories({ ...categories, BE: !categories.BE });
                    }}
                    className={`${classes.languageButtons} ${classes.categoryButtons}`}
                  >
                    Backend
                  </ToggleButton>
                  <ToggleButton
                    value=""
                    size="small"
                    selected={categories && categories.UI}
                    onChange={() => {
                      setCategories({ ...categories, UI: !categories.UI });
                    }}
                    className={`${classes.languageButtons} ${classes.categoryButtons}`}
                  >
                    UI/UX
                  </ToggleButton>
                  <ToggleButton
                    value=""
                    size="small"
                    selected={categories && categories.ML}
                    onChange={() => {
                      setCategories({ ...categories, ML: !categories.ML });
                    }}
                    className={`${classes.categoryButtons}`}
                  >
                    Machine Learning
                  </ToggleButton>
                </div>
              </DialogContent>
              <DialogActions style={{ marginTop: 40 }}>
                <Button
                  onClick={handleClose}
                  color="primary"
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  color="primary"
                  variant="contained"
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        ) : (
          <div>Loading....</div>
        )}
      </div>
    </Fragment>
  );
};
export default IndustryProjectDetails;
