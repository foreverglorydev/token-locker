import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Divider } from '@material-ui/core';


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
  const classes = useStyles();
  return (
    <div className="my-card">
    <CardContent>      
      <Typography variant="h6" component="p">
      OPTIONAL: Enable free locking
      </Typography>
      <input className='big-input' />      
    </CardContent>
    <Divider></Divider> 

    <CardActions style={{marginTop: "16px"}}>            
      <Button size="large" variant="outlined" style={{height:54,color:"white"}} fullWidth >PAY 10 BNB FEE</Button>
    </CardActions>
  </div>
  )
}

export default LockPage