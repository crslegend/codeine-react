import React from "react";
// import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import MemberLandingPage from "./member/landing/MemberLandingPage";
import IndustryLanding from "./industrypartner/IndustryLanding";
import ContentProviderLanding from "./contentprovider/ContentProviderLanding";

const App = () => {
  return (
    <Switch>
      <Route
        exact
        path="/content-provider"
        component={ContentProviderLanding}
      />
      <Route exact path="/member" component={MemberLandingPage} />
      <Route exact path="/industry" component={IndustryLanding} />
      <Redirect from="/" to="/member" />
    </Switch>
  );
};

export default App;
