import React from "react";
import { Route, Redirect } from "react-router-dom";
import Cookies from "js-cookie";

const LandingPageRoute = ({ render, path, user, ...rest }) => {
  return !Cookies.get("t1") ? (
    <Route path={path} render={render} {...rest} />
  ) : user === "member" ? (
    <Redirect to={`/courses`} />
  ) : (
    <Redirect to={`/${user}/home`} />
  );
};

export default LandingPageRoute;
