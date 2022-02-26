import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Divider } from '@material-ui/core';
import { useDispatch, useSelector } from "react-redux";


const useStyles = makeStyles({  
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});


function LockPage() {
  const {tokenSelectorSlice } = useSelector((state) => state);

  const classes = useStyles();
  return (
    <div className="my-card">
    <CardContent>
      <p style={{fontSize:'16px' }}>
        <span style={{float: 'left'}}>Fee:</span> 
        <span style={{float: 'right'}}>0.35%</span>       
      </p>      
    </CardContent>     
     <CardContent>
     <p style={{fontSize:'16px' }}>
        <span style={{float: 'left'}}>Total Debit:</span> 
        <span style={{float: 'right'}}>{`${tokenSelectorSlice.amount * 0.9965}`}</span>       
      </p>
     </CardContent>

    <Divider style={{clear:"both"}} />
    <CardContent style={{marginTop: "16px"}}>
      <span style={{fontSize: '12px', fontStyle:'italic', color:"#b9babb"}} >
        Apply a fee to each lock, or pay it once seperately, paying the fee seperately helps ensure the amount of the lock matches the amount you entered.
      </span>
    </CardContent>
  </div>
  )
}

export default LockPage