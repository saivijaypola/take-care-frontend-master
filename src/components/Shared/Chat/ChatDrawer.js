import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import chat from "../../../images/icon/chat.svg";
import Chatbox from '../../Shared/Chat/Chatbox';
import Badge from '@material-ui/core/Badge';
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
    right: props.chatOpen,
  });

  // React.useEffect(() => {
  //   setState({right: props.chatOpen });
  //   })
  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  
  const list = (anchor) => (
    <Chatbox towhom={props.towhom} chatId={props.chatId}></Chatbox>
  );

  return (
    <div style={{ float: "left" }}>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <img style={{ width: 30, marginTop: -5 }} src={chat}></img>
            {/* <Badge badgeContent={1} color="secondary"></Badge> */}
          </Button>
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