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
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import Service from "../../AxiosService";
import PageTitle from "../../components/PageTitle";
import { Add } from "@material-ui/icons";
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
  dataGrid: {
    backgroundColor: "#fff",
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
  const [newBankDetails, setNewBankDetails] = useState({
    bank_name: "",
    bank_account: "",
    swift_code: "",
    bank_country: "",
    bank_address: "",
  });
  const [bankDetails, setBankDetails] = useState();
  const [bankDialog, setBankDialog] = useState(false);

  // Transactions datagrid
  const [allTransactionList, setAllTransactionList] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState({
    id: "",
    date: "",
    amount: "",
  });

  const getTransactionData = () => {
    Service.client
      .get("/consultations/partner/payments")
      .then((res) => {
        setAllTransactionList(res.data);
      })
      .catch((error) => {
        setAllTransactionList(null);
      });
  };
  console.log(allTransactionList);

  useEffect(() => {
    getTransactionData();
  }, [setAllTransactionList]);

  const formatStatus = (status) => {
    if (status === "Earnings") {
      return "green";
    } else {
      return "red";
    }
  };

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 300 },
    { field: "date", headerName: "Transaction Date", width: 220 },
    {
      field: "title",
      headerName: "Consultation Title",
      width: 250,
    },
    {
      field: "start_date",
      headerName: "Consultation Date",
      width: 220,
    },
    {
      field: "member",
      headerName: "Booked By",
      width: 200,
    },
    {
      field: "type",
      headerName: "Transaction Type",
      renderCell: (params) => (
        <strong>
          <Typography
            variant="body2"
            style={{ color: formatStatus(params.value) }}
          >
            {params.value}
          </Typography>
        </strong>
      ),
      width: 200,
    },
    {
      field: "debit",
      headerName: "Debit",
      renderCell: (params) =>
        params.value && (
          <Typography style={{ color: "green" }} variant="body2">
            ${params.value}
          </Typography>
        ),
      width: 120,
    },
    {
      field: "credit",
      headerName: "Credit",
      renderCell: (params) =>
        params.value && (
          <Typography style={{ color: "red" }} variant="body2">
            ${params.value}
          </Typography>
        ),
      width: 120,
    },
  ];

  const formatDate = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const transactionRows = allTransactionList;
  for (var h = 0; h < allTransactionList.length; h++) {
    transactionRows[h].title = allTransactionList[h].consultation_slot.title;
    transactionRows[h].start_date = formatDate(
      allTransactionList[h].consultation_slot.start_time
    );
    transactionRows[h].member = allTransactionList[h].member_name;

    transactionRows[h].date = formatDate(
      allTransactionList[h].payment_transaction.timestamp
    );
    transactionRows[h].amount =
      allTransactionList[h].payment_transaction.payment_amount;

    if (
      allTransactionList[h].payment_transaction.payment_status === "COMPLETED"
    ) {
      transactionRows[h].type = "Earnings";
      transactionRows[h].debit =
        allTransactionList[h].payment_transaction.payment_amount;
    } else {
      transactionRows[h].type = "Refund";
      transactionRows[h].credit =
        allTransactionList[h].payment_transaction.payment_amount;
    }
  }

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
    // validation to prevent user from submitting empty fields
    if (
      newBankDetails.bank_name === "" ||
      newBankDetails.bank_account === "" ||
      newBankDetails.swift_code === "" ||
      newBankDetails.bank_country === "" ||
      newBankDetails.bank_address === ""
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "All bank account details must be filled!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 5000,
      });
      return;
    }

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

    // validation to prevent user from submitting empty fields
    if (
      bankDetails.bank_name === "" ||
      bankDetails.bank_account === "" ||
      bankDetails.swift_code === "" ||
      bankDetails.bank_country === "" ||
      bankDetails.bank_address === ""
    ) {
      setSbOpen(true);
      setSnackbar({
        message: "All bank account details must be filled!",
        severity: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
        autoHideDuration: 5000,
      });
      return;
    }

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
        <Grid container style={{ marginBottom: "50px" }}>
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
                    <FormControl
                      style={{ width: "50%", paddingBottom: "10px" }}
                    >
                      <InputLabel>Bank Name*</InputLabel>
                      <Select
                        label="Bank Name*"
                        name="bank_name"
                        value={bankDetails.bank_name || ""}
                        onChange={(e) =>
                          setBankDetails({
                            ...bankDetails,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="DBS">DBS</MenuItem>
                        <MenuItem value="OCBC">OCBC</MenuItem>
                        <MenuItem value="UOB">UOB</MenuItem>
                        <MenuItem value="UOB">HSBC</MenuItem>
                        <MenuItem value="SC">Standard Chartered</MenuItem>
                        <MenuItem value="CIMB">CIMB</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      id="bank_account"
                      label="Bank Account*"
                      name="bank_account"
                      style={{ width: "50%", paddingBottom: "10px" }}
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
                      style={{ width: "50%", paddingBottom: "10px" }}
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
                    <FormControl
                      style={{ width: "50%", paddingBottom: "10px" }}
                    >
                      <InputLabel>Bank Country*</InputLabel>
                      <Select
                        value={bankDetails.bank_country || ""}
                        label="Bank Country*"
                        name="bank_country"
                        onChange={(e) =>
                          setBankDetails({
                            ...bankDetails,
                            [e.target.name]: e.target.value,
                          })
                        }
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value="Singapore">Singapore</MenuItem>
                        <MenuItem value="Malaysia">Malaysia</MenuItem>
                        <MenuItem value="China">China</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <TextField
                      id="bank_address"
                      label="Bank Address*"
                      name="bank_address"
                      style={{ width: "50%", paddingBottom: "10px" }}
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
      <Typography
        variant="h5"
        style={{ fontWeight: 600, paddingBottom: "10px" }}
      >
        My Earnings
      </Typography>
      <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
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
          className={classes.dataGrid}
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
            <FormControl fullWidth>
              <InputLabel>Bank Name*</InputLabel>
              <Select
                label="Bank Name*"
                name="bank_name"
                onChange={(e) =>
                  setNewBankDetails({
                    ...newBankDetails,
                    [e.target.name]: e.target.value,
                  })
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="DBS">DBS</MenuItem>
                <MenuItem value="OCBC">OCBC</MenuItem>
                <MenuItem value="UOB">UOB</MenuItem>
                <MenuItem value="UOB">HSBC</MenuItem>
                <MenuItem value="SC">Standard Chartered</MenuItem>
                <MenuItem value="CIMB">CIMB</MenuItem>
              </Select>
            </FormControl>
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
            <FormControl fullWidth>
              <InputLabel>Bank Country*</InputLabel>
              <Select
                label="Bank Country*"
                name="bank_country"
                onChange={(e) =>
                  setNewBankDetails({
                    ...newBankDetails,
                    [e.target.name]: e.target.value,
                  })
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Singapore">Singapore</MenuItem>
                <MenuItem value="Malaysia">Malaysia</MenuItem>
                <MenuItem value="China">China</MenuItem>
              </Select>
            </FormControl>
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
