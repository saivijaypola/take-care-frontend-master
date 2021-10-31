import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import chat from "../../../images/icon/chat.svg";
import Chatbox from '../../Shared/Chat/Chatbox';
import Badge from '@material-ui/core/Badge';
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
} from "react-device-detect";
const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

export default function ChatDrawer(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Chatbox chatId={props.chatId}></Chatbox>
    );
    console.log("🚀 ~ file: requestDetails.js ~ line 321 ~ ChatButton ~ render ~ isMobile", isMobile)

    return (

        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    {isMobile &&
                        <Button onClick={toggleDrawer(anchor, true)} className="post-request chat-user">Chat with User
                                <img src={chat}></img>

                        </Button>
                    }
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        {
                            props.chatId && (
                                list(anchor)
                            )
                        }

                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}