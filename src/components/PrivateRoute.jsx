import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ render, path, user, ...rest }) => {
  return Cookies.get("t1") ? (
    <Route path={path} render={render} {...rest} />
  ) : (
    <Redirect to={`/${user}/login`} />
  );
};

export default PrivateRoute;
