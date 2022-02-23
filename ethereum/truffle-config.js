const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic = require("./private.json").mnemonic;
const endpoints = require("./private.json").endpoints;

module.exports = {
    contracts_build_directory: "../public/contracts",
    networks: {
        dev: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        },
        dev2: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        ropsten: {
            provider: function () {
                return new HDWalletProvider(mnemonic, endpoints.ropsten)
            },
            network_id: 3,
            gas: 1500000
        },
        rinkeby: {
            provider: function () {
                return new HDWalletProvider(mnemonic, endpoints.rinkeby)
            },
            network_id: 4,
            gas: 1500000
        },
        bsc_testnet: {
            provider: function () {
                return new HDWalletProvider(mnemonic, endpoints.bsc_testnet)
            },
            network_id: 97,
            gas: 1500000
        },
        bsc_mainnet: {
            provider: function () {
                return new HDWalletProvider(mnemonic, endpoints.bsc_mainnet)
            },
            network_id: 956,
            gas: 1500000
        }
    },
    compilers: {
        solc: {
            version: '0.8.1'
        }
    },
    plugins: [
        'truffle-plugin-verify'
    ],
    api_keys: {
        etherscan: 'DN9XS3J969K5IMYECGF2VHUUIERHYW78F6',
        bscscan: 'NDKVPFY9T8NVAG3SSDB4UKMMDBPT1DWT6A'
    }
};
