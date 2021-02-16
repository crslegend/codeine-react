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
import ViewAllCourses from "./member/course/ViewAllCourses";

const App = () => {
  return (
    <Switch>
      <LandingPageRoute
        exact
        path="/partner"
        render={() => <ContentProviderLanding />}
        user="partner"
      />
      <PrivateRoute
        path="/partner/home"
        render={() => <ContentProviderHome />}
        user="partner"
      />
      <LandingPageRoute
        exact
        path="/partner/login"
        render={() => <ContentProviderLoginPage />}
        user="partner"
      />
      <LandingPageRoute
        exact
        path="/partner/register"
        render={() => <ContentProviderRegisterPage />}
        user="partner"
      />
      <Route exact path="/" component={MemberLandingPage} />
      <Route exact path="/courses" component={ViewAllCourses} />
      <PrivateRoute
        path="/member/home"
        render={() => <MemberDashboard />}
        user="member"
      />
      <Route exact path="/member/login" component={MemberLoginPage} />
      <Route exact path="/member/register" component={MemberRegisterPage} />
      <Route exact path="/industry" component={IndustryLanding} />
      <Route exact path="/admin/login" component={AdminLoginPage} />
      <PrivateRoute path="/admin" component={AdminRoutesPage} user="admin" />
      <Route exact path="/admin/humanresource" component={AdminRoutesPage} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default App;
