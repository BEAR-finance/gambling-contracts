require('babel-register');
require('babel-polyfill');

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    mainnet: {
      provider: () => new HDWalletProvider("", `https://bsc-dataseed.binance.org/`),
      network_id: 56,
      confirmations: 2,      // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 10000,  // # of blocks before a deployment times out  (minimum/default: 50)
      gasPrice: 20000000000,
      skipDryRun: true       // Skip dry run before migrations? (default: false for public nets )
    },
    bsctestnet: {
      provider: () => new HDWalletProvider("", `https://data-seed-prebsc-1-s1.binance.org:8545/`),
      network_id: 97,
      confirmations: 5,       // # of confs to wait between deployments. (default: 0)
      gasPrice: 20000000000,
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true       // Skip dry run before migrations? (default: false for public nets )
    }
  },
  solc: {
  optimizer: {
    enabled: true,
    runs: 200
    }
  }
};
