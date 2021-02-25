import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
} from "@material-ui/core";
import { CountryDropdown } from "react-country-region-selector";
import Service from "../../AxiosService";
import PageTitle from "../../components/PageTitle";
import { Add, LaptopWindows } from "@material-ui/icons";
import Toast from "../../components/Toast.js";
import { DataGrid } from "@material-ui/data-grid";

import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  topSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    color: "#fff",
    backgroundColor: theme.palette.primary.main,
    height: 35,
    "&:hover": {
      color: "#000",
    },
  },
  paper: {
    height: "calc(100vh - 115px)",
  },
}));

const WalletPage = () => {
  const classes = useStyles();

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

  const [loading, setLoading] = useState(false);

  // Bank Details
  const [newBankDetails, setNewBankDetails] = useState();
  const [bankDetails, setBankDetails] = useState();
  const [bankDialog, setBankDialog] = useState(false);

  // Transactions datagrid
  const [allTransactionList, setAllTransactionList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({
    id: "",
    date: "",
    amount: "",
  });

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 300 },
    { field: "date", headerName: "Transaction Date", width: 180 },
    { field: "amount", headerName: "Amount", width: 130 },
    {
      field: "duration",
      headerName: "Duration",
      width: 130,
    },
  ];

  let transactionRows = allTransactionList;
  const [searchValueTransaction, setSearchValueTransaction] = useState("");

  const getTransactionData = () => {
    if (Service.getJWT() !== null && Service.getJWT() !== undefined) {
      Service.client
        .get(`/auth/members`)
        .then((res) => {
          setAllTransactionList(res.data);
          transactionRows = allTransactionList;
        })
        .catch((err) => {
          //setProfile(null);
        });
    }
  };

  const getBankDetail = () => {
    Service.client
      .get(`/auth/bank-details`)
      .then((res) => {
        setBankDetails(res.data);
      })
      .catch((err) => {
        setBankDetails(null);
      });
  };

  const handleBankDialog = (e) => {
    const {
      bank_name,
      bank_account,
      swift_code,
      bank_country,
      bank_address,
    } = newBankDetails;

    const formValues = {
      bank_name,
      bank_account,
      swift_code,
      bank_country,
      bank_address,
    };

    Service.client
      .post(`/auth/bank-details`, formValues)
      .then((res) => {
        setBankDialog(false);
        setSbOpen(true);
        setSnackbar({
          message: "Bank Account Details submitted successfully!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .then((res) => {
        Service.client.get(`/auth/bank-details`).then((res) => {
          setBankDetails(res.data);
        });
      })
      .catch((err) => console.log(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // submit form-data as per usual
    const {
      bank_name,
      bank_account,
      swift_code,
      bank_country,
      bank_address,
    } = bankDetails;

    const formValues = {
      bank_name,
      bank_account,
      swift_code,
      bank_country,
      bank_address,
    };

    Service.client
      .patch(`/auth/bank-details/${bankDetails.id}`, formValues)
      .then((res) => {
        setBankDialog(false);
        setSbOpen(true);
        setSnackbar({
          message: "Bank Account Details updated successfully!",
          severity: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "center",
          },
          autoHideDuration: 3000,
        });
      })
      .then((res) => {
        Service.client.get(`/auth/bank-details`).then((res) => {
          setBankDetails(res.data);
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getBankDetail();
  }, [setBankDetails]);

  return (
    <Fragment>
      <Toast open={sbOpen} setOpen={setSbOpen} {...snackbar} />
      <div className={classes.topSection}>
        <PageTitle title={`Wallet`} />
        {!bankDetails && (
          <Button
            style={{ float: "right" }}
            variant="contained"
            startIcon={<Add />}
            className={classes.addButton}
            onClick={() => setBankDialog(true)}
          >
            Add your Bank Account
          </Button>
        )}
      </div>
      {bankDetails ? (
        <Grid container>
          <Grid item xs>
            <form onSubmit={handleSubmit}>
              <Card className={classes.root}>
                <CardHeader
                  title={
                    <Typography style={{ fontWeight: "bold" }}>
                      Bank Account Details
                    </Typography>
                  }
                />
                <CardContent style={{ paddingTop: "0px" }}>
                  <div>
                    <TextField
                      id="bank_name"
                      label="Bank Name*"
                      name="bank_name"
                      style={{ width: "90%" }}
                      value={bankDetails.bank_name || ""}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      id="bank_account"
                      label="Bank Account*"
                      name="bank_account"
                      style={{ width: "90%" }}
                      value={bankDetails.bank_account || ""}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      id="swift_code"
                      label="Swift Code*"
                      name="swift_code"
                      style={{ width: "90%" }}
                      value={bankDetails.swift_code || ""}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      id="bank_country"
                      label="Bank Country*"
                      name="bank_country"
                      style={{ width: "90%" }}
                      value={bankDetails.bank_country || ""}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <TextField
                      id="bank_address"
                      label="Bank Address*"
                      name="bank_address"
                      style={{ width: "90%" }}
                      value={bankDetails.bank_address || ""}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    disabled={loading}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "10px", alignSelf: "flex-end" }}
                    type="submit"
                  >
                    {loading ? (
                      <CircularProgress
                        size="1.5rem"
                        style={{ color: "#FFF" }}
                      />
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </form>
          </Grid>
        </Grid>
      ) : null}
      <div style={{ height: "calc(100vh - 300px)", width: "100%" }}>
        <DataGrid
          rows={transactionRows}
          columns={transactionColumns.map((column) => ({
            ...column,
            //disableClickEventBubbling: true,
          }))}
          pageSize={10}
          //checkboxSelection
          disableSelectionOnClick
          //onRowClick={(e) => handleClickOpenAdmin(e)}
        />
      </div>
      <Dialog
        open={bankDialog}
        onClose={() => setBankDialog(false)}
        PaperProps={{
          style: {
            width: "400px",
          },
        }}
      >
        <DialogTitle>Add Bank Account</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              id="bank_name"
              label="Bank Name*"
              name="bank_name"
              fullWidth
              onChange={(e) =>
                setNewBankDetails({
                  ...newBankDetails,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div>
            <TextField
              id="bank_account"
              label="Bank Account*"
              name="bank_account"
              fullWidth
              onChange={(e) =>
                setNewBankDetails({
                  ...newBankDetails,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div>
            <TextField
              id="swift_code"
              label="Swift Code*"
              name="swift_code"
              fullWidth
              onChange={(e) =>
                setNewBankDetails({
                  ...newBankDetails,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div>
            <TextField
              id="bank_country"
              label="Bank Country*"
              name="bank_country"
              fullWidth
              onChange={(e) =>
                setNewBankDetails({
                  ...newBankDetails,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
          <div>
            <TextField
              id="bank_address"
              label="Bank Address*"
              name="bank_address"
              fullWidth
              onChange={(e) =>
                setNewBankDetails({
                  ...newBankDetails,
                  [e.target.name]: e.target.value,
                })
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            className={classes.dialogButtons}
            onClick={() => {
              setBankDialog(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBankDialog()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default WalletPage;
