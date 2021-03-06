import React, { useEffect } from "react";
import "../styles/App.scss";
import NetworkSelector from "./NetworkSelector";
import ApproveLockButton from "./ApproveLockButton";
import TokenSelector from "./TokenSelector";
//import "react-datetime/css/react-datetime.css";
import "../styles/date.css";

import UserLocks from "./UserLocks";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExternalData,
  setNetwork,
} from "../reduxSlices/externalDataSlice";
import {ETH_BSC, ETH_BSC_TESTNET, ETH_GANACHE, ETH_ROPSTEN} from "../constants";
import { setAddress } from "../reduxSlices/networkSlice";
import Web3Utils from "web3-utils";
import DateSelector from "./DateSelector";
import Grid from "@material-ui/core/Grid";
import TapPage from "./TabPage";
import SwitchNetwork from "./SwitchNetwork";

const App = () => {
  const { externalDataSlice } = useSelector((state) => state);
  const dispatch = useDispatch();

  const isMetaMask = window?.ethereum?.isMetaMask;

  useEffect(() => {
    if (externalDataSlice.externalDataLoaded || !isMetaMask) return;

    window.ethereum.on("accountsChanged", (accounts) => {
      dispatch(setAddress({ userAddress: accounts[0] }));
    });

    window.ethereum.on("chainChanged", (chainId) => {
      dispatch(setNetwork(Web3Utils.hexToNumber(chainId)));
      dispatch(fetchExternalData());
    });

    dispatch(fetchExternalData());
  }, [dispatch, externalDataSlice.externalDataLoaded, isMetaMask]);

  if (!isMetaMask) return "No metamask detected";

  if (
    externalDataSlice.chainId !== ETH_ROPSTEN &&
    externalDataSlice.chainId !== ETH_GANACHE &&
    externalDataSlice.chainId !== ETH_BSC &&
      externalDataSlice.chainId !== ETH_BSC_TESTNET
  )
    //return "Please switch network to BSC Network";
    return(<SwitchNetwork />)

  if (!externalDataSlice.externalDataLoaded) return "Loading...";

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={4}>
          <NetworkSelector />
        </Grid>

        <Grid item xs={12} md={8}>
         <TapPage />
        </Grid>

        <Grid item xs={12} md={12} style={{display:'none'}}>
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
              <ApproveLockButton />
              <UserLocks />
            </div>
          </div>
        </Grid>        
      </Grid>
    </>
  );
};

export default App;
