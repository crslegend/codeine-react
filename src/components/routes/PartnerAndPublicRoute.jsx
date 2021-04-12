import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Service from "../../AxiosService";
import jwt_decode from "jwt-decode";
import { CircularProgress } from "@material-ui/core";

const PartnerAndPublicRoute = ({ render, path, ...rest }) => {
  //   const [auth, setAuth] = useState();
  const [user, setUser] = useState();
  const checkUser = () => {
    // console.log("CHECKING");
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/partners/${decoded.user_id}`)
        .then((res) => {
          console.log(res);
          if (res.data.member) {
            // setAuth(true);
            setUser("member");
          } else {
            // setAuth(false);

            setUser("partner");
          }
        })
        .catch((err) => {
          // token t1 and t2 expire
          //   Service.removeCredentials();
          //   setAuth(true);
          //   setUser("non-logged");
          // return <Redirect to={`/404`} />;
        });
    } else {
      //   console.log("HELLO");
      //   setAuth(true);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  console.log(user);

  if (Cookies.get("t1") && user === undefined) {
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
    user && user === "partner" ? (
      <Redirect to={`/partner/home`} />
    ) : (
      <Route path={path} render={render} {...rest} />
    )
  ) : (
    <Route path={path} render={render} {...rest} />
  );
};

export default PartnerAndPublicRoute;
