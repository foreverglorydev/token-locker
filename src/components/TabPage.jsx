import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import NetworkSelector from "./NetworkSelector";
import ApproveLockButton from "./ApproveLockButton";
import TokenSelector from "./TokenSelector";
//import "react-datetime/css/react-datetime.css";
import UserLocks from "./UserLocks";
import { useDispatch, useSelector } from "react-redux";
import DateSelector from "./DateSelector";
import Grid from "@material-ui/core/Grid";
import { fromBaseUnit } from '../helpers';  

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import LockPage from './LockPage';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{background:"#000",padding:0, margin:-0}}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TapPage() {
  const {tokenSelectorSlice } = useSelector((state) => state);
  const balance = fromBaseUnit(tokenSelectorSlice.balance);

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if(balance) {
 return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="New Lock" {...a11yProps(0)} />
          <Tab label="Your Locks" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <Grid item xs={12} md={12}>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>START LOCK</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className="lock">
              <div className="lock-blocks">
                <span className="lock-label first-label">
                  Select token to lock
                </span>
                <div className="lock-block swap-addresses-from">
                  <TokenSelector />
                </div>
                <span className="lock-label">Select date to lock until</span>
                <div className="lock-block">
                  <DateSelector />
                </div>                
              
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        <LockPage />
        <LockPage />

        <ApproveLockButton />
        </Grid>    
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserLocks />
      </TabPanel>      
    </div>
   
  );
  } else {
    return (<></>)
  }
 
}
