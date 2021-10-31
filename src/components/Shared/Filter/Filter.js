import React, { useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import funnel from "../../../images/icon/selective.png";
import right from "../../../images/icon/right.svg";
import spiffy from "../../../images/icon/yoco-safe.png";
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";
import like from "../../../images/icon/like.svg";
import dislike from "../../../images/icon/dislike.svg";
import Radio from '@material-ui/core/Radio';
import Checkbox from '@material-ui/core/Checkbox';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import useForceUpdate from 'use-force-update';
import Chatbox from '../../Shared/Chat/Chatbox';
import {
    Container, Row, Col

} from "reactstrap";
import Badge from '@material-ui/core/Badge';
const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function Filter(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: props.chatOpen,
    });



    const [filterby, setFilterby] = React.useState(props.listFilter && props.listFilter.filterBy);
    const [responseValue, setValue] = React.useState(props.listFilter.filterBy ? props.listFilter.filterBy : "quotesOnly");
    const [likeValue, setLikeValue] = React.useState(props.listFilter.likeFilter ? props.listFilter.likeFilter : "");
    const [spiffyMinimum, setSpiffyMinimum] = React.useState(props.listFilter.spiffyMin ? props.listFilter.spiffyMin : 1);
    const [spiffyMaximum, setSpiffyMaximum] = React.useState(props.listFilter.spiffyMax ? props.listFilter.spiffyMax : 5);
    const [profileQuality, setChecked] = React.useState(false);
    const [isStrict, setIsStrict] = React.useState(false);
    const [showall, setAll] = React.useState(false);
    const [showActiveChat, setShowActiveChat] = React.useState(false);
    // React.useEffect(() => {
    //   setState({right: props.chatOpen });
    //   })

    useEffect(() => {
        var myFilter = JSON.parse(localStorage.getItem('filter'))
        console.log('MY FILTER', myFilter)
        if (myFilter) {
            setAll(myFilter.showFull)
            setLikeValue(myFilter.likeValue)
            setSpiffyMinimum(myFilter.spiffyMin)
            setSpiffyMaximum(myFilter.spiffyMax)
            setValue(myFilter.filterBy)
            setIsStrict(myFilter.isStrict)
        }

    }, [props.listFilter])

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };
    const handleChange = (event) => {
        setValue(event.target.value);
        if (event.target.value != "") {
            setAll(false);
            setLikeValue("");
            setIsStrict(true)
        }
    };
    const handleChangeLiked = (event) => {
        setLikeValue(event.target.value);
        if (event.target.value != "") {
            setAll(false);
            setIsStrict(true)
        }
    };
    const handleChangeProfileQuality = (event) => {
        setChecked(event.target.checked);
        if (event.target.checked == true) {
            setAll(false);
        }
    };
    const handleChangeSetActiveChat = (event) => {
        setShowActiveChat(event.target.checked);
        if (event.target.checked == true) {
            setAll(false);
        }
    }
    const handleChangeShowAll = (event) => {
        setAll(event.target.checked);
        if (event.target.checked == true) {
            setChecked(false);
            // setSpiffy(1, 5)
            setValue("");
            setLikeValue("");
            setShowActiveChat(false)
        }
    };
    const likeProvider = () => {
        setAll(false);
        setValue("")
        if (likeValue == "liked") {
            setLikeValue("")
        } else {
            setLikeValue("liked")
        }
    }
    const unlikeProvider = () => {
        setAll(false);
        setValue("")
        if (likeValue == "disliked") {
            setLikeValue("")
        }
        else {
            setLikeValue("disliked")
        }
    }
    const forceUpdate = useForceUpdate();
    const applyChanges = () => {



        var myFilter = {
            filterBy: responseValue,
            spiffyMin: spiffyMinimum,
            spiffyMax: spiffyMaximum,
            profilePic: profileQuality,
            likeValue: likeValue,
            showFull: showall,
            isStrict: true

        }
        console.log('MY FILER MESSAGE', myFilter)
        switch (myFilter && myFilter.filterBy) {
            case "quotesOnly": props.setActiveFilterMessage("Filtered by Offers")
                break;
            case "rejectedOnly": props.setActiveFilterMessage("Rejected Offers")
                break;
            case "": props.setActiveFilterMessage("Showing All Results")
                break;
        }
        if (myFilter && myFilter.filterBy == "") {
            switch (myFilter.likeValue) {
                case "liked": props.setActiveFilterMessage("Liked Providers")
                    break;
                case "disliked": props.setActiveFilterMessage("Disliked Providers")
                    break;
                case "": props.setActiveFilterMessage("Showing All Results")
                    break;
            }
        }
        if (myFilter.profilePic) {
            props.setActiveFilterMessage("Filtered by Profile Quality")
        }
        props.updateFilters(myFilter)
        setState({ right: false })

        props.getProviders(
            {
                locationData: {
                    "user_latitude": props.selectedPost && props.selectedPost.latitude,
                    "user_longitude": props.selectedPost && props.selectedPost.longitude,
                    "user_radius": process.env.REACT_APP_PROVIDER_RADIUS ? parseFloat(process.env.REACT_APP_PROVIDER_RADIUS) : 40000
                },
                filters: {
                    filterBy: responseValue,
                    spiffyMin: spiffyMinimum,
                    spiffyMax: spiffyMaximum,
                    profilePic: profileQuality,
                    likeValue: likeValue,
                    showFull: showall

                },
                requestId: {
                    requestId: props.selectedPost.requestId
                }
            })
    }
    const closeFilter = () => {
        setState({ right: false })
    }
    const onChangeSlide = (data) => {
        // console.log(data)
        var MinSpiffy = parseInt(data[0])
        var MaxSpiffy = parseInt(data[1])
        setSpiffy(MinSpiffy, MaxSpiffy)
        setAll(false);
    }
    const setSpiffy = (MinSpiffy, MaxSpiffy) => {
        setSpiffyMinimum(MinSpiffy);
        setSpiffyMaximum(MaxSpiffy);
    }
    const list = (anchor) => (
        <Chatbox towhom={props.towhom} chatId={props.chatId}></Chatbox>
    );


    return (
        <div style={{ float: "right" }}>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Button onClick={toggleDrawer(anchor, true)}>
                        <img style={{ width: 30, marginTop: -5 }} src={funnel}></img>
                        <span>Filter <img src={right} /></span>
                        {/* <Badge badgeContent={1} color="secondary"></Badge> */}
                    </Button>
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        <div className="filter-container">
                            <div className="filter-head">
                                <h4><b>Filter Providers  by:</b></h4>
                            </div>
                            <div className="filter-body">
                                <h6><b>Spiffy Strength  </b><img style={{ width: 40 }} src={spiffy} /></h6>
                                <Nouislider pips={{ mode: "count", values: 5 }}
                                    clickablePips
                                    onChange={onChangeSlide}
                                    range={{ min: 1, max: 5 }}
                                    step={1} start={[spiffyMinimum, spiffyMaximum]} connect />
                                <br /><br />
                                <hr />
                                <h6><b>Offers from providers </b></h6>
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="responses" value={responseValue} name="gender1" onChange={handleChange}>
                                        <FormControlLabel value="rejectedOnly" control={<Radio />} label="Rejected offers" />
                                        <FormControlLabel value="quotesOnly" control={<Radio />} label="Show quotes only (Low to high)" />
                                    </RadioGroup>
                                </FormControl>
                                <hr />


                                <h6><b>Favourites </b></h6>

                                <Row>
                                    <Col xs="4" onClick={likeProvider}>
                                        <div className={likeValue == "liked" ? "liked-container" : "like-container"}>
                                            <img src={like} />
                                        </div>

                                    </Col>
                                    <Col xs="4" onClick={unlikeProvider}>
                                        <div className={likeValue == "disliked" ? "disliked-container" : "like-container"}>
                                            <img src={dislike} />
                                        </div>
                                    </Col>
                                </Row>
                                <br />
                                <hr style={{ marginTop: 0 }} />


                                <h6><b>Profile quality </b></h6>

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={profileQuality}
                                            onChange={handleChangeProfileQuality}
                                            name="profilepics"
                                            color="primary"
                                        />
                                    }
                                    label="Show only profiles with pictures"
                                />



                                <hr style={{ marginTop: 0 }} />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={showall}
                                            onChange={handleChangeShowAll}
                                            name="showall"
                                            color="primary"
                                        />
                                    }
                                    label="Show all (clear filters)"
                                />
                                <br />  <br />
                                <div className="filter-fixed">
                                    <Row>
                                        <Col xs="6">
                                            <Button onClick={applyChanges} className="filter-apply-button">Apply</Button>
                                        </Col>
                                        <Col xs="6">
                                            <Button onClick={closeFilter} className="close-button">Close</Button>
                                        </Col>
                                    </Row>

                                </div>

                            </div>
                        </div>

                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}