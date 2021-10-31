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

export default function PostTabs(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(parseInt(props.tabId));
     
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <div className="border-tabs">
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

                </TabPanel>
                <TabPanel value={value} index={1} style={{ width: "100%" }}>

                </TabPanel>
                <TabPanel value={value} index={2} style={{ width: "100%" }}>
                  
                </TabPanel>
                <TabPanel value={value} index={3} style={{ width: "100%" }}>
                   
                </TabPanel>
                <TabPanel value={value} index={4}>

                </TabPanel>
                <TabPanel value={value} index={5}>

                </TabPanel>

                <TabPanel value={value} index={6}>
                     
      </TabPanel>
            </div>
        </div>
    );
}