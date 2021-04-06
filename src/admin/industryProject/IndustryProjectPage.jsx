import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import {
  Typography,
  Grid,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from "material-ui-search-bar";
import Service from "../../AxiosService";
import Toast from "../../components/Toast";

const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 580,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  dataGrid: {
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
  orgavatar: {
    objectFit: "contain",
  },
}));

const IndustryProjectPage = () => {
  const classes = styles();
  const history = useHistory();

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

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

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

  const formatActivationStatus = (status) => {
    if (status) {
      return "Activated";
    } else {
      return "Deactivated";
    }
  };

  const formatStatus = (status) => {
    if (status) {
      return "Completed";
    } else {
      return "Not Completed";
    }
  };

  const [searchIndustryProjectValue, setSearchIndustryProjectValue] = useState(
    ""
  );

  useEffect(() => {
    getIndustryProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchIndustryProjectValue === "") {
      getIndustryProjectData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchIndustryProjectValue]);

  const [allIndustryProjectList, setAllIndustryProjectList] = useState([]);

  const industryProjectColumns = [
    {
      field: "organization_photo",
      headerName: " ",
      width: 70,
      renderCell: (params) => (
        <Avatar
          alt="Pic"
          src={params.value}
          classes={{
            img: classes.orgavatar,
          }}
        />
      ),
    },
    { field: "title", headerName: "Title", flex: 1 },
    {
      field: "date_listed",
      headerName: "Date Listed",
      valueFormatter: (params) => formatDate(params.value),
      width: 150,
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
    },
    {
      field: "is_available",
      headerName: "Activation Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>
              {formatActivationStatus(params.value)}
            </div>
          ) : (
            <div style={{ color: "red" }}>
              {formatActivationStatus(params.value)}
            </div>
          )}
        </div>
      ),
      width: 200,
    },
    {
      field: "is_completed",
      headerName: "Project Status",
      renderCell: (params) => (
        <div>
          {params.value ? (
            <div style={{ color: "green" }}>{formatStatus(params.value)}</div>
          ) : (
            <div>{formatStatus(params.value)}</div>
          )}
        </div>
      ),
      width: 200,
    },
  ];

  let industryProjectRows = allIndustryProjectList;

  const getIndustryProjectData = () => {
    let queryParams;

    if (searchIndustryProjectValue !== "") {
      queryParams = {
        search: searchIndustryProjectValue,
      };
    }

    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/industry-projects`, { params: { ...queryParams } })
        .then((res) => {
          let arr = [];
          let obj = {};
          for (let i = 0; i < res.data.length; i++) {
            obj = {
              id: res.data[i].id,
              title: res.data[i].title,
              duration:
                formatDate(res.data[i].start_date) +
                " to " +
                formatDate(res.data[i].end_date),
              date_listed: res.data[i].date_listed,
              is_completed: res.data[i].is_completed,
              is_available: res.data[i].is_available,
              organization_photo:
                res.data[i].partner.partner.organization.organization_photo,
            };
            arr.push(obj);
          }

          setAllIndustryProjectList(arr);
          industryProjectRows = allIndustryProjectList;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const [selectedIndustryProject, setSelectedIndustryProject] = useState();
  const [openActivationDialog, setOpenActivationDialog] = useState(false);

  const handleClickOpenIndustryProject = (e) => {
    setSelectedIndustryProject(e.row);
    if (e.field === "is_available") {
      setOpenActivationDialog(true);
    } else {
      history.push("/admin/industryproject/" + e.row.id);
    }
  };

  const handleActivationSubmit = (industry_project_id, status) => {
    Service.client
      .patch(`/industry-projects/${industry_project_id}`, {
        is_available: !status,
      })
      .then((res) => {
        let msg = "";
        if (status) {
          msg = "deactivated";
        } else {
          msg = "activated";
        }
        setOpenActivationDialog(false);
        getIndustryProjectData();
        setSbOpen(true);
        setSnackbar({
          message: "Industry project has been " + msg + "!",
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

  return (
    <div className={classes.root}>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <Typography variant="h3" style={{ fontWeight: 700 }}>
        Industry Project
      </Typography>
      <Grid container>
        <Grid item xs={9}>
          <SearchBar
            style={{
              width: "70%",
              marginTop: "20px",
              marginBottom: "20px",
              elavation: "0px",
            }}
            placeholder="Search industry projects"
            value={searchIndustryProjectValue}
            onChange={(newValue) => setSearchIndustryProjectValue(newValue)}
            onRequestSearch={getIndustryProjectData}
            onCancelSearch={() => setSearchIndustryProjectValue("")}
          />
        </Grid>

        <Grid
          item
          xs={12}
          style={{ height: "calc(100vh - 280px)", width: "100%" }}
        >
          <DataGrid
            className={classes.dataGrid}
            rows={industryProjectRows}
            columns={industryProjectColumns.map((column) => ({
              ...column,
            }))}
            pageSize={6}
            disableSelectionOnClick
            onCellClick={(e) => handleClickOpenIndustryProject(e)}
          />
        </Grid>
      </Grid>
      <Dialog
        open={openActivationDialog}
        onClose={() => setOpenActivationDialog(false)}
        aria-labelledby="form-dialog-title"
        classes={{ paper: classes.dialogPaper }}
      >
        {selectedIndustryProject && selectedIndustryProject.is_available ? (
          <div>
            <DialogTitle id="form-dialog-title">
              Deactivate Industry Project?
            </DialogTitle>
            <DialogContent>
              Are you sure you want to deactivate this industry project?
            </DialogContent>
          </div>
        ) : (
          <div>
            <DialogTitle id="form-dialog-title">
              Activate Industry Project?
            </DialogTitle>
            <DialogContent>
              Are you sure you want to activate this industry project?
            </DialogContent>
          </div>
        )}
        <DialogActions style={{ marginTop: 40 }}>
          <Button
            onClick={() => setOpenActivationDialog(false)}
            color="primary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleActivationSubmit(
                selectedIndustryProject.id,
                selectedIndustryProject.is_available
              )
            }
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default IndustryProjectPage;
