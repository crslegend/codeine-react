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
} from "@material-ui/core";
import { ToggleButton } from "@material-ui/lab";
import { Edit } from "@material-ui/icons";
import { KeyboardDatePicker } from "@material-ui/pickers";
import PageTitle from "../../components/PageTitle";
import Toast from "../../components/Toast.js";
import ProjectCard from "./ProjectCard";
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
}));

const IndustryProjectDetails = () => {
  const classes = useStyles();
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

  const [open, setOpen] = useState(false);

  let decoded;
  if (Cookies.get("t1")) {
    decoded = jwt_decode(Cookies.get("t1"));
  }

  let queryParams = {
    //   search: searchValue,
    partner_id: decoded.user_id,
  };

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
        setOpen(false);
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      {industryProject ? (
        <div>
          <div className={classes.titleSection}>
            <PageTitle title={industryProject.title} />
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={handleOpen}
            >
              Edit
            </Button>
          </div>
          <Dialog
            open={open}
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
                <Typography variant="body2">Description (Required)</Typography>
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
                value={editIndustryProject && editIndustryProject.application_deadline}
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
              <Button onClick={handleClose} color="primary" variant="outlined">
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
    </Fragment>
  );
};
export default IndustryProjectDetails;
