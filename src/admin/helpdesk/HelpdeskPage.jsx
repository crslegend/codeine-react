import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router";
import Service from "../../AxiosService";
import { DataGrid } from "@material-ui/data-grid";
import SearchBar from "material-ui-search-bar";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 580,
  },
  dataGrid: {
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
}));

const AdminHelpdeskPage = () => {
  const classes = useStyles();
  const history = useHistory();

  const [enquiries, setEnquiries] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const getSubmittedEnquiries = () => {
    if (searchValue === "") {
      Service.client
        .get(`helpdesk/tickets`)
        .then((res) => {
          console.log(res);
          setEnquiries(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      Service.client
        .get(`helpdesk/tickets`, { params: { search: searchValue } })
        .then((res) => {
          console.log(res);
          setEnquiries(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getSubmittedEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchValue === "") {
      getSubmittedEnquiries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      const newDateTime = new Date(date).toLocaleTimeString("en-SG");
      // console.log(newDate);
      return newDate + " " + newDateTime;
    }
    return "";
  };

  const enquiryColumns = [
    { field: "id", headerName: "Ticket ID", width: 350 },
    {
      field: "ticket_status",
      headerName: "Ticket Status",
      width: 170,
      renderCell: (params) => (
        <div>
          {(() => {
            if (params.value) {
              if (params.value === "OPEN") {
                return (
                  <div variant="body2" style={{ color: "green" }}>
                    Open
                  </div>
                );
              } else if (params.value === "PENDING") {
                return (
                  <div variant="body2" style={{ color: "#f0ae24" }}>
                    Pending
                  </div>
                );
              } else if (params.value === "RESOLVED") {
                return (
                  <div variant="body2" style={{ color: "grey" }}>
                    Resolved
                  </div>
                );
              }
            }
          })()}
        </div>
      ),
    },
    {
      field: "ticket_type",
      headerName: "Type",
      width: 180,
      valueFormatter: (params) => capitalizeFirstLetter(params.value[0]),
    },
    {
      field: "timestamp",
      headerName: "Submitted On",
      width: 270,
      valueFormatter: (params) => formatDate(params.value),
    },
  ];

  return (
    <div className={classes.root}>
      <Typography variant="h3" style={{ fontWeight: 700 }}>
        Helpdesk
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
            placeholder="Search tickets"
            value={searchValue}
            onChange={(newValue) => setSearchValue(newValue)}
            onRequestSearch={getSubmittedEnquiries}
            onCancelSearch={() => setSearchValue("")}
          />
        </Grid>

        <Grid
          item
          xs={12}
          style={{ height: "calc(100vh - 280px)", width: "100%" }}
        >
          <DataGrid
            className={classes.dataGrid}
            rows={enquiries}
            columns={enquiryColumns}
            pageSize={10}
            //checkboxSelection
            disableSelectionOnClick
            onRowClick={(e) => history.push(`/admin/helpdesk/${e.row.id}`)}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminHelpdeskPage;
