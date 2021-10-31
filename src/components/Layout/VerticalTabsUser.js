import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Button } from '@material-ui/core';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        height: "auto",
        margin: "10vh 0"
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(parseInt(props.tabId));

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="Help" {...a11yProps(0)} />
                {/* <Tab label="Getting Started" {...a11yProps(1)} />
                <Tab label="Managing your Profile" {...a11yProps(2)} />
                <Tab label="How to maximize your benefit" {...a11yProps(3)} /> */}
                <Tab label="Privacy policy" {...a11yProps(4)} />
                <Tab label="Terms and conditions" {...a11yProps(5)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <h1><strong><strong>We are here to help!</strong></strong></h1>
                <p>Call Us @ +917899840331<br></br>
                    Email Us : care@yocoservices.com<br></br><br></br><br></br></p>
                    {/* For General FAQ on How to get Started
Watch our Video tutorials</p>
                <div>
                    <Button className="text-muted" onClick={() => setValue(1)}>Getting Started</Button>|
<Button className="text-muted" onClick={() => setValue(2)}>Managing your profile</Button>|
<Button className="text-muted" onClick={() => setValue(3)}>How to maximize your benefit</Button>
                </div>      */}
                </TabPanel>
            {/* <TabPanel value={value} index={1} style={{ width: "100%" }}>

                <iframe width="100%" height="500" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                    src="https://www.youtube.com/embed/_NJ-NWnbbe4" />
            </TabPanel>
            <TabPanel value={value} index={2} style={{ width: "100%" }}>
                <iframe width="100%" height="500" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                    src="https://www.youtube.com/embed/_NJ-NWnbbe4" />
            </TabPanel>
            <TabPanel value={value} index={3} style={{ width: "100%" }}>
                <iframe width="100%" height="500" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                    src="https://www.youtube.com/embed/_NJ-NWnbbe4" />
            </TabPanel> */}
            <TabPanel value={value} index={1} className="tabscroll">
                <p dir="ltr">
                    Privacy Policy
</p>
                <p dir="ltr">
                    Last updated: August 24, 2020
</p>
                <p dir="ltr">
                    This Privacy Policy describes Our policies and procedures on the
                    collection, use and disclosure of Your information when You use the Service
                    and tells You about Your privacy rights and how the law protects You.
</p>
                <p dir="ltr">
                    We use Your Personal data to provide and improve the Service. By using the
                    Service, You agree to the collection and use of information in accordance
                    with this Privacy Policy.
</p>
                <p dir="ltr">
                    <h1>Interpretation and Definitions</h1>
                </p>
                <h2 dir="ltr">
                    Interpretation
</h2>
                <p dir="ltr">
                    The words of which the initial letter is capitalized have meanings defined
                    under the following conditions. The following definitions shall have the
                    same meaning regardless of whether they appear in singular or in plural.
</p>
                <h2 dir="ltr">
                    Definitions
</h2>
                <p dir="ltr">
                    For the purposes of this Privacy Policy:
</p>
                <p dir="ltr">
                    Account means a unique account created for You to access our Service or
                    parts of our Service.
</p>
                <p dir="ltr">
                    Business, for the purpose of the CCPA (California Consumer Privacy Act),
                    refers to the Company as the legal entity that collects Consumers' personal
                    information and determines the purposes and means of the processing of
                    Consumers' personal information, or on behalf of which such information is
                    collected and that alone, or jointly with others, determines the purposes
                    and means of the processing of consumers' personal information, that does
                    business in the State of California.
</p>
                <p dir="ltr">
                    Company (referred to as either "the Company", "We", "Us" or "Our" in this
                    Agreement) refers to YoCo LLC, 16192 Coastal Highway, Lewes, Delaware,
                    19958.
</p>
                <p dir="ltr">
                    For the purpose of the GDPR, the Company is the Data Controller.
</p>
                <p dir="ltr">
                    Consumer, for the purpose of the CCPA (California Consumer Privacy Act),
                    means a natural person who is a California resident. A resident, as defined
                    in the law, includes (1) every individual who is in the USA for other than
                    a temporary or transitory purpose, and (2) every individual who is
                    domiciled in the USA who is outside the USA for a temporary or transitory
                    purpose.
</p>
                <p dir="ltr">
                    Cookies are small files that are placed on Your computer, mobile device or
                    any other device by a website, containing the details of Your browsing
                    history on that website among its many uses.
</p>
                <p dir="ltr">
                    Country refers to: Delaware, United States
</p>
                <p dir="ltr">
                    Data Controller, for the purposes of the GDPR (General Data Protection
                    Regulation), refers to the Company as the legal person which alone or
                    jointly with others determines the purposes and means of the processing of
                    Personal Data.
</p>
                <p dir="ltr">
                    Device means any device that can access the Platform such as a computer, a cellphone or a digital tablet.
</p>
                <p dir="ltr">
                    Goods refer to the items offered for sale on the Platform.

</p>
                <p dir="ltr">
                    Service Providers refer to the individuals signed up with our platform to provide a service.
</p>
                <p dir="ltr">
                    Orders mean a request by You to purchase Services from our Providers.
</p>
                <p dir="ltr">
                    Platform refers to the Website.
</p>
                <p dir="ltr">
                    Do Not Track (DNT) is a concept that has been promoted by US regulatory
                    authorities, in particular the U.S. Federal Trade Commission (FTC), for the
                    Internet industry to develop and implement a mechanism for allowing
                    internet users to control the tracking of their online activities across
                    websites.
</p>
                <p dir="ltr">
                    Facebook Fan Page is a public profile named YoCo Services specifically
                    created by the Company on the Facebook social network, accessible from
    <a href="https://www.facebook.com/YoCo-Services-113423320431903">
                        https://www.facebook.com/YoCo-Services-113423320431903
    </a>
                </p>
                <p dir="ltr">
                    Personal Data is any information that relates to an identified or
                    identifiable individual.
</p>
                <p dir="ltr">
                    For the purposes for GDPR, Personal Data means any information relating to
                    You such as a name, an identification number, location data, online
                    identifier or to one or more factors specific to the physical,
                    physiological, genetic, mental, economic, cultural or social identity.
</p>
                <p dir="ltr">
                    For the purposes of the CCPA, Personal Data means any information that
                    identifies, relates to, describes or is capable of being associated with,
                    or could reasonably be linked, directly or indirectly, with You.
</p>
                <p dir="ltr">
                    Sale, for the purpose of the CCPA (California Consumer Privacy Act), means
                    selling, renting, releasing, disclosing, disseminating, making available,
                    transferring, or otherwise communicating orally, in writing, or by
                    electronic or other means, a Consumer's Personal information to another
                    business or a third party for monetary or other valuable consideration.
</p>
                <p dir="ltr">
                    Service refers to the Website.
</p>
                <p dir="ltr">
                    Service Provider means any natural or legal person who processes the data
                    on behalf of the Company. It refers to third-party companies or individuals
                    employed by the Company to facilitate the Service, to provide the Service
                    on behalf of the Company, to perform services related to the Service or to
                    assist the Company in analyzing how the Service is used. For the purpose of
                    the GDPR, Service Providers are considered Data Processors.
</p>
                <p dir="ltr">
                    Third-party Social Media Service refers to any website or any social
                    network website through which a User can log in or create an account to use
                    the Service.
</p>
                <p dir="ltr">
                    Usage Data refers to data collected automatically, either generated by the
                    use of the Service or from the Service infrastructure itself (for example,
                    the duration of a page visit).
</p>
                <p dir="ltr">
                    Website refers to YoCo, accessible from    <a href="http://www.yocoservices.com">http://www.yocoservices.com</a>
                </p>
                <p dir="ltr">
                    You means the individual accessing or using the Service, or the company, or
                    other legal entity on behalf of which such individual is accessing or using
                    the Service, as applicable.
</p>
                <p dir="ltr">
                    Under GDPR (General Data Protection Regulation), You can be referred to as
                    the Data Subject or as the User as you are the individual using the
                    Service.
</p>
                <p dir="ltr">
                    <h1>Collecting and Using Your Personal Data</h1>
                </p>
                <h2 dir="ltr">
                    Types of Data Collected
</h2>
                <h3 dir="ltr">
                    Personal Data
</h3>
                <p dir="ltr">
                    While using Our Service, We may ask You to provide Us with certain
                    personally identifiable information that can be used to contact or identify
                    You. Personally identifiable information may include, but is not limited
                    to:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            Email address
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            First name and last name
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Phone number
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Address, State, Province, ZIP/Postal code, City
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Bank account information in order to pay for products and/or
                            services within the Service
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Usage Data
        </p>
                    </li>
                </ul>
                <p dir="ltr">
                    When You pay for a product and/or a service via bank transfer, We may ask
                    You to provide information to facilitate this transaction and to verify
                    Your identity. Such information may include, without limitation:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            Date of birth
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Passport or National ID card
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Bank card statement
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Other information linking You to an address
        </p>
                    </li>
                </ul>
                <h3 dir="ltr">
                    Usage Data
</h3>
                <p dir="ltr">
                    Usage Data is collected automatically when using the Service.
</p>
                <p dir="ltr">
                    Usage Data may include information such as Your Device's Internet Protocol
                    address (e.g. IP address), browser type, browser version, the pages of our
                    Service that You visit, the time and date of Your visit, the time spent on
                    those pages, unique device identifiers and other diagnostic data.
</p>
                <p dir="ltr">
                    When You access the Service by or through a mobile device, We may collect
                    certain information automatically, including, but not limited to, the type
                    of mobile device You use, Your mobile device unique ID, the IP address of
                    Your mobile device, Your mobile operating system, the type of mobile
                    Internet browser You use, unique device identifiers and other diagnostic
                    data.
</p>
                <p dir="ltr">
                    We may also collect information that Your browser sends whenever You visit
                    our Service or when You access the Service by or through a mobile device.
</p>
                <h3 dir="ltr">
                    Information from Third-Party Social Media Services
</h3>
                <p dir="ltr">
                    The Company allows You to create an account and log in to use the Service
                    through the following Third-party Social Media Services:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            Google
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Facebook
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Twitter
        </p>
                    </li>
                </ul>
                <p dir="ltr">
                    If You decide to register through or otherwise grant us access to a
                    Third-Party Social Media Service, We may collect Personal data that is
                    already associated with Your Third-Party Social Media Service's account,
                    such as Your name, Your email address, Your activities or Your contact list
                    associated with that account.
</p>
                <p dir="ltr">
                    You may also have the option of sharing additional information with the
                    Company through Your Third-Party Social Media Service's account. If You
                    choose to provide such information and Personal Data, during registration
                    or otherwise, You are giving the Company permission to use, share, and
                    store it in a manner consistent with this Privacy Policy.
</p>
                <h3 dir="ltr">
                    Tracking Technologies and Cookies
</h3>
                <p dir="ltr">
                    We use Cookies and similar tracking technologies to track the activity on
                    Our Service and store certain information. Tracking technologies used are
                    beacons, tags, and scripts to collect and track information and to improve
                    and analyze Our Service.
</p>
                <p dir="ltr">
                    You can instruct Your browser to refuse all Cookies or to indicate when a
                    Cookie is being sent. However, if You do not accept Cookies, You may not be
                    able to use some parts of our Service.
</p>
                <p dir="ltr">
                    Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain
                    on your personal computer or mobile device when You go offline, while
                    Session Cookies are deleted as soon as You close your web browser. Learn
more about cookies:    <a href="https://www.termsfeed.com/blog/cookies/">All About Cookies</a>.
</p>
                <p dir="ltr">
                    We use both session and persistent Cookies for the purposes set out below:
</p>
                <p dir="ltr">
                    Necessary / Essential Cookies
</p>
                <p dir="ltr">
                    Type: Session Cookies
</p>
                <p dir="ltr">
                    Administered by: Us
</p>
                <p dir="ltr">
                    Purpose: These Cookies are essential to provide You with services available
                    through the Website and to enable You to use some of its features. They
                    help to authenticate users and prevent fraudulent use of user accounts.
                    Without these Cookies, the services that You have asked for cannot be
                    provided, and We only use these Cookies to provide You with those services.
</p>
                <p dir="ltr">
                    Cookies Policy / Notice Acceptance Cookies
</p>
                <p dir="ltr">
                    Type: Persistent Cookies
</p>
                <p dir="ltr">
                    Administered by: Us
</p>
                <p dir="ltr">
                    Purpose: These Cookies identify if users have accepted the use of cookies
                    on the Website.
</p>
                <p dir="ltr">
                    Functionality Cookies
</p>
                <p dir="ltr">
                    Type: Persistent Cookies
</p>
                <p dir="ltr">
                    Administered by: Us
</p>
                <p dir="ltr">
                    Purpose: These Cookies allow us to remember choices You make when You use
                    the Website, such as remembering your login details or language preference.
                    The purpose of these Cookies is to provide You with a more personal
                    experience and to avoid You having to re-enter your preferences every time
                    You use the Website.
</p>
                <p dir="ltr">
                    Tracking and Performance Cookies
</p>
                <p dir="ltr">
                    Type: Persistent Cookies
</p>
                <p dir="ltr">
                    Administered by: Third-Parties
</p>
                <p dir="ltr">
                    Purpose: These Cookies are used to track information about traffic to the
                    Website and how users use the Website. The information gathered via these
                    Cookies may directly or indirectly identify you as an individual visitor.
                    This is because the information collected is typically linked to a
                    pseudonymous identifier associated with the device you use to access the
                    Website. We may also use these Cookies to test new pages, features or new
                    functionality of the Website to see how our users react to them.
</p>
                <p dir="ltr">
                    For more information about the cookies we use and your choices regarding
                    cookies, please visit our Cookies Policy or the Cookies section of our
                    Privacy Policy.
</p>
                <h2 dir="ltr">
                    Use of Your Personal Data
</h2>
                <p dir="ltr">
                    The Company may use Personal Data for the following purposes:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            To provide and maintain our Service, including to monitor the usage
                            of our Service.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            To manage Your Account: to manage Your registration as a user of
                            the Service. The Personal Data You provide can give You access to
                            different functionalities of the Service that are available to You
                            as a registered user.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            For the performance of a contract: the development, compliance and
                            undertaking of the purchase contract for the products, items or
                            services You have purchased or of any other contract with Us
                            through the Service.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            To contact You: To contact You by email, telephone calls, SMS, or
                            other equivalent forms of electronic communication, such as a
                            mobile application's push notifications regarding updates or
                            informative communications related to the functionalities, products
                            or contracted services, including the security updates, when
                            necessary or reasonable for their implementation.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            To provide You with news, special offers and general information
                            about other goods, services and events which we offer that are
                            similar to those that you have already purchased or enquired about
                            unless You have opted not to receive such information.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            To manage Your requests: To attend and manage Your requests to Us.
        </p>
                    </li>
                </ul>
                <p dir="ltr">
                    We may share your personal information in the following situations:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            With Service Providers: We may share Your personal information with
                            Service Providers to monitor and analyze the use of our Service,
                            for payment processing, to contact You.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            For Business transfers: We may share or transfer Your personal
                            information in connection with, or during negotiations of, any
                            merger, sale of Company assets, financing, or acquisition of all or
                            a portion of our business to another company.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            With Affiliates: We may share Your information with Our affiliates,
                            in which case we will require those affiliates to honor this
                            Privacy Policy. Affiliates include Our parent company and any other
                            subsidiaries, joint venture partners or other companies that We
                            control or that are under common control with Us.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            With Business partners: We may share Your information with Our
                            business partners to offer You certain products, services or
                            promotions.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            With other users: when You share personal information or otherwise
                            interact in the public areas with other users, such information may
                            be viewed by all users and may be publicly distributed outside. If
                            You interact with other users or register through a Third-Party
                            Social Media Service, Your contacts on the Third-Party Social Media
                            Service may see Your name, profile, pictures and description of
                            Your activity. Similarly, other users will be able to view
                            descriptions of Your activity, communicate with You and view Your
                            profile.
        </p>
                    </li>
                </ul>
                <h2 dir="ltr">
                    Retention of Your Personal Data
</h2>
                <p dir="ltr">
                    The Company will retain Your Personal Data only for as long as is necessary
                    for the purposes set out in this Privacy Policy. We will retain and use
                    Your Personal Data to the extent necessary to comply with our legal
                    obligations (for example, if we are required to retain your data to comply
                    with applicable laws), resolve disputes, and enforce our legal agreements
                    and policies.
</p>
                <p dir="ltr">
                    The Company will also retain Usage Data for internal analysis purposes.
                    Usage Data is generally retained for a shorter period of time, except when
                    this data is used to strengthen the security or to improve the
                    functionality of Our Service, or We are legally obligated to retain this
                    data for longer time periods.
</p>
                <h2 dir="ltr">
                    Transfer of Your Personal Data
</h2>
                <p dir="ltr">
                    Your information, including Personal Data, is processed at the Company's
                    operating offices and in any other places where the parties involved in the
                    processing are located. It means that this information may be transferred
                    to — and maintained on — computers located outside of Your state, province,
                    country or other governmental jurisdiction where the data protection laws
                    may differ than those from Your jurisdiction.
</p>
                <p dir="ltr">
                    Your consent to this Privacy Policy followed by Your submission of such
                    information represents Your agreement to that transfer.
</p>
                <p dir="ltr">
                    The Company will take all steps reasonably necessary to ensure that Your
                    data is treated securely and in accordance with this Privacy Policy and no
                    transfer of Your Personal Data will take place to an organization or a
                    country unless there are adequate controls in place including the security
                    of Your data and other personal information.
</p>
                <h2 dir="ltr">
                    Disclosure of Your Personal Data
</h2>
                <h3 dir="ltr">
                    Business Transactions
</h3>
                <p dir="ltr">
                    If the Company is involved in a merger, acquisition or asset sale, Your
                    Personal Data may be transferred. We will provide notice before Your
                    Personal Data is transferred and becomes subject to a different Privacy
                    Policy.
</p>
                <h3 dir="ltr">
                    Law enforcement
</h3>
                <p dir="ltr">
                    Under certain circumstances, the Company may be required to disclose Your
                    Personal Data if required to do so by law or in response to valid requests
                    by public authorities (e.g. a court or a government agency).
</p>
                <h3 dir="ltr">
                    Other legal requirements
</h3>
                <p dir="ltr">
                    The Company may disclose Your Personal Data in the good faith belief that
                    such action is necessary to:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            Comply with a legal obligation
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Protect and defend the rights or property of the Company
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Prevent or investigate possible wrongdoing in connection with the
                            Service
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Protect the personal safety of Users of the Service or the public
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Protect against legal liability
        </p>
                    </li>
                </ul>
                <h2 dir="ltr">
                    Security of Your Personal Data
</h2>
                <p dir="ltr">
                    The security of Your Personal Data is important to Us, but remember that no
                    method of transmission over the Internet, or method of electronic storage
                    is 100% secure. While We strive to use commercially acceptable means to
                    protect Your Personal Data, We cannot guarantee its absolute security.
</p>
                <p dir="ltr">
                    <h1>Detailed Information on the Processing of Your Personal Data</h1>
                </p>
                <p dir="ltr">
                    Service Providers have access to Your Personal Data only to perform their
                    tasks on Our behalf and are obligated not to disclose or use it for any
                    other purpose.
</p>
                <h2 dir="ltr">
                    Analytics
</h2>
                <p dir="ltr">
                    We may use third-party Service providers to monitor and analyze the use of
                    our Service.
</p>
                <p dir="ltr">
                    Google Analytics
</p>
                <p dir="ltr">
                    Google Analytics is a web analytics service offered by Google that tracks
                    and reports website traffic. Google uses the data collected to track and
                    monitor the use of our Service. This data is shared with other Google
                    services. Google may use the collected data to contextualize and
                    personalize the ads of its own advertising network.
</p>
                <p dir="ltr">
                    You can opt-out of having made your activity on the Service available to
                    Google Analytics by installing the Google Analytics opt-out browser add-on.
                    The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js
                    and dc.js) from sharing information with Google Analytics about visits
                    activity.
</p>
                <p dir="ltr">
                    For more information on the privacy practices of Google, please visit the
                    Google Privacy &amp; Terms web page:
    <a href="https://policies.google.com/privacy">
                        https://policies.google.com/privacy
    </a>
                </p>
                <p dir="ltr">
                    Firebase
</p>
                <p dir="ltr">
                    Firebase is an analytics service provided by Google Inc.
</p>
                <p dir="ltr">
                    You may opt-out of certain Firebase features through your mobile device
                    settings, such as your device advertising settings or by following the
                    instructions provided by Google in their Privacy Policy:
    <a href="https://policies.google.com/privacy">
                        https://policies.google.com/privacy
    </a>
                </p>
                <p dir="ltr">
                    We also encourage you to review the Google's policy for safeguarding your
                    data:
    <a href="https://support.google.com/analytics/answer/6004245">
                        https://support.google.com/analytics/answer/6004245
    </a>
                </p>
                <p dir="ltr">
                    For more information on what type of information Firebase collects, please
                    visit the Google Privacy &amp; Terms web page:
    <a href="https://policies.google.com/privacy">
                        https://policies.google.com/privacy
    </a>
                </p>
                <p dir="ltr">
                    Clicky
</p>
                <p dir="ltr">
                    Clicky is a web analytics service. Read the Privacy Policy for Clicky here:    <a href="https://clicky.com/terms">https://clicky.com/terms</a>
                </p>
                <p dir="ltr">
                    Flurry Analytics
</p>
                <p dir="ltr">
                    Flurry Analytics service is provided by Yahoo! Inc.
</p>
                <p dir="ltr">
                    You can opt-out from Flurry Analytics service to prevent Flurry Analytics
                    from using and sharing your information by visiting the Flurry's Opt-out
                    page:
    <a href="https://developer.yahoo.com/flurry/end-user-opt-out/">
                        https://developer.yahoo.com/flurry/end-user-opt-out/
    </a>
                </p>
                <p dir="ltr">
                    For more information on the privacy practices and policies of Yahoo!,
                    please visit their Privacy Policy page:
    <a href="https://policies.yahoo.com/xa/en/yahoo/privacy/index.htm">
                        https://policies.yahoo.com/xa/en/yahoo/privacy/index.htm
    </a>
                </p>
                <p dir="ltr">
                    Unity Analytics
</p>
                <p dir="ltr">
                    Unity Analytics is provided by Unity Technologies.
</p>
                <p dir="ltr">
                    For more information on what type of information Unity Analytics collects,
                    please visit their Privacy Policy page:
    <a href="https://unity3d.com/legal/privacy-policy">
                        https://unity3d.com/legal/privacy-policy
    </a>
                </p>
                <h2 dir="ltr">
                    Email Marketing
</h2>
                <p dir="ltr">
                    We may use Your Personal Data to contact You with newsletters, marketing or
                    promotional materials and other information that may be of interest to You.
                    You may opt-out of receiving any, or all, of these communications from Us
                    by following the unsubscribe link or instructions provided in any email We
                    send or by contacting Us.
</p>
                <p dir="ltr">
                    We may use Email Marketing Service Providers to manage and send emails to
                    You.
</p>
                <p dir="ltr">
                    SendGrid
</p>
                <p dir="ltr">
                    Their Privacy Policy can be viewed at
    <a href="https://www.twilio.com/legal/privacy">
                        https://www.twilio.com/legal/privacy
    </a>
                </p>
                <h2 dir="ltr">
                    Payments
</h2>
                <p dir="ltr">
                    We may provide paid products and/or services within the Service. In that
                    case, we may use third-party services for payment processing (e.g. payment
                    processors).
</p>
                <p dir="ltr">
                    We will not store or collect Your payment card details. That information is
                    provided directly to Our third-party payment processors whose use of Your
                    personal information is governed by their Privacy Policy. These payment
                    processors adhere to the standards set by PCI-DSS as managed by the PCI
                    Security Standards Council, which is a joint effort of brands like Visa,
                    Mastercard, American Express and Discover. PCI-DSS requirements help ensure
                    the secure handling of payment information.
</p>
                <p dir="ltr">
                    PayPal
</p>
                <p dir="ltr">
                    Their Privacy Policy can be viewed at
    <a href="https://www.paypal.com/webapps/mpp/ua/privacy-full">
                        https://www.paypal.com/webapps/mpp/ua/privacy-full
    </a>
                </p>
                <p dir="ltr">
                    Braintree
</p>
                <p dir="ltr">
                    Their Privacy Policy can be viewed at
    <a href="https://www.braintreepayments.com/legal/braintree-privacy-policy">
                        https://www.braintreepayments.com/legal/braintree-privacy-policy
    </a>
                </p>
                <p dir="ltr">
                    When You use Our Service to pay a product and/or service via bank transfer,
                    We may ask You to provide information to facilitate this transaction and to
                    verify Your identity.
</p>
                <p dir="ltr">
                    <h1>GDPR Privacy</h1>
                </p>
                <h2 dir="ltr">
                    Legal Basis for Processing Personal Data under GDPR
</h2>
                <p dir="ltr">
                    We may process Personal Data under the following conditions:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            Consent: You have given Your consent for processing Personal Data
                            for one or more specific purposes.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Performance of a contract: Provision of Personal Data is necessary
                            for the performance of an agreement with You and/or for any
                            pre-contractual obligations thereof.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Legal obligations: Processing Personal Data is necessary for
                            compliance with a legal obligation to which the Company is subject.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Vital interests: Processing Personal Data is necessary in order to
                            protect Your vital interests or of another natural person.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Public interests: Processing Personal Data is related to a task
                            that is carried out in the public interest or in the exercise of
                            official authority vested in the Company.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Legitimate interests: Processing Personal Data is necessary for the
                            purposes of the legitimate interests pursued by the Company.
        </p>
                    </li>
                </ul>
                <p dir="ltr">
                    In any case, the Company will gladly help to clarify the specific legal
                    basis that applies to the processing, and in particular whether the
                    provision of Personal Data is a statutory or contractual requirement, or a
                    requirement necessary to enter into a contract.
</p>
                <h2 dir="ltr">
                    Your Rights under the GDPR
</h2>
                <p dir="ltr">
                    The Company undertakes to respect the confidentiality of Your Personal Data
                    and to guarantee You can exercise Your rights.
</p>
                <p dir="ltr">
                    You have the right under this Privacy Policy, and by law if You are within
                    the EU, to:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            Request access to Your Personal Data. The right to access, update
                            or delete the information We have on You. Whenever made possible,
                            you can access, update or request deletion of Your Personal Data
                            directly within Your account settings section. If you are unable to
                            perform these actions yourself, please contact Us to assist You.
                            This also enables You to receive a copy of the Personal Data We
                            hold about You.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Request correction of the Personal Data that We hold about You. You
                            have the right to to have any incomplete or inaccurate information
                            We hold about You corrected.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Object to processing of Your Personal Data. This right exists where
                            We are relying on a legitimate interest as the legal basis for Our
                            processing and there is something about Your particular situation,
                            which makes You want to object to our processing of Your Personal
                            Data on this ground. You also have the right to object where We are
                            processing Your Personal Data for direct marketing purposes.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Request erasure of Your Personal Data. You have the right to ask Us
                            to delete or remove Personal Data when there is no good reason for
                            Us to continue processing it.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Request the transfer of Your Personal Data. We will provide to You,
                            or to a third-party You have chosen, Your Personal Data in a
                            structured, commonly used, machine-readable format. Please note
                            that this right only applies to automated information which You
                            initially provided consent for Us to use or where We used the
                            information to perform a contract with You.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Withdraw Your consent. You have the right to withdraw Your consent
                            on using your Personal Data. If You withdraw Your consent, We may
                            not be able to provide You with access to certain specific
                            functionalities of the Service.
        </p>
                    </li>
                </ul>
                <h2 dir="ltr">
                    Exercising of Your GDPR Data Protection Rights
</h2>
                <p dir="ltr">
                    You may exercise Your rights of access, rectification, cancellation and
                    opposition by contacting Us. Please note that we may ask You to verify Your
                    identity before responding to such requests. If You make a request, We will
                    try our best to respond to You as soon as possible.
</p>
                <p dir="ltr">
                    You have the right to complain to a Data Protection Authority about Our
                    collection and use of Your Personal Data. For more information, if You are
                    in the European Economic Area (EEA), please contact Your local data
                    protection authority in the EEA.
</p>
                <p dir="ltr">
                    <h1>Facebook Fan Page</h1>
                </p>
                <h2 dir="ltr">
                    Data Controller for the Facebook Fan Page
</h2>
                <p dir="ltr">
                    The Company is the Data Controller of Your Personal Data collected while
                    using the Service. As operator of the Facebook Fan Page
    <a href="https://www.facebook.com/YoCo-Services-113423320431903">
                        https://www.facebook.com/YoCo-Services-113423320431903
    </a>
                    , the Company and the operator of the social network Facebook are Joint
                    Controllers.
</p>
                <p dir="ltr">
                    The Company has entered into agreements with Facebook that define the terms
                    for use of the Facebook Fan Page, among other things. These terms are
                    mostly based on the Facebook Terms of Service:
    <a href="https://www.facebook.com/terms.php">
                        https://www.facebook.com/terms.php
    </a>
                </p>
                <p dir="ltr">
                    Visit the Facebook Privacy Policy
    <a href="https://www.facebook.com/policy.php">
                        https://www.facebook.com/policy.php
    </a>
                    for more information about how Facebook manages Personal data or contact
                    Facebook online, or by mail: Facebook, Inc. ATTN, Privacy Operations, 1601
                    Willow Road, Menlo Park, CA 94025, United States.
</p>
                <h2 dir="ltr">
                    Facebook Insights
</h2>
                <p dir="ltr">
                    We use the Facebook Insights function in connection with the operation of
                    the Facebook Fan Page and on the basis of the GDPR, in order to obtain
                    anonymized statistical data about Our users.
</p>
                <p dir="ltr">
                    For this purpose, Facebook places a Cookie on the device of the user
                    visiting Our Facebook Fan Page. Each Cookie contains a unique identifier
                    code and remains active for a period of two years, except when it is
                    deleted before the end of this period.
</p>
                <p dir="ltr">
                    Facebook receives, records and processes the information stored in the
                    Cookie, especially when the user visits the Facebook services, services
                    that are provided by other members of the Facebook Fan Page and services by
                    other companies that use Facebook services.
</p>
                <p dir="ltr">
                    For more information on the privacy practices of Facebook, please visit
                    Facebook Privacy Policy here:
    <a href="https://www.facebook.com/full_data_use_policy">
                        https://www.facebook.com/full_data_use_policy
    </a>
                </p>
                <p dir="ltr">
                    <h1>CCPA Privacy</h1>
                </p>
                <h2 dir="ltr">
                    Your Rights under the CCPA
</h2>
                <p dir="ltr">
                    Under this Privacy Policy, and by law if You are a resident of California,
                    You have the following rights:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            The right to notice. You must be properly notified which categories
                            of Personal Data are being collected and the purposes for which the
                            Personal Data is being used.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            The right to access / the right to request. The CCPA permits You to
                            request and obtain from the Company information regarding the
                            disclosure of Your Personal Data that has been collected in the
                            past 12 months by the Company or its subsidiaries to a third-party
                            for the third party's direct marketing purposes.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            The right to say no to the sale of Personal Data. You also have the
                            right to ask the Company not to sell Your Personal Data to third
                            parties. You can submit such a request by visiting our "Do Not Sell
                            My Personal Information" section or web page.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            The right to know about Your Personal Data. You have the right to
                            request and obtain from the Company information regarding the
                            disclosure of the following:
        </p>
                    </li>
                </ul>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            The categories of Personal Data collected
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            The sources from which the Personal Data was collected
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            The business or commercial purpose for collecting or selling the
                            Personal Data
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Categories of third parties with whom We share Personal Data
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            The specific pieces of Personal Data we collected about You
        </p>
                    </li>
                </ul>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            The right to delete Personal Data. You also have the right to
                            request the deletion of Your Personal Data that have been collected
                            in the past 12 months.
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            The right not to be discriminated against. You have the right not
                            to be discriminated against for exercising any of Your Consumer's
                            rights, including by:
        </p>
                    </li>
                </ul>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            Denying goods or services to You
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Charging different prices or rates for goods or services, including
                            the use of discounts or other benefits or imposing penalties
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Providing a different level or quality of goods or services to You
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Suggesting that You will receive a different price or rate for
                            goods or services or a different level or quality of goods or
                            services.
        </p>
                    </li>
                </ul>
                <h2 dir="ltr">
                    Exercising Your CCPA Data Protection Rights
</h2>
                <p dir="ltr">
                    In order to exercise any of Your rights under the CCPA, and if you are a
                    California resident, You can email or call us or visit our "Do Not Sell My
                    Personal Information" section or web page.
</p>
                <p dir="ltr">
                    The Company will disclose and deliver the required information free of
                    charge within 45 days of receiving Your verifiable request. The time period
                    to provide the required information may be extended once by an additional
                    45 days when reasonable necessary and with prior notice.
</p>
                <h2 dir="ltr">
                    Do Not Sell My Personal Information
</h2>
                <p dir="ltr">
                    We do not sell personal information. However, the Service Providers we
                    partner with (for example, our advertising partners) may use technology on
                    the Service that "sells" personal information as defined by the CCPA law.
</p>
                <p dir="ltr">
                    If you wish to opt out of the use of your personal information for
                    interest-based advertising purposes and these potential sales as defined
                    under CCPA law, you may do so by following the instructions below.
</p>
                <p dir="ltr">
                    Please note that any opt out is specific to the browser You use. You may
                    need to opt out on every browser that you use.
</p>
                <h3 dir="ltr">
                    Website
</h3>
                <p dir="ltr">
                    You can opt out of receiving ads that are personalized as served by our
                    Service Providers by following our instructions presented on the Service:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            From Our "Cookie Consent" notice banner
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Or from Our "CCPA Opt-out" notice banner
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Or from Our "Do Not Sell My Personal Information" notice banner
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            Or from Our "Do Not Sell My Personal Information" link
        </p>
                    </li>
                </ul>
                <p dir="ltr">
                    The opt out will place a cookie on Your computer that is unique to the
                    browser You use to opt out. If you change browsers or delete the cookies
                    saved by your browser, you will need to opt out again.
</p>
                <h3 dir="ltr">
                    Mobile Devices
</h3>
                <p dir="ltr">
                    Your mobile device may give you the ability to opt out of the use of
                    information about the apps you use in order to serve you ads that are
                    targeted to your interests:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            "Opt out of Interest-Based Ads" or "Opt out of Ads Personalization"
                            on Android devices
        </p>
                    </li>
                    <li dir="ltr">
                        <p dir="ltr">
                            "Limit Ad Tracking" on iOS devices
        </p>
                    </li>
                </ul>
                <p dir="ltr">
                    You can also stop the collection of location information from Your mobile
                    device by changing the preferences on your mobile device.
</p>
                <p dir="ltr">
                    <h1>"Do Not Track" Policy as Required by California Online Privacy Protection
                    Act (CalOPPA)</h1>
                </p>
                <p dir="ltr">
                    Our Service does not respond to Do Not Track signals.
</p>
                <p dir="ltr">
                    However, some third party websites do keep track of Your browsing
                    activities. If You are visiting such websites, You can set Your preferences
                    in Your web browser to inform websites that You do not want to be tracked.
                    You can enable or disable DNT by visiting the preferences or settings page
                    of Your web browser.
</p>
                <p dir="ltr">
                    <h1>Your California Privacy Rights (California's Shine the Light law)</h1>
                </p>
                <p dir="ltr">
                    Under California Civil Code Section 1798 (California's Shine the Light
                    law), California residents with an established business relationship with
                    us can request information once a year about sharing their Personal Data
                    with third parties for the third parties' direct marketing purposes.
</p>
                <p dir="ltr">
                    If you'd like to request more information under the California Shine the
                    Light law, and if you are a California resident, You can contact Us using
                    the contact information provided below.
</p>
                <p dir="ltr">
                    <h1>California Privacy Rights for Minor Users (California Business and
                    Professions Code Section 22581)</h1>
                </p>
                <p dir="ltr">
                    California Business and Professions Code section 22581 allow California
                    residents under the age of 18 who are registered users of online sites,
                    services or applications to request and obtain removal of content or
                    information they have publicly posted.
</p>
                <p dir="ltr">
                    To request removal of such data, and if you are a California resident, You
                    can contact Us using the contact information provided below, and include
                    the email address associated with Your account.
</p>
                <p dir="ltr">
                    Be aware that Your request does not guarantee complete or comprehensive
                    removal of content or information posted online and that the law may not
                    permit or require removal in certain circumstances.
</p>
                <p dir="ltr">
                    <h1> Links to Other Websites</h1>
                </p>
                <p dir="ltr">
                    Our Service may contain links to other websites that are not operated by
                    Us. If You click on a third party link, You will be directed to that third
                    party's site. We strongly advise You to review the Privacy Policy of every
                    site You visit.
</p>
                <p dir="ltr">
                    We have no control over and assume no responsibility for the content,
                    privacy policies or practices of any third party sites or services.
</p>
                <p dir="ltr">
                    <h1> Changes to this Privacy Policy</h1>
                </p>
                <p dir="ltr">
                    We may update our Privacy Policy from time to time. We will notify You of
                    any changes by posting the new Privacy Policy on this page.
</p>
                <p dir="ltr">
                    We will let You know via email and/or a prominent notice on Our Service,
                    prior to the change becoming effective and update the "Last updated" date
                    at the top of this Privacy Policy.
</p>
                <p dir="ltr">
                    You are advised to review this Privacy Policy periodically for any changes.
                    Changes to this Privacy Policy are effective when they are posted on this
                    page.
</p>
                <p dir="ltr">
                    <h1>Contact Us</h1>
                </p>
                <p dir="ltr">
                    If you have any questions about this Privacy Policy, You can contact us:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            By email: info@yocoservices.com
        </p>
                    </li>
                </ul>
            </TabPanel>
            <TabPanel value={value} index={2} className="tabscroll">
                <p dir="ltr">
                    Terms and Conditions
</p>
                <p dir="ltr">
                    Last updated: August 24, 2020
</p>
                <p dir="ltr">
                    Please read these terms and conditions carefully before using Our Platform.
</p>
                <p dir="ltr">
                    <h1>Interpretation and Definitions</h1>
                </p>
                <h2 dir="ltr">
                    Interpretation
</h2>
                <p dir="ltr">
                    The words of which the initial letter is capitalized have meanings defined
                    under the following conditions. The following definitions shall have the
                    same meaning regardless of whether they appear in singular or in plural.
</p>
                <h2 dir="ltr">
                    Definitions
</h2>
                <p dir="ltr">
                    For the purposes of these Terms and Conditions:
</p>
                <p dir="ltr">
                    Affiliate means an entity that controls, is controlled by or is under
                    common control with a party, where "control" means ownership of 50% or more
                    of the shares, equity interest or other securities entitled to vote for
                    election of directors or other managing authority.
</p>
                <p dir="ltr">
                    Account means a unique account created for You to access our Platform or
                    parts of our Platform.
</p>
                <p dir="ltr">
                    Country refers to: Delaware, United States
</p>
                <p dir="ltr">
                    Company (referred to as either "the Company", "We", "Us" or "Our" in this
                    Agreement) refers to YoCo LLC, 16192 Coastal Highway, Lewes, Delaware19958.
</p>
                <p dir="ltr">
                    Device means any device that can access the Platform such as a computer, a
                    cellphone or a digital tablet.
</p>
                <p dir="ltr">
                    Goods refer to the items offered for sale on the Platform.
</p>
                <p dir="ltr">
                    Orders mean a request by You to purchase Goods from Us.
</p>
                <p dir="ltr">
                    Platform refers to the Website.
</p>
                <p dir="ltr">
                    Subscriptions refer to the Platforms or access to the Platform offered on a
                    subscription basis by the Company to You.
</p>
                <p dir="ltr">
                    Terms and Conditions (also referred as "Terms") mean these Terms and
                    Conditions that form the entire agreement between You and the Company
                    regarding the use of the Platform.
</p>
                <p dir="ltr">
                    Third-party Social Media Service means any services or content (including
                    data, information, products or services) provided by a third-party that may
                    be displayed, included or made available by the Platform.
</p>
                <p dir="ltr">
                    Website refers to YoCo , accessible from    <a href="http://www.yocoservices.com">http://www.yocoservices.com</a>
                </p>
                <p dir="ltr">
                    You means the individual accessing or using the Platform, or the company,
                    or other legal entity on behalf of which such individual is accessing or
                    using the Platform, as applicable.
</p>
                <p dir="ltr">
                    <h1>Acknowledgment</h1>
                </p>
                <p dir="ltr">
                    These are the Terms and Conditions governing the use of this Platform and
                    the agreement that operates between You and the Company. These Terms and
                    Conditions set out the rights and obligations of all users regarding the
                    use of the Platform.
</p>
                <p dir="ltr">
                    Your access to and use of the Platform is conditioned on Your acceptance of
                    and compliance with these Terms and Conditions. These Terms and Conditions
                    apply to all visitors, users and others who access or use the Platform.
</p>
                <p dir="ltr">
                    By accessing or using the Platform You agree to be bound by these Terms and
                    Conditions. If You disagree with any part of these Terms and Conditions
                    then You may not access the Platform.
</p>
                <p dir="ltr">
                    You represent that you are over the age of 18. The Company does not permit
                    those under 18 to use the Platform.
</p>
                <p dir="ltr">
                    Your access to and use of the Platform is also conditioned on Your
                    acceptance of and compliance with the Privacy Policy of the Company. Our
                    Privacy Policy describes Our policies and procedures on the collection, use
                    and disclosure of Your personal information when You use the Application or
                    the Website and tells You about Your privacy rights and how the law
                    protects You. Please read Our Privacy Policy carefully before using Our
                    Platform.
</p>
                <p dir="ltr">
                    <h1>Placing Orders for Services</h1>
                </p>
                <p dir="ltr">
                    By placing an Order for Services through the Platform, You warrant that
                    You are legally capable of entering into binding contracts.

</p>
                <h2 dir="ltr">
                    Your Information
</h2>
                <p dir="ltr">
                    If You wish to place an Order for Services available on the Platform,
                    You may be asked to supply certain information relevant to Your Order
                    including, without limitation, Your name, Your email, Your phone number,
                    Your credit card number, the expiration date of Your credit card,
                    Your billing address, and Your address at which the service need to be provided.

</p>
                <p dir="ltr">
                    You represent and warrant that: (i) You have the legal right to use any
                    credit or debit card(s) or other payment method(s) in connection with any
                    Order; and that (ii) the information You supply to us is true, correct and
                    complete.
</p>
                <p dir="ltr">
                    By submitting such information, You grant us the right to provide the
                    information to payment processing third parties for purposes of
                    facilitating the completion of Your Order.
</p>
                <h2 dir="ltr">
                    Placing an Order
</h2>
                <p dir="ltr">
                    YoCo LLC is solely maintaining an online platform website for the purpose
                    of allowing User to interact with Service Providers to customize and
                    price to the User’s request. User is to accept or reject any order placed
                    by the service provider. This is purely between service provider and User.
                    YoCo LLC is operating only as a platform. Once an order is completed,
                    User agrees that it will approve or reject within 48 hours. Otherwise,
                    User agrees that after 48 hours the order will be automatically approved
                    and payment will be released to the Service Provider.

</p>
                <h2 dir="ltr">
                    Not a substitute for professional services
</h2>
                <p dir="ltr">
                    User agrees that participating in YoCo LLC’s online platform is not an excuse
                    for professional medical and healthcare advice and services.
                    User acknowledges that YoCo LLC is merely providing a platform in which
                    the User may be connected to other Service Providers.
                    YoCo LLC does not make any guarantee regarding the services of the provider
                    and User agrees that YoCo LLC shall not be held liable in any way relating
                    to the Service Provider’s services.

</p>
                <h2 dir="ltr">Correspondence and information sharing</h2>
                <p dir="ltr">
                    Requesting or providing Email addresses, Skype/IM usernames, telephone numbers or
                    any other personal contact details to communicate outside of the platform in order
                    to circumvent or abuse the platform’s messaging system or the platform in general
                    is not permitted. Users are not permitted to contact the service providers outside
                    of the online platform’s system and sign any contract, agreement, and/or legal document.
                    Any form of contact information cannot be exchanged between the User and the
                    service provider until an order is agreed and paid by the User. In some cases
                    due to complexity of the service the Users may want to discuss t he service with
                    the provider. In these cases, the User will be required to pay a small service
                    fee in order for the contact information to be shared and proceed with the
                    consultation with the Service Provider.

</p>
                <h2 dir="ltr">Disclosure Authorization</h2>
                <p dir="ltr">
                    User hereby authorizes YoCo LLC and its contractors and/or agents, including but
                    not limited to any service providers listed on the YoCo LLC online platform,
                    to use or disclose specific information, including but not limited to
                    confidential information, mental health, psychiatric information,
                    HIV information, alcohol/drug information, healthcare appointment dates
                    and times, medical or psychiatric diagnosis, medical testing of any
                    kind, x-ray results, prescriptions, medications, lab tests and results,
                    summar(ies) of medical record(s), healthcare plans, medical reports,
                    records. charts. notes, nurses' notes, x-ray reports, MRI reports,
                    itemized bills, and any other specific information, including all health
                    and/or psychiatric private information. Information used or disclosed
                    pursuant to this authorization may be subject to re-disclosure by service
                    providers and may n o longer be protected by the Health Insurance Portability
                    and Accountability Act (HIPAA) or any other comparable law.  User
                    consents that the recipient may further disclose the specified information
                    to others as n ecessary to investigate and evaluate User’s request and
                    healthcare service, and that the health information
                    may no longer be protected.
</p>
                <h2 dir="ltr">Refunds, disputes and cancellations</h2>
                <p dir="ltr">
                    YoCo LLC does not refund payments made for any User orders. Funds from order cancellations
                    must be requested to the service provider. User must settle any disputes and/or
                    cancellations with the service provider.
</p>
                <p dir="ltr">
                    We reserve the right to refuse or cancel Your Order if fraud or an unauthorized
                    or illegal transaction is suspected.

</p>
                <h2 dir="ltr">Payment disbursement disclosure</h2>
                <p dir="ltr">
                    For most services requested by User, 100% of the amount quoted by the provider will
                    be paid directly to the provider and YoCo LLC will not charge any commission on
                    the transaction. For unique, specialized, or difficult-to-find healthcare services,
                    YoCo LLC may contract through a staffing contractor. In this case, YoCo LLC will
                    take 5% of the amount quoted by the provider and the staffing contractor will take 15%.

</p>
                <h2 dir="ltr">
                    Waiver and release of liability
</h2>
                <p dir="ltr">
                    This Agreement also constitutes a complete release o f any and all rights and waiver
                    of any claims, now existing or in the future, that User may allege against YoCo LLC
                    for the performance of any services requested to service providers on YoCo LLC’s
                    online portal or otherwise associated with YoCo LLC business activities.
                    User expressly acknowledges that YoCo LLC does not provide any professional services whatsoever.
                    This Agreement also constitutes a complete release of any and all rights and
                    waiver of any claims, now existing or in the future, that the User may allege
                    against YoCo LLC as it may relate to this Agreement.  In no event will
                    YoCo. LLC or i ts agents and/or contractors be liable for damages of any
                    kind, under any legal theory, arising out of or in connection with this
                    Agreement, including any direct, indirect, special, incidental,
                    consequential or punitive damages, including but not limited to
                    personal injury, pain and suffering, emotional distress,
                    loss of revenue, loss of profits, loss of business or anticipated savings,
                    loss of use, loss of goodwill, loss of data, and whether caused by
                    tort (including negligence), breach of contract or otherwise, even if
                    foreseeable, and YoCo LLC and its agents assume no liability.
                    In no event will YoCo LLC be liable for any consequential, indirect,
                    exemplary, special, or incidental damages arising from or relating
                    to this Agreement.

</p>
                <h2 dir="ltr">Taxes
</h2>
                <p dir="ltr">
                    User may be charged w ith indirect taxes (such as Sales Tax, VAT or GST) depending
                    on its residency, location a nd any applicable law, in addition to the
                    price shown quoted by the service provider on the YoCo L LC platform site.
                    User agrees that they are responsible to comply with all tax requirements
                    applicable to them, including but not limited to any obligation to deduct
                    or withhold taxes. It is hereby clarified that all prices and fees that
                    appear on the YoCo LLC platform site are the quoted amounts set
                    by the service provider

</p>

                <p dir="ltr">
                    <h1>Subscriptions</h1>
                </p>
                <h2 dir="ltr">
                    Subscription period
</h2>
                <p dir="ltr">
                    The Platform or some parts of the Platform are available only with a paid
                    Subscription. You will be billed in advance on a recurring and periodic
                    basis (such as daily, weekly, monthly or annually), depending on the type
                    of Subscription plan you select when purchasing the Subscription.
</p>
                <p dir="ltr">
                    At the end of each period, Your Subscription will automatically renew under
                    the exact same conditions unless You cancel it or the Company cancels it.
</p>
                <h2 dir="ltr">
                    Subscription cancellations
</h2>
                <p dir="ltr">
                    You may cancel Your Subscription renewal either through Your Account
                    settings page or by contacting the Company. You will not receive a refund
                    for the fees You already paid for Your current Subscription period and You
                    will be able to access the Platform until the end of Your current
                    Subscription period.
</p>
                <h2 dir="ltr">
                    Billing
</h2>
                <p dir="ltr">
                    You shall provide the Company with accurate and complete billing
                    information including full name, address, state, zip code, telephone
                    number, and a valid payment method information.
</p>
                <p dir="ltr">
                    Should automatic billing fail to occur for any reason, the Company will
                    issue an electronic invoice indicating that you must proceed manually,
                    within a certain deadline date, with the full payment corresponding to the
                    billing period as indicated on the invoice.
</p>
                <h2 dir="ltr">
                    Fee Changes
</h2>
                <p dir="ltr">
                    The Company, in its sole discretion and at any time, may modify the
                    Subscription fees. Any Subscription fee change will become effective at the
                    end of the then-current Subscription period.
</p>
                <p dir="ltr">
                    The Company will provide You with reasonable prior notice of any change in
                    Subscription fees to give You an opportunity to terminate Your Subscription
                    before such change becomes effective.
</p>
                <p dir="ltr">
                    Your continued use of the Platform after the Subscription fee change comes
                    into effect constitutes Your agreement to pay the modified Subscription fee
                    amount.
</p>
                <h2 dir="ltr">
                    Refunds
</h2>
                <p dir="ltr">
                    Except when required by law, paid Subscription fees are non-refundable.
</p>
                <p dir="ltr">
                    Certain refund requests for Subscriptions may be considered by the Company
                    on a case-by-case basis and granted at the sole discretion of the Company.
</p>
                <p dir="ltr">
                    <h1>User Accounts</h1>
                </p>
                <p dir="ltr">
                    When You create an account with Us, You must provide Us information that is
                    accurate, complete, and current at all times. Failure to do so constitutes
                    a breach of the Terms, which may result in immediate termination of Your
                    account on Our Platform.
</p>
                <p dir="ltr">
                    You are responsible for safeguarding the password that You use to access
                    the Platform and for any activities or actions under Your password, whether
                    Your password is with Our Platform or a Third-Party Social Media Service.
</p>
                <p dir="ltr">
                    You agree not to disclose Your password to any third party. You must notify
                    Us immediately upon becoming aware of any breach of security or
                    unauthorized use of Your account.
</p>
                <p dir="ltr">
                    You may not use as a username the name of another person or entity or that
                    is not lawfully available for use, a name or trademark that is subject to
                    any rights of another person or entity other than You without appropriate
                    authorization, or a name that is otherwise offensive, vulgar or obscene.
</p>
                <p dir="ltr">
                    <h1>Intellectual Property</h1>
                </p>
                <p dir="ltr">
                    The Platform and its original content (excluding Content provided by You or
                    other users), features and functionality are and will remain the exclusive
                    property of the Company and its licensors.
</p>
                <p dir="ltr">
                    The Platform is protected by copyright, trademark, and other laws of both
                    the Country and foreign countries.
</p>
                <p dir="ltr">
                    Our trademarks and trade dress may not be used in connection with any
                    product or Platform without the prior written consent of the Company.
</p>
                <p dir="ltr">
                    <h1>Links to Other Websites</h1>
                </p>
                <p dir="ltr">
                    Our Platform may contain links to third-party web sites or services that
                    are not owned or controlled by the Company.
</p>
                <p dir="ltr">
                    The Company has no control over, and assumes no responsibility for, the
                    content, privacy policies, or practices of any third party web sites or
                    services. You further acknowledge and agree that the Company shall not be
                    responsible or liable, directly or indirectly, for any damage or loss
                    caused or alleged to be caused by or in connection with the use of or
                    reliance on any such content, goods or services available on or through any
                    such web sites or services.
</p>
                <p dir="ltr">
                    We strongly advise You to read the terms and conditions and privacy
                    policies of any third-party web sites or services that You visit.
</p>
                <p dir="ltr">
                    <h1>Termination</h1>
                </p>
                <p dir="ltr">
                    We may terminate or suspend Your Account immediately, without prior notice
                    or liability, for any reason whatsoever, including without limitation if
                    You breach these Terms and Conditions.
</p>
                <p dir="ltr">
                    Upon termination, Your right to use the Platform will cease immediately. If
                    You wish to terminate Your Account, You may simply discontinue using the
                    Platform.
</p>
                <p dir="ltr">
                    <h1>Limitation of Liability</h1>
                </p>
                <p dir="ltr">
                    Notwithstanding any damages that You might incur, the entire liability of
                    the Company and any of its suppliers under any provision of this Terms and
                    Your exclusive remedy for all of the foregoing shall be limited to the
                    amount actually paid by You through the Platform or 100 USD if You haven't
                    purchased anything through the Platform.
</p>
                <p dir="ltr">
                    To the maximum extent permitted by applicable law, in no event shall the
                    Company or its suppliers be liable for any special, incidental, indirect,
                    or consequential damages whatsoever (including, but not limited to, damages
                    for loss of profits, loss of data or other information, for business
                    interruption, for personal injury, loss of privacy arising out of or in any
                    way related to the use of or inability to use the Platform, third-party
                    software and/or third-party hardware used with the Platform, or otherwise
                    in connection with any provision of this Terms), even if the Company or any
                    supplier has been advised of the possibility of such damages and even if
                    the remedy fails of its essential purpose.
</p>
                <p dir="ltr">
                    Some states do not allow the exclusion of implied warranties or limitation
                    of liability for incidental or consequential damages, which means that some
                    of the above limitations may not apply. In these states, each party's
                    liability will be limited to the greatest extent permitted by law.
</p>
                <p dir="ltr">
                    <h1>"AS IS" and "AS AVAILABLE" Disclaimer</h1>
                </p>
                <p dir="ltr">
                    The Platform is provided to You "AS IS" and "AS AVAILABLE" and with all
                    faults and defects without warranty of any kind. To the maximum extent
                    permitted under applicable law, the Company, on its own behalf and on
                    behalf of its Affiliates and its and their respective licensors and service
                    providers, expressly disclaims all warranties, whether express, implied,
                    statutory or otherwise, with respect to the Service, including all implied
                    warranties of merchantability, fitness for a particular purpose, title and
                    non-infringement, and warranties that may arise out of course of dealing,
                    course of performance, usage or trade practice. Without limitation to the
                    foregoing, the Company provides no warranty or undertaking, and makes no
                    representation of any kind that the Platform will meet Your requirements,
                    achieve any intended results, be compatible or work with any other
                    software, applications, systems or services, operate without interruption,
                    meet any performance or reliability standards or be error free or that any
                    errors or defects can or will be corrected.
</p>
                <p dir="ltr">
                    Without limiting the foregoing, neither the Company nor any of the
                    company's provider makes any representation or warranty of any kind,
                    express or implied: (i) as to the operation or availability of the
                    Platform, or the information, content, and materials or products included
                    thereon; (ii) that the Platform will be uninterrupted or error-free; (iii)
                    as to the accuracy, reliability, or currency of any information or content
                    provided through the Platform; or (iv) that the Platform, its servers, the
                    content, or e-mails sent from or on behalf of the Company are free of
                    viruses, scripts, trojan horses, worms, malware, timebombs or other harmful
                    components.
</p>
                <p dir="ltr">
                    Some jurisdictions do not allow the exclusion of certain types of
                    warranties or limitations on applicable statutory rights of a consumer, so
                    some or all of the above exclusions and limitations may not apply to You.
                    But in such a case the exclusions and limitations set forth in this section
                    shall be applied to the greatest extent enforceable under applicable law.
</p>
                <p dir="ltr">
                    <h1> Governing Law</h1>
                </p>
                <p dir="ltr">
                    The laws of the Country, excluding its conflicts of law rules, shall govern
                    this Terms and Your use of the Platform. Your use of the Application may
                    also be subject to other local, state, national, or international laws.
</p>
                <p dir="ltr">
                    <h1>Disputes Resolution</h1>
                </p>
                <p dir="ltr">
                    If You have any concern or dispute about the Platform, You agree to first
                    try to resolve the dispute informally by contacting the Company.
</p>
                <p dir="ltr"><h1>Arbitration</h1>
                </p>
                <p dir="ltr">In the event of any disputes between the Parties pertaining
                to this Agreement, the Parties shall mutually and in good faith attempt
                to resolve all disputes, claims, suits and actions raised within 15 (Fifteen)
                calendar days from the date when a written notice of such dispute is
                raised by the disputing Party. In the event that such disputes, claims,
                suits a nd actions are not resolved to the mutual satisfaction of
                the Parties within 15 (Fifteen) calendar days, both Parties shall
                mutually appoint 1 (One) arbitrator. The arbitration shall be held
                in the State of Delaware, United States and the decision of the
                arbitrator shall be final and binding on the Parties.
</p>
                <p dir="ltr">
                    <h1>For European Union (EU) Users</h1>
                </p>
                <p dir="ltr">
                    If You are a European Union consumer, you will benefit from any mandatory
                    provisions of the law of the country in which you are resident in.
</p>
                <p dir="ltr">
                    <h1>United States Federal Government End Use Provisions</h1>
                </p>
                <p dir="ltr">
                    If You are a U.S. federal government end user, our Platform is a
                    "Commercial Item" as that term is defined at 48 C.F.R. §2.101.
</p>
                <p dir="ltr">
                    <h1>United States Legal Compliance</h1>
                </p>
                <p dir="ltr">
                    You represent and warrant that (i) You are not located in a country that is
                    subject to the United States government embargo, or that has been
                    designated by the United States government as a "terrorist supporting"
                    country, and (ii) You are not listed on any United States government list
                    of prohibited or restricted parties.
</p>
                <p dir="ltr">
                    <h1>Severability and Waiver</h1>
                </p>
                <h2 dir="ltr">
                    Severability
</h2>
                <p dir="ltr">
                    If any provision of these Terms is held to be unenforceable or invalid,
                    such provision will be changed and interpreted to accomplish the objectives
                    of such provision to the greatest extent possible under applicable law and
                    the remaining provisions will continue in full force and effect.
</p>
                <h2 dir="ltr">
                    Waiver
</h2>
                <p dir="ltr">
                    Except as provided herein, the failure to exercise a right or to require
                    performance of an obligation under this Terms shall not effect a party's
                    ability to exercise such right or require such performance at any time
                    thereafter nor shall be the waiver of a breach constitute a waiver of any
                    subsequent breach.
</p>
                <p dir="ltr">
                    <h1>Translation Interpretation</h1>
                </p>
                <p dir="ltr">
                    These Terms and Conditions may have been translated if We have made them
                    available to You on our Platform. You agree that the original English text
                    shall prevail in the case of a dispute.
</p>
                <p dir="ltr">
                    <h1>Changes to These Terms and Conditions</h1>
                </p>
                <p dir="ltr">
                    We reserve the right, at Our sole discretion, to modify or replace these
                    Terms at any time. If a revision is material We will make reasonable
                    efforts to provide at least 30 days' notice prior to any new terms taking
                    effect. What constitutes a material change will be determined at Our sole
                    discretion.
</p>
                <p dir="ltr">
                    By continuing to access or use Our Platform after those revisions become
                    effective, You agree to be bound by the revised terms. If You do not agree
                    to the new terms, in whole or in part, please stop using the website and
                    the Platform.
</p>
                <p dir="ltr">
                    <h1>Contact Us</h1>
                </p>
                <p dir="ltr">
                    If you have any questions about these Terms and Conditions, You can contact
                    us:
</p>
                <ul>
                    <li dir="ltr">
                        <p dir="ltr">
                            By email: info@yocoservices.com
        </p>
                    </li>
                </ul>
            </TabPanel>

            <TabPanel value={value} index={6}>
                Item Seven
      </TabPanel>
        </div>
    );
}