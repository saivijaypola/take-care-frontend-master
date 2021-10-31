import React from "react";
import { Redirect } from "react-router-dom";
//Guest
import Home from '../pages/Home/index'
import Services from '../pages/Home/Services'
import Solutions from '../pages/Home/Solutions'
import SignIn from "../pages/Auth/SignIn";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Login from "../pages/Auth/Login";
import Join from "../pages/Auth/Join";
import SignUp from "../pages/Auth/SignUp";
import NewProfile from "../pages/Auth/Profile";
import ProfileBasic from "../pages/Auth/ProfileBasic"
import Success from "../pages/Auth/Success"
import Where from "../pages/Auth/Where";
import Providers from "../pages/Auth/Providers"
import UserSignup from "../pages/Auth/UserSignup"
import ProviderSignUp from "../pages/Auth/ProviderSignUp";
import Invite from "../pages/Recommend/Invite";
import Thanks from "../pages/Recommend/Thanks";
import Logout from '../pages/Auth/Logout'
import Dashboard from "../pages/Dashboard";
import PageComingSoon from "../pages/Utils/PageComingSoon";
import YoCoSafe from "../pages/YoCoSafe";
import DigitalId from "../pages/Provider/DigitalId";
import Settings from "../pages/Provider/Settings";
//Login User
import Profile from '../pages/Profile/index';
import ProfileUser from '../pages/UserProfile/index';
import UserProfile from '../pages/User/UserProfile';
import UserOrders from '../pages/User/UserOrders';
import PaymentFlow from '../pages/User/PaymentFlow';
import CarePaymentFlow from '../pages/User/CarePaymentFlow';
import Notifications from '../pages/User/Notifications';
import ProviderListing from '../pages/User/ProviderListing';
import ProviderListingTimeLine from '../pages/User/ProviderListingTimeLine';
import ProviderOrders from "../pages/Request/ProviderOrders";
import Wallet from "../pages/Request/Wallet";
import WalletDetails from "../pages/Request/WalletDetails";
import NewRequest from '../pages/User/NewRequest';
import PreRequest from '../pages/User/PreRequest';
import RequestOptions from '../pages/Home/RequestOptions';
import NewQuote from '../pages/Request/NewQuote';
import NewCareQuote from '../pages/Request/NewCareQuote';

import NewPost from '../pages/User/NewPost';
import Verify from '../pages/Verify/index';
import ProviderResources from '../pages/Resources/Provider/Provider';
import UserResources from '../pages/Resources/User/User';
import User from "../pages/User";
import ProviderProfile from '../pages/Provider/index';

import ProviderDetails from '../pages/User/ProviderDetails';
import ProviderRequests from '../pages/Request';
import RequestDetails from '../pages/Provider/requestDetails'

import Subscriptions from '../pages/Subscriptions/Subscriptions'
import Delight from '../pages/Delight/Delight'
import DelightItem from '../pages/Delight/DelightItem'
import DelightConfirm from '../pages/Delight/DelightConfirm'
import DelightSuccess from '../pages/Delight/DelightSuccess'
import HamperSuccess from '../pages/Delight/HamperSuccess'
import PostSuccess from '../pages/User/PostSuccess'
import SubSuccess from '../pages/Subscriptions/SubSuccess'
import SubNext from '../pages/User/SubNext'
import CareDetails from '../pages/User/CareDetails'
import CareDetailsNew from '../pages/User/CareDetailsNew'
import CareProviderDetails from '../pages/User/CareProviderDetails'
import BuildDelight from '../pages/Delight/BuildDelight'
import QuoteSuccess from "../pages/Request/QuoteSuccess";
import CareQuoteSuccess from "../pages/Request/CareQuoteSuccess";
import Timeline from "../pages/Provider/Timeline";
import CareTimeline from "../pages/Provider/CareTimeline";
import UpdateOrder from "../pages/Provider/UpdateOrder";

//Admin Pages 
import AdminProviderList from "../pages/Admin/AdminProviderList"
import { AdminUserRequest } from "../pages/Admin/AdminUserRequest";
import AdminProviderDetails from "../pages/Admin/AdminProviderDetails";
import ProviderListByRequest from "../pages/Admin/ProviderListByRequest";
import { AddNewPackage } from "../pages/Admin/Packages/AddNewPackage";
import { PackagesProvider } from "../pages/Admin/Packages/PackagesProvider";
import { CarePackage } from "../pages/Admin/Packages/CarePackage";
import { AddNewCare } from "../pages/Admin/Packages/AddNewCare";
import { UpdateCareProvider } from "../pages/Admin/Packages/UpdateCareProvider"
import RenewalSuccess from "../components/Shared/CareRenewal/RenewalSucess";
import AdminProviderProfile from '../pages/Admin/UserProfile/index';

const publicRoutes = [

    //{ path: "/sign-in", component: SignIn },


    { path: "/sign-in", component: Login },
    { path: "/join", component: Join },
    { path: "/sign-in/hamper", component: Login },
    { path: "/signup", component: SignUp },
    { path: "/YoCoBuddy", component: Where },

    { path: "/YoCoCare", component: Subscriptions },
    { path: "/delight/:id", component: DelightItem },
    { path: "/YoCoDelights", component: Delight },
    { path: "/build-delight", component: BuildDelight },
    { path: "/delight-success", component: DelightSuccess },
    { path: "/hamper-success", component: HamperSuccess },
    { path: "/post-success", component: PostSuccess },
    { path: "/subscription-success", component: SubSuccess },
    { path: "/delight-confirm", component: DelightConfirm },
    { path: "/providers", component: Providers },
    { path: "/profile", component: ProfileBasic },
    { path: "/success", component: Success },
    { path: "/profile-full", component: NewProfile },
    { path: "/user-signup", component: UserSignup },
    { path: "/forgetpassword", component: ForgotPassword },
    { path: "/logout", component: Logout },
    { path: "/provider-signup", component: ProviderSignUp },
    { path: "/home", component: Home },
    { path: "/services", component: Services },
    { path: "/solutions", component: Solutions },
    { path: "/YoCoSafe", component: YoCoSafe },
    { path: "/pre-request", component: RequestOptions },
    { path: "/invite/:inviteId", component: Invite },
    { path: "/invitation/thanks/", component: Thanks },
    { path: "/provider/digitalid/:serviceorderid", component: DigitalId },
    { path: "/legal/resources/pubprovider/:tabId", component: ProviderResources },
    { path: "/legal/resources/pubuser/:tabId", component: UserResources },
    { path: "/provider/update-order/:requestid/:userId", component: UpdateOrder },
    { path: "/provider/timeline/:requestid/:userId", component: Timeline },
    { path: "/provider/care-timeline/:careid/:careOrderId", component: CareTimeline },
];

const authProtectedRoutes = [
    { path: "/send-quote-success/:requestid/:userId", component: QuoteSuccess },
    { path: "/send-care-quote-success/:requestid/:userId", component: CareQuoteSuccess },
    { path: "/send-quote/:requestid/:userId", component: NewQuote },
    { path: "/send-care-quote/:requestid/:userId", component: NewCareQuote },
    { path: "/provider-details/:requestid/:providerid", component: ProviderDetails },
    { path: "/provider-details/:requestid/:providerid/:chat", component: ProviderDetails },
    { path: "/provider-info/:requestid/:providerid", component: ProviderDetails },
    { path: "/provider-info/:requestid/:providerid/:chat", component: ProviderDetails },
    { path: "/provider/profile", component: Profile },
    { path: "/user/profile", component: ProfileUser },
    { path: "/notifications", component: Notifications },
    { path: "/provider/requests", component: ProviderRequests },
    { path: "/provider/settings", component: Settings },
    { path: "/provider/request-details/:requestid/:userId", component: RequestDetails },
    { path: "/care-renew-success/:requestid/:careid", component: RenewalSuccess },


    { path: "/provider/request-info/:requestid/:userId", component: RequestDetails },
    { path: "/verify", component: Verify },
    { path: "/provider/dashboard", component: () => <Redirect to="/provider/requests" /> },
    { path: "/legal/resources/provider/:tabId", component: ProviderResources },
    { path: "/legal/resources/user/:tabId", component: UserResources },
    { path: "/user/new-request/:requestid", component: NewRequest },
    { path: "/provider/orders/:providerid", component: ProviderOrders },
    { path: "/provider/wallet/:providerid", component: Wallet },
    { path: "/provider/walletdetails/:providerid", component: WalletDetails },
    { path: "/user/new-request", component: PreRequest },
    { path: "/user/new-post/:requestid", component: NewPost },
    { path: "/user/new-post", component: NewPost },
    { path: "/user/requests", component: UserProfile },
    { path: "/user/orders", component: UserOrders },
    { path: "/user/payment/:requestid/:providerid", component: PaymentFlow },
    { path: "/user/care-payment/:requestid/:careid", component: CarePaymentFlow },
    { path: "/user/providers/:requestid/:type", component: ProviderListing },


    // yoco Care 
    { path: "/subscription-next/:requestid", component: SubNext },
    { path: "/care-details/:requestid/:careid", component: CareDetails },
    { path: "/care-details-new/:requestid/:careid", component: CareDetailsNew },
    { path: "/care-provider-details/:requestid/:careid", component: CareProviderDetails },




    //Admin Section 
    { path: "/admin/all-providers", component: AdminProviderList },
    { path: "/admin/provider-profile-edit/:userid", component: AdminProviderProfile },
    { path: "/admin/all/user/request", component: AdminUserRequest },
    { path: "/admin/provider-profile-edit/:userid", component: AdminProviderProfile },
    { path: "/admin/request/providers/:requestid/:lat/:lng", component: ProviderListByRequest },
    { path: "/admin/provider-details/:requestid/:providerid", component: AdminProviderDetails },
    { path: "/admin/new-package/:careid/:requestid/:currency", component: AddNewPackage },
    { path: "/admin/package-provider/:careid/:requestid", component: PackagesProvider },
    { path: "/admin/care-package/:requestid", component: CarePackage },
    { path: "/admin/new-care/:requestid", component: AddNewCare },
    { path: "/admin/update-careprovider/:careid/:requestid/:currency", component: UpdateCareProvider },




    { path: "/", exact: true, component: () => <Redirect to="/home" /> },

];



export { publicRoutes, authProtectedRoutes };