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
  Paper,
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
import { Cell, PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

const useStyles = makeStyles((theme) => ({
  topSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addButton: {
    color: "#fff",
    height: 35,
  },
  paper: {
    height: "40vh",
  },
  dataGrid: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        cursor: "pointer",
      },
    },
  },
  withdrawButton: {
    backgroundColor: "#000000",
    color: "#FFFFFF",
    borderRadius: "40px",
    margin: "36px 0px 50px",
    "&:hover": {
      backgroundColor: "#3D3D3D",
    },
  },
  breakdownPaper: {
    padding: theme.spacing(4),
    width: "70%",
    marginLeft: "auto",
    marginRight: "auto",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    marginBottom: "30px",
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

  // eslint-disable-next-line no-unused-vars
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
  const [latestEarnings, setLatestEarnings] = useState("0");

  // Transactions datagrid
  const [allTransactionList, setAllTransactionList] = useState([]);

  const [earningsBreakdown, setEarningsBreakdown] = useState();
  const [data, setData] = useState();
  // const data = [
  //   { name: "Group A", value: 400 },
  //   { name: "Group B", value: 300 },
  //   { name: "Group C", value: 300 },
  //   { name: "Group D", value: 200 },
  // ];

  const getTransactionData = () => {
    Service.client
      .get("/consultations/partner/payments")
      .then((res) => {
        setAllTransactionList(res.data);
        // console.log(res.data);
        setEarnings(res.data);
      })
      .catch((error) => {
        setAllTransactionList(null);
      });
  };
  // console.log(allTransactionList);
  const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

  const getEarnings = () => {
    Service.client
      .get("/analytics/partner-earnings-report")
      .then((res) => {
        // setAllTransactionList(res.data);
        console.log(res);
        setEarningsBreakdown(res.data);
        const arr = [
          {
            name: "Your Cut",
            value:
              res.data.partner_cut_amount > 0 ? res.data.partner_cut_amount : 0,
          },
          {
            name: "Remaining Pool",
            value:
              res.data.profit_sharing_pool > 0
                ? res.data.profit_sharing_pool - res.data.partner_cut_amount
                : 0,
          },
        ];
        setData(arr);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getTransactionData();
    getEarnings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      width: 220,
    },
    {
      field: "start_date",
      headerName: "Consultation Date",
      width: 220,
    },
    {
      field: "member",
      headerName: "Applicant",
      width: 180,
    },
    {
      field: "type",
      headerName: "Transaction Type",
      renderCell: (params) => (
        <div>
          <div variant="body2" style={{ color: formatStatus(params.value) }}>
            {params.value}
          </div>
        </div>
      ),
      width: 170,
    },
    {
      field: "debit",
      headerName: "Debit",
      renderCell: (params) =>
        params.value && (
          <div style={{ color: "green" }} variant="body2">
            ${params.value}
          </div>
        ),
      width: 115,
    },
    {
      field: "credit",
      headerName: "Credit",
      renderCell: (params) =>
        params.value && (
          <div style={{ color: "red" }} variant="body2">
            ${params.value}
          </div>
        ),
      width: 115,
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
  //let obj = {}
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

  const setEarnings = (data) => {
    let amount = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i].debit !== undefined) {
        amount += Number(data[i].amount);
      } else {
        amount -= Number(data[i].amount);
      }
    }
    setLatestEarnings(amount);
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
        <PageTitle title={`See Earning Details`} />
        {!bankDetails && (
          <Button
            style={{ float: "right" }}
            variant="contained"
            color="primary"
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
          <Grid item xs={7}>
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
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <FormControl
                      style={{ width: "45%", paddingBottom: "10px" }}
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
                    <TextField
                      id="bank_account"
                      label="Bank Account*"
                      name="bank_account"
                      style={{
                        width: "45%",
                        paddingBottom: "10px",
                      }}
                      value={bankDetails.bank_account || ""}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <TextField
                      id="swift_code"
                      label="Swift Code*"
                      name="swift_code"
                      style={{ width: "45%", paddingBottom: "10px" }}
                      value={bankDetails.swift_code || ""}
                      onChange={(e) =>
                        setBankDetails({
                          ...bankDetails,
                          [e.target.name]: e.target.value,
                        })
                      }
                    />
                    <FormControl
                      style={{ width: "45%", paddingBottom: "10px" }}
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
                      style={{ width: "100%", paddingBottom: "10px" }}
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

          <Grid item xs={1} />
          <Grid
            item
            xs={3}
            style={{
              textAlign: "center",
            }}
          >
            <Paper>
              <Typography
                variant="h6"
                style={{
                  fontWeight: 600,
                  paddingTop: "50px",
                }}
              >
                Available to Withdraw
              </Typography>
              <Typography
                variant="h1"
                style={{
                  color: "#437FC7",
                  paddingTop: "15px",

                  fontWeight: 600,
                }}
              >
                ${latestEarnings}
              </Typography>
              <Typography
                variant="h6"
                style={{
                  color: "#4B4B4B",
                  fontWeight: 500,
                  paddingTop: "15px",
                }}
              >
                Accumulated Earnings: ${latestEarnings}
              </Typography>
              <Button variant="contained" className={classes.withdrawButton}>
                Withdraw Earnings
              </Button>
            </Paper>
          </Grid>
        </Grid>
      ) : null}
      <Paper className={classes.breakdownPaper}>
        <Typography
          variant="h6"
          style={{ fontWeight: 600, paddingBottom: "20px" }}
        >
          Earnings Breakdown for the Month
        </Typography>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Earnings from Consultation
            </Typography>
            <Typography variant="h1" style={{ paddingBottom: "10px" }}>
              {earningsBreakdown &&
                (earningsBreakdown.consultation_earnings
                  ? `$${earningsBreakdown.consultation_earnings}`
                  : `$0`)}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Pending Earnings from Consultation
            </Typography>
            <Typography variant="h1" style={{ paddingBottom: "10px" }}>
              {earningsBreakdown &&
                (earningsBreakdown.pending_consultation_earnings
                  ? `$${earningsBreakdown.pending_consultation_earnings}`
                  : `$0`)}
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body2" style={{ paddingBottom: "10px" }}>
              Earnings from Profit Sharing
            </Typography>
            <Typography variant="h1" style={{ paddingBottom: "10px" }}>
              {earningsBreakdown &&
                (earningsBreakdown.partner_cut_amount > 0
                  ? `$${earningsBreakdown.pending_consultation_earnings}`
                  : `$0`)}
            </Typography>
          </div>
        </div>
        {earningsBreakdown && earningsBreakdown.profit_sharing_pool > 0 && (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data && data}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label
              >
                {data &&
                  data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Paper>
      <Typography
        variant="h5"
        style={{ fontWeight: 600, paddingBottom: "10px" }}
      >
        My Earnings
      </Typography>
      <div
        style={{
          height: "calc(100vh - 250px)",
          width: "100%",
        }}
      >
        <DataGrid
          rows={transactionRows}
          columns={transactionColumns.map((column) => ({
            ...column,
          }))}
          pageSize={10}
          disableSelectionOnClick
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
          <div style={{ marginBottom: "15px" }}>
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
          <div style={{ marginBottom: "15px" }}>
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
          <div style={{ marginBottom: "15px" }}>
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
          <div style={{ marginBottom: "15px" }}>
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
          <div style={{ marginBottom: "15px" }}>
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
