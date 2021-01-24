import React from "react";
// import "./App.css";
import { Route, Switch } from "react-router-dom";
import MemberLanding from "./member/MemberLanding";

const App = () => {
  return (
    <Switch>
      <Route exact path="/" component={MemberLanding} />
    </Switch>
  );
};

export default App;
