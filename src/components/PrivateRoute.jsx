import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ render, path, ...rest }) => {
  return Cookies.get("t1") ? (
    <Route path={path} render={render} {...rest} />
  ) : (
    <Redirect to={`${path}/login`} />
  );
};

export default PrivateRoute;
