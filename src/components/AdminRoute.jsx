import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import { CircularProgress } from "@material-ui/core";

const AdminRoute = ({ render, path, user, ...rest }) => {
  const [auth, setAuth] = useState();
  const checkUser = () => {
    // console.log("CHECKING");
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/admins/${decoded.user_id}`)
        .then((res) => {
          setAuth(true);
        })
        .catch((err) => {
          setAuth(false);
          // return <Redirect to={`/404`} />;
        });
    } else {
      //   console.log("HELLO");
      return <Redirect to={`/${user}/login`} />;
    }
  };

  useEffect(() => {
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(auth);

  if (Cookies.get("t1") && auth === undefined) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return Cookies.get("t1") ? (
    auth && auth ? (
      <Route path={path} render={render} {...rest} />
    ) : (
      <Redirect to={`/401`} />
    )
  ) : (
    <Redirect to={`/${user}/login`} />
  );
};

export default AdminRoute;
