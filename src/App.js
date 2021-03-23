import React from "react";
// import "./App.css";
import { Route, Switch } from "react-router-dom";
import MemberDashboardPage from "./member/profile/Dashboard/DashboardPage";
import MemberLandingPage from "./member/landing/MemberLandingPage";
import MemberRegisterPage from "./member/auth/MemberRegisterPage";
import MemberLoginPage from "./member/auth/MemberLoginPage";
import ViewArticlePage from "./member/article/ArticleMain";
import MemberArticlePage from "./member/article/MemberArticleList";
import MemberCoursePage from "./member/profile/Courses/CoursesPage";
import MemberConsultationPage from "./member/profile/Consultation/ConsultationPage";
import MemberProfilePage from "./member/profile/Profile/ProfilePage";
import MemberPasswordPage from "./member/profile/Password/PasswordPage";
import MemberEditArticlePage from "./member/article/EditArticle";
import MemberPaymentPage from "./member/profile/Payment/PaymentPage";
import ContentProviderLanding from "./contentprovider/LandingPage/ContentProviderLanding";
import AdminLoginPage from "./admin/auth/AdminLoginPage";
import AdminRoutesPage from "./admin/AdminRoutesPage";
import PrivateRoute from "./components/Routes/PrivateRoute.jsx";
import NotFound from "./components/NotFound";
import ContentProviderHome from "./contentprovider/ContentProviderRoutes";
import ContentProviderLoginPage from "./contentprovider/auth/ContentProviderLoginPage";
import ContentProviderRegisterPage from "./contentprovider/auth/ContentProviderRegisterPage";
import LandingPageRoute from "./components/Routes/LandingPageRoute";
import ViewAllCourses from "./member/course/ViewAllCourses";
import ViewCourseDetails from "./member/course/ViewCourseDetails";
import EnrollCourse from "./member/course/EnrollCourse";
import BookConsult from "./member/course/BookConsult";
import PaymentSuccess from "./components/PaymentSuccess";
import ResetPassword from "./resetPassword/ResetPasswordPage";
import NewPassword from "./resetPassword/NewPasswordPage";
import PublicProfile from "./member/profile/Profile/PublicProfile";
import Activation from "./resetPassword/ActivationPage";
import AdminRoute from "./components/Routes/AdminRoute";
import PartnerRoute from "./components/Routes/PartnerRoute";
import MemberRoute from "./components/Routes/MemberRoute";
import MemberAndPublicRoute from "./components/Routes/MemberAndPublicRoute";
import PartnerAndPublicRoute from "./components/Routes/PartnerAndPublicRoute";
import ViewCodeReviewDetails from "./codereview/ViewCodeReviewDetails";
import ViewAllCodeReviews from "./codereview/ViewAllCodeReviews";

const App = () => {
  return (
    <Switch>
      <Route exact path="/codereview" component={ViewAllCodeReviews} />
      <Route path="/codereview/:id" component={ViewCodeReviewDetails} />
      <PartnerAndPublicRoute
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
      <LandingPageRoute
        exact
        path="/member/login"
        component={MemberLoginPage}
        user="member"
      />
      <LandingPageRoute
        exact
        path="/member/register"
        component={MemberRegisterPage}
        user="member"
      />
      <Route
        exact
        path="/article/:id"
        strict
        sensitive
        component={ViewArticlePage}
      />
      <PrivateRoute
        exact
        path="/member/dashboard"
        component={MemberDashboardPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/articles"
        component={MemberArticlePage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/courses"
        component={MemberCoursePage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/consultations"
        component={MemberConsultationPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/profile"
        component={MemberProfilePage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/profile/changepassword"
        component={MemberPasswordPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/payment"
        component={MemberPaymentPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/article/edit/:id"
        component={MemberEditArticlePage}
        user="member"
      />
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
      <Route exact path="/member/profile/:id" component={PublicProfile} />
      <Route path="/reset-password" component={NewPassword} />
      <Route exact path="/verify/:id" strict sensitive component={Activation} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default App;
