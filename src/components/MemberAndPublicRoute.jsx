import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import Service from "../AxiosService";
import jwt_decode from "jwt-decode";
import { CircularProgress } from "@material-ui/core";

const MemberAndPublicRoute = ({ render, path, ...rest }) => {
  const [auth, setAuth] = useState();
  const [user, setUser] = useState();
  const checkUser = () => {
    // console.log("CHECKING");
    if (Cookies.get("t1")) {
      const decoded = jwt_decode(Cookies.get("t1"));
      Service.client
        .get(`/auth/members/${decoded.user_id}`)
        .then((res) => {
          console.log(res);
          if (res.data.member) {
            setAuth(true);
            setUser("member");
          } else {
            setAuth(false);
            if (res.data.partner) {
              setUser("partner");
            } else {
              setUser("admin");
            }
          }
        })
        .catch((err) => {
          setAuth(false);
          // return <Redirect to={`/404`} />;
        });
    } else {
      //   console.log("HELLO");
      setAuth(true);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  console.log(user);

  if (Cookies.get("t1") && (auth === undefined || user === undefined)) {
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
    ) : user === "partner" ? (
      <Redirect to={`/partner/home`} />
    ) : (
      <Redirect to={`/admin`} />
    )
  ) : (
    <Route path={path} render={render} {...rest} />
  );
};

export default MemberAndPublicRoute;
