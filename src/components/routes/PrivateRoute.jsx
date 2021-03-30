import React from "react";
import { Route, useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const PrivateRoute = ({ render, path, user, ...rest }) => {
  const history = useHistory();

  const redirect = () => {
    history.push(`/${user}/login`);
    history.go();
  };
  return Cookies.get("t1") ? (
    <Route path={path} render={render} {...rest} />
  ) : (
    redirect()
  );
};

export default PrivateRoute;
