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
Email Us : care@yocoservices.com<br></br><br></br><br></br>
</p>
{/* For General FAQ on How to get Started
Watch our Video tutorials</p>
<div>
<Button className="text-muted" onClick={() => setValue(1)}>Getting Started</Button>|
<Button className="text-muted" onClick={() => setValue(2)}>Managing your profile</Button>|
<Button className="text-muted" onClick={() => setValue(3)}>How to maximize your benefit</Button>
</div>      */}
</TabPanel>
            {/* <TabPanel value={value} index={1} style={{width: "100%"}}>
                
            <iframe width="100%" height="500" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                    src="https://www.youtube.com/embed/wHvvNHGcslI" />
      </TabPanel>
            <TabPanel value={value} index={2} style={{width: "100%"}}>
            <iframe width="100%" height="500" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                    src="https://www.youtube.com/embed/V9MkwP-uDgE" />
      </TabPanel>
            <TabPanel value={value} index={3} style={{width: "100%"}}>
            <iframe width="100%" height="500" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={"allowFullScreen"} tabIndex='-1'
                                                    src="https://www.youtube.com/embed/wHvvNHGcslI" />
      </TabPanel> */}
            <TabPanel value={value} index={1} className="tabscroll">
                <h1><strong><strong>Privacy Policy</strong></strong></h1>
                <p className="text-muted">Last updated: August 12, 2020</p>
                <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
                <h1>Interpretation and Definitions</h1>
                <h2><strong><strong>Interpretation</strong></strong></h2>
                <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                <h2><strong><strong>Definitions</strong></strong></h2>
                <p>For the purposes of this Privacy Policy:</p>
                <p><strong><strong>Account</strong></strong>&nbsp;means a unique account created for You to access our Service or parts of our Service.</p>
                <p><strong><strong>Company</strong></strong>&nbsp;(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to YoCo LLC, 16192 Coastal Highway, Lewes, Delaware, 19958.</p>
                <p><strong><strong>Cookies</strong></strong>&nbsp;are small files that are placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website among its many uses.</p>
                <p><strong><strong>Country</strong></strong>&nbsp;refers to: Delaware, United States</p>
                <p><strong><strong>Device</strong></strong>&nbsp;means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
                <p><strong><strong>Personal Data</strong></strong>&nbsp;is any information that relates to an identified or identifiable individual.</p>
                <p><strong><strong>Service</strong></strong>&nbsp;refers to the Website.</p>
                <p><strong><strong>Service Provider</strong></strong>&nbsp;means any natural or legal person who processes the data on behalf of the Company. It refers to third-party companies or individuals employed by the Company to facilitate the Service, to provide the Service on behalf of the Company, to perform services related to the Service or to assist the Company in analyzing how the Service is used.</p>
                <p><strong><strong>Third-party Social Media Service</strong></strong>&nbsp;refers to any website or any social network website through which a User can log in or create an account to use the Service.</p>
                <p><strong><strong>Usage Data</strong></strong>&nbsp;refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit).</p>
                <p><strong><strong>Website</strong></strong>&nbsp;refers to YoCo, accessible from <a href="http://www.yocoservices.com">http://www.yocoservices.com</a></p>
                <p><strong><strong>You</strong></strong>&nbsp;means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                <h1>Collecting and Using Your Personal Data</h1>
                <h2><strong><strong>Types of Data Collected</strong></strong></h2>
                <h3><strong><strong>Personal Data</strong></strong></h3>
                <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:</p>
                <ul>
                    <li>Email address</li>
                    <li>First name and last name</li>
                    <li>Phone number</li>
                    <li>Address, State, Province, ZIP/Postal code, City</li>
                    <li>Bank account information in order to pay for products and/or services within the Service</li>
                    <li>Usage Data</li>
                </ul>
                <p>When You pay for a product and/or a service via bank transfer, We may ask You to provide information to facilitate this transaction and to verify Your identity. Such information may include, without limitation:</p>
                <ul>
                    <li>Date of birth</li>
                    <li>Passport or National ID card</li>
                    <li>Bank card statement</li>
                    <li>Other information linking You to an address</li>
                </ul>
                <h3><strong><strong>Usage Data</strong></strong></h3>
                <p>Usage Data is collected automatically when using the Service.</p>
                <p>Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</p>
                <p>When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data.</p>
                <p>We may also collect information that Your browser sends whenever You visit our Service or when You access the Service by or through a mobile device.</p>
                <h3><strong><strong>Information from Third-Party Social Media Services</strong></strong></h3>
                <p>The Company allows You to create an account and log in to use the Service through the following Third-party Social Media Services:</p>
                <ul>
                    <li>Google</li>
                    <li>Facebook</li>
                    <li>Twitter</li>
                </ul>
                <p>If You decide to register through or otherwise grant us access to a Third-Party Social Media Service, We may collect Personal data that is already associated with Your Third-Party Social Media Service's account, such as Your name, Your email address, Your activities or Your contact list associated with that account.</p>
                <p>You may also have the option of sharing additional information with the Company through Your Third-Party Social Media Service's account. If You choose to provide such information and Personal Data, during registration or otherwise, You are giving the Company permission to use, share, and store it in a manner consistent with this Privacy Policy.</p>
                <h3><strong><strong>Tracking Technologies and Cookies</strong></strong></h3>
                <p>We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies used are beacons, tags, and scripts to collect and track information and to improve and analyze Our Service.</p>
                <p>You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent. However, if You do not accept Cookies, You may not be able to use some parts of our Service.</p>
                <p>Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser. Learn more about cookies: <a href="https://www.termsfeed.com/blog/cookies/">All About Cookies</a>.</p>
                <p>We use both session and persistent Cookies for the purposes set out below:</p>
                <p><strong><strong>Necessary / Essential Cookies</strong></strong></p>
                <p>Type: Session Cookies</p>
                <p>Administered by: Us</p>
                <p>Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.</p>
                <p><strong><strong>Cookies Policy / Notice Acceptance Cookies</strong></strong></p>
                <p>Type: Persistent Cookies</p>
                <p>Administered by: Us</p>
                <p>Purpose: These Cookies identify if users have accepted the use of cookies on the Website.</p>
                <p><strong><strong>Functionality Cookies</strong></strong></p>
                <p>Type: Persistent Cookies</p>
                <p>Administered by: Us</p>
                <p>Purpose: These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.</p>
                <p><strong><strong>Tracking and Performance Cookies</strong></strong></p>
                <p>Type: Persistent Cookies</p>
                <p>Administered by: Third-Parties</p>
                <p>Purpose: These Cookies are used to track information about traffic to the Website and how users use the Website. The information gathered via these Cookies may directly or indirectly identify you as an individual visitor. This is because the information collected is typically linked to a pseudonymous identifier associated with the device you use to access the Website. We may also use these Cookies to test new pages, features or new functionality of the Website to see how our users react to them.</p>
                <p>For more information about the cookies we use and your choices regarding cookies, please visit our Cookies Policy or the Cookies section of our Privacy Policy.</p>
                <h2><strong><strong>Use of Your Personal Data</strong></strong></h2>
                <p>The Company may use Personal Data for the following purposes:</p>
                <ul>
                    <li><strong><strong>To provide and maintain our Service</strong></strong>, including to monitor the usage of our Service.</li>
                    <li><strong><strong>To manage Your Account:</strong></strong>to manage Your registration as a user of the Service. The Personal Data You provide can give You access to different functionalities of the Service that are available to You as a registered user.</li>
                    <li><strong><strong>For the performance of a contract:</strong></strong>the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service.</li>
                    <li><strong><strong>To contact You:</strong></strong>To contact You by email, telephone calls, SMS, or other equivalent forms of electronic communication, such as a mobile application's push notifications regarding updates or informative communications related to the functionalities, products or contracted services, including the security updates, when necessary or reasonable for their implementation.</li>
                    <li><strong><strong>To provide You</strong></strong>with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless You have opted not to receive such information.</li>
                    <li><strong><strong>To manage Your requests:</strong></strong>To attend and manage Your requests to Us.</li>
                </ul>
                <p>We may share your personal information in the following situations:</p>
                <ul>
                    <li><strong><strong>With Service Providers:</strong></strong>We may share Your personal information with Service Providers to monitor and analyze the use of our Service, for payment processing, to contact You.</li>
                    <li><strong><strong>For Business transfers:</strong></strong>We may share or transfer Your personal information in connection with, or during negotiations of, any merger, sale of Company assets, financing, or acquisition of all or a portion of our business to another company.</li>
                    <li><strong><strong>With Affiliates:</strong></strong>We may share Your information with Our affiliates, in which case we will require those affiliates to honor this Privacy Policy. Affiliates include Our parent company and any other subsidiaries, joint venture partners or other companies that We control or that are under common control with Us.</li>
                    <li><strong><strong>With Business partners:</strong></strong>We may share Your information with Our business partners to offer You certain products, services or promotions.</li>
                    <li><strong><strong>With other users:</strong></strong>when You share personal information or otherwise interact in the public areas with other users, such information may be viewed by all users and may be publicly distributed outside. If You interact with other users or register through a Third-Party Social Media Service, Your contacts on the Third-Party Social Media Service may see Your name, profile, pictures and description of Your activity. Similarly, other users will be able to view descriptions of Your activity, communicate with You and view Your profile.</li>
                </ul>
                <h2><strong><strong>Retention of Your Personal Data</strong></strong></h2>
                <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
                <p>The Company will also retain Usage Data for internal analysis purposes. Usage Data is generally retained for a shorter period of time, except when this data is used to strengthen the security or to improve the functionality of Our Service, or We are legally obligated to retain this data for longer time periods.</p>
                <h2><strong><strong>Transfer of Your Personal Data</strong></strong></h2>
                <p>Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to &mdash; and maintained on &mdash; computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from Your jurisdiction.</p>
                <p>Your consent to this Privacy Policy followed by Your submission of such information represents Your agreement to that transfer.</p>
                <p>The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy and no transfer of Your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of Your data and other personal information.</p>
                <h2><strong><strong>Disclosure of Your Personal Data</strong></strong></h2>
                <h3><strong><strong>Business Transactions</strong></strong></h3>
                <p>If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>
                <h3><strong><strong>Law enforcement</strong></strong></h3>
                <p>Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency).</p>
                <h3><strong><strong>Other legal requirements</strong></strong></h3>
                <p>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
                <ul>
                    <li>Comply with a legal obligation</li>
                    <li>Protect and defend the rights or property of the Company</li>
                    <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
                    <li>Protect the personal safety of Users of the Service or the public</li>
                    <li>Protect against legal liability</li>
                </ul>
                <h2><strong><strong>Security of Your Personal Data</strong></strong></h2>
                <p>The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to protect Your Personal Data, We cannot guarantee its absolute security.</p>
                <h1>Detailed Information on the Processing of Your Personal Data</h1>
                <p>Service Providers have access to Your Personal Data only to perform their tasks on Our behalf and are obligated not to disclose or use it for any other purpose.</p>
                <h2><strong><strong>Analytics</strong></strong></h2>
                <p>We may use third-party Service providers to monitor and analyze the use of our Service.</p>
                <p><strong><strong>Google Analytics</strong></strong></p>
                <p>Google Analytics is a web analytics service offered by Google that tracks and reports website traffic. Google uses the data collected to track and monitor the use of our Service. This data is shared with other Google services. Google may use the collected data to contextualize and personalize the ads of its own advertising network.</p>
                <p>You can opt-out of having made your activity on the Service available to Google Analytics by installing the Google Analytics opt-out browser add-on. The add-on prevents the Google Analytics JavaScript (ga.js, analytics.js and dc.js) from sharing information with Google Analytics about visits activity.</p>
                <p>For more information on the privacy practices of Google, please visit the Google Privacy &amp; Terms web page: <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a></p>
                <p><strong><strong>Firebase</strong></strong></p>
                <p>Firebase is an analytics service provided by Google Inc.</p>
                <p>You may opt-out of certain Firebase features through your mobile device settings, such as your device advertising settings or by following the instructions provided by Google in their Privacy Policy: <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a></p>
                <p>We also encourage you to review the Google's policy for safeguarding your data: <a href="https://support.google.com/analytics/answer/6004245">https://support.google.com/analytics/answer/6004245</a></p>
                <p>For more information on what type of information Firebase collects, please visit the Google Privacy &amp; Terms web page: <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a></p>
                <p><strong><strong>Clicky</strong></strong></p>
                <p>Clicky is a web analytics service. Read the Privacy Policy for Clicky here: <a href="https://clicky.com/terms">https://clicky.com/terms</a></p>
                <p><strong><strong>Flurry Analytics</strong></strong></p>
                <p>Flurry Analytics service is provided by Yahoo! Inc.</p>
                <p>You can opt-out from Flurry Analytics service to prevent Flurry Analytics from using and sharing your information by visiting the Flurry's Opt-out page: <a href="https://developer.yahoo.com/flurry/end-user-opt-out/">https://developer.yahoo.com/flurry/end-user-opt-out/</a></p>
                <p>For more information on the privacy practices and policies of Yahoo!, please visit their Privacy Policy page: <a href="https://policies.yahoo.com/xa/en/yahoo/privacy/index.htm">https://policies.yahoo.com/xa/en/yahoo/privacy/index.htm</a></p>
                <p><strong><strong>Unity Analytics</strong></strong></p>
                <p>Unity Analytics is provided by Unity Technologies.</p>
                <p>For more information on what type of information Unity Analytics collects, please visit their Privacy Policy page: <a href="https://unity3d.com/legal/privacy-policy">https://unity3d.com/legal/privacy-policy</a></p>
                <h2><strong><strong>Email Marketing</strong></strong></h2>
                <p>We may use Your Personal Data to contact You with newsletters, marketing or promotional materials and other information that may be of interest to You. You may opt-out of receiving any, or all, of these communications from Us by following the unsubscribe link or instructions provided in any email We send or by contacting Us.</p>
                <p>We may use Email Marketing Service Providers to manage and send emails to You.</p>
                <p><strong><strong>SendGrid</strong></strong></p>
                <p>Their Privacy Policy can be viewed at <a href="https://www.twilio.com/legal/privacy">https://www.twilio.com/legal/privacy</a></p>
                <h2><strong><strong>Payments</strong></strong></h2>
                <p>We may provide paid products and/or services within the Service. In that case, we may use third-party services for payment processing (e.g. payment processors).</p>
                <p>We will not store or collect Your payment card details. That information is provided directly to Our third-party payment processors whose use of Your personal information is governed by their Privacy Policy. These payment processors adhere to the standards set by PCI-DSS as managed by the PCI Security Standards Council, which is a joint effort of brands like Visa, Mastercard, American Express and Discover. PCI-DSS requirements help ensure the secure handling of payment information.</p>
                <p><strong><strong>Braintree</strong></strong></p>
                <p>Their Privacy Policy can be viewed at <a href="https://www.braintreepayments.com/legal/braintree-privacy-policy">https://www.braintreepayments.com/legal/braintree-privacy-policy</a></p>
                <p>When You use Our Service to pay a product and/or service via bank transfer, We may ask You to provide information to facilitate this transaction and to verify Your identity.</p>
                <p>&nbsp;</p>
                <h1>Links to Other Websites</h1>
                <p>Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit.</p>
                <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>
                <h1>Changes to this Privacy Policy</h1>
                <p>We may update our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page.</p>
                <p>We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the "Last updated" date at the top of this Privacy Policy.</p>
                <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
                <h1>Contact Us</h1>
                <p>If you have any questions about this Privacy Policy, You can contact us:</p>
                <ul>
                    <li>By email: info@yocoservices.com</li>
                </ul>
            </TabPanel>
            <TabPanel value={value} index={2} className="tabscroll">
            <h1><strong><strong>Terms & Conditions</strong></strong></h1>
                <p>Last updated: August 12, 2020</p>
                <p>Please read these terms and conditions carefully before using Our Service.</p>
                <h1>Interpretation and Definitions</h1>
                <h2><strong><strong>Interpretation</strong></strong></h2>
                <p>The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
                <h2><strong><strong>Definitions</strong></strong></h2>
                <p>For the purposes of these Terms and Conditions:</p>
                <p><strong><strong>Affiliate</strong></strong>&nbsp;means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.</p>
                <p><strong><strong>Account</strong></strong>&nbsp;means a unique account created for You to access our Service or parts of our Service.</p>
                <p><strong><strong>Country</strong></strong>&nbsp;refers to: Delaware, United States</p>
                <p><strong><strong>Company</strong></strong>&nbsp;(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to YoCo LLC, 16192 Coastal Highway, Lewes, Delaware, 19958.</p>
                <p><strong><strong>Device</strong></strong>&nbsp;means any device that can access the Service such as a computer, a cellphone or a digital tablet.</p>
                <p><strong><strong>Service</strong></strong>&nbsp;refers to the Website.</p>
                <p><strong><strong>Terms and Conditions</strong></strong>&nbsp;(also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.</p>
                <p><strong><strong>Third-party Social Media Service</strong></strong>&nbsp;means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.</p>
                <p><strong><strong>Website</strong></strong>&nbsp;refers to YoCo , accessible from <a href="http://www.yocoservices.com">http://www.yocoservices.com</a></p>
                <p><strong><strong>You</strong></strong>&nbsp;means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable</p>
                <p><strong><strong>Service Provider</strong></strong>&nbsp;means <strong><strong>You</strong></strong>, the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
                <h1>Acknowledgment</h1>
                <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
                <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
                <p>By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service.</p>
                <p>You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.</p>
                <p>Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your personal information when You use the Application or the Website and tells You about Your privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.</p>
                <h1>Service Provider qualifications</h1>
                <p>Service &nbsp;Provider &nbsp;shall &nbsp;possess &nbsp;all &nbsp;verification &nbsp;of &nbsp;qualifications &nbsp;to &nbsp;provide &nbsp;services &nbsp;in &nbsp;its professional &nbsp;field &nbsp;to consumers &nbsp;primarily &nbsp;from &nbsp;the &nbsp;United &nbsp;States &nbsp;who &nbsp;may &nbsp;use &nbsp;the &nbsp;platform provided &nbsp;by &nbsp;YoCo &nbsp;LLC &nbsp;to &nbsp;find &nbsp;service &nbsp;providers &nbsp;in &nbsp;India &nbsp;to &nbsp;help &nbsp;relatives &nbsp;and &nbsp;family &nbsp;members &nbsp;of the &nbsp;consumer &nbsp;who &nbsp;may &nbsp;be &nbsp;located &nbsp;in &nbsp;India. &nbsp;Service &nbsp;Provider &nbsp;shall &nbsp;provide &nbsp;its &nbsp;service &nbsp;in &nbsp;India and &nbsp;shall &nbsp;po`ssess &nbsp;all &nbsp;qualifications &nbsp;and &nbsp;credentials &nbsp;to &nbsp;do &nbsp;so. &nbsp;To &nbsp;note, &nbsp;since &nbsp;YoCo &nbsp;LLC &nbsp;is providing &nbsp;an &nbsp;online platform, &nbsp;the &nbsp;users &nbsp;may &nbsp;also &nbsp;use &nbsp;this &nbsp;from &nbsp;other &nbsp;countries &nbsp;to &nbsp;avail &nbsp;such services &nbsp;in &nbsp;India. &nbsp;For &nbsp;that &nbsp;matter &nbsp;sometime, &nbsp;users &nbsp;from &nbsp;India &nbsp;may &nbsp;also &nbsp;use &nbsp;the &nbsp;platform &nbsp;to &nbsp;avail the &nbsp;services &nbsp;in &nbsp;India.</p>
                <h1>Pricing your Service</h1>
                <p>&nbsp;</p>
                <p>Service &nbsp;Providers &nbsp;will find &nbsp;requests &nbsp;from &nbsp;users &nbsp;on &nbsp;the &nbsp;online &nbsp;platform. &nbsp;&nbsp;Service &nbsp;Providers &nbsp;may also &nbsp;customize &nbsp;the service &nbsp;requests &nbsp;by &nbsp;interacting &nbsp;with &nbsp;the &nbsp;users, &nbsp;Service &nbsp;Providers &nbsp;will &nbsp;be allowed &nbsp;to &nbsp;provide a &nbsp;fee &nbsp;quote. &nbsp;The &nbsp;user will &nbsp;be &nbsp;required &nbsp;to agree &nbsp;to &nbsp;the &nbsp;fee &nbsp;quote &nbsp;and &nbsp;then &nbsp;place &nbsp;the &nbsp;order &nbsp;with &nbsp;the &nbsp;Service &nbsp;Provider through &nbsp;the &nbsp;platform. Upon &nbsp;completion &nbsp;of &nbsp;service and acceptance from the user, the service provider &nbsp;will &nbsp;receive the &nbsp;payment. .An &nbsp;additional &nbsp;service &nbsp;fee &nbsp;will &nbsp;be &nbsp;charged &nbsp;to &nbsp;the &nbsp;users &nbsp;by &nbsp;YoCo &nbsp;LLC &nbsp;for using &nbsp;the &nbsp;platform</p>
                <h1>Payment disbursement</h1>
                <p>For &nbsp;most &nbsp;service &nbsp;requests, &nbsp;YoCo &nbsp;LLC &nbsp;will &nbsp;pay &nbsp;100% &nbsp;of &nbsp;the &nbsp;amount &nbsp;quoted &nbsp;by &nbsp;the &nbsp;Service Provider &nbsp;and &nbsp;does not &nbsp;charge &nbsp;any &nbsp;commission &nbsp;from &nbsp;the &nbsp;requests. &nbsp;For &nbsp;specialized &nbsp;or &nbsp;unique healthcare &nbsp;services, &nbsp;or &nbsp;healthcare &nbsp;services &nbsp;that &nbsp;are &nbsp;difficult &nbsp;to &nbsp;find &nbsp;professional &nbsp;treatment providers, &nbsp;YoCo &nbsp;LLC &nbsp;is &nbsp;permitted &nbsp;to &nbsp;contract &nbsp;with &nbsp;an &nbsp;independent &nbsp;third &nbsp;party &nbsp;staffing &nbsp;service. &nbsp;In doing &nbsp;so, &nbsp;YoCo &nbsp;LLC &nbsp;will &nbsp;be &nbsp;paid &nbsp;compensation &nbsp;amounting &nbsp;to &nbsp;5% &nbsp;of &nbsp;the &nbsp;amount &nbsp;quoted &nbsp;by &nbsp;the Service &nbsp;Provider &nbsp;in addition &nbsp;to &nbsp;the &nbsp;commission, &nbsp;percentage, &nbsp;and/or &nbsp;fee &nbsp;charged &nbsp;by &nbsp;the independent &nbsp;third &nbsp;party staffing &nbsp;service, &nbsp;which &nbsp;according &nbsp;to &nbsp;industry &nbsp;standards &nbsp;may &nbsp;be &nbsp;more &nbsp;or less &nbsp;than &nbsp;approximately &nbsp;15%. &nbsp;&nbsp;Therefore, &nbsp;Service &nbsp;Providers &nbsp;that &nbsp;are &nbsp;associated &nbsp;with &nbsp;any &nbsp;staffing company &nbsp;may &nbsp;only receive &nbsp;approximately &nbsp;80% &nbsp;of &nbsp;the &nbsp;fee &nbsp;quoted &nbsp;to &nbsp;users. &nbsp;Service &nbsp;Provider &nbsp;shall provide &nbsp;its &nbsp;banking information &nbsp;to &nbsp;YoCo &nbsp;LLC &nbsp;to &nbsp;make &nbsp;direct &nbsp;deposits</p>
                <h1>Correspondence and information sharing</h1>
                <p>Requesting &nbsp;or &nbsp;providing &nbsp;Email &nbsp;addresses, &nbsp;Skype/IM &nbsp;usernames, &nbsp;telephone &nbsp;numbers &nbsp;or &nbsp;any other &nbsp;personal &nbsp;contact details &nbsp;to &nbsp;communicate &nbsp;outside &nbsp;of &nbsp;the &nbsp;platform &nbsp;in &nbsp;order &nbsp;to &nbsp;circumvent &nbsp;or abuse &nbsp;the &nbsp;platform&rsquo;s &nbsp;messaging &nbsp;system &nbsp;or &nbsp;the &nbsp;platform &nbsp;in &nbsp;general &nbsp;is &nbsp;not &nbsp;permitted. &nbsp;Service Providers &nbsp;are &nbsp;not &nbsp;permitted &nbsp;to &nbsp;contact &nbsp;the &nbsp;users &nbsp;outside &nbsp;of &nbsp;the &nbsp;online &nbsp;platform&rsquo;s &nbsp;system &nbsp;and &nbsp;sign any &nbsp;contract, &nbsp;agreement, &nbsp;and/or &nbsp;legal &nbsp;document. &nbsp;Any &nbsp;form &nbsp;of &nbsp;contact &nbsp;information &nbsp;cannot &nbsp;be exchanged &nbsp;between the &nbsp;Service &nbsp;Provider &nbsp;and &nbsp;the &nbsp;user &nbsp;until &nbsp;an &nbsp;order &nbsp;is &nbsp;agreed &nbsp;and &nbsp;paid &nbsp;by &nbsp;the user. &nbsp;In &nbsp;some &nbsp;cases due &nbsp;to &nbsp;complexity &nbsp;of &nbsp;the &nbsp;service &nbsp;the &nbsp;users may &nbsp;want &nbsp;to &nbsp;discuss &nbsp;the &nbsp;service with &nbsp;the &nbsp;provider. &nbsp;In &nbsp;these &nbsp;cases, &nbsp;the &nbsp;user &nbsp;will &nbsp;be &nbsp;required &nbsp;to &nbsp;pay &nbsp;a &nbsp;small &nbsp;service &nbsp;fee &nbsp;in &nbsp;order &nbsp;for the &nbsp;contact &nbsp;information &nbsp;to &nbsp;be &nbsp;shared &nbsp;and &nbsp;proceed &nbsp;with &nbsp;the &nbsp;consultation &nbsp;with &nbsp;the &nbsp;Service Provider.</p>
                <h1>Independent and third party verification and authorization</h1>
                <p>Upon &nbsp;entering &nbsp;this &nbsp;Agreement, &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;shall &nbsp;have &nbsp;the &nbsp;following &nbsp;verified &nbsp;by &nbsp;a &nbsp;third party &nbsp;contractor &nbsp;selected &nbsp;by &nbsp;YoCo &nbsp;LLC: &nbsp;(1) &nbsp;address &nbsp;proof &nbsp;check, &nbsp;(2) &nbsp;photo &nbsp;ID &nbsp;check, &nbsp;and &nbsp;(3) complete &nbsp;criminal &nbsp;record &nbsp;check. &nbsp;&nbsp;YoCo &nbsp;LLC &nbsp;currently &nbsp;contracts with &nbsp;Baldor &nbsp;Technologies &nbsp;Private Limited, &nbsp;a &nbsp;company incorporated &nbsp;under &nbsp;Companies &nbsp;Act, &nbsp;1956 &nbsp;whose &nbsp;C.I.N. &nbsp;is U74900MH2011PTC291275, &nbsp;having &nbsp;its &nbsp;registered &nbsp;office &nbsp;at &nbsp;4-F &nbsp;Rushabh &nbsp;Chambers, &nbsp;Plot &nbsp;No. 609, &nbsp;Off &nbsp;Makwana &nbsp;Road, &nbsp;Marol &nbsp;Naka, &nbsp;Andheri &nbsp;(East), &nbsp;Mumbai &nbsp;400059, &nbsp;and &nbsp;does &nbsp;business &nbsp;as &ldquo;IDfy&rdquo;. &nbsp;</p>
                <p>&nbsp;</p>
                <p>YoCo &nbsp;LLC &nbsp;will &nbsp;contract with &nbsp;a &nbsp;third &nbsp;party &nbsp;independent &nbsp;contractor &nbsp;for &nbsp;services &nbsp;which &nbsp;comprise &nbsp;the authentication &nbsp;of &nbsp;the &nbsp;Service &nbsp;Provider. &nbsp;&nbsp;Service &nbsp;Provider &nbsp;hereby &nbsp;consents &nbsp;to &nbsp;submitting &nbsp;the biometric &nbsp;information &nbsp;and/or &nbsp;OTP &nbsp;and &nbsp;Aadhaar &nbsp;number. &nbsp;This &nbsp;information &nbsp;will &nbsp;be &nbsp;matched against &nbsp;the &nbsp;data &nbsp;available &nbsp;in &nbsp;the &nbsp;Central &nbsp;Identities &nbsp;Data &nbsp;Repository &nbsp;(CIDR).</p>
                <p>&nbsp;</p>
                <p>Client &nbsp;acknowledges &nbsp;and &nbsp;consents &nbsp;that &nbsp;this Agreement &nbsp;shall &nbsp;serve &nbsp;as &nbsp;a &nbsp;letter &nbsp;of &nbsp;authorization (or &nbsp;equivalent &nbsp;evidence o f &nbsp;consent, &nbsp;including &nbsp;opt-in &nbsp;clicks) &nbsp;duly &nbsp;signed &nbsp;or &nbsp;otherwise authenticated &nbsp;by &nbsp;the &nbsp;Subject &nbsp;Provider, &nbsp;and &nbsp;shall &nbsp;also &nbsp;serve &nbsp;as evidence &nbsp;of &nbsp;(i) &nbsp;the &nbsp;Service Provider&rsquo;s &nbsp;consent &nbsp;for &nbsp;the &nbsp;performance &nbsp;of &nbsp;the &nbsp;services b y &nbsp;IDfy, &nbsp;and &nbsp;(ii) &nbsp;the &nbsp;Service &nbsp;Provider&rsquo;s consent &nbsp;for &nbsp;YoCo &nbsp;LLC &nbsp;to &nbsp;create &nbsp;images &nbsp;of &nbsp;various &nbsp;identification &nbsp;and &nbsp;other &nbsp;documents o f &nbsp;the Service &nbsp;Provider, &nbsp;including, &nbsp;without &nbsp;limitation, &nbsp;Aadhar &nbsp;card, PAN &nbsp;card, &nbsp;Driving &nbsp;License, Voter &nbsp;identity &nbsp;card &nbsp;retaining &nbsp;such &nbsp;images, &nbsp;and &nbsp;forwarding &nbsp;such &nbsp;images &nbsp;to &nbsp;IDfy &nbsp;for &nbsp;the &nbsp;provision of &nbsp;the &nbsp;contracted &nbsp;services. &nbsp;&nbsp;Moreover, &nbsp;IDfy &nbsp;may &nbsp;require &nbsp;additional &nbsp;details &nbsp;from &nbsp;the &nbsp;Service Provider &nbsp;if &nbsp;the &nbsp;supporting &nbsp;documents &nbsp;already &nbsp;submitted &nbsp;are &nbsp;deemed &nbsp;inadequate &nbsp;for &nbsp;the &nbsp;purpose of &nbsp;verification. &nbsp;&nbsp;Service Provider &nbsp;hereby &nbsp;agrees &nbsp;to &nbsp;provide &nbsp;all &nbsp;such &nbsp;requested &nbsp;further &nbsp;supporting documents. &nbsp;</p>
                <p>&nbsp;Service &nbsp;Provider &nbsp;is &nbsp;informed &nbsp;and &nbsp;consents &nbsp;to &nbsp;any &nbsp;third &nbsp;party contractor &nbsp;of &nbsp;YoCo &nbsp;LLC, &nbsp;including but &nbsp;not &nbsp;limited &nbsp;to &nbsp;IDfy, may &nbsp;access &nbsp;or &nbsp;employ &nbsp;various &nbsp;third-party &nbsp;applications, &nbsp;programs, databases, &nbsp;and &nbsp;services &nbsp;(collectively, &nbsp;&ldquo;Third-Party Services&rdquo;) &nbsp;and &nbsp;application &nbsp;programming interfaces &nbsp;(&ldquo;APIs&rdquo;) &nbsp;provided &nbsp;by &nbsp;such &nbsp;third-party &nbsp;services. &nbsp;Service &nbsp;Provider &nbsp;is &nbsp;informed &nbsp;and consents &nbsp;to &nbsp;any &nbsp;third p arty &nbsp;contractor &nbsp;of &nbsp;YoCo &nbsp;LLC, &nbsp;including &nbsp;but &nbsp;not &nbsp;limited &nbsp;to &nbsp;IDfy, &nbsp;may &nbsp;retain anonymized &nbsp;records &nbsp;of all &nbsp;data &nbsp;that &nbsp;it &nbsp;obtains &nbsp;or &nbsp;generates &nbsp;that &nbsp;&lsquo;anonymized &nbsp;records&rsquo; &nbsp;relating &nbsp;to Service &nbsp;Provider, &nbsp;including &nbsp;but &nbsp;not &nbsp;limited &nbsp;to &nbsp;records of &nbsp;the &nbsp;results &nbsp;of &nbsp;any &nbsp;background &nbsp;checks &nbsp;or verifications, &nbsp;or &nbsp;information &nbsp;about &nbsp;candidates, &nbsp;as &nbsp;have &nbsp;been &nbsp;redacted &nbsp;in &nbsp;such &nbsp;a &nbsp;manner &nbsp;that &nbsp;no association &nbsp;or &nbsp;relationship &nbsp;can &nbsp;be &nbsp;traced &nbsp;between &nbsp;such &nbsp;data &nbsp;and &nbsp;any &nbsp;individual &nbsp;or &nbsp;entity. &nbsp;</p>
                <p>&nbsp;</p>
                <p>Service &nbsp;Provider &nbsp;hereby &nbsp;consent &nbsp;and &nbsp;agrees that &nbsp;this &nbsp;Agreement &nbsp;is &nbsp;in &nbsp;compliance &nbsp;with &nbsp;the provisions &nbsp;of &nbsp;Rules &nbsp;5 and &nbsp;6 &nbsp;of &nbsp;the &nbsp;Information &nbsp;Technology &nbsp;(Reasonable &nbsp;Security &nbsp;Practices &nbsp;And Procedures &nbsp;and &nbsp;Sensitive &nbsp;Personal &nbsp;Data &nbsp;or &nbsp;Information) &nbsp;Rules, &nbsp;2011 &nbsp;and &nbsp;the &nbsp;provisions of &nbsp;the Aadhaar &nbsp;(Targeted Delivery &nbsp;of &nbsp;Financial &nbsp;and &nbsp;Other &nbsp;Subsidies, &nbsp;Benefits &nbsp;and &nbsp;Services) &nbsp;Act, &nbsp;2016, and &nbsp;the &nbsp;applicable &nbsp;Rules &nbsp;and &nbsp;Regulations &nbsp;framed &nbsp;thereunder &nbsp;(&ldquo;the &nbsp;Aadhaar &nbsp;Act&rdquo;) &nbsp;and &nbsp;Service Provider &nbsp;hereby &nbsp;consents &nbsp;and &nbsp;authorizes &nbsp;the &nbsp;performance &nbsp;of &nbsp;the &nbsp;services, &nbsp;including, &nbsp;but &nbsp;not limited &nbsp;to, &nbsp;(i) &nbsp;the &nbsp;transmission &nbsp;of &nbsp;their &nbsp;sensitive &nbsp;personal &nbsp;information, &nbsp;if &nbsp;any, &nbsp;from &nbsp;YoCo &nbsp;LLC &nbsp;to any &nbsp;third &nbsp;party &nbsp;contractor, &nbsp;including &nbsp;but &nbsp;not &nbsp;limited &nbsp;to &nbsp;IDfy and &nbsp;thereby &nbsp;authorizes &nbsp;any &nbsp;third &nbsp;party contractor &nbsp;of &nbsp;YoCo L LC, &nbsp;including &nbsp;but &nbsp;not &nbsp;limited &nbsp;to &nbsp;IDfy, &nbsp;and &nbsp;where &nbsp;permitted &nbsp;under &nbsp;applicable laws &nbsp;to &nbsp;store &nbsp;and &nbsp;use &nbsp;their &nbsp;profiles &nbsp;in &nbsp;accordance &nbsp;with &nbsp;Clause &nbsp;2(e), &nbsp;and &nbsp;(ii) &nbsp;Service &nbsp;Provider hereby &nbsp;agrees &nbsp;and consents &nbsp;to &nbsp;the &nbsp;creation &nbsp;of &nbsp;images &nbsp;of &nbsp;various &nbsp;identification &nbsp;and &nbsp;other documents &nbsp;of &nbsp;the &nbsp;Service &nbsp;Provider, &nbsp;including, &nbsp;without &nbsp;limitation, &nbsp;Aadhar &nbsp;card, &nbsp;PAN &nbsp;card, &nbsp;Driving License, &nbsp;Voter &nbsp;identity c ard &nbsp;retaining &nbsp;such &nbsp;images, &nbsp;and &nbsp;forwarding &nbsp;such &nbsp;images &nbsp;to &nbsp;YoCo &nbsp;LLC &nbsp;for any &nbsp;third &nbsp;party &nbsp;contractor, &nbsp;including &nbsp;but &nbsp;not &nbsp;limited &nbsp;to &nbsp;IDfy. &nbsp;In &nbsp;cases &nbsp;that &nbsp;comprise &nbsp;e-KYC services, &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;hereby &nbsp;represents &nbsp;and &nbsp;warrants t hat &nbsp;it &nbsp;provides &nbsp;its &nbsp;consent &nbsp;for each &nbsp;specific &nbsp;e-KYC &nbsp;transaction. &nbsp;</p>
                <h1>Verification Authorization</h1>
                <p>The &nbsp;YoCo &nbsp;SAFE &nbsp;section &nbsp;on &nbsp;the &nbsp;website &nbsp;platform provides &nbsp;details &nbsp;of &nbsp;verification. &nbsp;&nbsp;Safety &nbsp;of &nbsp;loved ones &nbsp;is &nbsp;the &nbsp;priority. &nbsp;YoCo &nbsp;LLC &nbsp;only &nbsp;intends &nbsp;only &nbsp;to &nbsp;assist &nbsp;in &nbsp;the &nbsp;hire &nbsp;of &nbsp;only &nbsp;reliable &nbsp;professionals for &nbsp;the &nbsp;service &nbsp;needs &nbsp;of &nbsp;the &nbsp;user. &nbsp;&nbsp;Therefore, &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;hereby &nbsp;agrees &nbsp;to &nbsp;authorize &nbsp;all necessary &nbsp;steps &nbsp;necessary &nbsp;to &nbsp;verify &nbsp;its &nbsp;qualifications.</p>
                <h1>Spiffy Strength score</h1>
                <p>The &nbsp;&ldquo;Spiffy&rdquo; &nbsp;strength &nbsp;score &nbsp;will &nbsp;be &nbsp;provided &nbsp;in &nbsp;the &nbsp;Service &nbsp;Provider&rsquo;s &nbsp;profile &nbsp;to &nbsp;help &nbsp;the &nbsp;user identify &nbsp;a &nbsp;trusted &nbsp;individual &nbsp;for &nbsp;the &nbsp;requested &nbsp;service needs. &nbsp;Users &nbsp;will &nbsp;be &nbsp;allowed &nbsp;to &nbsp;assess &nbsp;the detailed &nbsp;profile &nbsp;information &nbsp;of &nbsp;the &nbsp;Service &nbsp;Provider, &nbsp;which &nbsp;may &nbsp;include, &nbsp;but &nbsp;is &nbsp;not &nbsp;limited &nbsp;to, educational &nbsp;and &nbsp;employment &nbsp;background, training &nbsp;and &nbsp;certification, &nbsp;reviews &nbsp;and &nbsp;ratings &nbsp;from other &nbsp;users. &nbsp;Users &nbsp;will &nbsp;be &nbsp;able &nbsp;to: &nbsp;note &nbsp;the &nbsp;badges &nbsp;assigned &nbsp;to &nbsp;each &nbsp;Service &nbsp;Provider &nbsp;profile and &nbsp;gauge &nbsp;credibility &nbsp;before &nbsp;deciding &nbsp;on &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;who &nbsp;can &nbsp;serve &nbsp;the &nbsp;user, &nbsp;the Service &nbsp;Provider&rsquo;s &nbsp;education &nbsp;credentials &nbsp;and &nbsp;a &nbsp;record &nbsp;of &nbsp;any &nbsp;negative &nbsp;and &nbsp;positive &nbsp;work experience &nbsp;history, &nbsp;the &nbsp;Service &nbsp;Provider&rsquo;s &nbsp;address &nbsp;and &nbsp;photo &nbsp;ID &nbsp;will &nbsp;be &nbsp;provided &nbsp;in &nbsp;order &nbsp;to &nbsp;be verified, &nbsp;any &nbsp;credible &nbsp;references &nbsp;from &nbsp;verified &nbsp;sources &nbsp;(professors, &nbsp;others &nbsp;in &nbsp;responsible positions &nbsp;etc.) &nbsp;will &nbsp;be provided &nbsp;as &nbsp;it &nbsp;concerns &nbsp;the &nbsp;Service &nbsp;Provider, &nbsp;a &nbsp;police &nbsp;clearance &nbsp;certificate / &nbsp;comprehensive &nbsp;criminal &nbsp;and &nbsp;court &nbsp;record &nbsp;concerning &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;must &nbsp;be &nbsp;verified, and &nbsp;any &nbsp;user &nbsp;ratings &nbsp;and reviews for &nbsp;services &nbsp;to &nbsp;other &nbsp;users concerning &nbsp;the &nbsp;Service &nbsp;Provider will &nbsp;be &nbsp;provided &nbsp;to &nbsp;the &nbsp;user.</p>
                <h1>Authentication</h1>
                <p>Authentication of &nbsp;the Service &nbsp;Provider &nbsp;is &nbsp;required &nbsp;in &nbsp;order &nbsp;to &nbsp;ensure &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;signed up &nbsp;by &nbsp;the &nbsp;user &nbsp;is &nbsp;the &nbsp;one &nbsp;who &nbsp;in &nbsp;fact &nbsp;performs &nbsp;the &nbsp;service. &nbsp;The &nbsp;verification &nbsp;process &nbsp;will &nbsp;be tracked &nbsp;and &nbsp;the &nbsp;user &nbsp;will &nbsp;receive &nbsp;real &nbsp;time &nbsp;status &nbsp;updates and &nbsp;view &nbsp;proof &nbsp;and &nbsp;quality &nbsp;of &nbsp;the service &nbsp;provided. &nbsp;&nbsp;The user authentication process &nbsp;will &nbsp;consist &nbsp;of &nbsp;when &nbsp;the &nbsp;Service &nbsp;Provider arrives &nbsp;on-site, &nbsp;the &nbsp;user &nbsp;will &nbsp;ensure &nbsp;that &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;signed &nbsp;up &nbsp;is &nbsp;the &nbsp;one &nbsp;who &nbsp;shows &nbsp;up to &nbsp;in-person &nbsp;appointments &nbsp;and &nbsp;in &nbsp;fact &nbsp;provides the &nbsp;service. &nbsp;&nbsp;A randomly &nbsp;generated &nbsp;unique &nbsp;code will &nbsp;be &nbsp;sent &nbsp;to &nbsp;the &nbsp;user &nbsp;as &nbsp;the &nbsp;Service Provider &nbsp;arrives &nbsp;onsite &nbsp;for &nbsp;in-person &nbsp;appointments. &nbsp;&nbsp;The user &nbsp;will &nbsp;validate &nbsp;the &nbsp;code, &nbsp;and &nbsp;cross &nbsp;check &nbsp;the &nbsp;digital &nbsp;photo &nbsp;ID &nbsp;and &nbsp;physical &nbsp;ID &nbsp;proof, &nbsp;before allowing &nbsp;the &nbsp;Service Provider &nbsp;to &nbsp;perform &nbsp;the &nbsp;service. &nbsp;&nbsp;When &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;in &nbsp;fact performs &nbsp;service, &nbsp;the user &nbsp;will &nbsp;be &nbsp;provided &nbsp;a &nbsp;real-time &nbsp;status &nbsp;update &nbsp;at &nbsp;each &nbsp;stage &nbsp;of &nbsp;the service. &nbsp;&nbsp;The &nbsp;user may &nbsp;also &nbsp;request &nbsp;that &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;upload &nbsp;photographs &nbsp;and &nbsp;videos as &nbsp;status &nbsp;updates &nbsp;in proof &nbsp;of &nbsp;providing &nbsp;the &nbsp;service.</p>
                <h1>No employment relationship</h1>
                <p>Service &nbsp;Provider &nbsp;is &nbsp;considered &nbsp;an &nbsp;Independent &nbsp;contractor &nbsp;and &nbsp;not &nbsp;an &nbsp;employee &nbsp;or &nbsp;agent &nbsp;of YoCo &nbsp;LLC. &nbsp;&nbsp;Service &nbsp;Provider &nbsp;is &nbsp;responsible &nbsp;for &nbsp;his &nbsp;or &nbsp;her &nbsp;own &nbsp;work, &nbsp;own &nbsp;self-employment &nbsp;and payroll &nbsp;taxes, &nbsp;and i s &nbsp;solely &nbsp;responsible &nbsp;for &nbsp;the &nbsp;risks &nbsp;and &nbsp;liabilities &nbsp;attached &nbsp;to &nbsp;the &nbsp;services requested &nbsp;and &nbsp;performed. &nbsp;The &nbsp;parties &nbsp;hereby &nbsp;agree &nbsp;that &nbsp;they a re &nbsp;at &nbsp;all &nbsp;times &nbsp;acting &nbsp;as independent &nbsp;contractors &nbsp;who &nbsp;have &nbsp;entered &nbsp;into &nbsp;this Agreement &nbsp;on &nbsp;the &nbsp;terms &nbsp;and &nbsp;conditions &nbsp;set forth &nbsp;in &nbsp;the &nbsp;Agreement. &nbsp;Except &nbsp;as &nbsp;set &nbsp;forth &nbsp;in &nbsp;this &nbsp;Agreement, &nbsp;YoCo &nbsp;LLC &nbsp;will &nbsp;neither &nbsp;have, &nbsp;nor exercise, &nbsp;any &nbsp;control or &nbsp;direction &nbsp;over &nbsp;the &nbsp;methods &nbsp;by &nbsp;which &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;performs &nbsp;his or &nbsp;her &nbsp;work &nbsp;and &nbsp;functions; &nbsp;the &nbsp;sole &nbsp;interest &nbsp;and &nbsp;responsibility &nbsp;of &nbsp;YoCo &nbsp;LLC &nbsp;is &nbsp;to &nbsp;provide &nbsp;an online &nbsp;platform &nbsp;in &nbsp;which &nbsp;users &nbsp;can &nbsp;submit &nbsp;service &nbsp;requests. &nbsp;&nbsp;Nothing &nbsp;in &nbsp;this &nbsp;Agreement &nbsp;will &nbsp;be construed &nbsp;or &nbsp;deemed t o &nbsp;create &nbsp;a &nbsp;relationship &nbsp;of &nbsp;employer &nbsp;and &nbsp;employee &nbsp;or &nbsp;principal &nbsp;and &nbsp;agent between &nbsp;the &nbsp;YoCo L LC &nbsp;and &nbsp;the &nbsp;Service &nbsp;Provider. &nbsp;The &nbsp;Service &nbsp;Provider &nbsp;agrees &nbsp;that &nbsp;he &nbsp;or &nbsp;she will &nbsp;not &nbsp;assert, &nbsp;or &nbsp;hold themselves &nbsp;out &nbsp;as &nbsp;having &nbsp;any &nbsp;relationship &nbsp;with &nbsp;YoCo &nbsp;LLC, &nbsp;other &nbsp;than &nbsp;an independent &nbsp;contractor relationship. &nbsp;This &nbsp;obligation &nbsp;will &nbsp;survive &nbsp;any &nbsp;termination &nbsp;of &nbsp;this Agreement. &nbsp;&nbsp;Because &nbsp;the &nbsp;Service &nbsp;Provider &nbsp;is &nbsp;not &nbsp;an &nbsp;employee &nbsp;of &nbsp;YoCo &nbsp;LLC, &nbsp;he &nbsp;or &nbsp;she &nbsp;will &nbsp;be exclusively &nbsp;responsible &nbsp;for &nbsp;the &nbsp;payment &nbsp;of &nbsp;all &nbsp;employment &nbsp;taxes, &nbsp;penalties, &nbsp;fees, &nbsp;insurance premiums, &nbsp;and &nbsp;contributions &nbsp;to &nbsp;insurance &nbsp;and &nbsp;pension &nbsp;or &nbsp;other &nbsp;deferred &nbsp;compensation &nbsp;plans including, &nbsp;but &nbsp;not &nbsp;limited &nbsp;to, &nbsp;Worker&rsquo;s &nbsp;Compensation &nbsp;and &nbsp;Social &nbsp;Security &nbsp;obligations, &nbsp;licensing fees, &nbsp;etc., &nbsp;and &nbsp;the filing &nbsp;of &nbsp;all &nbsp;necessary &nbsp;documents, &nbsp;forms, &nbsp;and &nbsp;returns &nbsp;pertinent &nbsp;to &nbsp;all &nbsp;of &nbsp;the foregoing. &nbsp;The &nbsp;Service &nbsp;Provider &nbsp;agrees &nbsp;to &nbsp;hold &nbsp;YoCo &nbsp;LLC &nbsp;harmless &nbsp;from, &nbsp;and &nbsp;to &nbsp;provide &nbsp;with &nbsp;a defense &nbsp;against, &nbsp;any and &nbsp;all &nbsp;claims &nbsp;that &nbsp;YoCo &nbsp;LLC &nbsp;is &nbsp;responsible &nbsp;for &nbsp;the &nbsp;payment &nbsp;of &nbsp;any &nbsp;of &nbsp;the foregoing &nbsp;payments, &nbsp;contributions, &nbsp;taxes, &nbsp;the &nbsp;withholding &nbsp;of &nbsp;any &nbsp;wages, &nbsp;or &nbsp;the &nbsp;filing &nbsp;of &nbsp;any relevant &nbsp;documents and &nbsp;returns, &nbsp;including, &nbsp;but &nbsp;not &nbsp;limited &nbsp;to, &nbsp;Social &nbsp;Security &nbsp;taxes &nbsp;and employer &nbsp;income t ax &nbsp;withholding &nbsp;obligations. &nbsp;This &nbsp;obligation &nbsp;will &nbsp;survive &nbsp;any &nbsp;termination &nbsp;of &nbsp;this Agreement.</p>
                <p>The &nbsp;Service &nbsp;Providers &nbsp;will &nbsp;be &nbsp;effectuating &nbsp;this &nbsp;Agreement &nbsp;with &nbsp;a &nbsp;third &nbsp;party &nbsp;for &nbsp;which &nbsp;YoCo &nbsp;LLC will &nbsp;be &nbsp;invoiced. &nbsp;&nbsp;YoCo &nbsp;LLC &nbsp;will &nbsp;submit &nbsp;payment &nbsp;through &nbsp;the &nbsp;third &nbsp;party &nbsp;who &nbsp;will &nbsp;then &nbsp;submit &nbsp;the amount &nbsp;owed &nbsp;to &nbsp;the Service &nbsp;Providers. &nbsp;The &nbsp;third &nbsp;party &nbsp;will &nbsp;be &nbsp;responsible &nbsp;for &nbsp;paying &nbsp;any resulting &nbsp;taxes &nbsp;in &nbsp;India.</p>
                <h1>User Accounts</h1>
                <p>When You create an account with Us, You must provide Us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of Your account on Our Service.</p>
                <p>You are responsible for safeguarding the password that You use to access the Service and for any activities or actions under Your password, whether Your password is with Our Service or a Third-Party Social Media Service.</p>
                <p>You agree not to disclose Your password to any third party. You must notify Us immediately upon becoming aware of any breach of security or unauthorized use of Your account.</p>
                <p>You may not use as a username the name of another person or entity or that is not lawfully available for use, a name or trademark that is subject to any rights of another person or entity other than You without appropriate authorization, or a name that is otherwise offensive, vulgar or obscene.</p>
                <h1>Intellectual Property</h1>
                <p>The Service and its original content (excluding Content provided by You or other users), features and functionality are and will remain the exclusive property of the Company and its licensors.</p>
                <p>The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.</p>
                <p>Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of the Company.</p>
                <h1>Links to Other Websites</h1>
                <p>Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.</p>
                <p>The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.</p>
                <p>We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or services that You visit.</p>
                <h1>Termination</h1>
                <p>We may terminate or suspend Your Account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions.</p>
                <p>Upon termination, Your right to use the Service will cease immediately. If You wish to terminate Your Account, You may simply discontinue using the Service.</p>
                <h1>Indemnity</h1>
                <p>Service &nbsp;Provider &nbsp;shall &nbsp;defend, &nbsp;indemnify, &nbsp;and &nbsp;hold &nbsp;harmless &nbsp;YoCo &nbsp;LLC, &nbsp;its &nbsp;directors, employees, &nbsp;contractors, &nbsp;and &nbsp;agents &nbsp;(&ldquo;Indemnified &nbsp;Party&rdquo;) &nbsp;from &nbsp;any &nbsp;and &nbsp;all &nbsp;losses, &nbsp;claims, damages, &nbsp;costs &nbsp;(including &nbsp;reasonable &nbsp;attorneys&rsquo; &nbsp;or &nbsp;legal &nbsp;costs), &nbsp;charges, &nbsp;expenses, &nbsp;liabilities, demands, &nbsp;proceedings and &nbsp;actions &nbsp;or &nbsp;any &nbsp;other &nbsp;liability &nbsp;of &nbsp;any &nbsp;nature &nbsp;whatsoever &nbsp;which &nbsp;an Indemnified &nbsp;Party &nbsp;may sustain &nbsp;or &nbsp;incur &nbsp;or &nbsp;which &nbsp;may &nbsp;be &nbsp;brought &nbsp;or &nbsp;established &nbsp;against &nbsp;it &nbsp;by &nbsp;any person, &nbsp;authority, &nbsp;or &nbsp;otherwise, &nbsp;and &nbsp;which &nbsp;may &nbsp;arise &nbsp;out &nbsp;of &nbsp;or &nbsp;in &nbsp;relation &nbsp;to &nbsp;or &nbsp;by &nbsp;reason &nbsp;of &nbsp;any violation &nbsp;of &nbsp;any &nbsp;privacy &nbsp;laws &nbsp;or &nbsp;any &nbsp;violation &nbsp;of &nbsp;the &nbsp;Aadhaar &nbsp;Act &nbsp;arising &nbsp;in &nbsp;connection &nbsp;with &nbsp;this Agreement</p>
                <h1>Limitation of Liability</h1>
                <p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
                <p>To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose.</p>
                <p>Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law.</p>
                <h1>Confidentiality</h1>
                <p>Service &nbsp;Provider &nbsp;agrees &nbsp;that, &nbsp;at &nbsp;all &nbsp;times &nbsp;he/she &nbsp;will &nbsp;hold &nbsp;in &nbsp;trust, &nbsp;keep &nbsp;confidential, &nbsp;not &nbsp;disclose or &nbsp;make &nbsp;available &nbsp;to &nbsp;any &nbsp;third &nbsp;person &nbsp;or &nbsp;entity, &nbsp;exploit, &nbsp;retain, &nbsp;or &nbsp;make &nbsp;any &nbsp;use &nbsp;of &nbsp;the confidential &nbsp;and &nbsp;private &nbsp;information &nbsp;of &nbsp;the &nbsp;user, &nbsp;including &nbsp;but &nbsp;not &nbsp;limited &nbsp;to &nbsp;any &nbsp;health &nbsp;and/or medical &nbsp;information. &nbsp;Service &nbsp;Provider &nbsp;further &nbsp;agrees &nbsp;that &nbsp;if, &nbsp;at &nbsp;any &nbsp;time, &nbsp;Service &nbsp;Provider becomes &nbsp;aware &nbsp;of &nbsp;any &nbsp;unauthorized &nbsp;access, &nbsp;use, &nbsp;possession &nbsp;or &nbsp;knowledge &nbsp;of &nbsp;any &nbsp;confidential and &nbsp;private &nbsp;information, &nbsp;Service &nbsp;Provider &nbsp;shall &nbsp;immediately &nbsp;notify &nbsp;YoCo &nbsp;LLC &nbsp;and &nbsp;shall &nbsp;take reasonable &nbsp;measures &nbsp;to &nbsp;prevent &nbsp;unauthorized &nbsp;persons &nbsp;or &nbsp;entities &nbsp;from &nbsp;having &nbsp;access &nbsp;to, obtaining, &nbsp;being &nbsp;furnished &nbsp;with, &nbsp;or &nbsp;using &nbsp;any &nbsp;confidential &nbsp;and &nbsp;private &nbsp;information. &nbsp;Service Provider &nbsp;also &nbsp;agrees &nbsp;that &nbsp;to &nbsp;the &nbsp;extent &nbsp;any &nbsp;court, &nbsp;agency, &nbsp;person &nbsp;or &nbsp;entity &nbsp;seeks &nbsp;to &nbsp;have &nbsp;Service Provider &nbsp;disclose &nbsp;any &nbsp;confidential &nbsp;information, &nbsp;Service &nbsp;Provider &nbsp;shall &nbsp;promptly &nbsp;notify &nbsp;YoCo &nbsp;LLC and &nbsp;shall &nbsp;take &nbsp;such &nbsp;reasonable &nbsp;steps &nbsp;as &nbsp;are &nbsp;available &nbsp;to &nbsp;Service &nbsp;Provider &nbsp;to &nbsp;prevent &nbsp;disclosure of &nbsp;such &nbsp;confidential &nbsp;information &nbsp;until &nbsp;YoCo &nbsp;LLC &nbsp;has &nbsp;been &nbsp;informed &nbsp;of &nbsp;the &nbsp;requested &nbsp;disclosure and &nbsp;the &nbsp;YoCo &nbsp;LLC &nbsp;has &nbsp;an &nbsp;opportunity &nbsp;to &nbsp;respond &nbsp;to &nbsp;the &nbsp;requesting &nbsp;party. &nbsp;Service &nbsp;Provider &nbsp;also agrees &nbsp;that &nbsp;he/she &nbsp;shall &nbsp;provide &nbsp;all &nbsp;reasonable &nbsp;assistance &nbsp;to &nbsp;YoCo &nbsp;LLC &nbsp;to &nbsp;protect &nbsp;the confidentiality &nbsp;of &nbsp;the &nbsp;user&rsquo;s &nbsp;private &nbsp;information &nbsp;that &nbsp;may &nbsp;have &nbsp;directly &nbsp;or &nbsp;indirectly &nbsp;been disclosed, &nbsp;published &nbsp;or &nbsp;made &nbsp;available &nbsp;to &nbsp;third &nbsp;parties &nbsp;in &nbsp;breach &nbsp;of &nbsp;this &nbsp;Agreement, &nbsp;including reimbursement &nbsp;for &nbsp;any &nbsp;and &nbsp;all &nbsp;attorney&rsquo;s &nbsp;fees &nbsp;that &nbsp;YoCo &nbsp;LLC &nbsp;may &nbsp;incur &nbsp;to &nbsp;protect &nbsp;or &nbsp;enforce &nbsp;its rights. &nbsp;</p>
                <h1>"AS IS" and "AS AVAILABLE" Disclaimer</h1>
                <p>The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected.</p>
                <p>Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components.</p>
                <p>Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law.</p>
                <h1>Governing Law</h1>
                <p>This &nbsp;Agreement &nbsp;shall be &nbsp;governed &nbsp;by &nbsp;the &nbsp;laws &nbsp;of &nbsp;the &nbsp;State &nbsp;of &nbsp;Delaware &nbsp;in &nbsp;the &nbsp;United &nbsp;States, and &nbsp;the &nbsp;courts &nbsp;of &nbsp;Delaware &nbsp;shall &nbsp;have &nbsp;jurisdiction.. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
                <h1>Arbitration</h1>
                <p>In &nbsp;the &nbsp;event &nbsp;of &nbsp;any disputes &nbsp;between &nbsp;the &nbsp;Parties &nbsp;pertaining &nbsp;to &nbsp;this &nbsp;Agreement, &nbsp;the &nbsp;Parties &nbsp;shall mutually &nbsp;and &nbsp;in &nbsp;good faith &nbsp;attempt &nbsp;to &nbsp;resolve &nbsp;all &nbsp;disputes, &nbsp;claims, &nbsp;suits &nbsp;and &nbsp;actions &nbsp;raised &nbsp;within 15 &nbsp;(Fifteen) &nbsp;calendar &nbsp;days &nbsp;from &nbsp;the &nbsp;date &nbsp;when &nbsp;a &nbsp;written &nbsp;notice &nbsp;of &nbsp;such &nbsp;dispute &nbsp;is &nbsp;raised &nbsp;by &nbsp;the disputing &nbsp;Party. &nbsp;In the &nbsp;event &nbsp;that &nbsp;such &nbsp;disputes, &nbsp;claims, &nbsp;suits and &nbsp;actions &nbsp;are &nbsp;not &nbsp;resolved &nbsp;to &nbsp;the mutual &nbsp;satisfaction of &nbsp;the &nbsp;Parties &nbsp;within &nbsp;15 &nbsp;(Fifteen) &nbsp;calendar &nbsp;days, &nbsp;both &nbsp;Parties &nbsp;shall &nbsp;mutually appoint &nbsp;1 &nbsp;(One) &nbsp;arbitrator. &nbsp;The &nbsp;arbitration &nbsp;shall &nbsp;be &nbsp;held &nbsp;in &nbsp;the &nbsp;State &nbsp;of &nbsp;Delaware, &nbsp;United &nbsp;States and &nbsp;the &nbsp;decision &nbsp;of the &nbsp;arbitrator &nbsp;shall &nbsp;be &nbsp;final &nbsp;and &nbsp;binding &nbsp;on &nbsp;the &nbsp;Parties.</p>
                <h1>For European Union (EU) Users</h1>
                <p>If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which you are resident in.</p>
                <h1>United States Legal Compliance</h1>
                <p>You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a "terrorist supporting" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.</p>
                <h1>Waiver of class claims</h1>
                <p>Service &nbsp;Provider &nbsp;agrees &nbsp;that &nbsp;it &nbsp;may &nbsp;bring &nbsp;disputes &nbsp;against &nbsp;YoCo &nbsp;LLC &nbsp;only &nbsp;in &nbsp;an &nbsp;individual capacity, &nbsp;and &nbsp;not &nbsp;as a &nbsp;&nbsp;plaintiff &nbsp;or &nbsp;class &nbsp;member &nbsp;in &nbsp;any &nbsp;purported &nbsp;class &nbsp;or &nbsp;representative proceeding, &nbsp;including without &nbsp;limitation &nbsp;federal &nbsp;or &nbsp;state &nbsp;class &nbsp;actions, &nbsp;or &nbsp;class &nbsp;arbitrations. Service &nbsp;Provider &nbsp;agrees &nbsp;that &nbsp;it &nbsp;will &nbsp;not &nbsp;seek &nbsp;to &nbsp;have &nbsp;any &nbsp;dispute &nbsp;heard &nbsp;as &nbsp;a &nbsp;class &nbsp;action, &nbsp;private attorney &nbsp;general &nbsp;action, &nbsp;or &nbsp;in &nbsp;any &nbsp;other &nbsp;proceeding &nbsp;in &nbsp;which &nbsp;its &nbsp;acts &nbsp;or &nbsp;proposes &nbsp;to &nbsp;act &nbsp;in &nbsp;a representative &nbsp;capacity.</p>
                <h1>Severability and Waiver</h1>
                <h2><strong><strong>Severability</strong></strong></h2>
                <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>
                <h2><strong><strong>Waiver</strong></strong></h2>
                <p>Except as provided herein, the failure to exercise a right or to require performance of an obligation under this Terms shall not effect a party's ability to exercise such right or require such performance at any time thereafter nor shall be the waiver of a breach constitute a waiver of any subsequent breach.</p>
                <h1>Translation Interpretation</h1>
                <p>These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute.</p>
                <h1>Changes to These Terms and Conditions</h1>
                <p>We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion.</p>
                <p>By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website and the Service.</p>
                <h1>Contact Us</h1>
                <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
                <ul>
                    <li>By email: info@yocoservices.com</li>
                </ul>
            </TabPanel>
            
            <TabPanel value={value} index={6}>
                Item Seven
      </TabPanel>
        </div>
    );
}