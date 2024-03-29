import React from "react";
// import "./App.css";
import { Route, Switch } from "react-router-dom";
import MemberDashboardPage from "./member/dropdownMenu/dashboard/DashboardPage";
import MemberLandingPage from "./member/landing/MemberLandingPage";
import MemberRegisterPage from "./member/auth/MemberRegisterPage";
import MemberLoginPage from "./member/auth/MemberLoginPage";
import ViewArticlePage from "./article/ArticleMain";
import EditArticlePage from "./article/EditArticle";
import AllArticlePage from "./article/ViewAllArticles";
import MemberArticlePage from "./member/dropdownMenu/article/MemberArticleList";
import MemberCoursePage from "./member/dropdownMenu/courses/CoursesPage";
import MemberConsultationPage from "./member/dropdownMenu/consultation/ConsultationPage";
import MemberProfilePage from "./member/dropdownMenu/profile/ProfilePage";
import MemberPasswordPage from "./member/dropdownMenu/password/PasswordPage";
import MemberPaymentPage from "./member/dropdownMenu/payment/PaymentPage";
import MemberHelpdeskPage from "./member/dropdownMenu/helpdesk/HelpdeskPage";
import ContentProviderLanding from "./contentProvider/landingPage/ContentProviderLanding";
import AdminLoginPage from "./admin/auth/AdminLoginPage";
import AdminRoutesPage from "./admin/AdminRoutesPage";
import PrivateRoute from "./components/routes/PrivateRoute.jsx";
import NotFound from "./components/NotFound";
import ContentProviderHome from "./contentProvider/ContentProviderRoutes";
import ContentProviderLoginPage from "./contentProvider/auth/ContentProviderLoginPage";
import ContentProviderRegisterPage from "./contentProvider/auth/ContentProviderRegisterPage";
import LandingPageRoute from "./components/routes/LandingPageRoute";
import ViewAllCourses from "./member/course/ViewAllCourses";
import ViewCourseDetails from "./member/course/ViewCourseDetails";
import EnrollCourse from "./member/course/EnrollCourse";
import BookConsult from "./member/course/BookConsult";
import PaymentSuccess from "./components/PaymentSuccess";
import ResetPassword from "./resetPassword/ResetPasswordPage";
import NewPassword from "./resetPassword/NewPasswordPage";
import PublicProfile from "./member/dropdownMenu/profile/PublicProfile";
import Activation from "./resetPassword/ActivationPage";
import AdminRoute from "./components/routes/AdminRoute";
import PartnerRoute from "./components/routes/PartnerRoute";
import MemberRoute from "./components/routes/MemberRoute";
import MemberAndPublicRoute from "./components/routes/MemberAndPublicRoute";
import PartnerAndPublicRoute from "./components/routes/PartnerAndPublicRoute";
import CodeReviewDetails from "./codeReview/CodeReviewDetails";
import ViewAllCodeReviews from "./codeReview/ViewAllCodeReviews";
import ViewAllIndustryProject from "./member/industryProject/ViewAllIndustryProjects";
import ViewIndustryProjectDetails from "./member/industryProject/ViewIndustryProjectDetails";
import IndustryProjectPage from "./member/dropdownMenu/industryProject/IndustryProjectPage";
import AllNotifications from "./notification/ViewAllNotification";
import NotificationDetail from "./notification/NotificationDetail";
import CreateNewTicketPage from "./member/dropdownMenu/helpdesk/CreateNewTicketPage";
import Membership from "./member/membership/Membership";
import ViewSubmittedTicketsPage from "./member/dropdownMenu/helpdesk/ViewSubmittedTicketsPage";
import ViewTicketPage from "./member/dropdownMenu/helpdesk/ViewTicketPage";
import OnlyIDE from "./member/ide/OnlyIDE";

const App = () => {
  return (
    <Switch>
      <Route
        strict
        sensitive
        exact
        path="/article/:id"
        component={ViewArticlePage}
      />
      <Route strict sensitive path="/viewarticles" component={AllArticlePage} />
      {/* <PrivateRoute
        strict
        sensitive
        path="/article/:id"
        component={ViewArticlePage}
      /> */}
      <Route exact path="/codereview" component={ViewAllCodeReviews} />
      <Route path="/codereview/:id" component={CodeReviewDetails} />
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
      <MemberAndPublicRoute
        strict
        sensitive
        path="/courses/language/:id"
        component={ViewAllCourses}
      />
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
      <MemberAndPublicRoute
        exact
        path="/industryprojects"
        component={ViewAllIndustryProject}
      />
      <MemberAndPublicRoute
        exact
        path="/industryprojects/:id"
        component={ViewIndustryProjectDetails}
        strict
        sensitive
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
        path="/partner/articles"
        component={MemberArticlePage}
        user="partner"
      />
      <PrivateRoute
        exact
        path="/admin/articles"
        component={MemberArticlePage}
        user="admin"
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
        path="/member/industryprojects"
        component={IndustryProjectPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/helpdesk"
        component={MemberHelpdeskPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/helpdesk/contact-us"
        component={CreateNewTicketPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/helpdesk/tickets"
        component={ViewSubmittedTicketsPage}
        user="member"
      />
      <PrivateRoute
        strict
        sensitive
        path="/member/helpdesk/tickets/:id"
        component={ViewTicketPage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/member/membership"
        component={Membership}
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
        path="/article/edit/member/:id"
        component={EditArticlePage}
        user="member"
      />
      <PrivateRoute
        exact
        path="/article/edit/partner/:id"
        component={EditArticlePage}
        user="partner"
      />
      <PrivateRoute
        exact
        path="/article/edit/admin/:id"
        component={EditArticlePage}
        user="admin"
      />
      <PrivateRoute
        exact
        path="/member/notifications"
        component={AllNotifications}
        user="member"
      />
      <PrivateRoute
        exact
        path="/partner/notifications"
        component={AllNotifications}
        user="partner"
      />
      <PrivateRoute
        exact
        path="/admin/notifications"
        component={AllNotifications}
        user="admin"
      />
      <PrivateRoute
        exact
        strict
        path="/member/notification/view/:id"
        component={NotificationDetail}
        user="member"
      />
      <PrivateRoute
        exact
        strict
        path="/partner/notification/view/:id"
        component={NotificationDetail}
        user="partner"
      />
      <PrivateRoute
        exact
        strict
        path="/admin/notification/view/:id"
        component={NotificationDetail}
        user="admin"
      />
      <MemberAndPublicRoute
        exact
        path="/ide/:portNum"
        component={OnlyIDE}
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
      <Route exact path="/:id" component={PublicProfile} />
      <Route path="/reset-password" component={NewPassword} />
      <Route exact path="/verify/:id" strict sensitive component={Activation} />
      <Route component={NotFound} />
    </Switch>
  );
};

export default App;
