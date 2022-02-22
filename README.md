# Token Locker MVP

Tool to lock you tokens for given period.

## Run this project

Edit /ethereum/private.json and paste your seed and infura secret key

Run `yarn install && yarn start` at repo root to compile and run frontend.

Run `cd /ethereum && truffle compile && truffle migrate` to compile and deploy scripts to ganache

Or `truffle migrate --network ropsten`  to deploy scripts to ropsten

Truffle compiles and copies artifacts at /public/contracts to access them from react-app

## User Guide

App deployed at http://142.93.233.33:3000

1. Switch network to Ropsten in Metamask
2. Claim test ETH faucet from https://faucet.ropsten.be/ or https://faucet.metamask.io/ or https://faucet.dimensions.network/
3. Swap ETH to any token on Uniswap (Ropsten)  
4. Select token in app, enter amount (less than your balance) and choose FUTURE date to lock until. 

# TODO 

- Add token lists
- Refactor and unify app design to future multichain solution 
- Create locks with linear and custom release schedule
- Create integrations with compound/aave to get yield while tokens are locked
- Add networks - bsc, avax etc
- Create CosmWasm contracts for cw-20 tokens
- Create NEAR contracts
- Create Solana contracts
