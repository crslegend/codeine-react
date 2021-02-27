import React from "react";
// import "./App.css";
import { Route, Switch } from "react-router-dom";
import MemberLandingPage from "./member/landing/MemberLandingPage";
import MemberRegisterPage from "./member/auth/MemberRegisterPage";
import MemberLoginPage from "./member/auth/MemberLoginPage";
import ContentProviderLanding from "./contentprovider/LandingPage/ContentProviderLanding";
import AdminLoginPage from "./admin/auth/AdminLoginPage";
import AdminRoutesPage from "./admin/AdminRoutesPage";
import MemberHome from "./member/profile/MemberRoutesPage";
import PrivateRoute from "./components/PrivateRoute.jsx";
import NotFound from "./components/NotFound";
import ContentProviderHome from "./contentprovider/ContentProviderRoutes";
import ContentProviderLoginPage from "./contentprovider/auth/ContentProviderLoginPage";
import ContentProviderRegisterPage from "./contentprovider/auth/ContentProviderRegisterPage";
import LandingPageRoute from "./components/LandingPageRoute";
import ViewAllCourses from "./member/course/ViewAllCourses";
import ViewCourseDetails from "./member/course/ViewCourseDetails";
import EnrollCourse from "./member/course/EnrollCourse";
import BookConsult from "./member/course/BookConsult";
import PaymentSuccess from "./components/PaymentSuccess";
import ResetPassword from "./resetPassword/ResetPasswordPage";
import NewPassword from "./resetPassword/NewPasswordPage";
import AdminRoute from "./components/AdminRoute";
import PartnerRoute from "./components/PartnerRoute";
import MemberRoute from "./components/MemberRoute";
import MemberAndPublicRoute from "./components/MemberAndPublicRoute";

const App = () => {
  return (
    <Switch>
      <LandingPageRoute
        exact
        path="/partner"
        render={() => <ContentProviderLanding />}
        user="partner"
      />
      <PartnerRoute
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
      <MemberAndPublicRoute exact path="/" component={MemberLandingPage} />
      <MemberAndPublicRoute exact path="/courses" component={ViewAllCourses} />
      <MemberAndPublicRoute
        exact
        path="/courses/:id"
        strict
        sensitive
        component={ViewCourseDetails}
      />
      <MemberRoute
        exact
        path="/courses/enroll/:id"
        strict
        sensitive
        component={EnrollCourse}
      />
      <MemberRoute
        exact
        path="/courses/enroll/consultation/:id"
        strict
        sensitive
        component={BookConsult}
      />
      <PrivateRoute
        path="/member/home"
        render={() => <MemberHome />}
        user="member"
      />
      <Route exact path="/member/login" component={MemberLoginPage} />
      <Route exact path="/member/register" component={MemberRegisterPage} />
      {/* <Route exact path="/industry" component={IndustryLanding} /> */}
      <Route exact path="/admin/login" component={AdminLoginPage} />
      <AdminRoute path="/admin" component={AdminRoutesPage} user="admin" />
      <Route exact path="/admin/humanresource" component={AdminRoutesPage} />
      <Route path="/payment/success" component={PaymentSuccess} />
      <Route
        exact
        path="/resetPassword/:id"
        strict
        sensitive
        component={ResetPassword}
      />
      <Route path="/reset-password" component={NewPassword} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default App;
