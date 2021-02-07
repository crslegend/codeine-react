import React from "react";
// import "./App.css";
import { Redirect, Route, Switch } from "react-router-dom";
import MemberLandingPage from "./member/landing/MemberLandingPage";
import MemberRegisterPage from "./member/auth/MemberRegisterPage";
import MemberLoginPage from "./member/auth/MemberLoginPage";
import IndustryLanding from "./industrypartner/landing/IndustryLanding";
import ContentProviderLanding from "./contentprovider/LandingPage/ContentProviderLanding";
import AdminLoginPage from "./admin/auth/AdminLoginPage";
import AdminRoutesPage from "./admin/AdminRoutesPage";
import MemberDashboard from "./member/profile/MemberDashboard";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NotFound from "./components/NotFound";
import ContentProviderHome from "./contentprovider/ContentProviderHome";
import ContentProviderLoginPage from "./contentprovider/auth/ContentProviderLoginPage";
import ContentProviderRegisterPage from "./contentprovider/auth/ContentProviderRegisterPage";

const App = () => {
  return (
    <Switch>
      <Route
        exact
        path="/content-provider"
        component={ContentProviderLanding}
      />
      <PrivateRoute
        exact
        path="/content-provider/dashboard"
        component={ContentProviderHome}
        user="content-provider"
      />
      <Route
        exact
        path="/content-provider/login"
        component={ContentProviderLoginPage}
      />
      <Route
        exact
        path="/content-provider/register"
        component={ContentProviderRegisterPage}
      />
      <Route exact path="/" component={MemberLandingPage} />
      <PrivateRoute
        exact
        path="/member"
        render={() => <MemberDashboard />}
        user="member"
      />
      <Route exact path="/member/login" component={MemberLoginPage} />
      <Route exact path="/member/register" component={MemberRegisterPage} />
      <Route exact path="/industry" component={IndustryLanding} />
      <Route exact path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminRoutesPage} />
      <Route exact path="/admin/humanresource" component={AdminRoutesPage} />

      <Route component={NotFound} />
    </Switch>
  );
};

export default App;
