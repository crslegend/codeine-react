import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import { CircularProgress } from "@material-ui/core";

const PartnerRoute = ({ render, path, user, ...rest }) => {
  const [auth, setAuth] = useState();
  const checkUser = () => {
    // console.log("CHECKING");
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/partners/${decoded.user_id}`)
        .then((res) => {
          if (res.data.partner) {
            setAuth(true);
          } else {
            setAuth(false);
          }
        })
        .catch((err) => {
          // token t1 and t2 expire
          Service.removeCredentials();
          setAuth(true);
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

export default PartnerRoute;
