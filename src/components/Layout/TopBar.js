import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter, Redirect } from "react-router";
import logo from '../../assets/images/logo.png';
import ScrollspyNav from '../Layout/scrollSpy';
import { AvForm, AvField, AvGroup } from 'availity-reactstrap-validation';
import LaddaButton, { XL, SLIDE_UP } from 'react-ladda';
import axios from "axios";
import {
    Container,
    Row, Col,
    FormGroup,
    Label,
    Badge,
    Input,
    Modal,
    Spinner,
    Alert,
    ModalHeader,
    ModalBody,
    Button,
    ModalFooter,

} from "reactstrap";
class Topbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            isLogged: false,
            isModalVisible: false,
            fullName: '',
            email: '',
            navLinksGuest: [
                { id: 1, title: "Home", link: "/index", isAnchor: true, idnm: "home" },
                { id: 2, title: "Solutions", link: "/service", isAnchor: true, idnm: "service" },
                { id: 4, title: "How It Works", link: "/index", isAnchor: true, idnm: "how" },
                { id: 3, title: "YoCo Safe", link: "/yocosafe", isAnchor: false, idnm: "safe" },
                { id: 5, title: "About Us", link: "/index", isAnchor: true, idnm: "aboutus" },
                { id: 7, title: "Help", link: "https://yoco.tawk.help", isAnchor: false, idnm: "help", name: '', IsNewWindow: true },
                { id: 6, title: "Sign In", link: "/sign-in", isAnchor: false, idnm: "home" },
                { id: 6, title: "Join", link: "/join", isAnchor: false, idnm: "home" },
            ],
            navLinksProvider: [
                { id: 5, title: "Profile", link: "/provider/profile", isAnchor: false, name: '', IsNewWindow: false },
                // { id: 5, title: "Search", link: "/profile", isAnchor: false, name: '', IsNewWindow:false },
                // { id: 5, title: "People", link: "/profile", isAnchor: false, name: '', IsNewWindow:false },


                { id: 7, title: "Refer a Friend", link: "", isAnchor: false, name: '', IsNewWindow: false, IsModal: true },
                { id: 7, title: "Help", link: "https://yoco.tawk.help", isAnchor: false, name: '', IsNewWindow: true },
                { id: 4, title: "Settings", link: "/provider/settings", isAnchor: false, name: '', IsNewWindow: false },
                { id: 6, title: "Logout", link: "/logout", isAnchor: false, name: '', IsNewWindow: false }
            ],
            navLinksUser: [
                { id: 4, title: "Profile", link: "/user/profile", isAnchor: false, name: '', IsNewWindow: false },

                { id: 5, title: "Requests", link: "/user/requests", isAnchor: false, name: '', IsNewWindow: false },
                // { id: 5, title: "Search", link: "/profile", isAnchor: false, name: '', IsNewWindow:false },
                // { id: 5, title: "People", link: "/profile", isAnchor: false, name: '', IsNewWindow:false },
                { id: 6, title: "Logout", link: "/logout", isAnchor: false, name: '', IsNewWindow: false },
                { id: 7, title: "Help", link: "https://yocousers.tawk.help/", isAnchor: false, name: '', IsNewWindow: true },
            ],
            navLinksAdmin: [
                { id: 1, title: "User Requests", link: "/admin/all/user/request", isAnchor: false, name: '', IsNewWindow: false },
                { id: 2, title: "Provider List", link: "/admin/all-providers", isAnchor: false, name: '', IsNewWindow: false },
                { id: 3, title: "Logout", link: "/logout", isAnchor: false, name: '', IsNewWindow: false },

            ]

        };
        //this.toggleModal = this.toggleModal.bind(this)
        this.toggleLine = this.toggleLine.bind(this);
        this.openBlock.bind(this);
        this.openNestedBlock.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.onChangeText = this.onChangeText.bind(this)
        this.onReferSubmit = this.onReferSubmit.bind(this)
    }
    onChangeText(event) {

        this.setState({
            [event.target.name]: event.target.value
        })
    }
    onReferSubmit(event, errors, values) {

        if (errors && errors.length > 0) {

        } else {
            const apiBaseUrl = process.env.REACT_APP_SERVICES_URI;
            var data = {
                email: this.state.email,
                friend_name: this.state.fullName,
                provider_name: localStorage.getItem('fullName')
            }
            return axios
                .post(`${apiBaseUrl}provider/refer`, data, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {

                    if ((response.status >= 200 && response.status < 300) || response.status === 304) {
                        this.setState(prevState => ({
                            isModalVisible: !prevState.isModalVisible
                        }));
                        return { error: null, response: response, resultCode: 1 }
                    } else {
                        this.setState(prevState => ({
                            isModalVisible: !prevState.isModalVisible
                        }));
                        return { error: response, resultCode: 2 }
                    }
                })
                .catch(error => {
                    return { error: error, response: null, resultCode: 2 }
                });
        }

    }
    toggleModal() {
        this.setState(prevState => ({
            isModalVisible: !prevState.isModalVisible
        }));
    }
    toggleLine() {
        this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }

    scrollNavigation = () => {
        var doc = document.documentElement;
        var top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        if (top > 80) {
            document.getElementById('topnav').classList.add('nav-sticky');
            document.getElementById('navigation').display = 'none';
        }
        else {
            try {
                document.getElementById('topnav').classList.remove('nav-sticky');
            }
            catch (err) {
            }
        }
    }

    componentDidMount() {
        var matchingMenuItem = null;
        var ul = document.getElementById("top-menu");
        var listItems = ul.getElementsByTagName("li");
        const list = document.querySelectorAll('#top-menu');
        list.forEach(el => el.addEventListener('click', event => {
            for (var i = 0; i < listItems.length; ++i) {
                listItems[i].classList.remove("active");
            }
            event.target.parentNode.classList.add("active");
        }));
        var items = ul.getElementsByTagName("a");
        for (var i = 0; i < items.length; ++i) {
            if (this.props.location.pathname === items[i].pathname) {
                matchingMenuItem = items[i];
                break;
            }
        }
        if (matchingMenuItem) {
            this.activateParentDropdown(matchingMenuItem);
        }

        document.body.classList = "";
        document.getElementById('topnav').classList.add('bg-white');
        window.addEventListener("scroll", this.scrollNavigation, true);

    }

    activateParentDropdown = (item) => {
        const parent = item.parentElement;
        if (parent) {
            // parent.classList.add('active'); // li
            const parent1 = parent.parentElement;
            parent1.classList.add('active'); // li
            if (parent1) {
                const parent2 = parent1.parentElement;
                parent2.classList.add('active'); // li
                if (parent2) {
                    const parent3 = parent2.parentElement;
                    parent3.classList.add('active'); // li
                    if (parent3) {
                        const parent4 = parent3.parentElement;
                        parent4.classList.add('active'); // li
                    }
                }
            }
        }
    }

    openBlock = (level2_id) => {
        //match level 2 id with current clicked id and if id is correct then update status and open level 2 submenu
        this.setState({
            navLinks: this.state.navLinks.map(navLink => (navLink.id === level2_id ? { ...navLink, isOpenSubMenu: !navLink.isOpenSubMenu } : navLink))
        });
    }

    openNestedBlock = (level2_id, level3_id) => {
        var tmpLinks = this.state.navLinks;
        tmpLinks.map((tmpLink) =>
            //Match level 2 id
            tmpLink.id === level2_id ?
                tmpLink.child.map((tmpchild) =>
                    //if level1 id is matched then match level 3 id
                    tmpchild.id === level3_id ?
                        //if id is matched then update status(level 3 sub menu will be open)
                        tmpchild.isOpenNestedSubMenu = !tmpchild.isOpenNestedSubMenu
                        :
                        tmpchild.isOpenNestedSubMenu = false
                )
                :
                false

        )
        this.setState({ navLinks: tmpLinks });
    }

    render() {
        const {
            isLogged, navLinksGuest, navLinksUser, navLinksProvider, isModalVisible, fullName, email, navLinksAdmin
        } = this.state;
        let targetId = this.state.navLinksGuest.map((item) => {
            return (
                item.idnm
            )
        });

        return (
            <React.Fragment>
                <header id="topnav" className="defaultscroll sticky">
                    <Container>

                        <Link className="logo" to="/home"><img className="yoco-logo" src={logo} /><span className="text-primary"></span></Link>
                        <div className="menu-extras">
                            <div className="menu-item">
                                <Link to="#" onClick={this.toggleLine} className={this.state.isOpen ? "navbar-toggle open" : "navbar-toggle"} >
                                    <div className="lines">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        {/* {localStorage.getItem("userId") !== null ? <React.Fragment></React.Fragment> :
                            <div className="mobile-clear">
                                <div className="mobile-table">
                                   
                                    <div className="buy-button">
                                        <Link to="/provider-signup" id="buyButton" className="btn btn-primary">Become A Provider</Link>
                                    </div>
                                    <div className="buy-button">
                                        <a href="#service" id="buyButton" className="btn btn-primary buy2">Find A Provider</a>
                                    </div>
                                </div>
                            </div>
                        } */}
                        {/* <div className="buy-button">
                                <Link to="/provider-signup" id="buyButton" className="btn btn-primary">Refer Your Friends</Link>
                            </div> */}

                        <ScrollspyNav
                            scrollTargetIds={targetId}
                            scrollDuration="800"
                            headerBackground="false"
                            activeNavClass="active"
                            {...this.props}
                        >
                            <div id="navigation" style={{ display: this.state.isOpen ? "block" : "none" }}>
                                <ul className="navigation-menu" id="top-menu">
                                    {
                                        localStorage.getItem("userId") && localStorage.getItem("role") === 'provider' ? (
                                            navLinksProvider.map((navLink, key) =>
                                                navLink.title !== "Help" ? (
                                                    navLink.IsModal ? (<li key={key}><a onClick={this.toggleModal} >{navLink.title}</a></li>) :
                                                        <li key={key}><Link to={navLink.link}>{navLink.title}</Link></li>

                                                ) :
                                                    <li key={key}><a onClick={() => window.open(navLink.link, '_blank')} target="_blank" >{navLink.title}</a></li>

                                            )

                                        )
                                            : localStorage.getItem("userId") && localStorage.getItem("role") === 'user' ? (
                                                navLinksUser.map((navLink, key) =>

                                                    navLink.title !== "Help" ? (
                                                        <li key={key}><Link to={navLink.link}>{navLink.title}</Link></li>

                                                    ) :
                                                        <li key={key}><a target="_blank" onClick={() => window.open(navLink.link, '_blank')} >{navLink.title}</a></li>
                                                )
                                            ) : localStorage.getItem("userId") && localStorage.getItem("role") === 'admin' ? (
                                                navLinksAdmin.map((navLink, key) =>
                                                    navLink.isAnchor ?
                                                        <li key={key} className="has-submenu">
                                                            <a href={"#" + navLink.idnm} onClick={this.toggleLine}> {navLink.title}</a>
                                                        </li>
                                                        :
                                                        <li key={key} className=""><Link to={navLink.link}>{navLink.title}</Link></li>
                                                )
                                            ) :
                                                navLinksGuest.map((navLink, key) =>
                                                    navLink.title !== "Help" ? (
                                                        navLink.isAnchor ?
                                                            <li key={key} className="has-submenu">
                                                                <a href={"#" + navLink.idnm} onClick={this.toggleLine}> {navLink.title}</a>
                                                            </li>
                                                            :
                                                            <li key={key} className=""><Link to={navLink.link}>{navLink.title}</Link></li>
                                                    ) :
                                                        <li key={key}><a target="_blank" onClick={() => window.open(navLink.link, '_blank')} >{navLink.title}</a></li>
                                                )
                                    }
                                </ul>
                                <div className="buy-menu-btn d-none">
                                    <Link to="/provider-signup" id="buyButton" className="btn btn-primary">Become A Provider</Link>
                                </div>
                                <Modal isOpen={this.state.isModalVisible} role="dialog" autoFocus={true} centered={true}>
                                    <ModalHeader toggle={this.toggleModal}>Refer your Friends</ModalHeader>
                                    <ModalBody>
                                        <AvForm className="login-form" onSubmit={this.onReferSubmit}>
                                            <Row>
                                                <Col md={12}>
                                                    <AvGroup className="form-group position-relative">
                                                        <Label for="email">Full Name<span className="text-danger">*</span></Label>
                                                        <AvField type="text" className="form-control" value={fullName} name="fullName" id="fullName" onChange={this.onChangeText} placeholder="Full Name" required
                                                            errorMessage=""
                                                            validate={{
                                                                required: { value: true, errorMessage: "Enter the full name" },
                                                            }}
                                                        />
                                                    </AvGroup>
                                                </Col>

                                                <Col md={12}>

                                                    <AvGroup className="form-group position-relative">
                                                        <Label for="email">Email<span className="text-danger">*</span></Label>
                                                        <AvField type="text" className="form-control" value={email} name="email" id="email" onChange={this.onChangeText} placeholder="Email" required
                                                            errorMessage=""
                                                            validate={{
                                                                required: { value: true, errorMessage: "Enter the Email" },
                                                            }}
                                                        />
                                                    </AvGroup>
                                                </Col>
                                                <Col md="12">
                                                    <LaddaButton
                                                        loading={this.state.loadProfileUpdate}
                                                        className="submitBnt btn btn-primary pull-left"
                                                        data-color="#eee"
                                                        data-size={XL}
                                                        data-style={SLIDE_UP}
                                                        data-spinner-size={30}
                                                        data-spinner-color="#ddd"
                                                        data-spinner-lines={12}
                                                    // onClick={this.toggleModal}
                                                    >
                                                        Send
                                                    </LaddaButton>
                                                </Col>
                                            </Row>
                                        </AvForm>
                                        {/* <Button onClick={this.toggleModal}>Invite</Button> */}
                                    </ModalBody>
                                </Modal>
                            </div>
                        </ScrollspyNav>
                    </Container>
                </header>

            </React.Fragment >
        );
    }
}

export default withRouter(Topbar);