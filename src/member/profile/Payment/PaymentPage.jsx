import React, { Fragment, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Chip, Paper, Typography } from "@material-ui/core";
// import jwt_decode from "jwt-decode";
import Service from "../../../AxiosService";
import Cookies from "js-cookie";
import MemberNavBar from "../../MemberNavBar";
import PageTitle from "../../../components/PageTitle";

const useStyles = makeStyles((theme) => ({
  heading: {
    height: "70px",
    backgroundColor: "#437FC7",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "65px",
  },
  dataGrid: {
    backgroundColor: "#fff",
    "@global": {
      ".MuiDataGrid-row": {
        // cursor: "pointer",
      },
    },
  },
  paper: {
    padding: theme.spacing(5),
    marginBottom: "30px",
    display: "flex",
    flexDirection: "column",
  },
  pro: {
    backgroundColor: theme.palette.primary.main,
    color: "#FFFFFF",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    fontSize: 16,
  },
  free: {
    backgroundColor: "  #F7DF1E",
    color: "#000",
    marginLeft: "8px",
    padding: "0px 3px",
    letterSpacing: "0.5px",
    borderRadius: "9px",
    fontSize: 16,
  },
}));

const Payment = () => {
  const classes = useStyles();
  const [allTransactions, setAllTransactions] = useState([]);
  const [latestTransactionForPro, setLatestTransactionForPro] = useState();

  const [loggedIn, setLoggedIn] = useState(false);

  const checkIfLoggedIn = () => {
    if (Cookies.get("t1")) {
      setLoggedIn(true);
    }
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const getTransactionData = async () => {
    Service.client
      .get("/consultations/member/payments")
      .then((res) => {
        // console.log(res);
        let arr = res.data;

        Service.client
          .get(`auth/membership-subscriptions`)
          .then((res) => {
            // console.log(res.data);
            for (let i = 0; i < res.data.length; i++) {
              arr.push(res.data[i]);
            }
            // console.log(arr);
            setAllTransactions(arr);
          })
          .catch((err) => console.log(err));
        // setAllTransactions(res.data);
      })
      .catch((error) => {
        // setAllTransactions(null);
      });

    Service.client
      .get(`/auth/membership-subscriptions`, {
        params: { latest: 1 },
      })
      .then((res) => {
        // console.log(res);
        if (res.data.payment_transaction.payment_status === "COMPLETED") {
          const futureDate = new Date(res.data.expiry_date);
          const currentDate = new Date();
          const diffTime = futureDate - currentDate;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 29) {
            // check = false;
            setLatestTransactionForPro(res.data);
          }
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(allTransactions);

  useEffect(() => {
    getTransactionData();
  }, [setAllTransactions]);

  const formatStatus = (status) => {
    if (status !== "Payment") {
      return "green";
    }
  };

  const formatDateToReturnWithoutTime = (date) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (date !== null) {
      const newDate = new Date(date).toLocaleDateString(undefined, options);
      // const newDateTime = new Date(date).toLocaleTimeString("en-SG");
      // console.log(newDate);
      return newDate;
    }
    return "";
  };

  const transactionColumns = [
    { field: "id", headerName: "Transaction ID", width: 200 },
    {
      field: "date",
      headerName: "Payment Date",
      type: "date",
      width: 250,
    },
    {
      field: "pay_for",
      headerName: "Pay For",
      width: 200,
    },
    {
      field: "expiry_date",
      headerName: "Expires On",
      // valueFormatter: (params) => formatDateToReturnWithoutTime(params.value),
      width: 150,
    },
    {
      field: "title",
      headerName: "Consultation Title",
      width: 250,
    },
    {
      field: "consultation_date",
      headerName: "Consultation Date",
      type: "date",
      width: 220,
    },
    {
      field: "partner",
      headerName: "Instructor",
      width: 200,
    },

    {
      field: "type",
      headerName: "Transaction Type",
      renderCell: (params) => (
        <div variant="body2" style={{ color: formatStatus(params.value) }}>
          {params.value}
        </div>
      ),
      width: 170,
    },
    {
      field: "debit",
      headerName: "Debit",
      renderCell: (params) =>
        params.value && <div variant="body2">${params.value}</div>,
      width: 120,
    },
    {
      field: "credit",
      headerName: "Credit",
      renderCell: (params) =>
        params.value && (
          <div style={{ color: "green" }} variant="body2">
            ${params.value}
          </div>
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

  const transactionRows = [...allTransactions];

  for (var h = 0; h < allTransactions.length; h++) {
    transactionRows[h].title = allTransactions[h].consultation
      ? allTransactions[h].consultation_slot.title
      : "-";
    transactionRows[h].partner = allTransactions[h].consultation_slot
      ? allTransactions[h].consultation_slot.partner_name
      : "-";

    transactionRows[h].pay_for = allTransactions[h].consultation_slot
      ? "Consultation"
      : "Pro-Tier Membership";

    transactionRows[h].expiry_date = allTransactions[h].expiry_date
      ? formatDateToReturnWithoutTime(allTransactions[h].expiry_date)
      : "-";

    transactionRows[h].consultation_date = allTransactions[h].consultation_slot
      ? formatDate(allTransactions[h].consultation_slot.start_time)
      : "-";

    transactionRows[h].date = formatDate(
      allTransactions[h].payment_transaction.timestamp
    );

    if (allTransactions[h].payment_transaction.payment_status === "COMPLETED") {
      transactionRows[h].type = "Payment";
      transactionRows[h].debit =
        allTransactions[h].payment_transaction.payment_amount;
    } else {
      transactionRows[h].type = "Refund";
      transactionRows[h].credit =
        allTransactions[h].payment_transaction.payment_amount;
    }
  }
  return (
    <Fragment>
      <MemberNavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <div style={{ marginTop: "65px" }}>
        <div
          style={{
            width: "80%",
            paddingTop: "30px",
            margin: "auto",
          }}
        >
          <Paper className={classes.paper}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <Typography
                variant="h6"
                style={{ fontWeight: 600, paddingRight: "10px" }}
              >
                Current Tier:
              </Typography>
              {latestTransactionForPro ? (
                <Chip
                  label="PRO"
                  style={{ backgroundColor: "#437FC7", color: "#fff" }}
                  size="small"
                />
              ) : (
                <Chip
                  label="FREE"
                  style={{ backgroundColor: "#F7DF1E", color: "#000" }}
                  size="small"
                />
              )}
            </div>

            <Typography
              variant="h6"
              style={{ fontWeight: 600, paddingBottom: "5px" }}
            >
              Paid On:{" "}
              <span style={{ fontWeight: 500 }}>
                {latestTransactionForPro
                  ? formatDateToReturnWithoutTime(
                      latestTransactionForPro.payment_transaction.timestamp
                    )
                  : "-"}
              </span>
            </Typography>
            <Typography
              variant="h6"
              style={{ fontWeight: 600, paddingBottom: "5px" }}
            >
              Paid By:{" "}
              <span style={{ fontWeight: 500 }}>
                {latestTransactionForPro
                  ? latestTransactionForPro.payment_transaction.payment_type
                  : "-"}
              </span>
            </Typography>
            <Typography
              variant="h6"
              style={{ fontWeight: 600, paddingBottom: "5px" }}
            >
              Pro-Tier Membership Expires On:{" "}
              <span style={{ fontWeight: 500 }}>
                {latestTransactionForPro
                  ? formatDateToReturnWithoutTime(
                      latestTransactionForPro.expiry_date
                    )
                  : "-"}
              </span>
            </Typography>
          </Paper>
          <PageTitle title="Past Transactions" />
          <div style={{ height: "500px", width: "100%", marginBottom: "25px" }}>
            <DataGrid
              className={classes.dataGrid}
              rows={transactionRows}
              columns={transactionColumns.map((column) => ({
                ...column,
              }))}
              pageSize={10}
              disableSelectionOnClick
              /*{onRowClick={(e) => handleClickOpenMember(e)}}*/
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Payment;
