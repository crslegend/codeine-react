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
import { Add } from "@material-ui/icons";
import PageTitle from "../../components/PageTitle";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Link, useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

import Service from "../../AxiosService";
import { addDays } from "date-fns/esm";

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
    marginBottom: 10
  },
}));

const IndustryProject = () => {
  const classes = useStyles();

  const beforeDate = addDays(new Date(), 1);
  const currentDate = addDays(new Date(), 2);
  const afterDate = addDays(new Date(), 3);
  const [industryProject, setIndustryProject] = useState({
    title: "",
    description: "",
    start_date: currentDate,
    end_date: afterDate,
    applicaion_deadline: beforeDate,
  });

  const [categories, setCategories] = useState({
    SEC: false,
    DB: false,
    FE: false,
    BE: false,
    UI: false,
    ML: false,
  });

  const [open, setOpen] = useState(false);

  const handleSubmit = () => {};

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    console.log("this is open");
    setOpen(true);
  };

  return (
    <Fragment>
      <div className={classes.titleSection}>
        <PageTitle title="My Industry Project" />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleOpen}
        >
          Create New Industry Project
        </Button>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle id="form-dialog-title">
          Create a new industry Project
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
            value={industryProject && industryProject.title}
            onChange={(e) =>
              setIndustryProject({
                ...industryProject,
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
            value={industryProject && industryProject.description}
            onChange={(e) =>
              setIndustryProject({
                ...industryProject,
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
            value={industryProject.start_date}
            onChange={(e) =>
              setIndustryProject({
                ...industryProject,
                [e.target.name]: e.target.value,
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
            value={industryProject.end_date}
            onChange={(e) =>
              setIndustryProject({
                ...industryProject,
                [e.target.name]: e.target.value,
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
            value={industryProject.applicaion_deadline}
            onChange={(e) =>
              setIndustryProject({
                ...industryProject,
                [e.target.name]: e.target.value,
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
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default IndustryProject;
