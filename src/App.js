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
import LandingPageRoute from "./components/LandingPageRoute";

const App = () => {
  return (
    <Switch>
      <LandingPageRoute
        exact
        path="/content-provider"
        render={() => <ContentProviderLanding />}
        user="content-provider"
      />
      <PrivateRoute
        path="/content-provider/home"
        render={() => <ContentProviderHome />}
        user="content-provider"
      />
      <LandingPageRoute
        exact
        path="/content-provider/login"
        render={() => <ContentProviderLoginPage />}
        user="content-provider"
      />
      <LandingPageRoute
        exact
        path="/content-provider/register"
        render={() => <ContentProviderRegisterPage />}
        user="content-provider"
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
