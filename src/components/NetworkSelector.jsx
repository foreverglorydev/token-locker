import React, { useState } from "react";
import { fromBaseUnit, shortAddress } from "../helpers";
import Grid from "@material-ui/core/Grid";
import Modal from "react-modal";

import { useSelector, useDispatch } from "react-redux";
import {
  connectToProvider,
  selectNetwork,
  setAddress,
} from "../reduxSlices/networkSlice";
import {ETH_BSC, ETH_BSC_TESTNET, ETH_GANACHE, ETH_ROPSTEN} from "../constants";
import "../styles/index.css";
import metamaskimg from "../assests/img/wallet/metamask.svg";
import coinbaseimg from "../assests/img/wallet/coinbase.svg";
import wcimg from "../assests/img/wallet/wc.svg";
import TokenSelector from "./TokenSelector";
import "react-responsive-modal/styles.css";
import "../styles/Modal.scss";
import { selectToken } from "../reduxSlices/tokenSelectorSlice";
import { getWeb3 } from "../web3provider";
import { getErc20Abi } from "../helpers";
function NetworkSelector() {
  
  const { networkSlice, externalDataSlice, tokenSelectorSlice } = useSelector((state) => state);
  const balance = fromBaseUnit(tokenSelectorSlice.balance);
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      padding: "0px",
      transform: "translate(-50%, -50%)",
      background: "#1a1e21",
      border: "1px solid rgb(73, 70, 70)",
      borderRadius: "10px",
      width: "325px",
      height: "400px",
    },
  };
  const handleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [open, setOpen] = useState(false);
  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const fullTokenList = [
    //externalDataSlice.nativeCurrency,
    ...externalDataSlice.tokenList,
  ];
  const [shownTokens, setShownTokens] = useState(fullTokenList);
  const [selectedToken, setSelectedToken] = useState()
  console.log(externalDataSlice.nativeCurrency);
  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} md={12} >
          <div className="connect-button-grp-new">
            <div className="connect-btn-grp-text-title">Token Locker</div>
            <div className="connect-btn-grp-text-text-b">
              Introducing Token Vesting Locking Pools. Token locks are
              represented as shares of a pool, in a similar way to a uniswap
              pool, allowing all ERC20 tokens including Rebasing and
              Deflationary mechanisms to be supported.
            </div>
            <div className="connect-btn-grp-text-text-s-i">
              This means lock amounts may change due to decimal rounding, but
              you will always retain your share of the pool.
            </div>
            <div className="connect-btn-grp-text-text-b-c">
              Do not lock Liquidity tokens here, they will not be shown in the
              Unicrypt browser, and will not be migrateable.
            </div>


              {networkSlice.userAddress ? (
                <div>
                  <div className="find-token">
                    <input
                      className="big-input find-token-input"
                      placeholder="Find token or paste contract"
                      onChange={async (event) => { 
                        setSelectedToken(null)                                              
                        let userInput = event.target.value.toLowerCase();                        
                        if (
                          userInput.length === 42 &&
                          userInput.toLowerCase().startsWith("0x")
                        ) {
                          let importedToken = await loadTokenByContractAddress(
                            userInput
                          );                          
                          setShownTokens([importedToken]);
                          setSelectedToken(importedToken)
                          dispatch(selectToken(importedToken))
                        } else {                          
                          if (!userInput) setShownTokens(fullTokenList);                          
                          let filtered = fullTokenList.filter((token) => {
                            if(token.ticker) {
                              let ticker = token.ticker.toLowerCase();
                              let name = token.name.toLowerCase();
  
                              return (
                                ticker.startsWith(userInput) ||
                                name.startsWith(userInput)
                              );
                            }                          
                            
                          });

                          setShownTokens(filtered);
                        }

                        /*
                        if (!userInput) setShownTokens(fullTokenList);

                        let filtered = fullTokenList.filter((token) => {
                          let ticker = token.ticker.toLowerCase();
                          let name = token.name.toLowerCase();

                          return (
                            ticker.startsWith(userInput) ||
                            name.startsWith(userInput)
                          );
                        });                        
                        setShownTokens(filtered);
                        */
                      }}
                    />
                  </div>

                  { balance && selectedToken &&
                    <div className="card">
                      <div style={{float:'left'}}>
                      {`${selectedToken.name} / ${selectedToken.ticker}`}
                      </div>                   
                      <div style={{float:'right'}}>
                        balacne <strong>{balance}</strong> 
                      </div>
                    </div>
                  }
                </div>
              ) : (
                <button
                className="tabs tabs-connect animated big-button connect-btn-new"
                onClick={handleModal}
              >
                Connect to Your Wallet
            </button>

              )}
          </div>
        </Grid>
        <Grid item xs={12} md={6}>
          {/* <button
            className="tabs tabs-eth big-button animated shadow"
            onClick={() => dispatch(selectNetwork({ network: "eth" }))}
          ></button> */}
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={12}>
          <div className="connect-button-grp-new tokenlist-new">
            <div className="tokenlist">
              {shownTokens.map((token) => {
                return (
                  <div
                    key={token.address || token.ticker}
                    className="tokenlist-token"
                  >
                    <button
                      className={"selecte-token"}
                      onClick={async () => {
                        dispatch(selectToken(token));
                        setSelectedToken(token)                        
                        onCloseModal();
                      }}
                    >
                      {`${token.name} (${token.ticker})`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          {/* <button
            className="tabs tabs-eth big-button animated shadow"
            onClick={() => dispatch(selectNetwork({ network: "eth" }))}
          ></button> */}
        </Grid>
      </Grid>
      <Modal
        isOpen={isModalVisible}
        // onAfterOpen={afterOpenModal}
        onRequestClose={handleModal}
        style={customStyles}
        ariaHideApp={false}
      >
        <div className="c-btn-modal-header">
          <Grid container spacing={2}>
            <Grid item xs={10}>
              <div className="c-modal-text-i">Unicrypt Version 1.03</div>
              <div className="c-modal-text-b">Connect your wallet</div>
            </Grid>
            <Grid item xs={2}>
              <button className="c-btn-modal-close" onClick={handleModal}>
                X
              </button>
            </Grid>
            <Grid
              container
              justifyContent="center"
              style={{ marginTop: "20px", marginLeft: "10px" }}
            >
              <Grid item xs={3}>
                <button className="c-modal-dm-btn">Desktop</button>
              </Grid>
              <Grid item xs={3}>
                <button className="c-modal-dm-btn">Mobile</button>
              </Grid>
            </Grid>
            <Grid contaienr>
              <Grid item xs={12}>
                <div className="c-modal-text-uc">
                  Unicrypt works best with Metamask on all chains.
                </div>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container style={{ borderBottom: "1px solid grey" }}>
                <Grid xs={1}>
                  <img src={metamaskimg} className="c-modal-wallet-logo" />
                </Grid>
                <Grid xs={10}>
                  <button
                    className="c-modal-wallet-btn"
                    onClick={() => {
                      networkSlice.userAddress
                        ? dispatch(setAddress(""))
                        : dispatch(connectToProvider());
                    }}
                  >
                    {getConnectButtonLabel(networkSlice, externalDataSlice)}
                  </button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container style={{ borderBottom: "1px solid grey" }}>
                <Grid xs={1}>
                  <img src={coinbaseimg} className="c-modal-wallet-logo" />
                </Grid>
                <Grid xs={10}>
                  <button className="c-modal-wallet-btn">
                    Coinbase Wallet{" "}
                  </button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ borderBottom: "1px solid grey" }}>
              <Grid container>
                <Grid xs={1}>
                  <img src={wcimg} className="c-modal-wallet-logo" />
                </Grid>
                <Grid xs={10}>
                  <button className="c-modal-wallet-btn">
                    wallet Connect{" "}
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className="c-btn-modal-footer">block 14255734</div>
      </Modal>
    </>
  );
}

const getConnectButtonLabel = (networkState, externalDataSlice) => {
  if (networkState.userAddress) return shortAddress(networkState.userAddress);

  let chainId = externalDataSlice.chainId;
  let networkName = "";
  if (chainId === ETH_ROPSTEN) networkName = "Ropsten";
  else if (chainId === ETH_GANACHE) networkName = "Ganache";
  else if (chainId === ETH_BSC) networkName = "BSC";
  else if (chainId === ETH_BSC_TESTNET) networkName = "BSC Testnet";

  return `MetaMask (${networkName})`;
};
const loadTokenByContractAddress = async (address) => {
  let web3 = await getWeb3();
  let abi = await getErc20Abi();

  let contract = new web3.eth.Contract(abi, address);

  let name = await contract.methods.name().call();
  let totalSupply = await contract.methods.totalSupply().call();
  let decimals = await contract.methods.decimals().call();
  let ticker = await contract.methods.symbol().call();

  return {
    name,
    totalSupply,
    address,
    decimals,
    ticker,
  };
};

export default NetworkSelector;
