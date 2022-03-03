import React from 'react'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from '@material-ui/core'

import { getWeb3 } from '../web3provider';


function SwitchNetwork() {

  const [open, setOpen] = React.useState(false);

  const detectEthereumNetwork = async () => {
    const web3 = await getWeb3();
    web3.eth.net.getNetworkType().then(async (netId) => {
      console.log(netId);
        // Do something based on which network ID the user is connected to
    });
  }

  const switchNetworkMumbai = async () => {
    const web3 = await getWeb3();  
    await web3.currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }],
    });
  }



  const handleClose = async () => {

    //setOpen(false);
    //detectEthereumNetwork();
    await switchNetworkMumbai()
  };

  return (
    <Dialog
    open={true}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">{"Please switch network to BSC Network"}</DialogTitle>
    <DialogContent>
     
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} color="primary">
        Agree
      </Button>     
    </DialogActions>
  </Dialog>    
  )
}

export default SwitchNetwork